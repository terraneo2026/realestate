'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { Heart, MapPin, ChevronRight, X, Trash2, Search, MessageSquare, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SavedPropertiesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [savedProperties, setSavedProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const favorites = userDoc.data().favorites || [];
          if (favorites.length > 0) {
            // Firestore 'in' operator supports max 10 IDs. 
            // For a production app with many favorites, this should be paginated or handled differently.
            const q = query(
              collection(firestore, "properties"),
              where("__name__", "in", favorites.slice(0, 10))
            );
            const snap = await getDocs(q);
            setSavedProperties(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          }
        }
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleRemoveFavorite = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        favorites: arrayRemove(id)
      });
      setSavedProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite");
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-80 bg-gray-100 rounded-[2.5rem]" />)}
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Saved Properties</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Your personal wishlist of dream homes</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-black text-gray-900">
             {savedProperties.length} Items Saved
           </div>
        </div>
      </div>

      {savedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {savedProperties.map((prop) => (
            <div key={prop.id} className="group bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-2">
               {/* Image Section */}
               <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={prop.image || (prop.images && prop.images[0]) || '/placeholder.svg'} 
                    alt={prop.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <button 
                    onClick={() => handleRemoveFavorite(prop.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all group/btn"
                  >
                     <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <div className="absolute bottom-4 left-6">
                     <p className="text-2xl font-black text-white tracking-tighter">₹{Number(prop.price).toLocaleString()}</p>
                  </div>
               </div>

               {/* Content Section */}
               <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6 flex-1">
                     <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{prop.title}</h3>
                     <p className="text-xs font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                        <MapPin size={12} /> {prop.city || prop.location || 'Location N/A'}
                     </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                     <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">BHK</p>
                        <p className="text-xs font-black text-gray-900">{prop.bedrooms || 'N/A'}</p>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bath</p>
                        <p className="text-xs font-black text-gray-900">{prop.bathrooms || 'N/A'}</p>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-50">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Area</p>
                        <p className="text-xs font-black text-gray-900">{prop.size_sqft || prop.sqft || 'N/A'}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <Link 
                       href={`/${locale}/property/${prop.slug}`}
                       className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                     >
                        <Calendar size={14} /> Book Visit
                     </Link>
                     <Link 
                       href={`/${locale}/tenant/messages?propertyId=${prop.id}`}
                       className="flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-gray-900/20 hover:bg-black transition-all active:scale-95"
                     >
                        <MessageSquare size={14} /> Inquire
                     </Link>
                  </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
           <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
              <Heart size={48} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-2">No Saved Properties</h2>
           <p className="text-gray-500 font-medium mb-10 max-w-xs mx-auto">Your favorites list is currently empty. Explore our premium listings.</p>
           <Link href={`/${locale}/properties`} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
             Explore Properties <ChevronRight size={16} />
           </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
