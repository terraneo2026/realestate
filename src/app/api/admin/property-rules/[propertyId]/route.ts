import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";
import { propertyFeeRulesSchema } from "@/lib/validations/configuration";
import { logConfigurationChange } from "@/lib/config-engine";

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { propertyId: string } }) => {
  const docRef = doc(firestore, 'property_fee_rules', params.propertyId);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    // Return defaults if no override exists
    return NextResponse.json({ 
      success: true, 
      data: { 
        tokenEnabled: true, 
        commissionEnabled: true, 
        commissionTarget: 'both' 
      } 
    });
  }

  return NextResponse.json({ success: true, data: snap.data() });
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { propertyId: string } }) => {
  const body = await req.json();
  const validatedData = propertyFeeRulesSchema.parse(body);
  
  const docRef = doc(firestore, 'property_fee_rules', params.propertyId);
  const oldSnap = await getDoc(docRef);
  const oldValue = oldSnap.exists() ? oldSnap.data() : null;

  const updateData = {
    ...validatedData,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin',
  };

  await setDoc(docRef, updateData, { merge: true });

  await logConfigurationChange(
    'admin_1',
    'PROPERTY_RULES',
    'UPDATE_OVERRIDE',
    oldValue,
    updateData
  );

  return NextResponse.json({ 
    success: true, 
    message: "Property-level fee rules updated" 
  });
});
