import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db as firestore } from '@/admin/lib/firebase';
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
import { useRouter } from 'next/router';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Specialized Components from Reference ---

const MetricCard = ({ title, value, trend, trendValue, icon: Icon, color = "primary" }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all relative overflow-hidden">
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
        color === 'primary' ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" :
        color === 'blue' ? "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white" :
        color === 'orange' ? "bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white" :
        "bg-gray-50 text-gray-500 group-hover:bg-gray-900 group-hover:text-white"
      )}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const RecentActivity = ({ bookings, enquiries }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Recent Activity</h3>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">Bookings</button>
        <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Enquiries</button>
      </div>
    </div>
    
    <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
      {bookings.length > 0 ? bookings.map((item, i) => (
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

const PropertyStats = ({ stats }) => (
  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
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
      <Link href="/admin/properties">
        <button className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all">
          <ArrowRight size={20} />
        </button>
      </Link>
    </div>
  </div>
);

const PropertyCard = ({ property }) => (
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

// --- Main Page Component ---

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
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

  const [recentProperties, setRecentProperties] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  useEffect(() => {
    fetchDashboardData();
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
        approvedProperties: props.filter((p) => p.status === 'active' || p.status === 'approved' || p.status === 'published').length,
        pendingProperties: props.filter((p) => p.status === 'pending').length,
        rejectedProperties: props.filter((p) => p.status === 'rejected').length,
        totalUsers: users.length,
        totalTenants: users.filter((u) => u.role === 'tenant' || u.role === 'customer').length,
        totalOwners: users.filter((u) => u.role === 'owner').length,
        totalAgents: users.filter((u) => u.role === 'agent').length,
        totalStaff: users.filter((u) => u.role === 'staff' || u.role === 'admin').length,
        visitBookings: bookings.length,
        activeLeads: enquiries.length,
        revenueThisMonth: payments
          .filter((p) => {
            const date = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
            return (p.status === 'completed' || p.status === 'success') && date >= firstDayOfMonth;
          })
          .reduce((acc, p) => acc + (Number(p.amount) || 0), 0),
        failedPayments: payments.filter((p) => p.status === 'failed' || p.status === 'rejected').length,
        openEnquiries: enquiries.filter((e) => e.status === 'open' || e.status === 'pending').length,
      };

      setStats(newStats);

      // Fetch recent properties
      const sortedProps = [...props].sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      setRecentProperties(sortedProps.slice(0, 4));
      setRecentBookings(bookings.slice(0, 5));
      setRecentEnquiries(enquiries.slice(0, 5));

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
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Recent Listings (Col 8) */}
           <div className="lg:col-span-8 space-y-8">
             <div className="flex justify-between items-center">
               <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Recent Listings</h2>
               <Link href="/admin/properties">
                 <span className="text-xs font-bold text-primary hover:underline cursor-pointer">View All Properties</span>
               </Link>
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
                <Link href="/admin/properties">
                   <button className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center gap-3 group">
                      Publish Property
                      <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                   </button>
                </Link>
             </div>
           </div>

           {/* Activity & Stats (Col 4) */}
           <div className="lg:col-span-4 space-y-10">
             <RecentActivity bookings={recentBookings} enquiries={recentEnquiries} />
             <PropertyStats stats={stats} />
           </div>

         </div>
      </div>
    </AdminLayout>
  );
}
