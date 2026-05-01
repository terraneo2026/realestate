import { NextRequest, NextResponse } from "next/server";
import { firestore, auth } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signToken } from "@/lib/jwt";
import { withErrorHandling } from "@/lib/api-wrapper";
import { loginSchema } from "@/lib/validations/auth";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const body = await req.json();
  const validation = loginSchema.safeParse(body);
  
  if (!validation.success) {
    throw validation.error;
  }

  const { email, password } = validation.data;

  // 1. Authenticate with Firebase Auth
  let userCredential;
  try {
    userCredential = await signInWithEmailAndPassword(auth, email, password);
  } catch (authError: any) {
    console.error("Firebase Auth Login Error:", authError.code);
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const user = userCredential.user;

  // 2. Fetch user role from Firestore
  const userDocRef = doc(firestore, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    return NextResponse.json(
      { message: "User data not found in database" },
      { status: 404 }
    );
  }

  const userData = userDocSnap.data();

  // 3. Generate JWT
  const token = await signToken({
    id: user.uid,
    email: user.email,
    role: userData.role,
  });

  // 4. Create response and set cookie
  const response = NextResponse.json(
    { 
      message: "Login successful", 
      role: userData.role,
      uid: user.uid,
      fullName: userData.fullName || userData.name,
      email: user.email,
      redirect: `/${userData.role}/dashboard` 
    }, 
    { status: 200 }
  );

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
});
