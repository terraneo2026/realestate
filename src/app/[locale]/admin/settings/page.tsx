'use client';

import React from 'react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';

export const dynamic = 'force-dynamic';

import { Settings, Shield, Bell, Globe, Database, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Platform Settings</h1>
          <p className="text-gray-400 mt-2 font-bold tracking-tight text-xs flex items-center gap-2">
             <Settings size={14} className="text-primary" /> Global configuration and system parameters
          </p>
        </div>
        <button className="h-14 px-8 bg-primary text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
           <Save size={18} /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
               <h3 className="text-xl font-bold mb-8 tracking-tight flex items-center gap-3">
                  <Globe size={20} className="text-primary" /> General Configuration
               </h3>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 tracking-tight ml-1">Platform Name</label>
                        <input type="text" defaultValue="Relocate Biz" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 tracking-tight ml-1">Contact Email</label>
                        <input type="email" defaultValue="admin@relocate.biz" className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
               <h3 className="text-xl font-bold mb-8 tracking-tight flex items-center gap-3">
                  <Shield size={20} className="text-primary" /> Security Policies
               </h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                     <span className="text-xs font-bold tracking-tight">Enforce MFA for Staff</span>
                     <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
}
