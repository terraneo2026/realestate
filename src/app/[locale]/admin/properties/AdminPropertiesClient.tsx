'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
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
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    // Use onSnapshot for real-time updates
    const q = collection(firestore, 'properties');
    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      
      fetched.sort((a: any, b: any) => {
        const getDate = (val: any) => {
          if (!val) return new Date(0);
          if (typeof val.toDate === 'function') return val.toDate();
          return new Date(val);
        };
        const dateA = getDate(a.createdAt || a.created_at);
        const dateB = getDate(b.createdAt || b.created_at);
        return dateB.getTime() - dateA.getTime();
      });

      setProperties(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
          recipientId: property.ownerId,
          recipientRole: 'owner',
          type: 'status_update',
          category: 'property',
          title: newStatus === 'approved' || newStatus === 'published' ? 'Property Published!' : 'Property Rejected',
          message: newStatus === 'approved' || newStatus === 'published' 
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

  const filteredProperties = properties.filter(p => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = (p.title || "").toLowerCase().includes(s) ||
                         (p.id || "").toLowerCase().includes(s) ||
                         (p.ownerName || "").toLowerCase().includes(s) ||
                         (p.city || p.location?.city || "").toLowerCase().includes(s);
    
    const status = String(p.status || 'pending').toLowerCase();
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && (status === 'approved' || status === 'published' || status === 'active')) ||
                         status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Properties Moderation</h1>
            <p className="text-gray-500 font-bold tracking-tight uppercase text-[10px] mt-1">Review and manage all property listings</p>
          </div>
          <Link 
            href={`/${locale}/admin/properties/add`}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus size={16} /> Add New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              placeholder="Search properties by title or ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl outline-none focus:border-primary transition-all font-bold text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Published / Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading properties...</p>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="p-20 text-center">
              <Building2 className="mx-auto text-gray-200 mb-4" size={60} />
              <p className="text-gray-500 font-bold">No properties found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-6">Property Info</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Budget</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProperties.map((prop) => {
                    const status = String(prop.status || 'pending').toLowerCase();
                    return (
                    <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                            {prop.coverImage || prop.images?.[0] || prop.image ? (
                              <img src={prop.coverImage || prop.images?.[0] || prop.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Building2 size={24} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 line-clamp-1">{prop.title}</h4>
                              <span className="text-[8px] font-black text-gray-300 uppercase">ID: {prop.id.slice(0, 8)}</span>
                            </div>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin size={12} /> {prop.location?.area || prop.city || 'Location N/A'}
                            </p>
                            <p className="text-[9px] font-black text-primary/60 uppercase mt-1">Owner: {prop.ownerName || 'Unknown'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500">
                          {prop.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold text-gray-900">
                        ₹{Number(prop.budget || prop.price || 0).toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                          (status === 'approved' || status === 'published' || status === 'active') ? "bg-green-500 text-white shadow-lg shadow-green-100" :
                          status === 'pending' ? "bg-amber-500 text-white shadow-lg shadow-amber-100" :
                          "bg-red-500 text-white shadow-lg shadow-red-100"
                        )}>
                          {status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          {(prop.status === 'pending' || prop.status === 'rejected') && (
                            <button 
                              onClick={() => handleStatusUpdate(prop, 'published')}
                              className="px-4 py-2 bg-green-50 text-green-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                              title="Publish to Platform"
                            >
                              <CheckCircle2 size={14} /> Publish
                            </button>
                          )}
                          {prop.status !== 'rejected' && (
                            <button 
                              onClick={() => handleStatusUpdate(prop, 'rejected')}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                              title="Reject Listing"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(prop.id)}
                            className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            title="Delete Permanently"
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
        </div>
      </div>
    </AdminLayout>
  );
}
