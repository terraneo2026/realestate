'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, orderBy, limit, doc, updateDoc, onSnapshot, QueryConstraint, getCountFromServer } from 'firebase/firestore';
import { getPaginatedData } from '@/lib/firestore-pagination';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  FileText, 
  Wallet, 
  TrendingUp, 
  Activity,
  AlertCircle,
  Loader2,
  ChevronDown,
  RefreshCcw,
  ShieldCheck,
  Calendar,
  IndianRupee,
  User,
  Building2,
  Smartphone,
  Globe,
  Terminal,
  X,
  RotateCcw,
  Receipt,
  History,
  MapPin,
  Mail
} from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPaymentsClient() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterUserType, setFilterUserType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const pageSize = 10;

  const [stats, setStats] = useState({
    totalRevenue: 0,
    successCount: 0,
    failedCount: 0,
    refundAmount: 0,
    avgTransaction: 0
  });

  const fetchPayments = async (isNext = true) => {
    setLoading(true);
    try {
      const filters: QueryConstraint[] = [];
      if (filterStatus !== 'all') filters.push(where('status', '==', filterStatus));
      if (filterMethod !== 'all') filters.push(where('paymentMethod', '==', filterMethod));
      if (filterUserType !== 'all') filters.push(where('userType', '==', filterUserType));
      
      // Date and Amount range filters in Firestore have limitations when combined with other filters
      // For now, we apply basic status/method filters at server-side.
      
      const result = await getPaginatedData<any>({
        collectionName: 'payments',
        pageSize,
        lastVisible: isNext ? lastVisible : (history[page - 2] || null),
        filters
      });

      setPayments(result.data);
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
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const collRef = collection(firestore, 'payments');
      
      // We need a few counts and sums. For sums, we'd need to fetch or use a summary doc.
      // For now, we'll use getCountFromServer for counts.
      const [
        totalSnap,
        successSnap,
        failedSnap,
        refundedSnap
      ] = await Promise.all([
        getCountFromServer(collRef),
        getCountFromServer(query(collRef, where('status', 'in', ['completed', 'success']))),
        getCountFromServer(query(collRef, where('status', 'in', ['failed', 'error']))),
        getCountFromServer(query(collRef, where('status', '==', 'refunded')))
      ]);

      // Revenue sum still requires a fetch or summary doc. 
      // Senior Architect: In production, use a 'system_stats' doc updated by triggers.
      const successfulDocs = await getDocs(query(collRef, where('status', 'in', ['completed', 'success'])));
      const totalRev = successfulDocs.docs.reduce((acc, d) => acc + (Number(d.data().amount) || 0), 0);
      
      setStats(prev => ({
        ...prev,
        totalRevenue: totalRev,
        successCount: successSnap.data().count,
        failedCount: failedSnap.data().count,
        avgTransaction: successSnap.data().count > 0 ? totalRev / successSnap.data().count : 0
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchPayments(true);
    fetchStats();
  }, [filterStatus, filterMethod, filterUserType]);

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm("Initiate refund for this transaction?")) return;
    try {
      await updateDoc(doc(firestore, 'payments', paymentId), {
        status: 'refunded',
        refundedAt: new Date(),
        updatedAt: new Date()
      });
      toast.success("Refund initiated successfully");
    } catch (error) {
      toast.error("Refund failed");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 p-4 md:p-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Payments & revenue</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <ShieldCheck size={14} className="text-primary" /> Enterprise audit, reconciliation & revenue tracking hub
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <button 
             onClick={() => exportToCSV(payments, 'relocate_transactions')}
             className="flex-1 md:flex-none h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export CSV
           </button>
           <button className="h-14 w-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:rotate-180 transition-all duration-500">
              <RefreshCcw size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
         <div className="bg-gray-900 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group min-w-0">
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:scale-110 transition-transform">
               <TrendingUp size={80} />
            </div>
            <div className="relative z-10">
               <p className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest mb-1 md:mb-2 uppercase">Total Revenue</p>
               <h2 className="text-2xl md:text-4xl font-black tracking-tight truncate">₹{stats.totalRevenue.toLocaleString()}</h2>
               <div className="mt-4 md:mt-6 flex items-center gap-2 text-[9px] md:text-[10px] font-black text-green-400 tracking-widest uppercase">
                  <ArrowUpRight size={12} /> +12.5% vs Last Month
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 min-w-0">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest mb-1 md:mb-2 uppercase">Success Rate</p>
            <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight truncate">{stats.successCount} <span className="text-[10px] md:text-sm text-gray-400 font-black">TXNs</span></h3>
            <div className="mt-4 md:mt-6 h-1 md:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-green-500" style={{ width: `${(stats.successCount / (payments.length || 1)) * 100}%` }} />
            </div>
         </div>

         <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 min-w-0">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest mb-1 md:mb-2 uppercase">Failed / Aborted</p>
            <h3 className="text-xl md:text-3xl font-black text-red-500 tracking-tight truncate">{stats.failedCount} <span className="text-[10px] md:text-sm text-gray-300 font-black">Errors</span></h3>
            <p className="text-[9px] md:text-[10px] font-black text-gray-300 mt-4 md:mt-6 tracking-widest uppercase truncate">Connectivity index</p>
         </div>

         <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 min-w-0">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest mb-1 md:mb-2 uppercase">Total Refunded</p>
            <h3 className="text-xl md:text-3xl font-black text-amber-500 tracking-tight truncate">₹{stats.refundAmount.toLocaleString()}</h3>
            <p className="text-[9px] md:text-[10px] font-black text-gray-300 mt-4 md:mt-6 tracking-widest uppercase truncate">Reconciliation reserve</p>
         </div>
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12 mx-4 md:mx-0">
        <div className="p-6 md:p-8 border-b border-gray-50 bg-white space-y-6 md:space-y-8">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8">
              <div className="relative w-full lg:w-96 group">
                 <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search transactions..." 
                   className="w-full pl-16 pr-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-[10px] md:text-xs"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 w-full lg:w-auto">
                 <div className="relative group flex-1 md:flex-none">
                    <select 
                      className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] text-gray-700 outline-none appearance-none cursor-pointer focus:border-primary focus:bg-white transition-all uppercase tracking-widest"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Status: All</option>
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                 </div>
                 <div className="relative group flex-1 md:flex-none">
                    <select 
                      className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] text-gray-700 outline-none appearance-none cursor-pointer focus:border-primary focus:bg-white transition-all uppercase tracking-widest"
                      value={filterMethod}
                      onChange={(e) => setFilterMethod(e.target.value)}
                    >
                      <option value="all">Method: All</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                 </div>
                 <div className="relative group flex-1 md:flex-none">
                    <select 
                      className="w-full md:w-auto h-12 md:h-14 px-6 md:px-8 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] text-gray-700 outline-none appearance-none cursor-pointer focus:border-primary focus:bg-white transition-all uppercase tracking-widest"
                      value={filterUserType}
                      onChange={(e) => setFilterUserType(e.target.value)}
                    >
                      <option value="all">User: All</option>
                      <option value="tenant">Tenant</option>
                      <option value="owner">Owner</option>
                      <option value="agent">Agent</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-gray-50">
              <div className="space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Date Range</label>
                 <div className="flex items-center gap-2">
                    <input type="date" className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black border-2 border-gray-50 focus:border-primary outline-none transition-all uppercase tracking-widest" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                    <span className="text-gray-300">-</span>
                    <input type="date" className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black border-2 border-gray-50 focus:border-primary outline-none transition-all uppercase tracking-widest" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] md:text-[10px] font-black text-gray-400 ml-2 uppercase tracking-widest">Amount (₹)</label>
                 <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black border-2 border-gray-50 focus:border-primary outline-none transition-all uppercase tracking-widest" value={amountRange.min} onChange={(e) => setAmountRange({...amountRange, min: e.target.value})} />
                    <span className="text-gray-300">-</span>
                    <input type="number" placeholder="Max" className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-50 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black border-2 border-gray-50 focus:border-primary outline-none transition-all uppercase tracking-widest" value={amountRange.max} onChange={(e) => setAmountRange({...amountRange, max: e.target.value})} />
                 </div>
              </div>
              <div className="sm:col-span-2 flex items-end">
                 <button onClick={() => { setDateRange({start:'', end:''}); setAmountRange({min:'', max:''}); setSearchTerm(''); setFilterStatus('all'); setFilterMethod('all'); setFilterUserType('all'); }} className="h-10 md:h-12 px-6 md:px-8 bg-gray-100 text-gray-500 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] hover:bg-gray-200 transition-all uppercase tracking-widest">Reset filters</button>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
           <table className="w-full text-left min-w-[1200px]">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">Transaction & gateway IDs</th>
                    <th className="px-6 py-8">User & context</th>
                    <th className="px-6 py-8 text-center">Amount (Incl. Tax)</th>
                    <th className="px-6 py-8">Method & gateway</th>
                    <th className="px-6 py-8">Status</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {payments.length > 0 ? payments.map((pay) => (
                   <tr key={pay.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0",
                              pay.status === 'success' || pay.status === 'completed' ? "bg-green-50 text-green-500" :
                              pay.status === 'failed' || pay.status === 'error' ? "bg-red-50 text-red-500" :
                              "bg-amber-50 text-amber-500"
                            )}>
                               {pay.status === 'success' || pay.status === 'completed' ? <ArrowDownLeft size={20} /> : <Clock size={20} />}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-gray-900 text-sm truncate max-w-[200px] tracking-tight">#{pay.transactionId || pay.id.slice(0, 10)}</h4>
                               <p className="text-[9px] font-black text-gray-300 uppercase tracking-tight mt-1">GW: {pay.gatewayTransactionId || 'Pending'}</p>
                               <div className="flex items-center gap-2 mt-2">
                                  <Calendar size={10} className="text-gray-300 shrink-0" />
                                  <span className="text-[10px] font-bold text-gray-300 tracking-tight uppercase">
                                    {pay.createdAt?.toDate ? new Date(pay.createdAt.toDate()).toLocaleString() : 'Recent'}
                                  </span>
                                </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                               <User size={12} className="text-primary/50 shrink-0" />
                               <span className="text-[10px] font-bold text-gray-900 uppercase truncate">{pay.userName || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Building2 size={12} className="text-gray-300 shrink-0" />
                               <span className="text-[10px] font-bold text-gray-400 tracking-tight truncate max-w-[150px] uppercase">{pay.propertyTitle || 'Platform services'}</span>
                            </div>
                            <span className="text-[9px] font-black text-primary tracking-widest px-2 py-0.5 bg-primary/5 rounded border border-primary/10 w-fit uppercase">{pay.planType || 'Standard'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         <div className="flex flex-col items-center">
                            <span className="text-base font-black text-gray-900">₹{(pay.finalAmount || pay.amount || 0).toLocaleString()}</span>
                            {pay.taxAmount > 0 && <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Incl. ₹{pay.taxAmount} GST</span>}
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                               <CreditCard size={12} className="text-gray-400 shrink-0" />
                               <span className="text-[10px] font-bold text-gray-700 uppercase">{pay.paymentMethod || 'Unknown'}</span>
                            </div>
                            <span className="text-[9px] font-black text-gray-400 tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit uppercase">{pay.gateway || 'Razorpay'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm",
                           pay.status === 'success' || pay.status === 'completed' ? "bg-green-50 border-green-100 text-green-600" :
                           pay.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                           pay.status === 'refunded' ? "bg-blue-50 border-blue-100 text-blue-600" :
                           "bg-red-50 border-red-100 text-red-600"
                         )}>
                            {pay.status}
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedPayment(pay)}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg shadow-sm transition-all"
                              title="Audit Trail"
                            >
                               <Eye size={16} />
                            </button>
                            {(pay.status === 'success' || pay.status === 'completed') && (
                              <button 
                                onClick={() => handleRefund(pay.id)}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-lg shadow-sm transition-all"
                                title="Refund"
                              >
                                 <RotateCcw size={16} />
                              </button>
                            )}
                            <button className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg shadow-sm transition-all" title="Invoice">
                               <Receipt size={16} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={6} className="py-32 text-center">
                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <CreditCard size={32} />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-widest">No transactions found</h3>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             Showing {payments.length} of {total} total transactions
           </p>
           <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    fetchPayments(false);
                  }
                }}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  if (payments.length === pageSize) {
                    setPage(page + 1);
                    fetchPayments(true);
                  }
                }}
                disabled={payments.length < pageSize}
                className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
              >
                Next
              </button>
           </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
              <div className="p-6 md:p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight flex flex-wrap items-center gap-2 md:gap-4">
                       Audit trail: #{selectedPayment.transactionId || selectedPayment.id.slice(0, 12)}
                       <div className={cn(
                         "px-4 py-1.5 rounded-xl text-[10px] md:text-xs font-bold tracking-tight border uppercase",
                         selectedPayment.status === 'success' || selectedPayment.status === 'completed' ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"
                       )}>
                          {selectedPayment.status}
                       </div>
                    </h2>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight mt-1 uppercase">Financial Reconciliation Report</p>
                 </div>
                 <button onClick={() => setSelectedPayment(null)} className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Financial Breakdown */}
                    <div className="lg:col-span-2 space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                             <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-6 uppercase">Payment Breakdown</h4>
                             <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                   <span>Base Amount</span>
                                   <span>₹{(selectedPayment.amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                   <span>Tax (GST 18%)</span>
                                   <span className="text-red-400">+ ₹{(selectedPayment.taxAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                   <span>Discount / Coupon</span>
                                   <span className="text-green-500">- ₹{(selectedPayment.discountAmount || 0).toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                   <span className="text-xs font-bold text-gray-900 tracking-tight uppercase">Final Amount</span>
                                   <span className="text-2xl font-bold text-gray-900">₹{(selectedPayment.finalAmount || selectedPayment.amount || 0).toLocaleString()}</span>
                                </div>
                             </div>
                          </div>
                          
                          <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                             <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-6 uppercase">Timeline & reference</h4>
                             <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary"><Calendar size={18} /></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 tracking-tight">Created At</p>
                                      <p className="text-xs font-bold text-gray-900">{selectedPayment.createdAt?.toDate ? new Date(selectedPayment.createdAt.toDate()).toLocaleString() : 'N/A'}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-500"><CheckCircle2 size={18} /></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 tracking-tight">Paid At</p>
                                      <p className="text-xs font-bold text-gray-900">{selectedPayment.paidAt?.toDate ? new Date(selectedPayment.paidAt.toDate()).toLocaleString() : 'Pending'}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400"><History size={18} /></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 tracking-tight">Last Sync</p>
                                      <p className="text-xs font-bold text-gray-900">{selectedPayment.updatedAt?.toDate ? new Date(selectedPayment.updatedAt.toDate()).toLocaleString() : 'Just now'}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-xs font-bold text-gray-400 tracking-tight uppercase">Property & listing context</h4>
                          <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/20 flex items-center gap-8">
                             <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-md shrink-0 border border-gray-50">
                                <img src={selectedPayment.propertyImage || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div className="min-w-0 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 tracking-tight truncate">{selectedPayment.propertyTitle || 'General platform fee'}</h3>
                                <div className="flex items-center gap-6 mt-4">
                                   <div className="flex items-center gap-2">
                                      <MapPin size={14} className="text-primary" />
                                      <span className="text-xs font-bold text-gray-600">{selectedPayment.propertyLocation || 'Global'}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <ShieldCheck size={14} className="text-primary" />
                                      <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">ID: {selectedPayment.propertyId || 'N/A'}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-xs font-bold tracking-tight border uppercase">
                                   {selectedPayment.listingType || 'Standard'}
                                </span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-xs font-bold text-gray-400 tracking-tight uppercase">Gateway raw log</h4>
                          <div className="p-6 bg-gray-900 rounded-[2rem] border border-gray-800">
                             <div className="flex items-center gap-3 mb-4 text-primary">
                                <Terminal size={14} />
                                <span className="text-xs font-bold tracking-tight uppercase">Payload Response</span>
                             </div>
                             <pre className="text-xs font-mono text-gray-400 overflow-x-auto custom-scrollbar">
                                {JSON.stringify(selectedPayment.gatewayResponse || { status: selectedPayment.status, code: '200', message: 'Manual Reconciliation Required' }, null, 2)}
                             </pre>
                          </div>
                       </div>
                    </div>

                    {/* Side Info */}
                    <div className="space-y-8">
                       <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                          <h3 className="text-xs font-bold text-gray-400 tracking-tight mb-6 uppercase">User Information</h3>
                          <div className="flex items-center gap-4 mb-8">
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary font-bold text-2xl shadow-sm border border-gray-100 uppercase">
                                {selectedPayment.userName?.charAt(0) || 'U'}
                             </div>
                             <div>
                                <h4 className="font-bold text-gray-900 tracking-tight">{selectedPayment.userName || 'Verified user'}</h4>
                                <span className="text-xs font-bold text-primary tracking-tight px-2 py-0.5 bg-primary/5 rounded border border-primary/10">{selectedPayment.userType || 'customer'}</span>
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                <Mail size={16} className="text-gray-300" /> {selectedPayment.userEmail || 'No email log'}
                             </div>
                             <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                <Smartphone size={16} className="text-gray-300" /> {selectedPayment.userMobile || 'No mobile log'}
                             </div>
                             <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                <Globe size={16} className="text-gray-300" /> {selectedPayment.ipAddress || '127.0.0.1'}
                             </div>
                          </div>
                       </div>

                       <div className="bg-white rounded-[2.5rem] p-8 border-2 border-primary/10 shadow-xl shadow-primary/5">
                          <h3 className="text-xs font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2 uppercase">
                             <Activity size={16} className="text-primary" /> Admin controls
                          </h3>
                          <div className="space-y-4">
                             {selectedPayment.status === 'failed' && (
                               <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 uppercase">
                                  <RefreshCcw size={16} /> Retry notification
                               </button>
                             )}
                             {(selectedPayment.status === 'success' || selectedPayment.status === 'completed') && (
                               <button 
                                 onClick={() => { handleRefund(selectedPayment.id); setSelectedPayment(null); }}
                                 className="w-full py-4 bg-white text-blue-600 border-2 border-blue-50 rounded-2xl font-bold text-xs tracking-tight hover:bg-blue-50 transition-all flex items-center justify-center gap-2 uppercase"
                               >
                                  <RotateCcw size={16} /> Process refund
                               </button>
                             )}
                             <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-black transition-all flex items-center justify-center gap-2 uppercase">
                                <FileText size={16} /> Resend receipt
                             </button>
                             <button className="w-full py-4 bg-white text-red-500 border-2 border-red-50 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-50 transition-all flex items-center justify-center gap-2 uppercase">
                                <AlertCircle size={16} /> Flag for review
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}
