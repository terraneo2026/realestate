'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verificationReportSchema } from '@/lib/validations/staff-workflow';
import { MapPin, Camera, FileText, CheckCircle2, Loader2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function VerificationReportForm({ propertyId, staffId, onComplete }: { propertyId: string, staffId: string, onComplete: () => void }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(verificationReportSchema),
    defaultValues: {
      property_id: propertyId,
      staff_id: staffId,
      media_urls: []
    }
  });

  const captureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setValue('latitude', pos.coords.latitude);
        setValue('longitude', pos.coords.longitude);
        toast.success("GPS Coordinates Captured");
      });
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // API call to verification_reports
      await new Promise(r => setTimeout(r, 2000));
      onComplete();
      toast.success("Verification Report Submitted");
    } catch (e) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <ShieldAlert className="text-primary" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Verification Audit</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Property ID: {propertyId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* GPS Section */}
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl bg-white text-gray-400 shadow-sm", watch('latitude') ? "text-green-500" : "")}>
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Visit Coordinates</p>
              <p className="text-xs font-bold text-gray-900">
                {watch('latitude') ? `${watch('latitude')?.toFixed(4)}, ${watch('longitude')?.toFixed(4)}` : "Pending GPS Capture"}
              </p>
            </div>
          </div>
          <button type="button" onClick={captureGPS} className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-sm">
            Capture Now
          </button>
        </div>

        {/* Notes & Docs */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Internal Audit Notes</label>
          <textarea 
            {...register('report_notes')}
            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold min-h-[120px]"
            placeholder="Detailed condition of the property and owner verification results..."
          />
          {errors.report_notes && <p className="text-[10px] text-red-500 font-bold">{errors.report_notes.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Status Selection */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Recommendation</label>
            <div className="grid grid-cols-2 gap-3">
              {['approved', 'rejected'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setValue('approval_status', status as any)}
                  className={cn(
                    "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                    watch('approval_status') === status 
                      ? (status === 'approved' ? "bg-green-500 text-white border-green-500" : "bg-red-500 text-white border-red-500")
                      : "bg-white text-gray-400 border-gray-100"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Document Status */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Document Status</label>
            <select 
              {...register('document_status')}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs uppercase"
            >
              <option value="verified">All Verified</option>
              <option value="missing">Missing Docs</option>
              <option value="fraudulent">Fraudulent</option>
            </select>
          </div>
        </div>

        {/* Media Upload Mock */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Proofs (Min 3)</label>
          <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group hover:border-primary transition-all cursor-pointer">
            <Camera className="text-gray-300 mb-2" size={24} />
            <span className="text-[9px] font-black text-gray-400 uppercase">Upload Photos & Videos</span>
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
          Submit Verification Report
        </button>
      </form>

      <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-4">
        <AlertTriangle size={20} className="text-orange-500 shrink-0" />
        <p className="text-[10px] text-orange-700 font-bold uppercase tracking-tight leading-relaxed">
          Reports are immutable once submitted. Ensure all photos and notes are accurate as per the physical visit. Conflicts will trigger a third-party audit.
        </p>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
