'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { Search, Clock, Trash2, RotateCcw, ChevronRight, Filter, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function SearchHistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [searches, setSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const history = userDoc.data().recent_searches || [];
          // Sort by date descending
          setSearches(history.sort((a: any, b: any) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          ));
        }
      } catch (error) {
        console.error("Error fetching search history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchHistory();
  }, []);

  const handleDeleteSearch = async (searchItem: any) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, {
        recent_searches: arrayRemove(searchItem)
      });
      setSearches(prev => prev.filter(s => s.date !== searchItem.date));
      toast.success("Search history deleted");
    } catch (error) {
      console.error("Error deleting search history:", error);
      toast.error("Failed to delete history");
    }
  };

  const handleRerunSearch = (searchItem: any) => {
    const query = new URLSearchParams();
    if (searchItem.keyword) query.set('keyword', searchItem.keyword);
    if (searchItem.filters) {
       Object.entries(searchItem.filters).forEach(([key, val]: [string, any]) => {
          if (val) query.set(key, val.toString());
       });
    }
    router.push(`/${locale}/properties?${query.toString()}`);
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex flex-col gap-8 animate-pulse">
           <div className="h-12 bg-gray-100 rounded-2xl w-1/3" />
           <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-3xl" />)}
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Search History</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Review and rerun your previous searches</p>
        </div>
        <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm font-black text-gray-900">
           {searches.length} Searches Stored
        </div>
      </div>

      <div className="space-y-4">
        {searches.length > 0 ? searches.map((item, idx) => (
          <div key={idx} className="group bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-2xl hover:border-primary/20">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-primary group-hover:text-white transition-all duration-500">
               <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>

            <div className="flex-1 text-center md:text-left">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">
                    {item.keyword || 'General Search'}
                  </h3>
                  {item.filters && Object.keys(item.filters).length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                       <Filter size={10} className="text-gray-400" />
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{Object.keys(item.filters).length} Filters</span>
                    </div>
                  )}
               </div>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                  {item.filters?.location && <span className="flex items-center gap-1"><MapPin size={12} /> {item.filters.location}</span>}
                  {item.filters?.type && <span className="flex items-center gap-1"><Tag size={12} /> {item.filters.type}</span>}
               </div>
            </div>

            <div className="flex gap-3">
               <button 
                 onClick={() => handleRerunSearch(item)}
                 className="px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
               >
                  Rerun Search
               </button>
               <button 
                 onClick={() => handleDeleteSearch(item)}
                 className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
               >
                  <Trash2 size={18} />
               </button>
            </div>
          </div>
        )) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
                <Search size={48} />
             </div>
             <h2 className="text-2xl font-black text-gray-900 mb-2">No Search History</h2>
             <p className="text-gray-500 font-medium mb-10 max-w-xs mx-auto">You haven't performed any searches yet. Your history will appear here.</p>
             <Link href={`/${locale}/properties`} className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
               Search Properties <ChevronRight size={16} />
             </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
