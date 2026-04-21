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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Server-side validation with Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          message: "Validation failed", 
          errors: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }

    const { fullName, email, mobile, password, role, agencyName, licenseNumber, address } = validation.data;

    // 2. Check mobile uniqueness in Firestore (Email uniqueness is handled by Firebase Auth)
    const mobileQuery = query(collection(firestore, "users"), where("mobile", "==", mobile));
    const mobileSnapshot = await getDocs(mobileQuery);
    
    if (!mobileSnapshot.empty) {
      return NextResponse.json(
        { message: "This mobile number is already registered" },
        { status: 409 }
      );
    }

    // 3. Create user in Firebase Auth
    // Note: This automatically checks for email uniqueness
    let userCredential;
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-in-use') {
        return NextResponse.json(
          { message: "This email is already registered" },
          { status: 409 }
        );
      }
      throw authError;
    }

    const user = userCredential.user;

    // 4. Store additional user data in Firestore
    await setDoc(doc(firestore, "users", user.uid), {
      uid: user.uid,
      name: fullName,
      email: email,
      mobile: mobile,
      role: role,
      is_verified: role === 'agent' ? false : true,
      agency_name: agencyName || null,
      license_number: licenseNumber || null,
      address: address || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    // 5. Return success
    return NextResponse.json(
      { 
        message: "User registered successfully", 
        role: role,
        uid: user.uid,
        redirect: `/${role}/dashboard`
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Firebase Registration Error:", error);
    return NextResponse.json(
      { 
        message: "Registration error: " + (error.message || "Internal server error")
      },
      { status: 500 }
    );
  }
}
