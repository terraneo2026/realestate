'use client';

import React from 'react';
import { 
  ClipboardCheck, 
  MapPin, 
  UserCheck, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight,
  ShieldCheck,
  Clock,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';

interface StaffStats {
  pendingTasks: number;
  completedToday: number;
  performanceScore: number;
  activeEscorts: number;
}

export default function StaffDashboard({ stats, role }: { stats: StaffStats, role: string }) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Staff Operations</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" /> {role.replace(/_/g, ' ')} Portal
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              stats.performanceScore >= 90 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
            )}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Performance</p>
              <p className="text-xl font-black text-gray-900 leading-none mt-1">{stats.performanceScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'bg-orange-50 text-orange-600' },
          { label: 'Completed Today', value: stats.completedToday, icon: ClipboardCheck, color: 'bg-green-50 text-green-600' },
          { label: 'Active Escorts', value: stats.activeEscorts, icon: UserCheck, color: 'bg-blue-50 text-blue-600' },
          { label: 'Unread Messages', value: 12, icon: MessageSquare, color: 'bg-primary/10 text-primary' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 group hover:scale-105 transition-all">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Active Queue Section */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <LayoutDashboard className="text-gray-900" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Current Assignment Queue</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Action items for next 24 hours</p>
            </div>
          </div>
        </div>

        <div className="p-10 text-center py-20">
          <AlertCircle size={48} className="mx-auto text-gray-100 mb-6" />
          <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Queue is Empty</h4>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Waiting for admin to assign new tasks</p>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
