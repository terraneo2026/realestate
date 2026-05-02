"use client";

import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { 
  Edit2, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Loader2, 
  Eye, 
  Users, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  ExternalLink,
  ChevronDown,
  MapPin,
  Clock
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardLayout from "./DashboardLayout";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PropertyTableProps {
  role: "owner" | "agent";
}

const PropertyTable = ({ role }: PropertyTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  
  const [properties, setProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (userId: string) => {
    try {
      setLoading(true);
      const catSnap = await getDocs(collection(firestore, "categories"));
      const catMap: any = {};
      catSnap.docs.forEach(doc => {
        catMap[doc.id] = doc.data().category || doc.data().name;
      });
      setCategories(catMap);

      const q = query(
        collection(firestore, "properties"),
        where("ownerId", "==", userId)
      );
      const propSnap = await getDocs(q);
      setProperties(propSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property permanently?")) return;
    
    try {
      await deleteDoc(doc(firestore, "properties", id));
      setProperties(properties.filter(p => p.id !== id));
      toast.success("Property deleted successfully");
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' || currentStatus === 'published' ? 'inactive' : 'active';
    try {
      await updateDoc(doc(firestore, "properties", id), { status: newStatus });
      setProperties(properties.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast.success(`Property ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      toast.error("Status update failed");
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchesSearch = (p.title || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const addPath = `/${locale}/${role}/add-property`;

  return (
    <DashboardLayout userRole={role}>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Property Management</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Track, edit and optimize your listings</p>
        </div>
        <Link 
          href={addPath}
          className="h-14 px-8 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Add New Listing
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 mb-10 flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full group">
          <Search size={20} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by title, location or ID..." 
            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
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
               <option value="published">Published</option>
               <option value="pending">Pending</option>
               <option value="rejected">Rejected</option>
               <option value="inactive">Inactive</option>
             </select>
             <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" size={20} />
           </div>
           
           <button className="p-5 bg-gray-900 text-white rounded-3xl shadow-xl shadow-gray-900/20 hover:bg-black transition-all">
             <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-32 text-center">
            <Loader2 className="animate-spin mx-auto text-primary mb-6" size={48} />
            <p className="text-gray-400 font-black tracking-widest text-[10px] uppercase">Syncing with database...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-32 text-center px-10">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-8">
              <Building2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">No listings found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
              Your property portfolio is currently empty. List your first property to start receiving leads.
            </p>
            <Link 
              href={addPath}
              className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              List Property Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1200px]">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-10 py-8">Listing Details</th>
                  <th className="px-8 py-8">Type & Config</th>
                  <th className="px-8 py-8">Performance</th>
                  <th className="px-8 py-8">Pricing</th>
                  <th className="px-8 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-6">
                        <div className="relative w-24 h-24 bg-gray-100 rounded-[1.5rem] overflow-hidden shadow-inner flex-shrink-0">
                          {prop.image ? (
                            <img src={prop.image} alt={prop.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Building2 size={32} />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[8px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">ID: {prop.id.slice(0, 8)}</span>
                             <span className="text-[8px] font-black text-gray-400 uppercase">{new Date(prop.created_at?.toDate ? prop.created_at.toDate() : prop.created_at).toLocaleDateString()}</span>
                          </div>
                          <h4 className="font-black text-gray-900 text-lg truncate mb-1 group-hover:text-primary transition-colors">{prop.title}</h4>
                          <p className="text-gray-400 text-xs font-bold flex items-center uppercase tracking-tight">
                            <MapPin size={12} className="mr-1 text-primary/50" /> {prop.location?.area || prop.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase text-gray-600">{prop.type}</span>
                             <span className="px-3 py-1 bg-blue-50 rounded-lg text-[9px] font-black uppercase text-blue-600">{prop.bedrooms?.length || 0} BHK</span>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">Project: {prop.projectName || 'Individual'}</p>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-6">
                          <div className="text-center">
                             <div className="flex items-center gap-1 text-blue-500 mb-1">
                                <Eye size={14} />
                                <span className="text-xs font-black">{prop.views || 0}</span>
                             </div>
                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Views</p>
                          </div>
                          <div className="text-center">
                             <div className="flex items-center gap-1 text-orange-500 mb-1">
                                <Users size={14} />
                                <span className="text-xs font-black">{prop.leadsCount || 0}</span>
                             </div>
                             <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Leads</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="space-y-1">
                         <p className="text-primary font-black text-xl tracking-tighter">₹{Number(prop.budget || prop.price).toLocaleString()}</p>
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{prop.type === 'rent' ? 'Per Month' : 'Total Value'}</p>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm",
                        prop.status === 'published' || prop.status === 'active' ? "bg-green-50 border-green-100 text-green-600" :
                        prop.status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                        prop.status === 'rejected' ? "bg-red-50 border-red-100 text-red-600" :
                        "bg-gray-100 border-gray-200 text-gray-400"
                      )}>
                        {prop.status === 'published' || prop.status === 'active' ? <CheckCircle2 size={12} /> : 
                         prop.status === 'pending' ? <Clock size={12} /> : <XCircle size={12} />}
                        {prop.status || 'Draft'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex justify-end items-center gap-3">
                        <Link 
                          href={`/${locale}/property/${prop.slug}`}
                          target="_blank"
                          className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
                          title="View Live"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          href={`/${locale}/${role === 'admin' ? 'admin/properties/' + prop.id + '/edit' : role + '/edit-property/' + prop.id}`}
                          className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100"
                          title="Edit Listing"
                        >
                          <Edit2 size={18} />
                        </Link>
                        
                        <div className="relative group/actions">
                           <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100">
                             <MoreVertical size={18} />
                           </button>
                           <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 opacity-0 invisible group-hover/actions:opacity-100 group-hover/actions:visible transition-all">
                              <button 
                                onClick={() => handleToggleStatus(prop.id, prop.status)}
                                className="w-full px-6 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 transition-colors"
                              >
                                {prop.status === 'active' || prop.status === 'published' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button 
                                onClick={() => handleDelete(prop.id)}
                                className="w-full px-6 py-2.5 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                              >
                                Delete Property
                              </button>
                           </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PropertyTable;
