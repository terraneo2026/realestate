'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, limit, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';
import { 
  Building2, 
  Users, 
  CreditCard, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  UserCheck,
  Briefcase,
  History,
  TrendingUp as TrendingUpIcon,
  MapPin,
  AlertTriangle,
  UserMinus,
  PieChart,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Mic,
  Plus,
  Wallet,
  Settings as SettingsIcon,
  Sparkles,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Specialized Components from Reference ---

const MetricCard = ({ title, value, trend, trendValue, icon: Icon, color = "primary" }: any) => (
  <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all relative overflow-hidden h-full">
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{title}</span>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight mt-1">{value}</h3>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-[10px] font-bold tracking-tight",
            trend === 'up' ? "text-green-500" : "text-red-500"
          )}>
            {trend === 'up' ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
            {trendValue}
            <span className="text-gray-300 ml-1">vs last month</span>
          </div>
        )}
      </div>
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
        color === 'primary' ? "bg-[#087c7c]/10 text-[#087c7c] group-hover:bg-[#087c7c] group-hover:text-white" :
        color === 'blue' ? "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white" :
        color === 'orange' ? "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white" :
        "bg-gray-50 text-gray-500 group-hover:bg-gray-900 group-hover:text-white"
      )}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ bookings, enquiries }: any) => (
  <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Recent Activity</h3>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Bookings</button>
        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Enquiries</button>
      </div>
    </div>
    
    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
      {bookings.length > 0 ? bookings.map((item: any, i: number) => (
        <div key={i} className="flex gap-4 items-start group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
            <Calendar size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-bold text-gray-900 truncate">{item.propertyTitle || 'Property Visit'}</h4>
              <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2">
                {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">By {item.userName || 'Customer'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                item.status === 'confirmed' ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
              )}>
                {item.status || 'pending'}
              </span>
            </div>
          </div>
        </div>
      )) : (
        <div className="flex flex-col items-center justify-center h-full text-center py-10">
          <Activity className="text-gray-200 mb-4" size={48} />
          <p className="text-sm font-bold text-gray-400">No recent activity found</p>
        </div>
      )}
    </div>
    
    <button className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10">
      View All Activity
    </button>
  </div>
);

