'use client';

import React from 'react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { Activity, ShieldCheck, Zap, Server, Database, Globe, Cpu, MemoryStick as Memory, HardDrive, Network, Loader2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const StatCard = ({ label, value, icon: Icon, color, subValue }: any) => (
  <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between h-full group hover:-translate-y-1 transition-all">
    <div className="flex justify-between items-start mb-6">
       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm bg-opacity-10", color)}>
         <Icon size={28} className={color.replace('bg-', 'text-')} />
       </div>
       <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-lg">
          <Activity size={10} />
          <span className="text-xs font-bold tracking-tight">Live</span>
       </div>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      {subValue && <p className="text-xs font-bold text-gray-400 mt-1 tracking-tight">{subValue}</p>}
    </div>
  </div>
);

export default function MonitoringPage() {
  return (
    <AdminLayout>
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Infrastructure</h1>
        <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
           <ShieldCheck size={14} className="text-[#087c7c]" /> Real-time system diagnostics, server health, and security telemetry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard label="Server status" value="Healthy" subValue="Region: US-EAST-1" icon={Server} color="bg-green-500" />
        <StatCard label="Database latency" value="12ms" subValue="99th Percentile" icon={Database} color="bg-blue-500" />
        <StatCard label="API uptime" value="99.98%" subValue="Last 30 Days" icon={Zap} color="bg-yellow-500" />
        <StatCard label="Traffic flow" value="1.2M" subValue="Requests / Hour" icon={Globe} color="bg-[#087c7c]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* CPU Usage */}
         <div className="lg:col-span-2 bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-400/20 relative overflow-hidden group">
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-10">
                  <Cpu size={24} className="text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight">Cluster performance</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                  <div className="space-y-4">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">CPU Load</span>
                     <div className="text-4xl font-bold">24%</div>
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '24%' }} />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Memory usage</span>
                     <div className="text-4xl font-bold">4.2<span className="text-sm font-bold text-gray-500 ml-1">GB</span></div>
                     <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '42%' }} />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">Disk I/O</span>
                     <div className="text-4xl font-bold text-green-500">Fast</div>
                     <div className="flex gap-1">
                        {[0.2, 0.5, 0.3, 0.8, 0.6, 0.9, 0.4].map((h, i) => (
                          <div key={i} className="w-1 bg-green-500/40 rounded-full" style={{ height: `${h * 20}px` }} />
                        ))}
                     </div>
                  </div>
               </div>
               
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Network size={18} className="text-gray-400" />
                     <span className="text-xs font-bold uppercase tracking-tight">Network throughput</span>
                  </div>
                  <span className="text-xs font-bold">842 Mbps</span>
               </div>
            </div>
         </div>

         {/* Security Feed */}
         <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-4 mb-10">
                  <ShieldCheck size={24} className="text-[#087c7c]" />
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Security</h2>
               </div>
               
               <div className="space-y-6">
                  {[
                    { event: 'SSL Certificate', status: 'Valid', color: 'text-green-500' },
                    { event: 'Firewall Rules', status: 'Active', color: 'text-green-500' },
                    { event: 'DDoS Protection', status: 'Optimal', color: 'text-green-500' },
                    { event: 'Auth Vulnerabilities', status: 'None', color: 'text-green-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{item.event}</span>
                       <span className={cn("text-xs font-bold uppercase tracking-tight", item.color)}>{item.status}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <button className="mt-10 w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-tight shadow-xl shadow-gray-900/10 hover:bg-black transition-all">
               Run full audit
            </button>
         </div>
      </div>
    </AdminLayout>
  );
}
