"use client";

import PropertyForm from "@/components/PropertyForm/PropertyForm";
import DashboardLayout from "@/components/DashboardLayout";
import React from "react";

export default function AgentEditPropertyPage({ 
  params 
}: { 
  params: { locale: string, id: string } 
}) {
  const { locale, id } = params;
  
  return (
    <DashboardLayout userRole="agent">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Edit Listing</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Update your listing and keep it optimized</p>
      </div>
      <PropertyForm propertyId={id} />
    </DashboardLayout>
  );
}
