"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ComingSoonProps {
  role: "tenant" | "owner" | "agent";
  pageName: string;
}

export default function ComingSoon({ role, pageName }: ComingSoonProps) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  return (
    <DashboardLayout userRole={role}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-4xl animate-bounce">
            🏗️
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-sm">
            ✨
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight capitalize">
          {pageName} <span className="text-primary italic">Coming Soon</span>
        </h1>
        
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
          We are building something extraordinary for your <span className="text-gray-800 font-bold">{pageName}</span> experience. 
          Our team is currently polishing the final details to ensure zero errors and a perfect functional flow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href={`/${locale}/${role}/dashboard`}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            📊 Back to Dashboard
          </Link>
          <Link 
            href={`/${locale}/contact`}
            className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            ✉️ Contact Support
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg w-full opacity-40">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[85%]"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[95%]"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[70%]"></div>
          </div>
        </div>
        <p className="mt-4 text-xs font-bold text-gray-400  tracking-widest">Development in progress</p>
      </div>
    </DashboardLayout>
  );
}
