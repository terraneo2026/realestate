"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";

import UnifiedRegisterForm from "@/components/auth/UnifiedRegisterForm";

export default function TenantRegisterClient() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10 transition-all duration-500">
        <UnifiedRegisterForm initialRole="tenant" locale={locale} />
      </div>
    </div>
  );
}
