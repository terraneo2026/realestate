'use client';

import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Download, 
  Filter,
  ShieldCheck,
  AlertTriangle,
  FileText
} from 'lucide-react';

interface FinanceStats {
  totalRevenue: number;
  escrowBalance: number;
  commissionsEarned: number;
  pendingPayouts: number;
  refundsIssued: number;
}

export default function AdminFinancialDashboard({ stats }: { stats: FinanceStats }) {
  return (
    <div className="space-y-10">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: stats.totalRevenue, icon: TrendingUp, color: 'bg-gray-900 text-white', trend: '+12.5%' },
          { label: 'Escrow Balance', value: stats.escrowBalance, icon: DollarSign, color: 'bg-[#087c7c] text-white', trend: 'Held' },
          { label: 'Commissions', value: stats.commissionsEarned, icon: PieChart, color: 'bg-white text-gray-900', trend: 'Platform' },
          { label: 'Pending Payouts', value: stats.pendingPayouts, icon: BarChart3, color: 'bg-white text-gray-900', trend: 'To Owners' },
        ].map((card, i) => (
          <div key={i} className={cn(
            "p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-gray-100",
            card.color
          )}>
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <card.icon size={60} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{card.label}</p>
                <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-white/10">{card.trend}</span>
              </div>
              <h3 className="text-3xl font-black tracking-tighter">₹{card.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Financial Log */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <FileText className="text-gray-900" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Audit Ledger</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master financial records</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
                <Filter size={18} />
              </button>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                <Download size={14} /> Export Report
              </button>
            </div>
          </div>

          <div className="p-20 text-center">
             <ShieldCheck size={48} className="mx-auto text-gray-100 mb-6" />
             <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Ledger Synchronized</h4>
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">All transactions are immutable and audited</p>
          </div>
        </div>

        {/* Financial Alerts & Actions */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8 uppercase">Risk Alerts</h2>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4">
                <AlertTriangle className="text-red-500 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black text-red-900 uppercase tracking-widest">Failed Payouts</p>
                  <p className="text-sm font-black text-red-600 mt-1">₹45,200 (3 cases)</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100 flex items-start gap-4">
                <AlertTriangle className="text-orange-500 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Pending Approvals</p>
                  <p className="text-sm font-black text-orange-600 mt-1">₹1,20,000 (Maker-Checker)</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-8 py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all">
              Resolve All Risks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