const PropertyStats = ({ stats }: any) => (
  <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Inventory Status</h3>
      <PieChart size={18} className="text-gray-400" />
    </div>
    
    <div className="flex-1 flex flex-col justify-center gap-6">
      {[
        { label: 'Published', value: stats.approvedProperties, color: 'bg-green-500', total: stats.totalProperties },
        { label: 'Pending Review', value: stats.pendingProperties, color: 'bg-amber-500', total: stats.totalProperties },
        { label: 'Rejected', value: stats.rejectedProperties, color: 'bg-red-500', total: stats.totalProperties },
      ].map((item, i) => {
        const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
        return (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)} />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="text-sm font-black text-gray-900">{item.value}</span>
            </div>
            <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-1000", item.color)} 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
    
    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Listings</p>
        <p className="text-2xl font-black text-gray-900">{stats.totalProperties}</p>
      </div>
      <Link href={`/en/admin/properties`}>
        <button className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
          <ArrowRight size={20} />
        </button>
      </Link>
    </div>
  </div>
);

const PropertyCard = ({ property }: any) => (
  <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500 flex flex-col h-full">
    <div className="relative h-[180px] md:h-[240px] overflow-hidden shrink-0">
      <img 
        src={property?.image || '/placeholder.svg'} 
        alt="" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <button className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-[#087c7c] transition-all shadow-xl">
        <ArrowUpRight size={18} className="md:w-5 md:h-5" />
      </button>
    </div>
    <div className="p-4 md:p-6 flex flex-col flex-1">
      <h3 className="text-base md:text-lg font-bold text-gray-900 tracking-tight mb-3 md:mb-4 line-clamp-1">
        {property?.title || 'Relocate property'}
      </h3>
      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
        {[
          { label: property?.bedrooms ? `${property.bedrooms} rooms` : '6 rooms' },
          { label: property?.furnishing?.toLowerCase() || 'furnished' },
          { label: 'terrace' },
          { label: '+3', more: true },
        ].map((tag, i) => (
          <span key={i} className={cn(
            "px-2 md:px-3 py-1 rounded-full text-[10px] font-bold tracking-tight",
            tag.more ? "bg-gray-50 text-gray-400" : "bg-gray-50 text-gray-600"
          )}>
            {tag.label}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-3 md:pt-4 border-t border-gray-50 flex justify-between items-center">
        <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">₹{property?.price?.toLocaleString() || '25,000'}</span>
      </div>
    </div>
  </div>
);

// --- Main Page Client ---

export default function AdminDashboardClient() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [userProfile, setUserProfile] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    approvedProperties: 0,
    pendingProperties: 0,
    rejectedProperties: 0,
    totalUsers: 0,
    totalTenants: 0,
    totalOwners: 0,
    totalAgents: 0,
    totalAdmins: 0,
    visitBookings: 0,
    activeLeads: 0,
    revenueThisMonth: 0,
    systemHealth: 'Optimal',
    errorRate: '0.02%'
  });

  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);

  useEffect(() => {
    // Real-time listener for Dashboard Stats
    const unsubscribeProps = onSnapshot(collection(firestore, 'properties'), (snap) => {
      const props = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStats(prev => ({
        ...prev,
        totalProperties: props.length,
        approvedProperties: props.filter((p: any) => {
          const s = String(p.status || '').toLowerCase();
          return s === 'approved' || s === 'published' || s === 'active';
        }).length,
        pendingProperties: props.filter((p: any) => String(p.status || 'pending').toLowerCase() === 'pending').length,
        rejectedProperties: props.filter((p: any) => String(p.status || '').toLowerCase() === 'rejected').length,
      }));

      // Update recent properties (sorted by date)
      const sorted = [...props].sort((a: any, b: any) => {
        const getDate = (val: any) => {
          if (!val) return new Date(0);
          if (typeof val.toDate === 'function') return val.toDate();
          return new Date(val);
        };
        const dateA = getDate(a.createdAt || a.created_at);
        const dateB = getDate(b.createdAt || b.created_at);
        return dateB.getTime() - dateA.getTime();
      });
      setRecentProperties(sorted.slice(0, 4));
      setLoading(false);
    });

    const unsubscribeUsers = onSnapshot(collection(firestore, 'users'), (snap) => {
      const users = snap.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        totalUsers: users.length,
        totalTenants: users.filter((u: any) => u.role === 'tenant' || u.role === 'customer').length,
        totalOwners: users.filter((u: any) => u.role === 'owner').length,
        totalAgents: users.filter((u: any) => u.role === 'agent').length,
        totalAdmins: users.filter((u: any) => u.role === 'admin').length,
      }));
    });

    const unsubscribeBookings = onSnapshot(collection(firestore, 'bookings'), (snap) => {
      setStats(prev => ({ ...prev, visitBookings: snap.size }));
      setRecentBookings(snap.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeEnquiries = onSnapshot(collection(firestore, 'enquiries'), (snap) => {
      setStats(prev => ({ ...prev, activeLeads: snap.size }));
      setRecentLeads(snap.docs.slice(0, 5).map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribePayments = onSnapshot(collection(firestore, 'payments'), (snap) => {
      const payments = snap.docs.map(doc => doc.data());
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const successfulPayments = payments.filter((p: any) => 
        (p.status === 'success' || p.status === 'completed') && 
        ((p.createdAt?.toDate?.() || new Date(p.createdAt)) >= firstDayOfMonth)
      );
      
      const totalRevenue = successfulPayments.reduce((acc: number, p: any) => acc + (Number(p.amount) || 0), 0);
      
      setStats(prev => ({
        ...prev,
        revenueThisMonth: totalRevenue
      }));
    });

    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) setUserProfile(JSON.parse(storedUser));

    return () => {
      unsubscribeProps();
      unsubscribeUsers();
      unsubscribeBookings();
      unsubscribeEnquiries();
      unsubscribePayments();
    };
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-10 animate-pulse p-10">
          <div className="h-20 bg-white rounded-3xl w-1/3" />
          <div className="grid grid-cols-4 gap-8">
            <div className="h-32 bg-white rounded-3xl" />
            <div className="h-32 bg-white rounded-3xl" />
            <div className="h-32 bg-white rounded-3xl" />
            <div className="h-32 bg-white rounded-3xl" />
          </div>
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-8 h-[600px] bg-white rounded-[3rem]" />
            <div className="col-span-4 h-[600px] bg-white rounded-[3rem]" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Relocate Dashboard</h1>
          <p className="text-xs font-bold text-gray-400 tracking-tight uppercase">Platform overview and business metrics</p>
        </div>

        {/* Top Metric Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 md:gap-6">
          <MetricCard 
            title="Total Revenue" 
            value={`₹${stats.revenueThisMonth.toLocaleString()}`}
            trend="up"
            trendValue="+12%"
            icon={Wallet}
            color="primary"
          />
          <MetricCard 
            title="Active Listings" 
            value={stats.approvedProperties}
            trend="up"
            trendValue="+5%"
            icon={Building2}
            color="blue"
          />
          <MetricCard 
            title="Total Customers" 
            value={stats.totalUsers}
            trend="up"
            trendValue="+8%"
            icon={Users}
            color="orange"
          />
          <MetricCard 
            title="Pending Actions" 
            value={stats.pendingProperties + stats.activeLeads}
            trend="down"
            trendValue="-2%"
            icon={AlertTriangle}
            color="gray"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-6 md:gap-10">
          
          {/* Recent Listings (Col 8) */}
          <div className="xl:col-span-8 space-y-6 md:space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Recent Listings</h2>
              <Link href={`/en/admin/properties`} className="text-xs font-bold text-primary hover:underline">View All Properties</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-primary rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-primary/20">
               <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
               <div className="relative z-10 text-center md:text-left">
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">Need to add new inventory?</h3>
                  <p className="text-white/60 text-sm font-bold tracking-tight">Quickly publish new properties to the platform.</p>
               </div>
               <Link href={`/en/admin/properties`} className="relative z-10 shrink-0">
                  <button className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-3 group">
                     Publish Property
                     <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                  </button>
               </Link>
            </div>
          </div>

          {/* Activity & Stats (Col 4) */}
          <div className="xl:col-span-4 space-y-6 md:space-y-10">
            <RecentActivity bookings={recentBookings} enquiries={recentLeads} />
            <PropertyStats stats={stats} />
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
