'use client';

import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ShieldCheck, 
  RefreshCw, 
  PlusCircle, 
  TrendingUp,
  Receipt,
  AlertCircle
} from 'lucide-react';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  reason: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function TenantWalletDashboard({ balance, transactions }: { balance: number, transactions: WalletTransaction[] }) {
  return (
    <div className="space-y-8">
      {/* Wallet Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-primary" size={20} />
              </div>
              <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Verified Balance</p>
            </div>
            <h3 className="text-6xl font-black tracking-tighter mb-8">₹{balance.toLocaleString()}</h3>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                <PlusCircle size={16} /> Add Credits
              </button>
              <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2 backdrop-blur-sm">
                <RefreshCw size={16} /> Refund History
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#087c7c] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-white/60 tracking-widest uppercase mb-4">Internal Ledger</p>
            <h4 className="text-xl font-black tracking-tight leading-snug">Every rupee is traceable and protected by platform escrow.</h4>
          </div>
          <div className="flex items-center gap-2 text-white/80 font-bold text-xs uppercase tracking-tight">
            <ShieldCheck size={16} /> 100% Audit-Grade Security
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <History className="text-gray-900" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Transaction History</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time ledger updates</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-10 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        tx.type === 'credit' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                      )}>
                        {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{tx.reason}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tx.timestamp}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                      tx.status === 'completed' ? "bg-green-50 text-green-600" : 
                      tx.status === 'pending' ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <p className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      tx.type === 'credit' ? "text-green-600" : "text-red-600"
                    )}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm">
                      <Receipt size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Safety Notice */}
      <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-6">
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
          <AlertCircle className="text-blue-500" size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-2">Fintech-Grade Assurance</h4>
          <p className="text-[10px] text-blue-700/80 font-bold uppercase tracking-tight leading-relaxed max-w-2xl">
            Relocate.biz uses an immutable ledger system. All token refunds and escrow deposits are logged permanently and cannot be deleted. Refunds for cancelled visits are automatically credited back to your internal wallet.
          </p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
