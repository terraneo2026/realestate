'use client';

import React from 'react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';

export const dynamic = 'force-dynamic';

import { Settings, Shield, Bell, Globe, Database, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-4 md:px-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight truncate">Platform Settings</h1>
          <p className="text-gray-400 mt-1 md:mt-2 font-bold tracking-tight text-[10px] md:text-xs flex items-center gap-2">
             <Settings size={14} className="text-primary shrink-0" /> <span className="truncate">Global configuration</span>
          </p>
        </div>
        <button className="w-full md:w-auto h-11 md:h-14 px-6 md:px-8 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase">
           <Save size={18} /> Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0 pb-12">
         <div className="lg:col-span-2 space-y-6 md:space-y-10">
            <div className="bg-white rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
               <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 tracking-tight flex items-center gap-3">
                  <Globe size={20} className="text-primary" /> General Configuration
               </h3>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight ml-1">Platform Name</label>
                        <input type="text" defaultValue="Relocate Biz" className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 text-sm md:text-base" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight ml-1">Contact Email</label>
                        <input type="email" defaultValue="drrealty9@gmail.com" className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 text-sm md:text-base" />
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="bg-white rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
               <h3 className="text-lg md:text-xl font-bold mb-6 md:mb-8 tracking-tight flex items-center gap-3">
                  <Shield size={20} className="text-primary" /> Security Policies
               </h3>
               <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                     <span className="text-[10px] md:text-sm font-bold tracking-tight">Enforce MFA for Staff</span>
                     <div className="w-8 h-4 md:w-12 md:h-6 bg-primary rounded-full relative cursor-pointer"><div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-sm" /></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
}
