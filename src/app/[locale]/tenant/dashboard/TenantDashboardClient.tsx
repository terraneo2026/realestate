"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Heart, Search, MessageSquare, Calendar, 
  ArrowRight, Clock, CheckCircle2, AlertCircle, 
  Wallet, User as UserIcon, Settings, ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TenantDashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    savedCount: 0,
    searchCount: 0,
    inquiryCount: 0,
    bookingCount: 0,
    paymentTotal: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentSaved, setRecentSaved] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
          
          // 2. Stats from User Doc
          const favorites = data.favorites || [];
          const searches = data.recent_searches || [];
          
          // 3. Fetch Bookings
          const bookingsQ = query(
            collection(firestore, "bookings"),
            where("userId", "==", user.uid)
          );
          const bookingsSnap = await getDocs(bookingsQ);
          const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Client-side sort by createdAt desc
          bookings.sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
          });
          setRecentBookings(bookings.slice(0, 5));

          // 4. Fetch Messages/Inquiries count
          const messagesQ = query(
            collection(firestore, "messages"),
            where("receiverId", "==", user.uid),
            where("status", "==", "unread")
          );
          const messagesSnap = await getDocs(messagesQ);

          // 5. Fetch Recent Saved Properties Details
          let savedProps: any[] = [];
          if (favorites.length > 0) {
            const propsQ = query(
              collection(firestore, "properties"),
              where("__name__", "in", favorites.slice(0, 3))
            );
            const propsSnap = await getDocs(propsQ);
            savedProps = propsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRecentSaved(savedProps);
          }

          setStats({
            savedCount: favorites.length,
            searchCount: searches.length,
            inquiryCount: messagesSnap.size,
            bookingCount: bookingsSnap.size,
            paymentTotal: data.total_payments || 0
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
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
    <DashboardLayout userRole="tenant">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome, {userData?.fullName?.split(' ')[0] || 'User'}!</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Relocate Tenant Dashboard • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
           <div className={cn(
             "px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border",
             userData?.kyc_status === 'verified' ? "bg-green-50 border-green-100 text-green-600" : "bg-orange-50 border-orange-100 text-orange-600"
           )}>
             KYC: {userData?.kyc_status || 'Pending'}
           </div>
           <Link href={`/${locale}/tenant/profile`} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all">
             <Settings size={20} className="text-gray-400" />
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatsCard
          label="Saved Items"
          value={stats.savedCount.toString()}
          icon={<Heart size={20} className="text-red-500" fill="currentColor" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
        <StatsCard
          label="Recent Searches"
          value={stats.searchCount.toString()}
          icon={<Search size={20} className="text-blue-500" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
        <StatsCard
          label="Active Bookings"
          value={stats.bookingCount.toString()}
          icon={<Calendar size={20} className="text-orange-500" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
        <StatsCard
          label="Total Payments"
          value={`₹${stats.paymentTotal.toLocaleString()}`}
          icon={<Wallet size={20} className="text-green-500" />}
          className="rounded-3xl border-none shadow-xl shadow-gray-200/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Recent Bookings */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <Clock size={20} className="text-orange-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Visits</h2>
              </div>
              <Link href={`/${locale}/tenant/bookings`} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recentBookings.length > 0 ? recentBookings.map((booking) => (
                <div key={booking.id} className="group flex items-center gap-6 p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-gray-200/30 transition-all">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                    <img src={booking.propertyImage || '/placeholder.svg'} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-gray-900 truncate text-lg group-hover:text-primary transition-colors">{booking.propertyTitle}</h4>
                    <div className="flex items-center gap-4 mt-2">
                       <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                         <Calendar size={12} /> {new Date(booking.bookingDate).toLocaleDateString()}
                       </p>
                       <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                         <Clock size={12} /> {booking.bookingSlot}
                       </p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                    booking.status === 'approved' ? "bg-green-50 border-green-100 text-green-600" : 
                    booking.status === 'pending' ? "bg-blue-50 border-blue-100 text-blue-600" :
                    "bg-gray-100 border-gray-200 text-gray-400"
                  )}>
                    {booking.status}
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <Calendar size={32} />
                   </div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No upcoming visits</p>
                   <Link href={`/${locale}/properties`} className="mt-4 text-xs font-black text-primary hover:underline uppercase tracking-widest">Book your first tour</Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Saved Properties */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                  <Heart size={20} className="text-red-500" fill="currentColor" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Favorites</h2>
              </div>
              <Link href={`/${locale}/tenant/saved`} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentSaved.length > 0 ? recentSaved.map((prop) => (
                <Link key={prop.id} href={`/${locale}/property/${prop.slug}`} className="group block space-y-4">
                   <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
                      <img src={prop.image || (prop.images && prop.images[0]) || '/placeholder.svg'} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-6">
                         <p className="text-xl font-black text-white tracking-tight">₹{Number(prop.price).toLocaleString()}</p>
                      </div>
                   </div>
                   <h4 className="font-black text-gray-900 truncate group-hover:text-primary transition-colors px-2">{prop.title}</h4>
                </Link>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                   <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <Heart size={32} />
                   </div>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Your favorites list is empty</p>
                </div>
              )}
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
                { label: 'Browse Properties', href: `/${locale}/properties`, icon: <Search size={18} />, color: 'primary' },
                { label: 'Saved Searches', href: `/${locale}/tenant/searches`, icon: <Clock size={18} />, color: 'blue' },
                { label: 'Messages', href: `/${locale}/tenant/messages`, icon: <MessageSquare size={18} />, color: 'green', badge: stats.inquiryCount },
                { label: 'Payments', href: `/${locale}/tenant/payments`, icon: <Wallet size={18} />, color: 'orange' },
                { label: 'My Profile', href: `/${locale}/tenant/profile`, icon: <UserIcon size={18} />, color: 'gray' },
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
                    <div className="flex items-center gap-3">
                       {typeof action.badge === 'number' && action.badge > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">{action.badge}</span>}
                       <ChevronRight size={14} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
            <h3 className="text-xl font-black mb-4 tracking-tight">Complete Your Profile</h3>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed font-bold tracking-tight uppercase">Get verified to unlock priority bookings and direct owner contact.</p>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                     <span>Profile Completion</span>
                     <span>65%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[65%]" />
                  </div>
               </div>
               <Link href={`/${locale}/tenant/profile`} className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                 Verify KYC <ArrowRight size={16} />
               </Link>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
