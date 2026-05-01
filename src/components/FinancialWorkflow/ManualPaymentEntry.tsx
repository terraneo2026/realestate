'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualPaymentEntrySchema } from '@/lib/validations/financial-workflow';
import { 
  CreditCard, 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  UserPlus, 
  History,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ManualPaymentEntry({ staffId, onComplete }: { staffId: string, onComplete: () => void }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(manualPaymentEntrySchema),
    defaultValues: {
      created_by: staffId,
      status: 'PENDING_APPROVAL' as const
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // API call to manual_payment_entries
      await new Promise(r => setTimeout(r, 2000));
      onComplete();
      toast.success("Manual payment entry created. Pending second approval.");
    } catch (e) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('proof_url', `https://storage.relocate.biz/manual-payments/${file.name}`);
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
          <CreditCard className="text-primary" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Offline Payment Entry</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Maker-Checker Financial Control</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Amount (INR)</label>
            <input 
              type="number"
              {...register('amount', { valueAsNumber: true })}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
              placeholder="0.00"
            />
            {errors.amount && <p className="text-[10px] text-red-500 font-bold">{errors.amount.message as string}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction Reference ID</label>
            <input 
              {...register('payment_reference')}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
              placeholder="e.g. UTR-982312"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Date</label>
            <input 
              type="date"
              {...register('payment_date')}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deal / Booking ID</label>
            <input 
              {...register('property_deal_id')}
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
              placeholder="BOOKING-XXX"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Proof (Screenshot/PDF)</label>
          <div className="relative group">
            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            <div className="h-40 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center group hover:border-primary transition-all">
              {watch('proof_url') ? <CheckCircle2 className="text-green-500" size={32} /> : <Upload className="text-gray-300" size={32} />}
              <span className="text-[10px] font-black text-gray-400 uppercase mt-2">Upload Transaction Receipt</span>
            </div>
          </div>
          {errors.proof_url && <p className="text-[10px] text-red-500 font-bold">{errors.proof_url.message as string}</p>}
        </div>

        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
          <ShieldCheck size={20} className="text-blue-500 shrink-0" />
          <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight leading-relaxed">
            Maker-Checker Model: This entry will be sent to the Finance Approval Queue. You cannot approve your own entries. A second staff member or admin must verify the proof before funds are credited.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
          Initiate Payment Entry
        </button>
      </form>
    </div>
  );
}
