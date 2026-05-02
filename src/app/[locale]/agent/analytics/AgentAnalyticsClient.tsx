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
  Info,
  Lock,
  Coins
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import AnalyticsClient from "@/components/AnalyticsClient";
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

export default function AgentAnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalLeads: 0,
    activeLocks: 0,
    creditsUsed: 0,
    conversionRate: 0,
    avgResponseTime: "1.5h",
    territoryReach: "85%"
  });
  const [timeRange, setTimeRange] = useState("30D");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAnalytics(user.uid);
      }
    });
    return () => unsubscribe();
  }, [locale, router]);

  const fetchAnalytics = async (agentId: string) => {
    try {
      setLoading(true);
      // Fetch stats logic (mocked for now as in original)
      setStatsData({
        totalLeads: 124,
        activeLocks: 8,
        creditsUsed: 450,
        conversionRate: 12.5,
        avgResponseTime: "1.2h",
        territoryReach: "92%"
      });
    } catch (error) {
      console.error("Error fetching agent analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Leads",
      value: statsData.totalLeads,
      icon: <MessageSquare size={24} />,
      trend: { value: "15.5%", isUp: true },
      color: "blue",
      chartData: [40, 60, 30, 80, 50, 90, 70]
    },
    {
      label: "Active Locks",
      value: statsData.activeLocks,
      icon: <Lock size={24} />,
      trend: { value: "2 Locks", isUp: true },
      color: "primary",
      chartData: [30, 45, 60, 40, 55, 30, 80]
    },
    {
      label: "Credits Used",
      value: statsData.creditsUsed,
      icon: <Coins size={24} />,
      trend: { value: "120 used", isUp: false },
      color: "orange",
      chartData: [50, 30, 40, 20, 45, 60, 35]
    },
    {
      label: "Conversion Rate",
      value: `${statsData.conversionRate}%`,
      icon: <TrendingUp size={24} />,
      trend: { value: "2.3%", isUp: true },
      color: "green",
      chartData: [20, 40, 30, 50, 40, 60, 80]
    }
  ];

  return (
    <AnalyticsClient
      role="agent"
      title="Agent Performance"
      subtitle="Real-time insights for your listings and leads"
      stats={stats}
      loading={loading}
      sidebar={
        <>
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
             <h3 className="text-xl font-black mb-6 tracking-tight">Agent Ranking</h3>
             <div className="flex items-center justify-center py-10 relative">
                <svg className="w-48 h-48 -rotate-90">
                   <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/10" />
                   <circle 
                     cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                     className="text-primary transition-all duration-1000"
                     strokeDasharray={552}
                     strokeDashoffset={552 - (552 * 0.92)}
                     strokeLinecap="round"
                   />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                   <span className="text-5xl font-black">#4</span>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In Territory</span>
                </div>
             </div>
             <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <span>Avg. Response Time</span>
                   <span className="text-white">{statsData.avgResponseTime}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <span>Territory Reach</span>
                   <span className="text-white">{statsData.territoryReach}</span>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/50">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                   <Info size={20} className="text-amber-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Pro Tips</h3>
             </div>
             <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs font-black text-gray-900 mb-1 tracking-tight">Lock Early</p>
                     <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest leading-relaxed">Properties locked within 24h of listing have 2x conversion.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                     <p className="text-xs font-black text-gray-900 mb-1 tracking-tight">Buy Credits</p>
                     <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest leading-relaxed">Bulk credit purchase saves 20% on listing costs.</p>
                </div>
             </div>
             <Link href={`/${locale}/agent/packages`} className="block w-full mt-8 py-4 bg-primary/10 text-primary rounded-2xl font-black text-[10px] text-center uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                Upgrade Package
             </Link>
          </div>
        </>
      }
    >
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
         <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <BarChart3 size={20} className="text-blue-500" />
               </div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight">Lead Activity Trend</h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" /> <span>Inquiries</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" /> <span>Visits</span>
               </div>
            </div>
         </div>
         
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

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
         <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Territory Dominance</h2>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Expand Territory</button>
         </div>
         <div className="space-y-6">
            {[
              { area: 'Kokapet', share: 45, leads: 56 },
              { area: 'Gachibowli', share: 25, leads: 32 },
              { area: 'Madhapur', share: 20, leads: 28 },
              { area: 'Financial District', share: 10, leads: 8 }
            ].map((item) => (
              <div key={item.area} className="space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-900">{item.area}</span>
                    <span className="text-gray-400">{item.leads} Leads ({item.share}%)</span>
                 </div>
                 <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${item.share}%` }} />
                 </div>
              </div>
            ))}
         </div>
      </div>
    </AnalyticsClient>
  );
}
