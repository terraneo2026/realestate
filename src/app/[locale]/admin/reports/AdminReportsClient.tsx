'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  PieChart, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Activity, 
  Layers, 
  Map, 
  Loader2, 
  ShieldCheck,
  Zap,
  Clock,
  ArrowUpRight,
  Wallet,
  Building2,
  Users,
  MessageSquare
} from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminReportsClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalRevenue: 0,
    totalEnquiries: 0
  });

  useEffect(() => {
    setLoading(true);
    
    // Real-time listener for users
    const unsubUsers = onSnapshot(collection(firestore, 'users'), (snap) => {
      setStats(prev => ({ ...prev, totalUsers: snap.size }));
      setLoading(false);
    });

    // Real-time listener for properties
    const unsubProps = onSnapshot(collection(firestore, 'properties'), (snap) => {
      setStats(prev => ({ ...prev, totalProperties: snap.size }));
    });

    // Real-time listener for payments
    const unsubPayments = onSnapshot(collection(firestore, 'payments'), (snap) => {
      const successfulPayments = snap.docs
        .map(doc => doc.data())
        .filter((p: any) => p.status === 'completed' || p.status === 'success');
      
      setStats(prev => ({
        ...prev,
        totalRevenue: successfulPayments.reduce((acc, p: any) => acc + (Number(p.amount) || 0), 0)
      }));
    });

    // Real-time listener for enquiries
    const unsubEnquiries = onSnapshot(collection(firestore, 'enquiries'), (snap) => {
      setStats(prev => ({ ...prev, totalEnquiries: snap.size }));
    });

    return () => {
      unsubUsers();
      unsubProps();
      unsubPayments();
      unsubEnquiries();
    };
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Platform reporting</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <PieChart size={14} className="text-primary" /> Comprehensive analytics, system logs, and business intelligence
          </p>
        </div>
        <button className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-2 shadow-xl shadow-gray-900/10 hover:bg-black transition-all">
           <Download size={18} /> Download all reports
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
         {[
           { label: 'Total revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: Wallet, color: 'text-green-500', bg: 'bg-green-50' },
           { label: 'Properties', value: stats.totalProperties, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
           { label: 'User base', value: stats.totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
           { label: 'Active leads', value: stats.totalEnquiries, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' }
         ].map((item, i) => (
           <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm", item.bg, item.color)}>
                 <item.icon size={24} />
              </div>
              <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">{item.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{item.value}</h3>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* System Health */}
         <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center">
                    <Activity size={24} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System health</h2>
              </div>
              
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">Database latency</span>
                    <span className="text-xs font-bold text-green-500">24ms (Optimal)</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">Storage usage</span>
                    <span className="text-xs font-bold text-gray-900">42.8 GB / 100 GB</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">Daily API calls</span>
                    <span className="text-xs font-bold text-gray-900">1.2M Calls</span>
                 </div>
              </div>
            </div>
            
            <button className="mt-10 w-full py-4 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl font-bold text-xs tracking-tight transition-all">
               View server logs
            </button>
         </div>

         {/* Location Demand Map Simulation */}
         <div className="bg-gray-900 rounded-[3rem] p-10 shadow-2xl shadow-gray-400/20 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center">
                    <Map size={24} />
                 </div>
                 <h2 className="text-2xl font-bold tracking-tight">Location demand</h2>
              </div>
              <div className="space-y-6">
                 {['Chennai', 'Bangalore', 'Mumbai', 'Hyderabad'].map((city, i) => (
                   <div key={city} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold tracking-tight uppercase">
                         <span>{city}</span>
                         <span>{85 - (i * 15)}% Demand</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-primary" style={{ width: `${85 - (i * 15)}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
            </div>
            
            <button className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-2xl font-bold text-xs tracking-tight transition-all">
               Heatmap analysis
            </button>
         </div>
      </div>
    </AdminLayout>
  );
}
