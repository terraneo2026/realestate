'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agentKYCSchema } from '@/lib/validations/agent-workflow';
import { Upload, ShieldCheck, Camera, FileText, CheckCircle2, Loader2, AlertCircle, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function AgentKYCForm({ onComplete }: { onComplete: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(agentKYCSchema),
    defaultValues: {
      kycStatus: 'pending_review' as const,
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(data);
      toast.success("KYC application submitted for review");
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(field as any, `https://storage.relocate.biz/agent/kyc/${file.name}`);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Briefcase className="text-primary" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Agent Verification</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Business & KYC Documentation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  {...register('fullName')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  placeholder="As per Aadhaar"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Name (Optional)</label>
                <input 
                  {...register('businessName')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  placeholder="Agency Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  {...register('email')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">RERA Number (Optional)</label>
                <input 
                  {...register('reraNumber')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  placeholder="State RERA ID"
                />
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all"
            >
              Continue to Document Upload
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aadhaar Proof</label>
                <div className="relative group">
                  <input type="file" onChange={(e) => handleFileUpload('documents.aadhaarUpload', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-primary transition-all">
                    {watch('documents.aadhaarUpload') ? <CheckCircle2 className="text-green-500" /> : <Upload className="text-gray-300" />}
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-2">Aadhaar JPG/PDF</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Proof</label>
                <div className="relative group">
                  <input type="file" onChange={(e) => handleFileUpload('documents.businessProof', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-primary transition-all">
                    {watch('documents.businessProof') ? <CheckCircle2 className="text-green-500" /> : <FileText className="text-gray-300" />}
                    <span className="text-[9px] font-black text-gray-400 uppercase mt-2">GST/RERA/Trade License</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Live Selfie Photo</label>
              <div className="relative group">
                <input type="file" onChange={(e) => handleFileUpload('documents.selfiePhoto', e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center group-hover:border-primary transition-all">
                  {watch('documents.selfiePhoto') ? <CheckCircle2 className="text-green-500" size={32} /> : <Camera className="text-gray-300" size={32} />}
                  <span className="text-[10px] font-black text-gray-400 uppercase mt-2">Take or Upload Selfie</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Back</button>
              <button type="submit" disabled={loading} className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                Submit for Verification
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
