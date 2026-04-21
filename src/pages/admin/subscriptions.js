import React, { useEffect, useState } from 'react';
import { firestore } from '../../lib/firebase';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  Crown, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  Zap, 
  Star, 
  Gem,
  RefreshCcw,
  MoreVertical,
  Mail,
  ShieldAlert
} from 'lucide-react';
import AdminLayout from '@/admin/components/AdminLayout';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const PLAN_THEMES = {
  free: { icon: Star, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100' },
  pro: { icon: Zap, color: 'text-[#087c7c]', bg: 'bg-[#087c7c]/5', border: 'border-[#087c7c]/10' },
  enterprise: { icon: Gem, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' }
};

export default function SubscriptionsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const q = collection(firestore, 'users');
      const snap = await getDocs(q);
      const fetched = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.role === 'owner' || u.role === 'agent' || u.plan);
      
      setUsers(fetched);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriber data");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || (u.plan || 'free') === filterPlan;
    return matchesSearch && matchesPlan;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="animate-spin text-gray-900" size={48} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight text-[#087c7c]">Subscription hub</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <Crown size={14} className="text-[#087c7c]" /> Manage enterprise licenses, recurring plans, and account tiers
          </p>
        </div>
        <div className="flex gap-4">
           <button onClick={fetchSubscriptions} className="h-14 w-14 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] rounded-2xl flex items-center justify-center shadow-xl shadow-gray-200/50 transition-all">
              <RefreshCcw size={20} />
           </button>
           <button className="h-14 px-8 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-3 shadow-xl shadow-[#087c7c]/20 hover:bg-[#066666] transition-all">
              <Star size={18} /> Manage plan config
           </button>
        </div>
      </div>

      {/* Plan Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
         {[
           { label: 'Pro members', count: users.filter(u => u.plan === 'pro').length, theme: PLAN_THEMES.pro },
           { label: 'Enterprise', count: users.filter(u => u.plan === 'enterprise').length, theme: PLAN_THEMES.enterprise },
           { label: 'Active trials', count: users.filter(u => !u.plan || u.plan === 'free').length, theme: PLAN_THEMES.free }
         ].map((stat, i) => (
           <div key={i} className={cn("bg-white p-10 rounded-[3rem] border shadow-2xl shadow-gray-200/50 relative overflow-hidden group transition-all hover:-translate-y-1", stat.theme.border)}>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm", stat.theme.bg, stat.theme.color)}>
                 <stat.theme.icon size={28} />
              </div>
              <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">{stat.label}</p>
              <h3 className="text-4xl font-bold text-gray-900 tracking-tight">{stat.count} <span className="text-xs text-gray-300 font-bold ml-1">accounts</span></h3>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-8 bg-white">
           <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-96 group">
                 <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search Subscriber..." 
                   className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none transition-all font-bold text-xs"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="relative group">
                 <select 
                   className="h-14 px-8 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none transition-all font-bold text-xs tracking-tight text-gray-500 appearance-none cursor-pointer pr-12"
                   value={filterPlan}
                   onChange={(e) => setFilterPlan(e.target.value)}
                 >
                   <option value="all">All plans</option>
                   <option value="pro">Pro</option>
                   <option value="enterprise">Enterprise</option>
                   <option value="free">Free</option>
                 </select>
                 <Filter size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
              </div>
           </div>
           <div className="flex gap-2">
              <button className="h-14 px-8 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl font-bold text-xs tracking-tight flex items-center gap-3 transition-all">
                 <Filter size={18} /> Export list
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">Subscriber</th>
                    <th className="px-6 py-8">Account tier</th>
                    <th className="px-6 py-8">Billing cycle</th>
                    <th className="px-6 py-8">Status</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredUsers.length > 0 ? filteredUsers.map((user) => {
                   const plan = user.plan || 'free';
                   const theme = PLAN_THEMES[plan] || PLAN_THEMES.free;
                   return (
                     <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-[#087c7c] text-white flex items-center justify-center font-bold shadow-xl shadow-[#087c7c]/10">
                                 {user.fullName?.[0] || 'U'}
                              </div>
                              <div>
                                 <h4 className="font-bold text-gray-900 text-sm tracking-tight">{user.fullName || 'New user'}</h4>
                                 <p className="text-xs font-bold text-gray-400 tracking-tight mt-1">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-8">
                           <div className={cn(
                             "inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm",
                             theme.bg, theme.border
                           )}>
                              <theme.icon size={14} className={theme.color} />
                              <span className={cn("text-xs font-bold tracking-tight", theme.color)}>{plan}</span>
                           </div>
                        </td>
                        <td className="px-6 py-8">
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-900 tracking-tight">Monthly</span>
                              <span className="text-xs font-bold text-gray-400 tracking-tight mt-1">Next: May 12, 2024</span>
                           </div>
                        </td>
                        <td className="px-6 py-8">
                           <div className="flex items-center gap-1.5 px-4 py-1.5 bg-green-50 text-green-600 rounded-xl text-xs font-bold tracking-tight border border-green-100 w-fit">
                              <CheckCircle2 size={10} /> Active
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] rounded-xl shadow-sm transition-all">
                                 <Mail size={18} />
                              </button>
                              <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-all">
                                 <ShieldAlert size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   );
                 }) : (
                   <tr>
                      <td colSpan={5} className="py-32 text-center text-gray-400 font-bold tracking-tight">No subscribers found</td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </AdminLayout>
  );
}
