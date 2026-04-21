'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, limit, orderBy, Timestamp } from 'firebase/firestore';
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
import AdminLayout from '@/components/Admin/AdminLayout';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Specialized Components from Reference ---

const MetricCard = ({ title, value, trend, trendValue, icon: Icon, color }: any) => (
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-gray-400 tracking-tight mb-1 uppercase">{title}</span>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
      </div>
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className={cn(
        "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold tracking-tight",
        trend === 'up' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      )}>
        {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {trendValue}
      </div>
      <span className="text-xs font-bold text-gray-300 tracking-tight">from last month</span>
    </div>
  </div>
);

const RevenueBarChart = ({ stats }: { stats: any }) => (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-start mb-8">
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1">Total Revenue</h3>
        <span className="text-xs font-bold text-gray-400 tracking-tight">Available revenue in your wallet</span>
      </div>
      <button className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-all">
        <ArrowUpRight size={18} />
      </button>
    </div>

    <div className="flex items-end gap-3 mb-10">
      <h2 className="text-4xl font-bold text-gray-900 tracking-tight">₹{stats.revenueThisMonth.toLocaleString()}</h2>
      <div className="flex items-center gap-1 text-[#087c7c] mb-1">
        <TrendingUpIcon size={14} />
        <span className="text-sm font-bold tracking-tight">2.03%</span>
      </div>
    </div>

    <div className="flex-1 flex items-end justify-between gap-4 h-[180px]">
      {[
        { m: 'Jan', h: 40, active: false },
        { m: 'Feb', h: 70, active: false },
        { m: 'Mar', h: 55, active: false },
        { m: 'Apr', h: 90, active: true, val: '₹27,632' },
        { m: 'May', h: 45, active: false },
        { m: 'Jun', h: 65, active: false },
      ].map((bar, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
          <div className="w-full relative flex flex-col items-center">
            {bar.active && (
              <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl mb-2 after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-gray-900">
                {bar.val}
              </div>
            )}
            <div 
              className={cn(
                "w-full rounded-2xl transition-all duration-500 cursor-pointer",
                bar.active ? "bg-[#087c7c]" : "bg-[#087c7c]/10 group-hover:bg-[#087c7c]/30"
              )} 
              style={{ height: `${bar.h}%` }}
            >
              {!bar.active && (
                <div className="w-full h-full opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, white 5px, white 6px)' }} />
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-gray-400 tracking-tight">{bar.m}</span>
        </div>
      ))}
    </div>
  </div>
);

const ListingsLineChart = () => (
  <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Total Listings</h3>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#087c7c] rounded-full" />
            <span className="text-xs font-bold text-gray-400 tracking-tight">Property Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-900 rounded-full" />
            <span className="text-xs font-bold text-gray-400 tracking-tight">Property Sale</span>
          </div>
        </div>
        <select className="bg-gray-50 border-none rounded-xl text-xs font-bold tracking-tight px-4 py-2 focus:ring-0">
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>
    </div>

    <div className="flex-1 relative mt-4">
      {/* Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between">
        {[400, 300, 200, 100, 0].map((val) => (
          <div key={val} className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-300 w-6">{val}</span>
            <div className="flex-1 h-px bg-gray-50" />
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <svg className="absolute inset-0 w-full h-full pt-2 pb-1" viewBox="0 0 700 200" preserveAspectRatio="none">
        {/* Sale Line (Dashed) */}
        <path 
          d="M0,120 L100,160 L200,100 L300,140 L400,150 L500,80 L600,140 L700,130" 
          fill="none" 
          stroke="#111827" 
          strokeWidth="2" 
          strokeDasharray="6,4" 
        />
        {/* Rent Line (Solid) */}
        <path 
          d="M0,150 L100,100 L200,130 L300,160 L400,120 L500,150 L600,110 L700,140" 
          fill="none" 
          stroke="#087c7c" 
          strokeWidth="2" 
        />
        {/* Area Fill for Rent */}
        <path 
          d="M0,150 L100,100 L200,130 L300,160 L400,120 L500,150 L600,110 L700,140 L700,200 L0,200 Z" 
          fill="#087c7c" 
          fillOpacity="0.05"
        />
        {/* Tooltip Point */}
        <circle cx="400" cy="120" r="6" fill="white" stroke="#111827" strokeWidth="2" />
        <rect x="380" y="80" width="40" height="25" rx="12" fill="#111827" />
        <text x="400" y="96" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">12%</text>
      </svg>

      {/* X Axis Labels */}
      <div className="absolute bottom-[-24px] left-10 right-0 flex justify-between">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <span key={day} className="text-xs font-bold text-gray-400 tracking-tight">{day}</span>
        ))}
      </div>
    </div>
  </div>
);

