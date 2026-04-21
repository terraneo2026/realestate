'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { Wallet, Calendar, Clock, MapPin, ChevronRight, X, AlertCircle, CheckCircle2, Loader2, IndianRupee, Download, Receipt } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PaymentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, "payments"),
          where("userId", "==", user.uid)
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
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDownloadReceipt = (id: string) => {
    toast.success("Receipt downloading...");
    // Mock download for now
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[2.5rem]" />)}
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Payments History</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Track your token payments & refunds</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
           <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Wallet size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</p>
              <p className="text-lg font-black text-gray-900">₹{payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0).toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {payments.length > 0 ? payments.map((payment) => (
          <div key={payment.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col gap-6 transition-all hover:shadow-2xl hover:border-primary/20">
            <div className="flex justify-between items-start">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary">
                  <Receipt size={24} />
               </div>
               <div className={cn(
                 "px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest border",
                 payment.status === 'success' ? "bg-green-50 border-green-100 text-green-600" : 
                 payment.status === 'pending' ? "bg-blue-50 border-blue-100 text-blue-600" :
                 "bg-red-50 border-red-100 text-red-600"
               )}>
                 {payment.status}
               </div>
            </div>

            <div>
               <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">₹{Number(payment.amount).toLocaleString()}</h3>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{payment.type || 'Token Payment'}</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-50">
               <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">Property</span>
                  <span className="text-gray-900 truncate max-w-[150px]">{payment.propertyTitle || 'N/A'}</span>
               </div>
               <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">Date</span>
                  <span className="text-gray-900">{new Date(payment.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">ID</span>
                  <span className="text-gray-900 uppercase font-black">{payment.id.slice(0, 8)}...</span>
               </div>
            </div>

            <button 
              onClick={() => handleDownloadReceipt(payment.id)}
              className="mt-4 flex items-center justify-center gap-3 w-full py-4 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-gray-100 font-black text-[10px] uppercase tracking-widest"
            >
               <Download size={14} />
               <span>Download Receipt</span>
            </button>
          </div>
        )) : (
          <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
                <Receipt size={48} />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">No Payments Found</h2>
             <p className="text-gray-500 font-medium mb-10 max-w-xs mx-auto">You haven't made any transactions yet.</p>
             <Link href={`/${locale}/properties`} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
               Browse Properties <ChevronRight size={16} />
             </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
