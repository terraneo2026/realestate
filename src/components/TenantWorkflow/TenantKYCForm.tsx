'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantKYCSchema } from '@/lib/validations/tenant-workflow';
import { Upload, User, Briefcase, Wallet, Users, CheckCircle2, Loader2, ShieldCheck, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function TenantKYCForm({ onComplete }: { onComplete: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(tenantKYCSchema),
    defaultValues: {
      employmentType: 'salaried',
      familySize: 1,
      kycStatus: 'pending'
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Simulate API call for KYC submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(data);
      toast.success("KYC submitted for review");
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock upload URL
      setValue(field as any, `https://storage.relocate.biz/tenant/kyc/${file.name}`);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-2xl mx-auto overflow-hidden">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-[#087c7c]/10 rounded-2xl flex items-center justify-center">
          <User className="text-[#087c7c]" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Tenant Verification</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Complete profile to unlock visits</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Profession</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    {...register('profession')}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                {errors.profession && <p className="text-[10px] text-red-500 font-bold">{errors.profession.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Income</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <select 
                    {...register('monthlyIncome')}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs uppercase"
                  >
                    <option value="">Select Range</option>
                    <option value="below_50k">Below ₹50,000</option>
                    <option value="50k_1l">₹50,000 - ₹1,00,000</option>
                    <option value="1l_2l">₹1,00,000 - ₹2,00,000</option>
                    <option value="above_2l">Above ₹2,00,000</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Family Size</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="number"
                    {...register('familySize', { valueAsNumber: true })}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aadhaar Number</label>
                <input 
                  {...register('aadhaarNumber')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  placeholder="12-digit Aadhaar"
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all"
            >
              Continue to Verification
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Proof (Aadhaar)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  onChange={(e) => handleFileUpload('documents.aadhaarUpload', e)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center group-hover:border-primary transition-all">
                  {watch('documents.aadhaarUpload') ? (
                    <CheckCircle2 className="text-green-500 mb-2" size={32} />
                  ) : (
                    <Upload className="text-gray-300 mb-2" size={32} />
                  )}
                  <span className="text-[10px] font-black text-gray-400 uppercase">Upload Aadhaar PDF/JPG</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <ShieldCheck className="text-blue-500 shrink-0" size={24} />
              <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight leading-relaxed">
                Your data is encrypted and only used for rental verification. We never share your exact name or phone number with owners until you visit.
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
              >
                Back
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-5 bg-[#087c7c] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                Submit KYC
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