const PropertyCard = ({ property }: any) => (
  <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
    <div className="relative h-[240px] overflow-hidden">
      <img 
        src={property?.image || '/placeholder.svg'} 
        alt="" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white hover:text-[#087c7c] transition-all shadow-xl">
        <ArrowUpRight size={20} />
      </button>
    </div>
    <div className="p-6">
      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-4">
        {property?.title || 'Relocate property'}
      </h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: property?.bedrooms ? `${property.bedrooms} rooms` : '6 rooms' },
          { label: property?.furnishing?.toLowerCase() || 'furnished' },
          { label: 'terrace' },
          { label: '+3', more: true },
        ].map((tag, i) => (
          <span key={i} className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold tracking-tight",
            tag.more ? "bg-gray-50 text-gray-400" : "bg-gray-50 text-gray-600"
          )}>
            {tag.label}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">₹{property?.price?.toLocaleString() || '25,000'}</span>
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
    totalStaff: 0,
    visitBookings: 0,
    activeLeads: 0,
    revenueThisMonth: 0,
    failedPayments: 0,
    openEnquiries: 0,
  });

  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [leaseAlerts, setLeaseAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    // Get user profile from localStorage or state if needed
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) setUserProfile(JSON.parse(storedUser));
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const [propsSnap, usersSnap, bookingsSnap, paymentsSnap, enquiriesSnap] = await Promise.all([
        getDocs(collection(firestore, 'properties')),
        getDocs(collection(firestore, 'users')),
        getDocs(collection(firestore, 'bookings')),
        getDocs(collection(firestore, 'payments')),
        getDocs(collection(firestore, 'enquiries'))
      ]);

      const props = propsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const payments = paymentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const enquiries = enquiriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const bookings = bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const newStats = {
        totalProperties: props.length,
        approvedProperties: props.filter((p: any) => p.status === 'active' || p.status === 'approved').length,
        pendingProperties: props.filter((p: any) => p.status === 'pending').length,
        rejectedProperties: props.filter((p: any) => p.status === 'rejected').length,
        totalUsers: users.length,
        totalTenants: users.filter((u: any) => u.role === 'tenant' || u.role === 'customer').length,
        totalOwners: users.filter((u: any) => u.role === 'owner').length,
        totalAgents: users.filter((u: any) => u.role === 'agent').length,
        totalStaff: users.filter((u: any) => u.role === 'staff' || u.role === 'admin').length,
        visitBookings: bookings.length,
        activeLeads: enquiries.length,
        revenueThisMonth: payments
          .filter((p: any) => {
            const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
            return (p.status === 'completed' || p.status === 'success') && date >= firstDayOfMonth;
          })
          .reduce((acc, p: any) => acc + (Number(p.amount) || 0), 0),
        failedPayments: payments.filter((p: any) => p.status === 'failed' || p.status === 'rejected').length,
        openEnquiries: enquiries.filter((e: any) => e.status === 'open' || e.status === 'pending').length,
      };

      setStats(newStats);

      // Fetch recent properties for highlight
      const recentPropsQ = query(collection(firestore, 'properties'), orderBy('createdAt', 'desc'), limit(3));
      const recentPropsSnap = await getDocs(recentPropsQ);
      const fetchedRecentProps = recentPropsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentProperties(fetchedRecentProps);

      // Real Lease Alerts: Properties with leaseEnd within 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const alerts = props
        .filter((p: any) => {
          if (!p.leaseEnd) return false;
          const leaseEndDate = p.leaseEnd.toDate ? p.leaseEnd.toDate() : new Date(p.leaseEnd);
          return leaseEndDate > now && leaseEndDate <= thirtyDaysFromNow;
        })
        .map((p: any) => {
          const leaseEndDate = p.leaseEnd.toDate ? p.leaseEnd.toDate() : new Date(p.leaseEnd);
          const diffTime = Math.abs(leaseEndDate.getTime() - now.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return {
            unit: p.title?.split(' ')[0] || 'Unit',
            days: diffDays,
            tenant: p.tenantName || 'Active Tenant'
          };
        })
        .slice(0, 3);
      
      setLeaseAlerts(alerts);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-10 animate-pulse p-10">
          <div className="h-20 bg-white rounded-3xl w-1/3" />
          <div className="grid grid-cols-3 gap-10">
            <div className="h-40 bg-white rounded-3xl" />
            <div className="h-40 bg-white rounded-3xl" />
            <div className="h-40 bg-white rounded-3xl" />
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="h-[400px] bg-white rounded-[3rem]" />
            <div className="h-[400px] bg-white rounded-[3rem]" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Welcome back, {userProfile?.fullName?.split(' ')[0] || 'Nafis'}! 👋
          </h1>
          <p className="text-sm font-bold text-gray-400 tracking-tight">
            Keep learning and earn 50 XP today. You're on a 5-day streak!
          </p>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard 
            title="Total Revenue" 
            value={`₹${stats.revenueThisMonth.toLocaleString()}`}
            trend="up"
            trendValue="+12%"
            icon={Wallet}
            color="bg-green-50 text-[#087c7c]"
          />
          <MetricCard 
            title="Total Properties" 
            value={stats.totalProperties.toLocaleString()}
            trend="down"
            trendValue="-2.5%"
            icon={Building2}
            color="bg-blue-50 text-blue-600"
          />
          <MetricCard 
            title="Active Listing" 
            value={stats.approvedProperties.toLocaleString()}
            trend="up"
            trendValue="+4.5%"
            icon={CheckCircle2}
            color="bg-orange-50 text-orange-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueBarChart stats={stats} />
          <ListingsLineChart />
        </div>

        {/* Properties Row */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Featured properties</h3>
            <Link href={`/${locale}/admin/properties`} className="text-sm font-bold text-[#087c7c] tracking-tight hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProperties.map((prop, i) => (
              <PropertyCard key={prop.id || i} property={prop} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
