import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where 
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";
import { tokenConfigSchema } from "@/lib/validations/configuration";
import { logConfigurationChange } from "@/lib/config-engine";
import { verifyAdminApi, forbiddenResponse } from "@/lib/api-auth";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const auth = await verifyAdminApi(req);
  if (!auth.authorized) return forbiddenResponse(auth.message);

  const q = query(collection(firestore, 'platform_token_configs'));
  const snap = await getDocs(q);
  const configs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return NextResponse.json({ success: true, data: configs });
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const auth = await verifyAdminApi(req);
  if (!auth.authorized) return forbiddenResponse(auth.message);

  const body = await req.json();
  const validatedData = tokenConfigSchema.parse(body);
  const { category, tokenAmount, active, id } = validatedData;

  // Use category as ID for simplicity or provided ID
  const configId = id || category.toLowerCase().replace(/\s+/g, '_');
  const docRef = doc(firestore, 'platform_token_configs', configId);
  
  // Get old value for auditing
  const oldSnap = await getDocs(query(collection(firestore, 'platform_token_configs'), where('category', '==', category)));
  const oldValue = !oldSnap.empty ? oldSnap.docs[0].data() : null;

  const updateData = {
    category,
    tokenAmount,
    active,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin', // In real app, get from session
  };

  await setDoc(docRef, updateData, { merge: true });

  // Log to Audit
  await logConfigurationChange(
    'admin_1', // Replace with real admin ID
    'TOKEN_CONFIG',
    oldValue ? 'UPDATE' : 'CREATE',
    oldValue,
    updateData,
    { ip: req.headers.get('x-forwarded-for') || '127.0.0.1' }
  );

  return NextResponse.json({ 
    success: true, 
    message: "Token configuration updated successfully",
    data: updateData 
  });
});
