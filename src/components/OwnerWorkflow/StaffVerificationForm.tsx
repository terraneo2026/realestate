'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffVerificationReportSchema } from '@/lib/validations/owner-workflow';
import { MapPin, Camera, Star, AlertTriangle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffVerificationForm({ propertyId, staffId, onComplete }: { propertyId: string, staffId: string, onComplete: () => void }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(staffVerificationReportSchema),
    defaultValues: {
      propertyId,
      staffId,
      location: {
        lat: 0,
        lng: 0,
        geotagged: false
      },
      fraudIndicators: []
    }
  });

  const captureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setValue('location', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          geotagged: true
        });
        toast.success("Location geotagged successfully");
      });
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // API call to submit verification report
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete();
      toast.success("Verification report submitted successfully");
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
          <MapPin className="text-orange-500" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Field Verification</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Property ID: {propertyId}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Geo-tagging */}
        <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", watch('location.geotagged') ? "bg-green-100 text-green-600" : "bg-white text-gray-400")}>
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Geo-tagged Proof</p>
              <p className="text-xs font-bold text-gray-900">
                {watch('location.geotagged') ? `${watch('location.lat').toFixed(4)}, ${watch('location.lng').toFixed(4)}` : "Not Captured"}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={captureLocation}
            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all"
          >
            Capture GPS
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Condition Rating */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Condition Rating (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setValue('conditionRating', star)}
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                    watch('conditionRating') >= star ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-50 text-gray-300"
                  )}
                >
                  <Star size={20} fill={watch('conditionRating') >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>

          {/* Visit Images */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Visit Proof (Images)</label>
            <div className="h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-primary transition-all">
              <Camera size={18} className="text-gray-300" />
              <span className="text-[9px] font-black text-gray-400 uppercase">Upload Photos</span>
            </div>
          </div>
        </div>

        {/* Verification Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Owner Verified?</span>
            <input type="checkbox" {...register('isOwnerVerified')} className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" />
          </div>
          <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Occupancy Verified?</span>
            <input type="checkbox" {...register('isOccupancyVerified')} className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-gray-300" />
          </div>
        </div>

        {/* Fraud Indicators */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-500" /> Fraud Indicators
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Fake Owner', 'Subletting', 'Damage', 'External Deal', 'Suspicious Behavior'].map(flag => (
              <label key={flag} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all">
                <input type="checkbox" className="w-4 h-4 rounded text-red-500 border-gray-300" />
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{flag}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Final Recommendation</label>
          <div className="grid grid-cols-3 gap-4">
            {['approve', 'reject', 'review'].map(rec => (
              <button
                key={rec}
                type="button"
                onClick={() => setValue('recommendation', rec as any)}
                className={cn(
                  "py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all",
                  watch('recommendation') === rec 
                    ? (rec === 'approve' ? "bg-green-500 text-white border-green-500 shadow-xl shadow-green-200" : rec === 'reject' ? "bg-red-500 text-white border-red-500 shadow-xl shadow-red-200" : "bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-200")
                    : "bg-white text-gray-400 border-gray-100"
                )}
              >
                {rec}
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
          Submit Final Report
        </button>
      </form>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
