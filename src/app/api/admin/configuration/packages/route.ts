import { NextRequest, NextResponse } from "next/server";
import { firestore } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { withErrorHandling } from "@/lib/api-wrapper";
import { agentPackageSchema } from "@/lib/validations/configuration";
import { logConfigurationChange } from "@/lib/config-engine";

export const GET = withErrorHandling(async (req: NextRequest) => {
  const q = query(collection(firestore, 'agent_packages'), orderBy('sortOrder', 'asc'));
  const snap = await getDocs(q);
  const packages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  return NextResponse.json({ success: true, data: packages });
});

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const validatedData = agentPackageSchema.parse(body);
  
  const docData = {
    ...validatedData,
    updatedAt: serverTimestamp(),
    updatedBy: 'admin',
  };

  const docRef = await addDoc(collection(firestore, 'agent_packages'), docData);

  await logConfigurationChange(
    'admin_1',
    'AGENT_PACKAGES',
    'CREATE',
    null,
    docData
  );

  return NextResponse.json({ 
    success: true, 
    id: docRef.id,
    message: "Agent package created successfully" 
  });
});
