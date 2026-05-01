import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Senior Architect API Wrapper
 * Provides centralized error handling, structured logging, and validation for API routes.
 */

type ApiHandler = (req: NextRequest, params?: any) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler) {
  return async (req: NextRequest, params?: any) => {
    try {
      return await handler(req, params);
    } catch (error: any) {
      // 1. Structured Logging
      console.error(`[API ERROR] ${req.method} ${req.url}:`, {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });

      // 2. Handle Zod Validation Errors
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      // 3. Handle Firebase Auth/Firestore Errors
      if (error.code) {
        const status = getStatusCode(error.code);
        return NextResponse.json(
          {
            success: false,
            message: error.message || "Database operation failed",
            code: error.code,
          },
          { status }
        );
      }

      // 4. Default Internal Server Error
      return NextResponse.json(
        {
          success: false,
          message: process.env.NODE_ENV === "production" 
            ? "An internal server error occurred" 
            : error.message,
        },
        { status: 500 }
      );
    }
  };
}

function getStatusCode(firebaseCode: string): number {
  switch (firebaseCode) {
    case "auth/email-already-in-use":
    case "auth/credential-already-in-use":
      return 409;
    case "auth/invalid-email":
    case "auth/weak-password":
    case "auth/invalid-password":
      return 400;
    case "auth/user-not-found":
    case "auth/wrong-password":
      return 401;
    case "permission-denied":
      return 403;
    case "not-found":
      return 404;
    default:
      return 500;
  }
}
