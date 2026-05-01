'use client';

import React from 'react';
import { 
  CreditCard, 
  Clock, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  ArrowUpRight,
  Receipt,
  History,
  TrendingUp,
  FileText
} from 'lucide-react';

interface RentPayment {
  id: string;
  month: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'escalated';
  dueDate: string;
  paidAt?: string;
  transactionId?: string;
}

export default function RentPaymentsDashboard({ payments }: { payments: RentPayment[] }) {
  const currentMonth = payments.find(p => p.status !== 'paid');

  return (
    <div className="space-y-8">
      {/* Rent Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">Next Rent Due</p>
            <h3 className="text-4xl font-black tracking-tighter mb-4">₹{currentMonth?.amount || 0}</h3>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tight">
              <Calendar size={14} /> Due by {currentMonth?.dueDate || 'N/A'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
          <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-2">Total Paid (Year)</p>
          <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">
            ₹{payments.filter(p => p.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0)}
          </h3>
          <div className="flex items-center gap-2 text-green-500 font-bold text-xs uppercase tracking-tight">
            <CheckCircle2 size={14} /> 100% On-time record
          </div>
        </div>

        <div className="bg-[#087c7c] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <p className="text-[10px] font-black text-white/60 tracking-widest uppercase mb-2">Escrow Status</p>
          <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase">Verified</h3>
          <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-tight">
            Payments are secured via platform escrow and released to owner monthly.
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <History className="text-gray-900" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Payment History</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rent cycle: Apr 2024 - Mar 2025</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">
            <Download size={14} /> Export All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Month</th>
                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-10 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{payment.month}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Due: {payment.dueDate}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                      payment.status === 'paid' ? "bg-green-50 text-green-600" :
                      payment.status === 'overdue' ? "bg-red-50 text-red-600" :
                      "bg-orange-50 text-orange-600"
                    )}>
                      {payment.status === 'paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">₹{payment.amount}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[10px] font-mono font-bold text-gray-400 uppercase">{payment.transactionId || '---'}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {payment.status === 'paid' ? (
                      <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                        <Receipt size={16} />
                      </button>
                    ) : (
                      <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-gray-200">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delayed Rent Policy Notice */}
      <div className="p-8 bg-red-50 rounded-[2.5rem] border border-red-100 flex items-start gap-6">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
          <AlertTriangle className="text-red-500" size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-red-900 uppercase tracking-widest mb-2">Late Payment Policy</h4>
          <p className="text-[10px] text-red-700/80 font-bold uppercase tracking-tight leading-relaxed max-w-2xl">
            Rent must be paid by the 5th of every month. Delayed payments beyond 15 days will trigger automated administrative escalation and potential legal notices as per the digital agreement terms.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
