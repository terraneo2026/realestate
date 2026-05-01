'use client';

import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  UserX, 
  Activity, 
  ChevronRight,
  TrendingUp,
  FileSearch,
  History,
  Lock
} from 'lucide-react';

interface RiskStat {
  userId: string;
  userName: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  violations: number;
  lastEvent: string;
}

export default function RiskMonitoringDashboard({ stats }: { stats: RiskStat[] }) {
  return (
    <div className="space-y-8">
      {/* Risk Overview Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Platform Safety</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldAlert size={14} className="text-red-500" /> Real-time Anomaly Detection Active
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Critical Risks</p>
                <p className="text-xl font-black text-gray-900 leading-none mt-1">4 Active</p>
              </div>
           </div>
        </div>
      </div>

      {/* Risk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Alerts Queue */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                <Activity className="text-gray-900" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Live Risk Monitor</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tracking behavioral patterns</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/30">
                  <th className="px-10 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">User / Entity</th>
                  <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Risk Level</th>
                  <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Violations</th>
                  <th className="px-10 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.map((stat) => (
                  <tr key={stat.userId} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                          <UserX size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{stat.userName}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {stat.userId.slice(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                        stat.riskLevel === 'critical' ? "bg-red-100 text-red-600" :
                        stat.riskLevel === 'high' ? "bg-orange-100 text-orange-600" :
                        "bg-green-100 text-green-600"
                      )}>
                        {stat.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{stat.violations}</p>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all">
                        <FileSearch size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Lock size={80} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-4 tracking-tight uppercase">Enforcement Controls</h3>
              <p className="text-gray-400 text-[10px] mb-8 leading-relaxed font-bold tracking-tight uppercase">Manual override for system restrictions and identity blacklisting.</p>
              <div className="space-y-3">
                <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                  <UserX size={14} /> Blacklist Identity
                </button>
                <button className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <History size={14} /> View Audit Logs
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100 flex items-start gap-4">
            <AlertTriangle size={24} className="text-orange-500 shrink-0" />
            <div>
              <h4 className="text-sm font-black text-orange-900 uppercase tracking-widest mb-2">Automated Rules</h4>
              <p className="text-[10px] text-orange-700 font-bold uppercase tracking-tight leading-relaxed">
                Platform fees are auto-deducted from escrow. Rent is locked after the first visit request. Bypass attempts trigger automatic reliability penalties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
