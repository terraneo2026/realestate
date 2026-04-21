"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LogoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        // Force a hard redirect to the login page
        window.location.href = `/${locale}/login`;
      } catch (error) {
        console.error("Logout error:", error);
        window.location.href = `/${locale}/login`;
      }
    };
    performLogout();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Signing you out...</p>
      </div>
    </div>
  );
}
