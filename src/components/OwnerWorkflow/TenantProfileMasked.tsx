'use client';

import React from 'react';
import { User, Briefcase, Users, Wallet, ShieldCheck, Lock } from 'lucide-react';

interface MaskedTenant {
  profession: string;
  familySize: number;
  incomeRange: string;
  occupationType: string;
  isKycVerified: boolean;
}

export default function TenantProfileMasked({ tenant }: { tenant: MaskedTenant }) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
      {/* Background Masking Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 10px, transparent 10px, transparent 20px)' }} />
      
      <div className="flex items-center gap-6 mb-8 relative z-10">
        <div className="w-20 h-20 bg-gray-900 rounded-[1.5rem] flex items-center justify-center relative shadow-2xl">
          <User className="text-white" size={32} />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-lg border-4 border-white flex items-center justify-center">
            <Lock className="text-white" size={14} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Tenant Profile</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={12} className="text-primary" /> Identity Masked for Privacy
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase size={16} className="text-[#087c7c]" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Profession</span>
          </div>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{tenant.profession}</p>
        </div>

        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Users size={16} className="text-[#087c7c]" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Family Size</span>
          </div>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{tenant.familySize} Members</p>
        </div>

        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
          <div className="flex items-center gap-3 mb-2">
            <Wallet size={16} className="text-[#087c7c]" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Income Range</span>
          </div>
          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{tenant.incomeRange}</p>
        </div>

        <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white transition-all">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={16} className="text-[#087c7c]" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verification</span>
          </div>
          <p className="text-sm font-black text-primary uppercase tracking-tight">
            {tenant.isKycVerified ? 'Verified Tenant' : 'In Review'}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100">
        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3">
          <Lock size={18} className="text-orange-500 shrink-0" />
          <p className="text-[9px] text-orange-700 font-bold uppercase tracking-tight leading-relaxed">
            Full contact details and exact name will be revealed only after you ACCEPT the visit request.
          </p>
        </div>
      </div>
    </div>
  );
}
