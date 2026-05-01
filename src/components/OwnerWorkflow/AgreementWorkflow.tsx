'use client';

import React, { useState } from 'react';
import { FileText, PenTool, CheckCircle2, Download, ShieldCheck, Globe, Laptop, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AgreementProps {
  bookingId: string;
  tenantName: string;
  ownerName: string;
  propertyTitle: string;
  onComplete: () => void;
}

export default function AgreementWorkflow({ bookingId, tenantName, ownerName, propertyTitle, onComplete }: AgreementProps) {
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const handleESign = async () => {
    setSigning(true);
    try {
      // Mock e-sign process
      await new Promise(resolve => setTimeout(resolve, 2500));
      setSigned(true);
      onComplete();
      toast.success("Digital Agreement signed successfully");
    } catch (error) {
      toast.error("Signing failed");
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-3xl mx-auto overflow-hidden relative">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
          <FileText className="text-blue-500" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Digital Rental Agreement</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Booking Ref: {bookingId}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Document Preview Area */}
        <div className="aspect-[1/1.4] w-full bg-gray-50 rounded-[2rem] border-2 border-gray-100 p-10 overflow-y-auto custom-scrollbar shadow-inner relative">
          <div className="absolute top-0 right-0 p-6">
            <ShieldCheck size={40} className="text-gray-100" />
          </div>
          <div className="space-y-6 text-gray-800 font-medium text-xs leading-relaxed">
            <h3 className="text-lg font-black text-center uppercase tracking-tighter mb-10 underline underline-offset-8 decoration-primary">Rental Agreement</h3>
            <p>This Rental Agreement is made on <strong>{new Date().toLocaleDateString()}</strong> between:</p>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="mb-2 uppercase text-[10px] font-black text-gray-400">The Landlord</p>
              <p className="font-black text-sm">{ownerName}</p>
            </div>
            <p className="text-center font-black text-[10px] text-gray-300">AND</p>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="mb-2 uppercase text-[10px] font-black text-gray-400">The Tenant</p>
              <p className="font-black text-sm">{tenantName}</p>
            </div>
            <p>Regarding the property located at <strong>{propertyTitle}</strong>.</p>
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <p className="font-black uppercase tracking-widest text-[10px] text-primary">Terms & Conditions:</p>
              <p>1. The monthly rent shall be paid through the Relocate.biz platform only.</p>
              <p>2. Any maintenance issues must be reported via the platform dashboard.</p>
              <p>3. This agreement is digitally signed and holds legal validity under the IT Act.</p>
            </div>
          </div>
        </div>

        {/* Audit Log / E-Sign Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Globe size={14} className="text-gray-400 mb-2" />
            <p className="text-[8px] font-black text-gray-400 uppercase">IP Address</p>
            <p className="text-[10px] font-bold text-gray-900">182.72.198.42</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Laptop size={14} className="text-gray-400 mb-2" />
            <p className="text-[8px] font-black text-gray-400 uppercase">Device</p>
            <p className="text-[10px] font-bold text-gray-900">Chrome / macOS</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <Clock size={14} className="text-gray-400 mb-2" />
            <p className="text-[8px] font-black text-gray-400 uppercase">Timestamp</p>
            <p className="text-[10px] font-bold text-gray-900">{new Date().toLocaleTimeString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <ShieldCheck size={14} className="text-primary mb-2" />
            <p className="text-[8px] font-black text-gray-400 uppercase">Security</p>
            <p className="text-[10px] font-bold text-primary">SHA-256 Encrypted</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
            <Download size={18} /> Download Draft
          </button>
          <button 
            onClick={handleESign}
            disabled={signing || signed}
            className={cn(
              "flex-[2] py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2",
              signed ? "bg-green-500 text-white" : "bg-primary text-white"
            )}
          >
            {signing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : signed ? (
              <CheckCircle2 size={18} />
            ) : (
              <PenTool size={18} />
            )}
            {signed ? "Agreement Signed" : "E-Sign Agreement"}
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
