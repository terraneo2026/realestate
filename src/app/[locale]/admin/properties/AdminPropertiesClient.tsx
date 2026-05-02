'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, deleteDoc, onSnapshot, orderBy, limit, startAfter, QueryConstraint, getCountFromServer } from 'firebase/firestore';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Loader2,
  Edit2,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown,
  Plus
} from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sendNotification } from '@/lib/notifications';
import { getPaginatedData } from '@/lib/firestore-pagination';
import Pagination from '@/components/Pagination';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPropertiesClient() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]); // To support back pagination
  const pageSize = 10;

  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const fetchProperties = async (isNext = true) => {
    setLoading(true);
    try {
      const filters: QueryConstraint[] = [];
      if (filterStatus !== 'all') {
        filters.push(where('status', '==', filterStatus));
      }

      const result = await getPaginatedData<any>({
        collectionName: 'properties',
        pageSize,
        lastVisible: isNext ? lastVisible : (history[page - 2] || null),
        filters
      });

      setProperties(result.data);
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
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filterStatus]);

  // Handle Search separately as it's harder to do server-side in Firestore without third-party services
  // For now, we keep search as a client-side filter on the current page, or notify user.
  // Senior Architect Note: Real production apps use Algolia/ElasticSearch for this.

  const handleStatusUpdate = async (property: any, newStatus: string) => {
    try {
      const id = property.id;
      await updateDoc(doc(firestore, 'properties', id), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Send notification to owner
      if (property.ownerId) {
        await sendNotification({
          user_id: property.ownerId,
          role: 'owner',
          type: newStatus === 'published' || newStatus === 'approved' ? 'approval' : 'rejection',
          title: newStatus === 'published' || newStatus === 'approved' ? 'Property Published!' : 'Property Rejected',
          message: newStatus === 'published' || newStatus === 'approved'
            ? `Your property "${property.title}" has been reviewed and is now live.` 
            : `Your property "${property.title}" was not approved. Please review the details and try again.`,
          metadata: { propertyId: id }
        });
      }

      toast.success(`Property marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteDoc(doc(firestore, 'properties', id));
      toast.success("Property deleted");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase truncate">Properties Moderation</h1>
            <p className="text-gray-500 font-bold tracking-tight uppercase text-[10px] mt-1">Review and manage all property listings</p>
          </div>
          <Link 
            href={`/${locale}/admin/properties/add`}
            className="w-full sm:w-auto px-6 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <Plus size={16} /> Add New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search properties..."
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl outline-none focus:border-primary transition-all font-bold text-[10px] md:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative group shrink-0 w-full sm:w-56">
            <select 
              className="w-full px-4 md:px-6 py-3 md:py-4 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold text-[10px] md:text-xs appearance-none cursor-pointer pr-10 md:pr-12 uppercase tracking-widest text-gray-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Published</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" strokeWidth={3} />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 md:p-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-12 md:p-20 text-center">
              <Building2 className="mx-auto text-gray-200 mb-4" size={60} />
              <p className="text-gray-500 font-bold text-xs md:text-sm">No properties found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                    <th className="px-6 md:px-8 py-4 md:py-6">Property Info</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-center">Type</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-center">Budget</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-center">Status</th>
                    <th className="px-6 md:px-8 py-4 md:py-6 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {properties.map((prop) => {
                    const status = String(prop.status || 'pending').toLowerCase();
                    return (
                    <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 md:px-8 py-4 md:py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shadow-inner shrink-0">
                            {prop.coverImage || prop.images?.[0] || prop.image ? (
                              <img src={prop.coverImage || prop.images?.[0] || prop.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Building2 size={20} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-bold text-gray-900 text-xs md:text-sm truncate max-w-[150px] md:max-w-[250px]">{prop.title}</h4>
                              <span className="text-[8px] font-black text-primary/40 uppercase shrink-0">
                                {prop.propertyReferenceId ? prop.propertyReferenceId : `#${prop.id.slice(0, 6)}`}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1 truncate">
                              <MapPin size={10} className="text-primary/50" /> {prop.location?.area || prop.city || 'Location N/A'}
                            </p>
                            <p className="text-[9px] font-black text-primary/60 uppercase mt-1 truncate">Owner: {prop.ownerName || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <span className="px-2 md:px-3 py-1 bg-gray-100 rounded-lg text-[9px] md:text-[10px] font-black uppercase text-gray-500 whitespace-nowrap">
                          {prop.type}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center font-bold text-gray-900 text-xs md:text-sm whitespace-nowrap">
                        ₹{Number(prop.budget || prop.price || 0).toLocaleString()}
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6 text-center">
                        <span className={cn(
                          "px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider whitespace-nowrap",
                          (status === 'approved' || status === 'published' || status === 'active') ? "bg-green-500 text-white shadow-lg shadow-green-100" :
                          status === 'pending' ? "bg-amber-500 text-white shadow-lg shadow-amber-100" :
                          "bg-red-500 text-white shadow-lg shadow-red-100"
                        )}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-4 md:py-6">
                        <div className="flex justify-end gap-2 md:gap-3">
                          {(prop.status === 'pending' || prop.status === 'rejected') && (
                            <button 
                              onClick={() => handleStatusUpdate(prop, 'published')}
                              className="w-8 h-8 md:w-auto md:px-4 md:py-2 bg-green-50 text-green-600 rounded-lg md:rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center md:gap-2"
                              title="Publish"
                            >
                              <CheckCircle2 size={14} /> <span className="hidden md:inline">Publish</span>
                            </button>
                          )}
                          {prop.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusUpdate(prop, 'rejected')}
                              className="w-8 h-8 md:w-auto md:px-4 md:py-2 bg-red-50 text-red-600 rounded-lg md:rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center md:gap-2"
                              title="Reject"
                            >
                              <XCircle size={14} /> <span className="hidden md:inline">Reject</span>
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(prop.id)}
                            className="w-8 h-8 p-0 bg-gray-50 text-gray-400 rounded-lg md:rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
          {!loading && properties.length > 0 && (
            <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Showing {properties.length} of {total} properties
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      fetchProperties(false);
                    }
                  }}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-gray-100 transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(Math.ceil(total / pageSize))].map((_, i) => {
                    const pageNum = i + 1;
                    // Simple logic to show only few page numbers
                    if (pageNum === 1 || pageNum === Math.ceil(total / pageSize) || Math.abs(pageNum - page) <= 1) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            if (pageNum !== page) {
                              // Cursor-based pagination usually only supports Next/Prev.
                              // To jump to a page, we'd need offset-based, which Firestore doesn't support well for large sets.
                              // For simplicity in this architectural refactor, we stick to Next/Prev.
                            }
                          }}
                          className={cn(
                            "w-8 h-8 rounded-lg font-black text-[10px] transition-all",
                            page === pageNum ? "bg-primary text-white" : "text-gray-400 hover:bg-gray-50"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    if (pageNum === page - 2 || pageNum === page + 2) return <span key={pageNum}>...</span>;
                    return null;
                  })}
                </div>
                <button
                  onClick={() => {
                    if (properties.length === pageSize) {
                      setPage(page + 1);
                      fetchProperties(true);
                    }
                  }}
                  disabled={properties.length < pageSize}
                  className="px-4 py-2 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-gray-100 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
