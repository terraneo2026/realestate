import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
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
  User,
  Building2,
  Smartphone,
  Globe,
  Terminal,
  X,
  RotateCcw,
  Receipt,
  History,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [filterUserType, setFilterUserType] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    successCount: 0,
    failedCount: 0,
    refundAmount: 0,
    avgTransaction: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const q = collection(firestore, 'payments');
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      fetched.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setPayments(fetched);

      const successful = fetched.filter(p => p.status === 'completed' || p.status === 'success');
      const totalRev = successful.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      const refunded = fetched.filter(p => p.status === 'refunded');
      const totalRefund = refunded.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

      setStats({
        totalRevenue: totalRev,
        successCount: successful.length,
        failedCount: fetched.filter(p => p.status === 'failed' || p.status === 'error').length,
        refundAmount: totalRefund,
        avgTransaction: successful.length > 0 ? totalRev / successful.length : 0
      });

    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = (p.transactionId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.gatewayTransactionId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.propertyId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (p.propertyTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || p.paymentMethod === filterMethod;
    const matchesUserType = filterUserType === 'all' || p.userType === filterUserType;
    
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const pDate = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt || 0);
      if (dateRange.start && pDate < new Date(dateRange.start)) matchesDate = false;
      if (dateRange.end && pDate > new Date(dateRange.end)) matchesDate = false;
    }

    let matchesAmount = true;
    if (amountRange.min && (p.amount || 0) < Number(amountRange.min)) matchesAmount = false;
    if (amountRange.max && (p.amount || 0) > Number(amountRange.max)) matchesAmount = false;

    return matchesSearch && matchesStatus && matchesMethod && matchesUserType && matchesDate && matchesAmount;
  });

  const handleRefund = async (paymentId) => {
    if (!window.confirm("Initiate refund for this transaction?")) return;
    try {
      await updateDoc(doc(firestore, 'payments', paymentId), {
        status: 'refunded',
        refundedAt: new Date(),
        updatedAt: new Date()
      });
      toast.success("Refund initiated successfully");
      fetchPayments();
    } catch (error) {
      toast.error("Refund failed");
    }
  };

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
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Payments & revenue</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <ShieldCheck size={14} className="text-[#087c7c]" /> Enterprise audit, reconciliation & revenue tracking hub
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => exportToCSV(payments, 'relocate_transactions')}
             className="h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export CSV
           </button>
           <button onClick={fetchPayments} className="h-14 w-14 bg-[#087c7c] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#087c7c]/20 hover:rotate-180 transition-all duration-500">
              <RefreshCcw size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
               <TrendingUp size={80} />
            </div>
            <div className="relative z-10">
               <p className="text-xs font-bold text-gray-400 tracking-tight mb-2 uppercase">Total Revenue</p>
               <h2 className="text-4xl font-bold tracking-tight">₹{stats.totalRevenue.toLocaleString()}</h2>
               <div className="mt-6 flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-tight">
                  <ArrowUpRight size={12} /> +12.5% vs Last Month
               </div>
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-2 uppercase">Success Rate</p>
            <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stats.successCount} <span className="text-sm text-gray-400 font-bold">TXNs</span></h3>
            <div className="mt-6 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-green-500" style={{ width: `${(stats.successCount / (payments.length || 1)) * 100}%` }} />
            </div>
         </div>

         <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-2 uppercase">Failed / Aborted</p>
            <h3 className="text-3xl font-bold text-red-500 tracking-tight">{stats.failedCount} <span className="text-sm text-gray-300 font-bold">Errors</span></h3>
            <p className="text-xs font-bold text-gray-300 mt-6 uppercase tracking-tight">Global connectivity index</p>
         </div>

         <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <p className="text-xs font-bold text-gray-400 tracking-tight mb-2 uppercase">Total Refunded</p>
            <h3 className="text-3xl font-bold text-amber-500 tracking-tight">₹{stats.refundAmount.toLocaleString()}</h3>
            <p className="text-xs font-bold text-gray-300 mt-6 uppercase tracking-tight">Reconciliation reserve</p>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 bg-white space-y-8">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="relative w-full lg:w-96 group">
                 <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search transaction, order, user, property..." 
                   className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none transition-all font-bold text-xs"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                 <div className="relative group">
                    <select 
                      className="h-14 px-8 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none appearance-none cursor-pointer focus:border-[#087c7c] focus:bg-white transition-all"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Status: All</option>
                      <option value="success">Success</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                 </div>
                 <div className="relative group">
                    <select 
                      className="h-14 px-8 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none appearance-none cursor-pointer focus:border-[#087c7c] focus:bg-white transition-all"
                      value={filterMethod}
                      onChange={(e) => setFilterMethod(e.target.value)}
                    >
                      <option value="all">Method: All</option>
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Net Banking">Net Banking</option>
                      <option value="Wallet">Wallet</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                 </div>
                 <div className="relative group">
                    <select 
                      className="h-14 px-8 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none appearance-none cursor-pointer focus:border-[#087c7c] focus:bg-white transition-all"
                      value={filterUserType}
                      onChange={(e) => setFilterUserType(e.target.value)}
                    >
                      <option value="all">User: All</option>
                      <option value="tenant">Tenant</option>
                      <option value="owner">Owner</option>
                      <option value="agent">Agent</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 border-t border-gray-50">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tight">Date Range</label>
                 <div className="flex items-center gap-2">
                    <input type="date" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold border-2 border-gray-50 focus:border-[#087c7c] outline-none transition-all" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                    <span className="text-gray-300">-</span>
                    <input type="date" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold border-2 border-gray-50 focus:border-[#087c7c] outline-none transition-all" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tight">Amount Range (₹)</label>
                 <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold border-2 border-gray-50 focus:border-[#087c7c] outline-none transition-all" value={amountRange.min} onChange={(e) => setAmountRange({...amountRange, min: e.target.value})} />
                    <span className="text-gray-300">-</span>
                    <input type="number" placeholder="Max" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-bold border-2 border-gray-50 focus:border-[#087c7c] outline-none transition-all" value={amountRange.max} onChange={(e) => setAmountRange({...amountRange, max: e.target.value})} />
                 </div>
              </div>
              <div className="md:col-span-2 flex items-end">
                 <button onClick={() => { setDateRange({start:'', end:''}); setAmountRange({min:'', max:''}); setSearchTerm(''); setFilterStatus('all'); setFilterMethod('all'); setFilterUserType('all'); }} className="h-11 px-8 bg-gray-100 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all">Reset filters</button>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
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
                 {filteredPayments.length > 0 ? filteredPayments.map((pay) => (
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
                               <p className="text-xs font-bold text-gray-400 tracking-tight mt-1 uppercase">GW: {pay.gatewayTransactionId || 'Pending'}</p>
                               <div className="flex items-center gap-2 mt-2">
                                  <Calendar size={10} className="text-gray-300" />
                                  <span className="text-xs font-bold text-gray-300 tracking-tight uppercase">
                                    {pay.createdAt?.toDate ? new Date(pay.createdAt.toDate()).toLocaleString() : 'Recent'}
                                  </span>
                                </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <User size={12} className="text-[#087c7c]/50" />
                               <span className="text-xs font-bold text-gray-900">{pay.userName || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Building2 size={12} className="text-gray-300" />
                               <span className="text-xs font-bold text-gray-400 tracking-tight truncate max-w-[150px] uppercase">{pay.propertyTitle || 'Platform services'}</span>
                            </div>
                            <span className="text-xs font-bold text-[#087c7c] tracking-tight px-2 py-0.5 bg-[#087c7c]/5 rounded border border-[#087c7c]/10 w-fit uppercase">{pay.planType || 'Standard'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         <div className="flex flex-col items-center">
                            <span className="text-base font-bold text-gray-900">₹{(pay.finalAmount || pay.amount || 0).toLocaleString()}</span>
                            {pay.taxAmount > 0 && <span className="text-xs font-bold text-gray-400 tracking-tight mt-1 uppercase">Incl. ₹{pay.taxAmount} GST</span>}
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <CreditCard size={12} className="text-gray-400" />
                               <span className="text-xs font-bold text-gray-700 uppercase">{pay.paymentMethod || 'Unknown'}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 tracking-tight bg-gray-50 px-2 py-0.5 rounded border border-gray-100 w-fit uppercase">{pay.gateway || 'Razorpay'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border shadow-sm uppercase",
                           pay.status === 'success' || pay.status === 'completed' ? "bg-green-50 border-green-100 text-green-600" :
                           pay.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                           pay.status === 'refunded' ? "bg-blue-50 border-blue-100 text-blue-600" :
                           "bg-red-50 border-red-100 text-red-600"
                         )}>
                            {pay.status}
                         </div>
                         {pay.status === 'failed' && pay.failureReason && (
                           <p className="text-xs font-bold text-red-400 mt-2 line-clamp-1 max-w-[120px] italic">"{pay.failureReason}"</p>
                         )}
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedPayment(pay)}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all"
                              title="View full audit trail"
                            >
                               <Eye size={18} />
                            </button>
                            {(pay.status === 'success' || pay.status === 'completed') && (
                              <button 
                                onClick={() => handleRefund(pay.id)}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-xl shadow-sm transition-all"
                                title="Initiate Refund"
                              >
                                 <RotateCcw size={18} />
                              </button>
                            )}
                            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all" title="Download Invoice">
                               <Receipt size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={6} className="py-32 text-center">
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <CreditCard size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No transactions found</h3>
                         <p className="text-gray-400 max-w-xs mx-auto text-xs font-semibold leading-relaxed tracking-tight">
                            Try adjusting your search terms or filters to reconcile data.
                         </p>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
                       Audit trail: #{selectedPayment.transactionId || selectedPayment.id.slice(0, 12)}
                       <div className={cn(
                         "px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border uppercase",
                         selectedPayment.status === 'success' || selectedPayment.status === 'completed' ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"
                       )}>
                          {selectedPayment.status}
                       </div>
                    </h2>
                    <p className="text-xs font-bold text-gray-400 tracking-tight mt-1 uppercase">Financial Reconciliation Report</p>
                 </div>
                 <button onClick={() => setSelectedPayment(null)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={32} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
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
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#087c7c]"><Calendar size={18} /></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 tracking-tight uppercase">Created At</p>
                                      <p className="text-xs font-bold text-gray-900">{selectedPayment.createdAt?.toDate ? new Date(selectedPayment.createdAt.toDate()).toLocaleString() : 'N/A'}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-500"><CheckCircle2 size={18} /></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 tracking-tight uppercase">Paid At</p>
                                      <p className="text-xs font-bold text-gray-900">{selectedPayment.paidAt?.toDate ? new Date(selectedPayment.paidAt.toDate()).toLocaleString() : 'Pending'}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-gray-400"><History size={18} /></div>
                                   <div>
                                      <p className="text-xs font-bold text-gray-400 tracking-tight uppercase">Last Sync</p>
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
                                      <MapPin size={14} className="text-[#087c7c]" />
                                      <span className="text-xs font-bold text-gray-600">{selectedPayment.propertyLocation || 'Global'}</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <ShieldCheck size={14} className="text-[#087c7c]" />
                                      <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">ID: {selectedPayment.propertyId || 'N/A'}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="text-right">
                                <span className="px-4 py-2 bg-[#087c7c]/5 text-[#087c7c] rounded-xl text-xs font-bold tracking-tight border border-[#087c7c]/10 uppercase">
                                   {selectedPayment.listingType || 'Standard'}
                                </span>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-xs font-bold text-gray-400 tracking-tight uppercase">Gateway raw log</h4>
                          <div className="p-6 bg-gray-900 rounded-[2rem] border border-gray-800">
                             <div className="flex items-center gap-3 mb-4 text-[#087c7c]">
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
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#087c7c] font-bold text-2xl shadow-sm border border-gray-100 uppercase">
                                {selectedPayment.userName?.charAt(0) || 'U'}
                             </div>
                             <div>
                                <h4 className="font-bold text-gray-900 tracking-tight">{selectedPayment.userName || 'Verified user'}</h4>
                                <span className="text-xs font-bold text-[#087c7c] tracking-tight px-2 py-0.5 bg-[#087c7c]/5 rounded border border-[#087c7c]/10 uppercase">{selectedPayment.userType || 'customer'}</span>
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

                       <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#087c7c]/10 shadow-xl shadow-[#087c7c]/5">
                          <h3 className="text-xs font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2 uppercase">
                             <Activity size={16} className="text-[#087c7c]" /> Admin controls
                          </h3>
                          <div className="space-y-4">
                             {selectedPayment.status === 'failed' && (
                               <button className="w-full py-4 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-[#087c7c]/90 transition-all shadow-lg shadow-[#087c7c]/20 flex items-center justify-center gap-2 uppercase">
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
