'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { 
  Zap, 
  Crown, 
  Star, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  CreditCard, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Building2,
  Mail,
  MoreVertical
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminSubscriptionsClient() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    activePlans: 0,
    featuredListings: 0,
    revenue: 0,
    expiringSoon: 0
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      // Fetch users with active plans
      const q = query(collection(firestore, 'users'), where('plan', '!=', 'free'));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      
      setSubscriptions(fetched);
      
      setStats({
        activePlans: fetched.length,
        featuredListings: fetched.filter(u => u.plan === 'featured').length,
        revenue: fetched.reduce((acc, u) => acc + (u.planPrice || 0), 0),
        expiringSoon: fetched.filter(u => {
          if (!u.planExpiry) return false;
          const expiry = u.planExpiry.toDate ? u.planExpiry.toDate() : new Date(u.planExpiry);
          const diff = expiry.getTime() - new Date().getTime();
          return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000); // 7 days
        }).length
      });

    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(s => 
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Subscriptions control</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <Crown size={14} className="text-primary" /> Track active plans, feature upgrades, and recurring revenue
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => exportToCSV(subscriptions, 'relocate_subscriptions')}
             className="h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export active plans
           </button>
        </div>
      </div>

      {/* Subscription Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
               <Zap size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-1 uppercase">Active plans</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats.activePlans}</h3>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
               <Star size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-1 uppercase">Featured users</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats.featuredListings}</h3>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
               <TrendingUp size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-1 uppercase">Plan revenue</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">₹{stats.revenue.toLocaleString()}</h3>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
               <Clock size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-1 uppercase">Expiring (7d)</p>
            <h3 className="text-3xl font-bold text-red-500 tracking-tight">{stats.expiringSoon}</h3>
         </div>
      </div>

      {/* Subscription Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
           <div className="relative group max-w-xl w-full">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search by user or plan type..." 
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">User & contact</th>
                    <th className="px-6 py-8 text-center">Active plan</th>
                    <th className="px-6 py-8 text-center">Price paid</th>
                    <th className="px-6 py-8">Expiry date</th>
                    <th className="px-6 py-8">Status</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredSubscriptions.length > 0 ? filteredSubscriptions.map((sub) => (
                   <tr key={sub.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-bold text-lg">
                               {sub.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-900 text-sm tracking-tight">{sub.fullName}</h4>
                               <p className="text-xs font-bold text-gray-400 tracking-tight">{sub.email}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         <div className={cn(
                           "inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border shadow-sm uppercase",
                           sub.plan === 'premium' ? "bg-primary text-white border-primary" : 
                           sub.plan === 'featured' ? "bg-amber-500 text-white border-amber-500" :
                           "bg-gray-900 text-white border-gray-900"
                         )}>
                            {sub.plan === 'premium' && <Zap size={10} />}
                            {sub.plan === 'featured' && <Star size={10} />}
                            {sub.plan}
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         <span className="text-sm font-bold text-gray-900">₹{(sub.planPrice || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase">
                            <Calendar size={14} className="text-gray-300" />
                            {sub.planExpiry?.toDate ? new Date(sub.planExpiry.toDate()).toLocaleDateString() : 'Lifetime'}
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span className="text-xs font-bold text-green-600 tracking-tight uppercase">Active</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-xl shadow-sm transition-all">
                               <CreditCard size={18} />
                            </button>
                            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-xl shadow-sm transition-all">
                               <MoreVertical size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={6} className="py-32 text-center text-gray-400 font-bold text-xs tracking-tight uppercase">No active paid subscriptions</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </AdminLayout>
  );
}
