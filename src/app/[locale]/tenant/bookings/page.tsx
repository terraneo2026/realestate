'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar, Clock, MapPin, ChevronRight, X, AlertCircle, CheckCircle2, Loader2, IndianRupee, ShieldCheck, FileText, MessageSquare } from "lucide-react";
import { BOOKING_STATUS } from "@/lib/constants";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function BookingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(firestore, "bookings"),
          where("userId", "==", user.uid)
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
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await deleteDoc(doc(firestore, "bookings", id));
      setBookings(prev => prev.filter(b => b.id !== id));
      toast.success("Booking cancelled successfully");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-[2.5rem]" />)}
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My Bookings</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Track your property visits & reservations</p>
      </div>

      <div className="space-y-6">
        {bookings.length > 0 ? bookings.map((booking) => (
          <div key={booking.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center transition-all hover:shadow-2xl hover:border-primary/20">
            {/* Property Image */}
            <div className="relative w-full md:w-48 aspect-video md:aspect-square rounded-[2rem] overflow-hidden shadow-md">
              <img src={booking.propertyImage || '/placeholder.svg'} alt="" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Booking Details */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">{booking.propertyTitle}</h3>
                <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center justify-center md:justify-start gap-1">
                   <MapPin size={12} /> {booking.propertySlug}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                       <Calendar size={14} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                       <p className="text-xs font-black text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-primary">
                       <Clock size={14} />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Slot</p>
                       <p className="text-xs font-black text-gray-900">{booking.bookingSlot}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex flex-col items-center md:items-end gap-4">
              <div className={cn(
                "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                booking.status === BOOKING_STATUS.BOOKED ? "bg-green-500 border-green-400 text-white" : 
                booking.status === BOOKING_STATUS.VISIT_REQUESTED ? "bg-blue-50 border-blue-100 text-blue-600" :
                booking.status === BOOKING_STATUS.VISIT_BOOKED ? "bg-primary border-primary/10 text-white" :
                booking.status === BOOKING_STATUS.REJECTED ? "bg-red-50 border-red-100 text-red-600" :
                "bg-gray-100 border-gray-200 text-gray-400"
              )}>
                {booking.status.replace('_', ' ')}
              </div>
              
              <div className="flex gap-3">
                 <Link 
                   href={`/${locale}/owner/messages?userId=${booking.ownerId}`}
                   className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-gray-100"
                   title="Chat with Owner"
                 >
                    <MessageSquare size={20} />
                 </Link>
                 <Link 
                   href={`/${locale}/property/${booking.propertySlug}`}
                   className="p-3 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all border border-gray-100"
                   title="View Property"
                 >
                    <ChevronRight size={20} />
                 </Link>
                 {booking.status === BOOKING_STATUS.VISIT_REQUESTED && (
                   <button 
                     onClick={() => handleCancelBooking(booking.id)}
                     className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-gray-100"
                     title="Cancel Request"
                   >
                      <X size={20} />
                   </button>
                 )}
              </div>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
                <Calendar size={48} />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">No Bookings Found</h2>
             <p className="text-gray-500 font-medium mb-10 max-w-xs mx-auto">You haven't scheduled any property visits yet.</p>
             <Link href={`/${locale}/properties`} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
               Start Exploring <ChevronRight size={16} />
             </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
