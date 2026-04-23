import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await sendPasswordResetEmail(auth, email);

    return NextResponse.json(
      { message: "Reset email sent successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Password Reset Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to send reset email" },
      { status: 500 }
    );
  }
}
