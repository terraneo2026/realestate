import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";

/**
 * Senior Architect API Auth Guard
 * Verifies JWT token and checks for admin role.
 */
export async function verifyAdminApi(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1] || req.cookies.get("auth-token")?.value;

  if (!token) {
    return { authorized: false, message: "Authentication required" };
  }

  const payload = await verifyToken(token);
  
  if (!payload || payload.role !== 'admin') {
    return { authorized: false, message: "Forbidden: Admin access required" };
  }

  return { authorized: true, payload };
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export function forbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json({ success: false, message }, { status: 403 });
}
