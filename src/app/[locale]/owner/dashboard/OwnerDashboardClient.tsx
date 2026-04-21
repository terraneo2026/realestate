"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Plus, 
  Home, 
  Eye, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  Users,
  Wallet
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OwnerDashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingApproval: 0,
    rejectedProperties: 0,
    totalViews: 0,
    totalLeads: 0,
    bookingRequests: 0,
    monthlyEngagement: 0,
    profileCompletion: 0
  });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

  useEffect(() => {
    const fetchOwnerData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // 1. Fetch User Profile
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Calculate profile completion (simplified logic)
          let completion = 0;
          if (data.fullName) completion += 20;
          if (data.email) completion += 20;
          if (data.mobile) completion += 20;
          if (data.kyc_status === 'verified') completion += 40;
          
          setStats(prev => ({ ...prev, profileCompletion: completion }));
        }

        // 2. Fetch Properties
        const propsQ = query(
          collection(firestore, "properties"),
          where("ownerId", "==", user.uid)
        );
        const propsSnap = await getDocs(propsQ);
        const props = propsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const active = props.filter((p: any) => p.status === 'published' || p.status === 'active').length;
        const pending = props.filter((p: any) => p.status === 'pending').length;
        const rejected = props.filter((p: any) => p.status === 'rejected').length;
        
        setRecentProperties(props.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5));
        setPendingApprovals(props.filter((p: any) => p.status === 'pending').slice(0, 3));

        // 3. Fetch Bookings (Leads)
        const bookingsQ = query(
          collection(firestore, "bookings"),
          where("ownerId", "==", user.uid)
        );
        const bookingsSnap = await getDocs(bookingsQ);
        const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setRecentLeads(bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5));

        // 4. Update Stats
        setStats(prev => ({
          ...prev,
          totalProperties: props.length,
          activeProperties: active,
          pendingApproval: pending,
          rejectedProperties: rejected,
          totalViews: props.reduce((acc, p: any) => acc + (p.views || 0), 0),
          totalLeads: bookings.length,
          bookingRequests: bookings.filter((b: any) => b.status === 'pending').length,
          monthlyEngagement: 85 // Mock for now
        }));

      } catch (error) {
        console.error("Error fetching owner dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

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
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Owner Console</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Real-time property management • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className={cn(
             "px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border",
             userData?.kyc_status === 'verified' ? "bg-green-50 border-green-100 text-green-600" : "bg-orange-50 border-orange-100 text-orange-600"
           )}>
             KYC: {userData?.kyc_status || 'Pending'}
           </div>
           <Link 
             href={`/${locale}/owner/add-property`}
             className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
           >
             <Plus size={18} strokeWidth={3} />
             Add Property
           </Link>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          label="Total Listings"
          value={stats.totalProperties.toString()}
          icon={<Home size={20} className="text-primary" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
        <StatsCard
          label="Active"
          value={stats.activeProperties.toString()}
          icon={<CheckCircle2 size={20} className="text-green-500" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
        <StatsCard
          label="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={<Eye size={20} className="text-blue-500" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
        <StatsCard
          label="Leads"
          value={stats.totalLeads.toString()}
          icon={<Users size={20} className="text-orange-500" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Recent Leads / Inquiries */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Users size={20} className="text-orange-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Leads</h2>
              </div>
              <Link href={`/${locale}/owner/messages`} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All Leads</Link>
            </div>
            
            <div className="space-y-4">
              {recentLeads.length > 0 ? recentLeads.map((lead) => (
                <div key={lead.id} className="group flex items-center gap-6 p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 truncate text-lg">{lead.userName}</h4>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{lead.propertyTitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[9px] font-black text-gray-400 uppercase">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    <div className={cn(
                      "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                      lead.status === 'pending' ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-green-50 border-green-100 text-green-600"
                    )}>
                      {lead.status}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <Users size={32} />
                   </div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No leads yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Pending Approvals Section */}
          {pendingApprovals.length > 0 && (
            <div className="bg-amber-50 rounded-[2.5rem] border border-amber-100 p-10">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <Clock size={20} className="text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-black text-amber-900 tracking-tight">Pending Approval</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pendingApprovals.map((prop) => (
                    <div key={prop.id} className="bg-white p-4 rounded-3xl shadow-sm border border-amber-100">
                       <div className="aspect-video rounded-2xl overflow-hidden mb-4">
                          <img src={prop.image} alt="" className="object-cover w-full h-full" />
                       </div>
                       <h4 className="font-black text-gray-900 truncate text-sm mb-2">{prop.title}</h4>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Submitted: {new Date(prop.created_at).toLocaleDateString()}</p>
                       <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 text-[8px] font-black uppercase tracking-widest w-fit">
                          Under Review
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* Engagement Placeholder Chart (SVG) */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Engagement Trend</h2>
                </div>
                <div className="flex gap-2">
                   {['7D', '1M', '3M'].map(p => (
                     <button key={p} className={cn(
                       "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                       p === '1M' ? "bg-primary text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                     )}>{p}</button>
                   ))}
                </div>
             </div>
             <div className="h-64 w-full flex items-end gap-3 pb-4">
                {[40, 65, 30, 85, 45, 90, 55, 70, 40, 60, 35, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-50 rounded-t-xl relative group">
                     <div 
                       className="absolute bottom-0 left-0 right-0 bg-primary/20 group-hover:bg-primary transition-all rounded-t-xl" 
                       style={{ height: `${h}%` }}
                     />
                     {i % 2 === 0 && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-300 uppercase tracking-widest">W{i+1}</span>}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-10">
          
          {/* Quick Actions Card */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { label: 'Manage Properties', href: `/${locale}/owner/properties`, icon: <Home size={18} />, color: 'primary' },
                { label: 'View Analytics', href: `/${locale}/owner/analytics`, icon: <BarChart3 size={18} />, color: 'blue' },
                { label: 'My Bookings', href: `/${locale}/owner/bookings`, icon: <Calendar size={18} />, color: 'orange' },
                { label: 'Payment History', href: `/${locale}/owner/payments`, icon: <Wallet size={18} />, color: 'green' },
                { label: 'Account Profile', href: `/${locale}/owner/profile`, icon: <Users size={18} />, color: 'gray' },
              ].map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/30 border border-gray-50 hover:border-primary/10 transition-all group mb-2">
                    <div className="flex items-center gap-4">
                       <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                         action.color === 'primary' ? "bg-primary/10 text-primary" :
                         action.color === 'blue' ? "bg-blue-100 text-blue-600" :
                         action.color === 'green' ? "bg-green-100 text-green-600" :
                         action.color === 'orange' ? "bg-orange-100 text-orange-600" :
                         "bg-gray-200 text-gray-600"
                       )}>
                         {action.icon}
                       </div>
                       <span className="text-xs font-black text-gray-700 uppercase tracking-widest">{action.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
            <h3 className="text-xl font-black mb-4 tracking-tight">Complete Profile</h3>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed font-bold tracking-tight uppercase">Verified owners receive 3x more inquiries and priority listing status.</p>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                     <span>Completion</span>
                     <span>{stats.profileCompletion}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${stats.profileCompletion}%` }} />
                  </div>
               </div>
               <Link href={`/${locale}/owner/profile`} className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                 Finish Setup <ArrowUpRight size={16} />
               </Link>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
