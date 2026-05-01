import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "@/lib/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { registerSchema } from "@/lib/validations/auth";
import { withErrorHandling } from "@/lib/api-wrapper";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();

  // 1. Server-side validation with Zod
  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    throw validation.error; // Caught by wrapper
  }

  const { fullName, email, mobile, password, role, agencyName, licenseNumber, address, aadhaarNumber } = validation.data;

  // 2. Check mobile uniqueness in Firestore
  const mobileQuery = query(collection(firestore, "users"), where("mobile", "==", mobile));
  const mobileSnapshot = await getDocs(mobileQuery);
  
  if (!mobileSnapshot.empty) {
    return NextResponse.json(
      { message: "This mobile number is already registered" },
      { status: 409 }
    );
  }

  // 3. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 4. Store additional user data in Firestore
  await setDoc(doc(firestore, "users", user.uid), {
    uid: user.uid,
    fullName: fullName,
    name: fullName,
    email: email,
    mobile: mobile,
    role: role,
    kyc_status: role === 'agent' ? 'pending' : 'unverified',
    is_verified: role === 'agent' ? false : true,
    isVerified: role === 'agent' ? false : true,
    agency_name: agencyName || null,
    license_number: licenseNumber || null,
    address: address || null,
    aadhaar_number: aadhaarNumber || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    accountStatus: 'active'
  });

  // 5. Return success
  return NextResponse.json(
    { 
      message: "User registered successfully", 
      role: role,
      uid: user.uid,
      fullName: fullName,
      email: email,
      redirect: `/${role}/dashboard`
    }, 
    { status: 201 }
  );
});
