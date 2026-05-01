import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  serverTimestamp, 
  query, 
  where,
  orderBy,
  limit
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";
import { commissionConfigSchema } from "@/lib/validations/configuration";
import { logConfigurationChange } from "@/lib/config-engine";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const q = query(collection(firestore, 'platform_commission_configs'), orderBy('updatedAt', 'desc'));
  const snap = await getDocs(q);
  const configs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return NextResponse.json({ success: true, data: configs });
});

export const PUT = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = commissionConfigSchema.parse(body);
  const { side, type, value, active, effectiveFrom, remarks, id } = validatedData;

  // We deactivate old configs for the same side if this one is active
  if (active) {
    const oldConfigsQuery = query(
      collection(firestore, 'platform_commission_configs'),
      where('side', '==', side),
      where('active', '==', true)
    );
    const oldConfigsSnap = await getDocs(oldConfigsQuery);
    // Note: In production, use a transaction here
    for (const oldDoc of oldConfigsSnap.docs) {
      if (oldDoc.id !== id) {
        await setDoc(oldDoc.ref, { active: false }, { merge: true });
      }
    }
  }

  const docId = id || `${side}_${Date.now()}`;
  const docRef = doc(firestore, 'platform_commission_configs', docId);
  
  const updateData = {
    side,
    type,
    value,
    active,
    effectiveFrom,
    remarks,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin',
  };

  await setDoc(docRef, updateData, { merge: true });

  await logConfigurationChange(
    'admin_1',
    'COMMISSION_CONFIG',
    id ? 'UPDATE' : 'CREATE',
    null, // Simplified for brevity
    updateData,
    { ip: req.headers.get('x-forwarded-for') || '127.0.0.1' }
  );

  return NextResponse.json({ 
    success: true, 
    message: "Commission configuration saved successfully" 
  });
});
