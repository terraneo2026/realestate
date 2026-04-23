import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db } from '@/admin/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Loader2, 
  User, 
  Eye, 
  CheckCircle2, 
  UserCheck,
  Search,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setEnquiries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'enquiries', id), { 
        status: newStatus,
        updatedAt: new Date()
      });
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      toast.success(`Enquiry marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating enquiry:", error);
      toast.error("Update failed");
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      (e.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.message || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || (e.status || 'open') === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Support & enquiries</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <MessageSquare size={14} className="text-[#087C7C]" /> Global lead & support management center
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
              {['all', 'open', 'viewed', 'responded', 'resolved'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-bold tracking-tight transition-all capitalize",
                    filterStatus === status ? "bg-[#087C7C] text-white shadow-lg shadow-[#087C7C]/20" : "text-gray-400 hover:bg-gray-50"
                  )}
                >
                  {status}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 bg-white">
           <div className="relative group max-w-xl">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#087C7C] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by subject, message, or user..." 
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087C7C] focus:bg-white outline-none transition-all font-bold text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#087C7C]" size={40} />
              <p className="text-gray-400 font-bold tracking-tight text-xs">Fetching messages...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
                <tr>
                  <th className="px-10 py-8">Sender info</th>
                  <th className="px-6 py-8">Contact details</th>
                  <th className="px-6 py-8">Message subject</th>
                  <th className="px-6 py-8">Status</th>
                  <th className="px-6 py-8">Received date</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredEnquiries.length > 0 ? filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="group hover:bg-gray-50/30 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#087C7C] font-bold text-lg shadow-sm group-hover:bg-[#087C7C] group-hover:text-white transition-all">
                          {(enquiry.fullName || 'E')[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 tracking-tight text-sm">{enquiry.fullName || 'Anonymous'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {enquiry.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center text-xs text-gray-700 font-bold">
                          <Mail size={14} className="mr-2 text-gray-300" /> {enquiry.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-700 font-bold">
                          <Phone size={14} className="mr-2 text-gray-300" /> {enquiry.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="max-w-xs">
                        <p className="font-bold text-gray-900 text-sm truncate leading-tight mb-1">{enquiry.subject || 'Property Inquiry'}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 font-semibold leading-relaxed">{enquiry.message}</p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border shadow-sm uppercase",
                         enquiry.status === 'resolved' ? "bg-green-50 border-green-100 text-green-600" :
                         enquiry.status === 'responded' ? "bg-orange-50 border-orange-100 text-orange-600" :
                         enquiry.status === 'viewed' ? "bg-blue-50 border-blue-100 text-blue-600" :
                         (enquiry.status === 'open' || !enquiry.status) ? "bg-amber-50 border-amber-100 text-amber-600" :
                         "bg-gray-50 border-gray-100 text-gray-400"
                       )}>
                          {enquiry.status || 'open'}
                       </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center text-gray-400 font-bold text-xs tracking-tight bg-gray-50 px-3 py-1.5 rounded-xl w-fit border border-gray-100">
                        <Calendar size={12} className="mr-2" />
                        {enquiry.createdAt?.toDate ? new Date(enquiry.createdAt.toDate()).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 
                         enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent'}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          {(enquiry.status === 'open' || !enquiry.status) && (
                            <button 
                              onClick={() => handleStatusUpdate(enquiry.id, 'viewed')}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-xl shadow-sm transition-all"
                              title="Mark Viewed"
                            >
                               <Eye size={18} />
                            </button>
                          )}
                          {(enquiry.status === 'viewed' || enquiry.status === 'open' || !enquiry.status) && (
                            <button 
                              onClick={() => handleStatusUpdate(enquiry.id, 'responded')}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-orange-500 hover:border-orange-100 rounded-xl shadow-sm transition-all"
                              title="Mark Responded"
                            >
                               <UserCheck size={18} />
                            </button>
                          )}
                          {enquiry.status !== 'resolved' && (
                            <button 
                              onClick={() => handleStatusUpdate(enquiry.id, 'resolved')}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-100 rounded-xl shadow-sm transition-all"
                              title="Mark Resolved"
                            >
                               <CheckCircle2 size={18} />
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-32 text-center">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-100 mx-auto mb-6">
                        <MessageSquare size={48} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No enquiries found</h3>
                      <p className="text-gray-400 text-xs font-semibold max-w-xs mx-auto">Try adjusting your filters or search to find specific messages.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EnquiriesPage;
