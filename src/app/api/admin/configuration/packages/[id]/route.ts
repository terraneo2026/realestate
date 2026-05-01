import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";
import { agentPackageSchema } from "@/lib/validations/configuration";
import { logConfigurationChange } from "@/lib/config-engine";

export const GET = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const docRef = doc(firestore, 'agent_packages', params.id);
  const snap = await getDoc(docRef);
  
  if (!snap.exists()) {
    return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: { id: snap.id, ...snap.data() } });
});

export const PUT = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const body = await req.json();
  const validatedData = agentPackageSchema.parse(body);
  
  const docRef = doc(firestore, 'agent_packages', params.id);
  const oldSnap = await getDoc(docRef);
  const oldValue = oldSnap.exists() ? oldSnap.data() : null;

  const updateData = {
    ...validatedData,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin',
  };

  await updateDoc(docRef, updateData);

  await logConfigurationChange(
    'admin_1',
    'AGENT_PACKAGES',
    'UPDATE',
    oldValue,
    updateData
  );

  return NextResponse.json({ 
    success: true, 
    message: "Agent package updated successfully" 
  });
});

export const DELETE = withErrorHandling(async (req: NextRequest, { params }: { params: { id: string } }) => {
  const docRef = doc(firestore, 'agent_packages', params.id);
  await deleteDoc(docRef);

  await logConfigurationChange(
    'admin_1',
    'AGENT_PACKAGES',
    'DELETE',
    { id: params.id },
    null
  );

  return NextResponse.json({ success: true, message: "Agent package deleted successfully" });
});
