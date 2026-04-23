'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  Mail, 
  Phone, 
  User, 
  Building2, 
  AlertCircle,
  MoreVertical,
  Send,
  Loader2,
  ChevronDown,
  Tag,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendNotification } from '@/lib/notifications';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminEnquiriesClient() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let q = query(collection(firestore, 'enquiries'), orderBy('createdAt', 'desc'));
    
    if (filterStatus !== 'all') {
      q = query(q, where('status', '==', filterStatus));
    }

    const unsubscribe = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      fetched.sort((a: any, b: any) => {
        const getDate = (val: any) => {
          if (!val) return new Date(0);
          if (typeof val.toDate === 'function') return val.toDate();
          return new Date(val);
        };
        return getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime();
      });

      setEnquiries(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching enquiries:", error);
      toast.error("Failed to load enquiries");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filterStatus]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const enquiry = enquiries.find(e => e.id === id);
      await updateDoc(doc(firestore, 'enquiries', id), { 
        status: newStatus,
        updatedAt: new Date()
      });
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      toast.success(`Enquiry marked as ${newStatus}`);

      // Send notification to the user who sent the enquiry
      if (enquiry && enquiry.userId) {
        await sendNotification({
          recipientId: enquiry.userId,
          recipientRole: 'tenant', // Assuming tenants send enquiries
          type: 'status_update',
          category: 'system',
          title: `Support update`,
          message: `Your enquiry "${enquiry.subject}" has been marked as ${newStatus}.`,
          metadata: { enquiryId: id, status: newStatus }
        });
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Update failed");
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Support & enquiries</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <MessageSquare size={14} className="text-primary" /> Centralized hub for inbound leads and support tickets
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              {['all', 'open', 'viewed', 'responded', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold tracking-tight transition-all capitalize",
                    filterStatus === status ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-50"
                  )}
                >
                  {status}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 bg-white">
           <div className="relative group max-w-xl">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search by subject, message, or user..." 
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">Enquiry details</th>
                    <th className="px-6 py-8">Sender info</th>
                    <th className="px-6 py-8 text-center">Type / source</th>
                    <th className="px-6 py-8 text-center">Priority</th>
                    <th className="px-6 py-8">Status</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredEnquiries.length > 0 ? filteredEnquiries.map((enq) => (
                   <tr key={enq.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm truncate max-w-[300px] leading-tight mb-1 tracking-tight">{enq.subject || 'New Inquiry'}</h4>
                            <p className="text-xs font-semibold text-gray-400 line-clamp-2 max-w-[350px] leading-relaxed mb-3">{enq.message}</p>
                            <div className="flex items-center gap-3">
                               <span className="text-xs font-bold text-gray-300 tracking-tight">Received: {enq.createdAt?.toDate ? new Date(enq.createdAt.toDate()).toLocaleDateString() : 'Today'}</span>
                               {enq.propertyId && (
                                 <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 rounded text-xs font-bold text-primary border border-primary/10">
                                    <Building2 size={10} /> Linked Prop
                                 </div>
                               )}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold">
                                  {enq.userName?.charAt(0) || 'U'}
                               </div>
                               <span className="text-xs font-bold text-gray-700">{enq.userName || 'Anonymous'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-tight">
                               <Mail size={12} /> {enq.userEmail}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         <div className="flex flex-col gap-1 items-center">
                            <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 tracking-tight border border-gray-100">{enq.type || 'Support'}</span>
                            <span className="text-xs font-bold text-gray-300 tracking-tight">{enq.source || 'Web Form'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <div className={cn(
                               "px-3 py-1 rounded-lg text-xs font-bold tracking-tight border capitalize",
                               enq.priority === 'high' ? "bg-red-50 border-red-100 text-red-500" :
                               enq.priority === 'medium' ? "bg-amber-50 border-amber-100 text-amber-600" :
                               "bg-blue-50 border-blue-100 text-blue-500"
                            )}>
                               {enq.priority || 'Normal'}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border shadow-sm capitalize",
                           enq.status === 'resolved' ? "bg-green-50 border-green-100 text-green-600" :
                           enq.status === 'responded' ? "bg-orange-50 border-orange-100 text-orange-600" :
                           enq.status === 'viewed' ? "bg-blue-50 border-blue-100 text-blue-600" :
                           enq.status === 'open' ? "bg-amber-50 border-amber-100 text-amber-600" :
                           "bg-gray-50 border-gray-100 text-gray-400"
                         )}>
                            {enq.status}
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            {(enq.status === 'open' || !enq.status) && (
                              <button 
                                onClick={() => handleStatusUpdate(enq.id, 'viewed')}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-xl shadow-sm transition-all"
                                title="Mark Viewed"
                              >
                                 <Eye size={18} />
                              </button>
                            )}
                            {(enq.status === 'viewed' || enq.status === 'open' || !enq.status) && (
                              <button 
                                onClick={() => handleStatusUpdate(enq.id, 'responded')}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-orange-500 hover:border-orange-100 rounded-xl shadow-sm transition-all"
                                title="Mark Responded"
                              >
                                 <UserCheck size={18} />
                              </button>
                            )}
                            {enq.status !== 'resolved' && (
                              <button 
                                onClick={() => handleStatusUpdate(enq.id, 'resolved')}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-100 rounded-xl shadow-sm transition-all"
                                title="Mark Resolved"
                              >
                                 <CheckCircle2 size={18} />
                              </button>
                            )}
                            <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-xl shadow-sm transition-all">
                               <Send size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={6} className="py-32 text-center">
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <MessageSquare size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No enquiries found</h3>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </AdminLayout>
  );
}
