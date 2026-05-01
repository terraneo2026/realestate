import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp, 
  query 
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";
import { creditExpiryRulesSchema } from "@/lib/validations/configuration";
import { logConfigurationChange } from "@/lib/config-engine";
import { verifyAdminApi, forbiddenResponse } from "@/lib/api-auth";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const auth = await verifyAdminApi(req);
  if (!auth.authorized) return forbiddenResponse(auth.message);

  const q = query(collection(firestore, 'platform_expiry_configs'));
  const snap = await getDocs(q);
  const configs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // If no configs exist, return a default one
  if (configs.length === 0) {
    return NextResponse.json({ 
      success: true, 
      data: [{ 
        policyName: 'Default Expiry', 
        durationDays: 30, 
        active: true 
      }] 
    });
  }

  return NextResponse.json({ success: true, data: configs });
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const auth = await verifyAdminApi(req);
  if (!auth.authorized) return forbiddenResponse(auth.message);

  const body = await req.json();
  const validatedData = creditExpiryRulesSchema.parse(body);
  const { id, policyName } = validatedData;

  const configId = id || policyName.toLowerCase().replace(/\s+/g, '_');
  const docRef = doc(firestore, 'platform_expiry_configs', configId);
  
  // Get old value for auditing
  const oldSnap = await getDocs(query(collection(firestore, 'platform_expiry_configs')));
  const oldValue = !oldSnap.empty ? oldSnap.docs.find(d => d.id === configId)?.data() : null;

  const updateData = {
    ...validatedData,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin',
  };

  await setDoc(docRef, updateData, { merge: true });

  // Log to Audit
  await logConfigurationChange(
    'admin_1',
    'EXPIRY_CONFIG',
    oldValue ? 'UPDATE' : 'CREATE',
    oldValue,
    updateData,
    { ip: req.headers.get('x-forwarded-for') || '127.0.0.1' }
  );

  return NextResponse.json({ 
    success: true, 
    message: "Expiry configuration updated successfully",
    data: updateData 
  });
});
