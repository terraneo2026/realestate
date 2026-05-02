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
  Info
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import AnalyticsClient from "@/components/AnalyticsClient";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OwnerAnalyticsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalViews: 0,
    uniqueVisitors: 0,
    totalSaves: 0,
    totalInquiries: 0,
    conversionRate: 0,
    avgResponseTime: "1.8h"
  });
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAnalytics(user.uid);
      }
    });
    return () => unsubscribe();
  }, [locale, router]);

  const fetchAnalytics = async (ownerId: string) => {
    try {
      setLoading(true);
      const propsQ = query(collection(firestore, "properties"), where("ownerId", "==", ownerId));
      const propsSnap = await getDocs(propsQ);
      const props = propsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const bookingsQ = query(collection(firestore, "bookings"), where("ownerId", "==", ownerId));
      const bookingsSnap = await getDocs(bookingsQ);
      const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalViews = props.reduce((acc, p: any) => acc + (p.views || 0), 0);
      const totalLeads = bookings.length;
      const conversion = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

      setStatsData({
        totalViews,
        uniqueVisitors: Math.round(totalViews * 0.7),
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

  const stats = [
    {
      label: "Total Views",
      value: statsData.totalViews,
      icon: <Eye size={24} />,
      trend: { value: "12%", isUp: true },
      color: "blue",
      chartData: [30, 45, 60, 40, 55, 30, 80]
    },
    {
      label: "Unique Visitors",
      value: statsData.uniqueVisitors,
      icon: <Users size={24} />,
      trend: { value: "8%", isUp: true },
      color: "primary",
      chartData: [40, 60, 30, 80, 50, 90, 70]
    },
    {
      label: "Total Saves",
      value: statsData.totalSaves,
      icon: <Heart size={24} />,
      trend: { value: "15%", isUp: true },
      color: "orange",
      chartData: [50, 30, 40, 20, 45, 60, 35]
    },
    {
      label: "Inquiries",
      value: statsData.totalInquiries,
      icon: <MessageSquare size={24} />,
      trend: { value: "3%", isUp: false },
      color: "red",
      chartData: [20, 40, 30, 50, 40, 60, 80]
    }
  ];

  return (
    <AnalyticsClient
      role="owner"
      title="Property Insights"
      subtitle="Comprehensive performance analysis of your listings"
      stats={stats}
      loading={loading}
      sidebar={
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/50">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                 <Info size={20} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Optimization</h3>
           </div>
           <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                 <p className="text-xs font-black text-gray-900 mb-1 tracking-tight">Update 24+ images</p>
                 <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest leading-relaxed">Properties with more than 20 images get 4x more engagement.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                 <p className="text-xs font-black text-gray-900 mb-1 tracking-tight">Lower Response Time</p>
                 <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest leading-relaxed">Responding within 1 hour increases conversion by 60%.</p>
              </div>
           </div>
           <button className="w-full mt-8 py-4 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              Get Pro Advice
           </button>
        </div>
      }
    >
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
         <div className="p-10 border-b border-gray-50">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Popular Properties</h2>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Traffic</span>
               </div>
            </div>
         </div>
         <div className="p-4">
            {properties.slice(0, 5).map((prop) => (
              <div key={prop.id} className="flex items-center justify-between p-6 rounded-[2rem] hover:bg-gray-50 transition-all group">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                       <img src={prop.coverImage || prop.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                    </div>
                    <div>
                       <p className="font-black text-gray-900 tracking-tight">{prop.title}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{prop.location?.area}, {prop.location?.city}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-gray-900 tracking-tight">{prop.views || 0}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Views</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </AnalyticsClient>
  );
}
