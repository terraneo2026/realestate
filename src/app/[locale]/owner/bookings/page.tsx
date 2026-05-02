"use client";

import React, { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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
  Phone,
  MessageSquare,
  AlertCircle,
  Zap,
  Handshake,
  FileText,
  ShieldCheck,
  Building2
} from "lucide-react";
import { BOOKING_STATUS, PROPERTY_STATUS } from "@/lib/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import DigitalAgreementModal from "@/components/modals/DigitalAgreementModal";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { sendNotification } from "@/lib/notifications";
import { transitionBookingState } from "@/lib/booking-service";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OwnerBookingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchBookings(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBookings = async (ownerId: string) => {
    try {
      setLoading(true);
      const q = query(
        collection(firestore, "bookings"),
        where("ownerId", "==", ownerId)
      );
      const snap = await getDocs(q);
      const fetchedBookings = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Client-side sort by createdAt desc
      fetchedBookings.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string, propertyId?: string, signatureUrl?: string) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const metadata: any = {};
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

      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      toast.success(`Booking status updated to: ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredBookings = bookings.filter(b => 
    filterStatus === 'all' || b.status === filterStatus
  );

  if (loading) {
    return (
      <DashboardLayout userRole="owner">
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-[2.5rem]" />)}
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="owner">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Visit Requests</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Manage property tours & tenant inquiries</p>
        </div>
        
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
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

      <div className="space-y-6">
        {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
          <div key={booking.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col lg:flex-row gap-8 items-center transition-all hover:shadow-2xl hover:border-primary/20">
            {/* Property Info */}
            <div className="relative w-full lg:w-48 aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-md shrink-0">
              <img src={booking.propertyImage || '/placeholder.svg'} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                 <div className={cn(
                   "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg border",
                   booking.status === BOOKING_STATUS.BOOKED ? "bg-green-500 border-green-400 text-white" : 
                   booking.status === BOOKING_STATUS.VISIT_REQUESTED ? "bg-blue-500 border-blue-400 text-white" :
                   booking.status === BOOKING_STATUS.REJECTED ? "bg-red-500 border-red-400 text-white" :
                   "bg-primary border-primary/50 text-white"
                 )}>
                   {booking.status.replace('_', ' ')}
                 </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
               {/* Column 1: Tenant & Property */}
               <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Tenant Details</p>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                          <User size={18} />
                       </div>
                       <div>
                          <h3 className="font-bold text-gray-900 text-lg">{booking.userName}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                             <Mail size={12} className="text-primary/50" />
                             <span className="text-[10px] font-bold text-gray-400">{booking.userEmail}</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Property</p>
                    <div className="flex items-center gap-2">
                       <Home size={14} className="text-primary" />
                       <Link href={`/${locale}/property/${booking.propertySlug}`} className="text-sm font-bold text-gray-700 hover:text-primary transition-colors truncate">
                          {booking.propertyTitle}
                       </Link>
                    </div>
                  </div>
               </div>

               {/* Column 2: Date & Time / Agreement Status */}
               <div className="space-y-4">
                  <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 group-hover:bg-white group-hover:border-primary/10 transition-colors">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Visit Schedule</p>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <Calendar size={16} className="text-primary" />
                           <span className="text-sm font-bold text-gray-900">
                              {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </span>
                        </div>
                        <div className="w-px h-4 bg-gray-200" />
                        <div className="flex items-center gap-2">
                           <Clock size={16} className="text-primary" />
                           <span className="text-sm font-bold text-gray-900 uppercase">{booking.bookingSlot}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl border border-green-100 w-fit">
                        <CheckCircle2 size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Token Paid: ₹{booking.tokenAmount || 500}</span>
                     </div>
                     {booking.status === BOOKING_STATUS.AGREEMENT && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 w-fit">
                           <FileText size={14} />
                           <span className="text-[9px] font-black uppercase tracking-widest">Agreement Drafted</span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Column 3: Dynamic Lifecycle Actions */}
               <div className="flex flex-col justify-center gap-3">
                  {/* Step 1: Approve/Reject Visit */}
                  {booking.status === BOOKING_STATUS.VISIT_REQUESTED && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.VISIT_BOOKED, booking.propertyId)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Confirm Visit
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.REJECTED, booking.propertyId)}
                        className="w-full py-4 bg-white text-red-500 border-2 border-red-50 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} /> Reject Visit
                      </button>
                    </>
                  )}

                  {/* Step 2: Visit Completed -> Discussion */}
                  {booking.status === BOOKING_STATUS.VISIT_BOOKED && (
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.DISCUSSION)}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} /> Mark Visit Completed
                    </button>
                  )}

                  {/* Step 3: Discussion -> Agreed */}
                  {booking.status === BOOKING_STATUS.DISCUSSION && (
                    <button 
                      onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.AGREED)}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-2"
                    >
                      <Handshake size={16} /> Terms Agreed
                    </button>
                  )}

                  {/* Step 4: Agreed -> Agreement */}
                  {booking.status === BOOKING_STATUS.AGREED && (
                    <button 
                      onClick={() => {
                        setActiveBooking(booking);
                        handleStatusUpdate(booking.id, BOOKING_STATUS.AGREEMENT);
                      }}
                      className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-2"
                    >
                      <FileText size={16} /> Generate Agreement
                    </button>
                  )}

                  {/* Step 5: Agreement -> Booked */}
                  {booking.status === BOOKING_STATUS.AGREEMENT && (
                    <button 
                      onClick={() => {
                        setActiveBooking(booking);
                        setIsAgreementOpen(true);
                      }}
                      className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/10 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={16} /> Sign & Finalize
                    </button>
                  )}

                  {/* Final State */}
                  {booking.status === BOOKING_STATUS.BOOKED && (
                    <div className="p-6 rounded-3xl bg-green-50 border border-green-100 flex flex-col items-center justify-center text-center gap-2">
                       <ShieldCheck size={24} className="text-green-500" />
                       <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Successfully Rented</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                     <Link href={`/${locale}/owner/messages?userId=${booking.userId}`} className="flex-1 py-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-gray-100 flex items-center justify-center gap-2 font-bold text-[9px] uppercase tracking-widest">
                        <MessageSquare size={14} /> Chat with Tenant
                     </Link>
                     {booking.status !== BOOKING_STATUS.BOOKED && booking.status !== BOOKING_STATUS.REJECTED && (
                        <button 
                           onClick={() => handleStatusUpdate(booking.id, BOOKING_STATUS.CANCELLED, booking.propertyId)}
                           className="px-4 py-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                           title="Cancel Booking"
                        >
                           <XCircle size={16} />
                        </button>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-[3rem] p-32 text-center border border-dashed border-gray-200 shadow-sm">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
                <Calendar size={48} />
             </div>
             <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight uppercase">No requests found</h3>
             <p className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed mb-10">
               When tenants request a visit to your properties, they will appear here for your approval.
             </p>
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
    </DashboardLayout>
  );
}
