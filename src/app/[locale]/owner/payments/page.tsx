"use client";

import React, { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Filter, 
  Search, 
  Loader2, 
  Building2, 
  User, 
  CheckCircle2, 
  Clock, 
  XCircle,
  FileText,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OwnerPaymentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPayments(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPayments = async (ownerId: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, "payments"),
        where("ownerId", "==", ownerId)
      );
      const snap = await getDocs(q);
      const fetchedPayments = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sort by createdAt desc
      fetchedPayments.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = (p.propertyTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.userName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalEarnings = payments
    .filter(p => p.status === 'completed' || p.status === 'success')
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  if (loading) {
    return (
      <DashboardLayout userRole="owner">
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl" />)}
           </div>
           <div className="h-96 bg-gray-100 rounded-[2.5rem]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="owner">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Payment History</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Track your earnings and payouts</p>
        </div>
        <button className="h-14 px-8 rounded-2xl bg-gray-900 text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-gray-900/10 hover:scale-105 transition-all active:scale-95">
           <Download size={18} /> Export Statement
        </button>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
         <div className="bg-primary rounded-[2rem] p-8 text-white shadow-2xl shadow-primary/20">
            <div className="flex items-center gap-3 mb-4 opacity-80">
               <Wallet size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">Total Earnings</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight">₹{totalEarnings.toLocaleString()}</h2>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1.5 rounded-lg">
               <ArrowUpRight size={14} className="text-green-300" /> +12% from last month
            </div>
         </div>
         
         <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
               <Clock size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">Pending Payouts</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">₹{(totalEarnings * 0.15).toLocaleString()}</h2>
            <p className="text-[10px] font-black text-gray-400 mt-6 uppercase tracking-widest">Next payout: April 25, 2026</p>
         </div>

         <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
               <CheckCircle2 size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">Completed Payouts</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight text-gray-900">₹{(totalEarnings * 0.85).toLocaleString()}</h2>
            <p className="text-[10px] font-black text-green-500 mt-6 uppercase tracking-widest flex items-center gap-1">
               <CheckCircle2 size={12} /> All accounts clear
            </p>
         </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 mb-10 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search size={20} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by property or tenant..." 
            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-primary outline-none transition-all font-bold text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative group flex-1 lg:flex-none">
             <select 
               className="w-full lg:w-auto px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-primary outline-none transition-all font-black text-[10px] uppercase tracking-widest text-gray-500 appearance-none pr-14"
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
               <option value="all">All Status</option>
               <option value="completed">Completed</option>
               <option value="pending">Pending</option>
               <option value="failed">Failed</option>
             </select>
             <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" size={20} />
           </div>
           <button className="p-5 bg-gray-900 text-white rounded-3xl shadow-xl shadow-gray-900/20 hover:bg-black transition-all">
             <Filter size={20} />
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-10 py-8">Transaction & Property</th>
                  <th className="px-8 py-8">Tenant</th>
                  <th className="px-8 py-8">Amount</th>
                  <th className="px-8 py-8">Date</th>
                  <th className="px-8 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                           payment.status === 'completed' || payment.status === 'success' ? "bg-green-50 text-green-500" : "bg-amber-50 text-amber-500"
                         )}>
                            {payment.status === 'completed' || payment.status === 'success' ? <ArrowDownLeft size={20} /> : <Clock size={20} />}
                         </div>
                         <div>
                            <h4 className="font-black text-gray-900 truncate max-w-[200px]">{payment.propertyTitle}</h4>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">ID: {payment.transactionId || payment.id.slice(0, 10)}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                             <User size={14} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{payment.userName || 'Verified Tenant'}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <span className="text-lg font-black text-gray-900">₹{Number(payment.amount).toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-8">
                       <p className="text-xs font-bold text-gray-500">
                          {new Date(payment.createdAt?.toDate ? payment.createdAt.toDate() : payment.createdAt).toLocaleDateString()}
                       </p>
                    </td>
                    <td className="px-8 py-8">
                       <div className={cn(
                         "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                         payment.status === 'completed' || payment.status === 'success' ? "bg-green-50 border-green-100 text-green-600" :
                         payment.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                         "bg-red-50 border-red-100 text-red-600"
                       )}>
                          {payment.status === 'completed' || payment.status === 'success' ? <CheckCircle2 size={12} /> : 
                           payment.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
                          {payment.status}
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-gray-100">
                          <FileText size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-32 text-center px-10">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
              <Wallet size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight uppercase">No transactions yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
              When tenants make payments for your properties, you will see the full history and payout status here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
