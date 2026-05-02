'use client';

import React from 'react';
import { 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Loader2
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Custom Bar Chart Component
const MiniBarChart = ({ data, color = "primary" }: { data: number[], color?: string }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-12 w-24">
      {data.map((v, i) => (
        <div 
          key={i} 
          className={cn(
            "flex-1 rounded-sm transition-all duration-500",
            color === "primary" ? "bg-primary/40 hover:bg-primary" : 
            color === "blue" ? "bg-blue-200 hover:bg-blue-500" :
            color === "orange" ? "bg-orange-200 hover:bg-orange-500" : 
            color === "red" ? "bg-red-200 hover:bg-red-500" :
            color === "green" ? "bg-green-200 hover:bg-green-500" :
            "bg-gray-200"
          )}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color: string;
  chartData: number[];
}

interface AnalyticsClientProps {
  role: "owner" | "agent";
  title: string;
  subtitle: string;
  stats: Stat[];
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  loading?: boolean;
}

export default function AnalyticsClient({
  role,
  title,
  subtitle,
  stats,
  children,
  sidebar,
  loading
}: AnalyticsClientProps) {
  const [timeRange, setTimeRange] = React.useState("30D");

  if (loading) {
    return (
      <DashboardLayout userRole={role}>
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-gray-100 rounded-[2.5rem]" />
              <div className="h-96 bg-gray-100 rounded-[2.5rem]" />
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole={role}>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">{title}</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">{subtitle}</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              {['7D', '30D', '90D', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    timeRange === range ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-50"
                  )}
                >
                  {range}
                </button>
              ))}
           </div>
           <button className="h-14 w-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center shadow-xl shadow-gray-900/10 hover:scale-105 transition-all">
              <Download size={20} />
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'blue' ? "bg-blue-50 text-blue-500" :
                stat.color === 'orange' ? "bg-orange-50 text-orange-500" :
                stat.color === 'red' ? "bg-red-50 text-red-500" :
                "bg-green-50 text-green-500"
              )}>
                {stat.icon}
              </div>
              {stat.trend && (
                <div className={cn(
                  "flex items-center gap-1 font-black text-[10px] uppercase",
                  stat.trend.isUp ? "text-green-500" : "text-red-500"
                )}>
                  {stat.trend.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend.value}
                </div>
              )}
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
            <div className="mt-6 pt-6 border-t border-gray-50">
               <MiniBarChart data={stat.chartData} color={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {children}
        </div>
        <div className="space-y-10">
          {sidebar}
        </div>
      </div>
    </DashboardLayout>
  );
}
