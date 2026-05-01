'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ownerKYCSchema } from '@/lib/validations/owner-workflow';
import { Upload, ShieldCheck, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function OwnerKYCForm({ onComplete }: { onComplete: (data: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(ownerKYCSchema),
    defaultValues: {
      kycStatus: 'pending' as const,
      documents: {
        proofType: 'sale_deed' as const
      }
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // In a real app, upload files to storage first
      await new Promise(resolve => setTimeout(resolve, 1500));
      onComplete(data);
      toast.success("KYC submitted successfully for verification");
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock URL for now
      setValue(field as any, `https://storage.relocate.biz/temp/${file.name}`);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="text-primary" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Owner Verification</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">KYC & Ownership Proof Required</p>
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
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.fullName.message as string}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aadhaar Number</label>
                <input 
                  {...register('aadhaarNumber')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  placeholder="12-digit number"
                />
                {errors.aadhaarNumber && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.aadhaarNumber.message as string}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Permanent Address</label>
              <textarea 
                {...register('address')}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold min-h-[100px]"
                placeholder="Full residential address"
              />
              {errors.address && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.address.message as string}</p>}
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aadhaar Front</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload('documents.aadhaarFront', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-primary transition-all">
                    {watch('documents.aadhaarFront') ? (
                      <CheckCircle2 className="text-green-500 mb-2" size={24} />
                    ) : (
                      <Upload className="text-gray-300 mb-2" size={24} />
                    )}
                    <span className="text-[9px] font-black text-gray-400 uppercase">Upload JPG/PNG</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aadhaar Back</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={(e) => handleFileUpload('documents.aadhaarBack', e)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-primary transition-all">
                    {watch('documents.aadhaarBack') ? (
                      <CheckCircle2 className="text-green-500 mb-2" size={24} />
                    ) : (
                      <Upload className="text-gray-300 mb-2" size={24} />
                    )}
                    <span className="text-[9px] font-black text-gray-400 uppercase">Upload JPG/PNG</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ownership Proof</label>
              <select 
                {...register('documents.proofType')}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs uppercase"
              >
                <option value="sale_deed">Sale Deed</option>
                <option value="eb_bill">EB Bill</option>
                <option value="tax_receipt">Property Tax Receipt</option>
                <option value="encumbrance_proof">Encumbrance Proof</option>
              </select>
              <div className="relative group">
                <input 
                  type="file" 
                  onChange={(e) => handleFileUpload('documents.ownershipProof', e)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group-hover:border-primary transition-all">
                  <FileText className="text-gray-300 mb-2" size={32} />
                  <span className="text-[9px] font-black text-gray-400 uppercase">Upload PDF/JPG Proof</span>
                </div>
              </div>
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
                className="flex-[2] py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                Submit for Verification
              </button>
            </div>
          </div>
        )}
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight leading-relaxed">
          Verification typically takes 24-48 hours. You can list properties during this time, but they will not go live until KYC is approved.
        </p>
      </div>
    </div>
  );
}
