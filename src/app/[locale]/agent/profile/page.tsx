"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { usePathname } from "next/navigation";

export default function GenericDashboardPage() {
  const pathname = usePathname();
  const parts = pathname?.split("/") || [];
  const role = parts[2] as "tenant" | "owner" | "agent";
  const pageName = parts[3]?.replace("-", " ") || "Page";

  return (
    <DashboardLayout userRole={role}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">{pageName}</h1>
        <p className="text-gray-600 mt-2 font-medium">This section is currently under development.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl mx-auto mb-6">
          🏗️
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          We are working hard to bring you the best experience for managing your {pageName}. Stay tuned!
        </p>
      </div>
    </DashboardLayout>
  );
}
