'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, orderBy, limit, onSnapshot, getCountFromServer, addDoc, deleteDoc } from 'firebase/firestore';
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
  MoreVertical,
  Plus,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getPaginatedData } from '@/lib/firestore-pagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packageSchema, PackageFormData } from '@/lib/validations/package';
import type { QueryConstraint } from 'firebase/firestore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminSubscriptionsClient() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const pageSize = 10;

  const [stats, setStats] = useState({
    activePlans: 0,
    featuredListings: 0,
    revenue: 0,
    expiringSoon: 0
  });

  const [packages, setPackages] = useState<any[]>([]);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isPackageSubmitting },
    setValue
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      price: 0,
      duration: 30,
      listingLimit: 10,
      features: []
    }
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'packages'), (snap) => {
      setPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePackageSubmit = async (data: PackageFormData) => {
    try {
      if (editingPackage) {
        await updateDoc(doc(firestore, 'packages', editingPackage.id), {
          ...data,
          updatedAt: new Date()
        });
        toast.success("Package updated successfully");
      } else {
        await addDoc(collection(firestore, 'packages'), {
          ...data,
          createdAt: new Date()
        });
        toast.success("Package created successfully");
      }
      setIsPackageModalOpen(false);
      setEditingPackage(null);
      reset();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await deleteDoc(doc(firestore, 'packages', id));
      toast.success("Package deleted");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const fetchSubscriptions = async (isNext = true) => {
    setLoading(true);
    try {
      const filters: QueryConstraint[] = [where('plan', '!=', 'free')];
      
      const result = await getPaginatedData<any>({
        collectionName: 'users',
        pageSize,
        lastVisible: isNext ? lastVisible : (history[page - 2] || null),
        filters
      });

      setSubscriptions(result.data);
      setTotal(result.total);
      setLastVisible(result.lastVisible);
      
      if (isNext) {
        setHistory(prev => {
          const newHistory = [...prev];
          newHistory[page - 1] = result.lastVisible;
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const collRef = collection(firestore, 'users');
      const subQuery = query(collRef, where('plan', '!=', 'free'));
      
      const [
        activeSnap,
        featuredSnap,
      ] = await Promise.all([
        getCountFromServer(subQuery),
        getCountFromServer(query(collRef, where('plan', '==', 'featured')))
      ]);

      // Revenue and expiry still need full fetch or summary doc
      // Senior Architect: Use Cloud Functions to update a stats doc
      const allSubsDocs = await getDocs(subQuery);
      const allSubs = allSubsDocs.docs.map(d => d.data());
      
      const revenue = allSubs.reduce((acc, u) => acc + (u.planPrice || 0), 0);
      const expiringSoon = allSubs.filter(u => {
        if (!u.planExpiry) return false;
        const expiry = u.planExpiry.toDate ? u.planExpiry.toDate() : new Date(u.planExpiry);
        const diff = expiry.getTime() - new Date().getTime();
        return diff > 0 && diff < (7 * 24 * 60 * 60 * 1000); // 7 days
      }).length;

      setStats({
        activePlans: activeSnap.data().count,
        featuredListings: featuredSnap.data().count,
        revenue,
        expiringSoon
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions(true);
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-4 md:px-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight truncate">Subscriptions</h1>
          <p className="text-gray-400 mt-1 md:mt-2 font-semibold tracking-tight text-[10px] md:text-xs flex items-center gap-2">
             <Crown size={14} className="text-primary shrink-0" /> <span className="truncate">Track active plans and revenue</span>
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
           <button 
             onClick={() => {
               setEditingPackage(null);
               reset({
                 name: '',
                 price: 0,
                 duration: 30,
                 listingLimit: 10,
                 features: []
               });
               setIsPackageModalOpen(true);
             }}
             className="w-full md:w-auto h-11 md:h-14 px-6 md:px-8 bg-gray-900 text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 hover:bg-black transition-all uppercase"
           >
              <Plus size={18} /> Create Package
           </button>
           <button 
             onClick={() => exportToCSV(subscriptions, 'subscriptions')}
             className="w-full md:w-auto h-11 md:h-14 px-6 md:px-8 bg-white border border-gray-100 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50 uppercase"
           >
              <Download size={18} /> Export plans
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12 px-4 md:px-0">
         {[
           { label: 'Active plans', value: stats.activePlans, icon: Zap, color: 'text-primary', bg: 'bg-primary/10' },
           { label: 'Featured users', value: stats.featuredListings, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Plan revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
           { label: 'Expiring (7d)', value: stats.expiringSoon, icon: Clock, color: 'text-red-500', bg: 'bg-red-50' }
         ].map((item, i) => (
           <div key={i} className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 group hover:-translate-y-1 transition-all">
              <div className={cn("w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center mb-3 md:mb-6 shadow-sm", item.bg, item.color)}>
                 <item.icon size={24} />
              </div>
              <p className="text-[8px] md:text-xs font-bold text-gray-400 tracking-tight mb-1 uppercase">{item.label}</p>
              <h3 className={cn("text-lg md:text-3xl font-bold tracking-tight", item.label === 'Expiring (7d)' && stats.expiringSoon > 0 ? "text-red-500" : "text-gray-900")}>{item.value}</h3>
           </div>
         ))}
      </div>

      {/* Packages Management Section */}
      <div className="mb-12 px-4 md:px-0">
         <div className="flex items-center gap-3 mb-6 md:mb-10">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 text-white rounded-lg md:rounded-2xl flex items-center justify-center">
               <ShieldCheck size={24} />
            </div>
            <div>
               <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Agent Packages</h2>
               <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Configure tier-based listing limits</p>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/30 flex flex-col justify-between group hover:border-primary/20 transition-all">
                 <div>
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          {pkg.price > 1000 ? <Crown size={24} /> : <Zap size={24} />}
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingPackage(pkg);
                              reset(pkg);
                              setIsPackageModalOpen(true);
                            }}
                            className="p-2 bg-gray-50 text-gray-400 hover:text-primary rounded-lg transition-all"
                          >
                             <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                          >
                             <Trash2 size={14} />
                          </button>
                       </div>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-1">{pkg.name}</h3>
                    <p className="text-2xl font-black text-primary mb-6">₹{pkg.price}<span className="text-[10px] text-gray-400 ml-1">/ {pkg.duration}d</span></p>
                    
                    <div className="space-y-2 mb-8">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-gray-700">
                          <CheckCircle2 size={12} className="text-green-500" /> {pkg.listingLimit} Listings
                       </div>
                       {pkg.features?.map((f: string, i: number) => (
                         <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                            <CheckCircle2 size={12} className="text-green-500" /> {f}
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Subscription Table */}
      <div className="px-4 md:px-0 pb-12">
        <div className="bg-white rounded-2xl md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
             <div className="relative group max-w-xl w-full">
                <Search size={18} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <h2 className="text-lg font-black text-gray-900 tracking-tight ml-12">Active Subscriptions</h2>
             </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
             <table className="w-full text-left min-w-[800px] md:min-w-[1000px]">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] md:text-xs font-bold tracking-tight border-b border-gray-50">
                   <tr>
                      <th className="px-6 md:px-10 py-6 md:py-8">User & contact</th>
                      <th className="px-4 py-6 md:py-8 text-center">Active plan</th>
                      <th className="px-4 py-6 md:py-8 text-center">Price paid</th>
                      <th className="px-4 py-6 md:py-8">Expiry date</th>
                      <th className="px-4 py-6 md:py-8">Status</th>
                      <th className="px-6 md:px-10 py-6 md:py-8 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {subscriptions.length > 0 ? subscriptions.map((sub) => (
                     <tr key={sub.id} className="group hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 md:px-10 py-6 md:py-8">
                           <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-50 rounded-lg md:rounded-2xl flex items-center justify-center text-primary font-bold text-sm md:text-lg">
                                 {sub.fullName?.charAt(0) || 'U'}
                              </div>
                              <div className="min-w-0">
                                 <h4 className="font-bold text-gray-900 text-xs md:text-sm tracking-tight truncate max-w-[120px] md:max-w-none">{sub.fullName}</h4>
                                 <p className="text-[9px] md:text-xs font-bold text-gray-400 tracking-tight truncate max-w-[150px] md:max-w-none">{sub.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-4 py-6 md:py-8 text-center">
                           <div className={cn(
                             "inline-flex items-center gap-1.5 px-2.5 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold tracking-tight border shadow-sm uppercase",
                             sub.plan === 'premium' ? "bg-primary text-white border-primary" : 
                             sub.plan === 'featured' ? "bg-amber-500 text-white border-amber-500" :
                             "bg-gray-900 text-white border-gray-900"
                           )}>
                              {sub.plan === 'premium' && <Zap size={10} />}
                              {sub.plan === 'featured' && <Star size={10} />}
                              {sub.plan}
                           </div>
                        </td>
                        <td className="px-4 py-6 md:py-8 text-center">
                           <span className="text-xs md:text-sm font-bold text-gray-900">₹{(sub.planPrice || 0).toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-6 md:py-8">
                           <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold text-gray-700 uppercase">
                              <Calendar size={14} className="text-gray-300" />
                              {sub.planExpiry?.toDate ? new Date(sub.planExpiry.toDate()).toLocaleDateString() : 'Lifetime'}
                           </div>
                        </td>
                        <td className="px-4 py-6 md:py-8">
                           <div className="flex items-center gap-1.5 md:gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              <span className="text-[10px] md:text-xs font-bold text-green-600 tracking-tight uppercase">Active</span>
                           </div>
                        </td>
                        <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                           <div className="flex items-center justify-end gap-1.5 md:gap-2">
                              <button className="p-2 md:p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-lg md:rounded-xl shadow-sm transition-all">
                                 <CreditCard size={18} />
                              </button>
                              <button className="p-2 md:p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-lg md:rounded-xl shadow-sm transition-all">
                                 <MoreVertical size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   )) : (
                     <tr>
                        <td colSpan={6} className="py-24 md:py-32 text-center text-gray-400 font-bold text-xs tracking-tight uppercase">No active paid subscriptions</td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
               Showing {subscriptions.length} of {total} total subscriptions
             </p>
             <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      fetchSubscriptions(false);
                    }
                  }}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                >
                  Previous
                </button>
                <button 
                  onClick={() => {
                    if (subscriptions.length === pageSize) {
                      setPage(page + 1);
                      fetchSubscriptions(true);
                    }
                  }}
                  disabled={subscriptions.length < pageSize}
                  className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                >
                  Next
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Package Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 md:p-10 border-b border-gray-50 flex justify-between items-center">
                 <div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">{editingPackage ? 'Edit Package' : 'Create Package'}</h2>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Configure agent tier details</p>
                 </div>
                 <button onClick={() => setIsPackageModalOpen(false)} className="p-2 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl hover:bg-gray-100 transition-all text-gray-400"><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit(handlePackageSubmit)} className="p-6 md:p-10 space-y-6 md:space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Package Name</label>
                       <input {...register('name')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" placeholder="e.g. Gold Tier" />
                       {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                       <input type="number" {...register('price', { valueAsNumber: true })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                       {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                       <input type="number" {...register('duration', { valueAsNumber: true })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                       {errors.duration && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.duration.message}</p>}
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Limit</label>
                       <input type="number" {...register('listingLimit', { valueAsNumber: true })} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                       {errors.listingLimit && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.listingLimit.message}</p>}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Features (Comma separated)</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm min-h-[100px]"
                      placeholder="e.g. Featured Listings, Analytics, Support"
                      onChange={(e) => {
                        const features = e.target.value.split(',').map(f => f.trim()).filter(f => f !== '');
                        setValue('features', features);
                      }}
                      defaultValue={editingPackage?.features?.join(', ')}
                    />
                 </div>

                 <button 
                   type="submit" 
                   disabled={isPackageSubmitting}
                   className="w-full py-4 bg-gray-900 text-white rounded-xl md:rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2"
                 >
                    {isPackageSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingPackage ? 'Update Package' : 'Create Package')}
                 </button>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}
