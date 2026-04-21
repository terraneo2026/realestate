"use client";

import React, { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare, 
  Calendar,
  Download,
  Filter,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
            color === "orange" ? "bg-orange-200 hover:bg-orange-500" : "bg-gray-200"
          )}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

export default function OwnerAnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    totalSaves: 0,
    totalInquiries: 0,
    conversionRate: 0,
    avgResponseTime: "2.4h"
  });
  const [properties, setProperties] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("30D");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAnalytics(user.uid);
      } else {
        router.push(`/${locale}/login`);
      }
    });
    return () => unsubscribe();
  }, [locale, router]);

  const fetchAnalytics = async (ownerId: string) => {
    try {
      setLoading(true);
      // 1. Fetch Properties to get views and aggregate
      const propsQ = query(
        collection(firestore, "properties"),
        where("ownerId", "==", ownerId)
      );
      const propsSnap = await getDocs(propsQ);
      const props = propsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // 2. Fetch Bookings for inquiries/leads
      const bookingsQ = query(
        collection(firestore, "bookings"),
        where("ownerId", "==", ownerId)
      );
      const bookingsSnap = await getDocs(bookingsQ);
      const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalViews = props.reduce((acc, p: any) => acc + (p.views || 0), 0);
      const totalLeads = bookings.length;
      const conversion = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

      setStats({
        totalViews,
        uniqueVisitors: Math.round(totalViews * 0.7), // Mocked for now
        totalSaves: props.reduce((acc, p: any) => acc + (p.favoritesCount || 0), 0),
        totalInquiries: totalLeads,
        conversionRate: parseFloat(conversion.toFixed(1)),
        avgResponseTime: "1.8h"
      });

      setProperties(props.sort((a: any, b: any) => (b.views || 0) - (a.views || 0)));

    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="owner">
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
    <DashboardLayout userRole="owner">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Performance Analytics</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Real-time insights for your property portfolio</p>
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

      {/* High Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <Eye size={24} />
               </div>
               <div className="flex items-center gap-1 text-green-500 font-black text-[10px] uppercase">
                  <ArrowUpRight size={14} /> 12.5%
               </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Views</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalViews.toLocaleString()}</h3>
            <div className="mt-6 pt-6 border-t border-gray-50">
               <MiniBarChart data={[40, 60, 30, 80, 50, 90, 70]} color="blue" />
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Users size={24} />
               </div>
               <div className="flex items-center gap-1 text-green-500 font-black text-[10px] uppercase">
                  <ArrowUpRight size={14} /> 8.2%
               </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Unique Visitors</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stats.uniqueVisitors.toLocaleString()}</h3>
            <div className="mt-6 pt-6 border-t border-gray-50">
               <MiniBarChart data={[30, 45, 60, 40, 55, 30, 80]} color="primary" />
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <Heart size={24} />
               </div>
               <div className="flex items-center gap-1 text-red-500 font-black text-[10px] uppercase">
                  <ArrowDownRight size={14} /> 2.1%
               </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Saves / Favorites</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalSaves.toLocaleString()}</h3>
            <div className="mt-6 pt-6 border-t border-gray-50">
               <MiniBarChart data={[50, 30, 40, 20, 45, 60, 35]} color="red" />
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                  <MessageSquare size={24} />
               </div>
               <div className="flex items-center gap-1 text-green-500 font-black text-[10px] uppercase">
                  <ArrowUpRight size={14} /> 15.3%
               </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stats.totalInquiries.toLocaleString()}</h3>
            <div className="mt-6 pt-6 border-t border-gray-50">
               <MiniBarChart data={[20, 40, 30, 50, 40, 60, 80]} color="orange" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Top Properties */}
         <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
               <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={20} className="text-primary" />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight">Top Performing Properties</h2>
                  </div>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Full Report</button>
               </div>
               
               <div className="space-y-6">
                  {properties.slice(0, 5).map((prop, i) => (
                    <div key={prop.id} className="group flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 transition-all">
                       <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                          <img src={prop.image || prop.coverImage} alt="" className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 w-5 h-5 bg-white/90 rounded-md flex items-center justify-center text-[10px] font-black">
                             {i + 1}
                          </div>
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-gray-900 truncate text-sm mb-1">{prop.title}</h4>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{prop.location?.area || prop.city}</p>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="text-right">
                             <p className="text-xs font-black text-gray-900">{(prop.views || 0).toLocaleString()}</p>
                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Views</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-primary">{(prop.leadsCount || 0).toLocaleString()}</p>
                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Leads</p>
                          </div>
                          <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary transition-all duration-1000" 
                               style={{ width: `${((prop.views || 0) / (properties[0]?.views || 1)) * 100}%` }}
                             />
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Engagement Trends */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
               <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                        <BarChart3 size={20} className="text-blue-500" />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight">Lead Conversion Trend</h2>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full" /> <span>Total Leads</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" /> <span>Conversions</span>
                     </div>
                  </div>
               </div>
               
               {/* Mock Trend Chart */}
               <div className="h-64 flex items-end gap-4 pb-4">
                  {[30, 45, 35, 60, 50, 80, 65, 90, 70, 85, 60, 75].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                       <div className="w-full relative flex items-end justify-center gap-1">
                          <div className="w-full max-w-[12px] bg-primary/20 group-hover:bg-primary transition-all rounded-t-lg" style={{ height: `${h}%` }} />
                          <div className="w-full max-w-[12px] bg-blue-500/20 group-hover:bg-blue-500 transition-all rounded-t-lg" style={{ height: `${h * 0.4}%` }} />
                       </div>
                       {i % 2 === 0 && <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">W{i+1}</span>}
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Stats */}
         <div className="space-y-10">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
               <h3 className="text-xl font-black mb-6 tracking-tight">Efficiency Score</h3>
               <div className="flex items-center justify-center py-10 relative">
                  <svg className="w-48 h-48 -rotate-90">
                     <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                     <circle 
                       cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                       className="text-primary transition-all duration-1000"
                       strokeDasharray={552}
                       strokeDashoffset={552 - (552 * 0.85)}
                       strokeLinecap="round"
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <span className="text-5xl font-black">85</span>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Premium</span>
                  </div>
               </div>
               <div className="space-y-4 mt-6">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                     <span>Conversion Rate</span>
                     <span className="text-white">{stats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                     <span>Avg. Response Time</span>
                     <span className="text-white">{stats.avgResponseTime}</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/50">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                     <Info size={20} className="text-amber-500" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Optimization Tips</h3>
               </div>
               <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs font-black text-gray-900 mb-1 tracking-tight">Update 24+ images</p>
                     <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Properties with more than 20 images get 4x more engagement.</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs font-black text-gray-900 mb-1 tracking-tight">Lower Response Time</p>
                     <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Responding within 1 hour increases conversion by 60%.</p>
                  </div>
               </div>
               <button className="w-full mt-8 py-4 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                  Get Pro Advice
               </button>
            </div>
         </div>
      </div>
    </DashboardLayout>
  );
}
