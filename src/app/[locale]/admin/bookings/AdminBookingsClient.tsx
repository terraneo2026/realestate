'use client';

import React, { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, query, getDocs, updateDoc, doc, serverTimestamp, deleteDoc, onSnapshot, orderBy } from "firebase/firestore";
import { 
  Calendar, 
  Clock, 
  User, 
  Home, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ChevronRight,
  MoreVertical,
  Mail,
  MessageSquare,
  Zap,
  Handshake,
  FileText,
  ShieldCheck,
  Search,
  Filter,
  Trash2,
  AlertCircle
} from "lucide-react";
import { BOOKING_STATUS, PROPERTY_STATUS } from "@/lib/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdminLayout from "@/components/admin-layout-panel/AdminLayout";
import DigitalAgreementModal from "@/components/modals/DigitalAgreementModal";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { sendNotification } from "@/lib/notifications";
import { transitionBookingState } from "@/lib/booking-service";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminBookingsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(firestore, "bookings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string, propertyId?: string, signatureUrl?: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const metadata: any = { adminOverride: true };
      if (signatureUrl) {
        metadata.signatureUrl = signatureUrl;
        metadata.signedAt = serverTimestamp();
      }

      await transitionBookingState({
        bookingId,
        newStatus,
        propertyId,
        userId: booking.userId,
        ownerId: booking.ownerId,
        propertyTitle: booking.propertyTitle,
        metadata
      });

      toast.success(`Booking status updated by Admin to: ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Admin: Permanently delete this booking record? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(firestore, "bookings", id));
      toast.success("Booking record deleted");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch = 
      b.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Booking Directory...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-4 md:px-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight truncate uppercase">Booking Oversight</h1>
          <p className="text-gray-400 mt-1 md:mt-2 font-bold tracking-tight text-[10px] md:text-xs flex items-center gap-2">
             <ShieldCheck size={14} className="text-primary shrink-0" /> <span className="truncate uppercase">Global reservation & visit management</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 md:mb-10 px-4 md:px-0">
        <div className="relative group flex-1">
           <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
           <input 
             type="text" 
             placeholder="Search by property, tenant, or email..." 
             className="w-full pl-16 pr-6 py-4 bg-white border-2 border-white rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs shadow-xl shadow-gray-200/50"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-white overflow-x-auto no-scrollbar">
           {['all', ...Object.values(BOOKING_STATUS)].map((status) => (
             <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={cn(
                 "px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                 filterStatus === status ? "bg-primary text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"
               )}
             >
               {status.replace('_', ' ')}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-6 px-4 md:px-0 pb-12">
        {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
          <div key={booking.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white p-8 flex flex-col lg:flex-row gap-8 items-center transition-all hover:shadow-2xl hover:border-primary/20">
            {/* Property Image */}
            <div className="relative w-full lg:w-40 aspect-square rounded-[2rem] overflow-hidden shadow-md shrink-0">
              <img src={booking.propertyImage || '/placeholder.svg'} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Info Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
               <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tenant</p>
                    <h3 className="font-bold text-gray-900 text-base">{booking.userName}</h3>
                    <p className="text-[10px] font-bold text-gray-400 truncate">{booking.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Property</p>
                    <Link href={`/${locale}/property/${booking.propertySlug}`} className="text-sm font-bold text-gray-700 hover:text-primary transition-colors truncate block">
                       {booking.propertyTitle}
                    </Link>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Schedule</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                       <Calendar size={14} className="text-primary" /> {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mt-1 uppercase">
                       <Clock size={14} className="text-primary" /> {booking.bookingSlot}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg border border-green-100 w-fit">
                     <CheckCircle2 size={12} />
                     <span className="text-[8px] font-black uppercase tracking-widest">Token: ₹{booking.tokenAmount}</span>
                  </div>
               </div>

               <div className="flex flex-col justify-center gap-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Controls</p>
                  <div className="flex flex-wrap gap-2">
                     <div className={cn(
                       "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                       booking.status === BOOKING_STATUS.BOOKED ? "bg-green-500 text-white border-green-400" :
                       booking.status === BOOKING_STATUS.REJECTED ? "bg-red-500 text-white border-red-400" :
                       "bg-primary text-white border-primary/20"
                     )}>
                        {booking.status.replace('_', ' ')}
                     </div>
                     <div className="flex gap-1">
                        <button 
                          onClick={() => {
                            setActiveBooking(booking);
                            setIsAgreementOpen(true);
                          }}
                          className="p-2 bg-gray-50 text-gray-400 hover:text-primary rounded-lg border border-gray-100"
                          title="Agreement Flow"
                        >
                           <FileText size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-lg border border-gray-100"
                          title="Delete Record"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                  <select 
                    className="mt-2 w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest focus:border-primary outline-none"
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking.id, e.target.value, booking.propertyId)}
                  >
                     {Object.values(BOOKING_STATUS).map(status => (
                       <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
                     ))}
                  </select>
               </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-[3rem] p-32 text-center border border-dashed border-gray-200">
             <Calendar size={48} className="text-gray-200 mx-auto mb-6" />
             <h3 className="text-xl font-black text-gray-900 uppercase">No bookings found</h3>
          </div>
        )}
      </div>

      {activeBooking && (
        <DigitalAgreementModal 
          isOpen={isAgreementOpen}
          onClose={() => setIsAgreementOpen(false)}
          onSign={async (signatureUrl) => {
            await handleStatusUpdate(activeBooking.id, BOOKING_STATUS.BOOKED, activeBooking.propertyId, signatureUrl);
            setIsAgreementOpen(false);
          }}
          bookingData={activeBooking}
        />
      )}
    </AdminLayout>
  );
}
