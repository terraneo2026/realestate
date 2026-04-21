import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db } from '@/admin/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { MessageSquare, Mail, Phone, Calendar, Loader2, User } from 'lucide-react';

const EnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setEnquiries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Enquiries</h2>
          <p className="text-gray-400 font-semibold text-xs tracking-tight mt-1">Manage property enquiries and contact submissions</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-white border border-gray-100 shadow-sm text-[#087C7C] rounded-xl text-xs font-bold tracking-tight">
            {enquiries.length} new messages
          </span>
        </div>
      </div>
 
      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#087C7C]" size={40} />
            <p className="text-gray-400 font-bold tracking-tight text-xs">Fetching messages...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-xs font-bold tracking-tight">
                  <th className="px-6 py-4">Sender info</th>
                  <th className="px-6 py-4">Contact details</th>
                  <th className="px-6 py-4">Message subject</th>
                  <th className="px-6 py-4">Received date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#087C7C] font-bold text-sm shadow-inner group-hover:bg-[#087C7C] group-hover:text-white transition-all">
                          {(enquiry.fullName || 'E')[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 tracking-tight text-sm">{enquiry.fullName || 'Anonymous'}</p>
                          <p className="text-xs text-gray-400 font-semibold tracking-tight">ID: {enquiry.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600 font-medium">
                          <Mail size={12} className="mr-2 text-gray-300" /> {enquiry.email}
                        </div>
                        <div className="flex items-center text-xs text-gray-600 font-medium">
                          <Phone size={12} className="mr-2 text-gray-300" /> {enquiry.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="font-bold text-gray-700 text-xs truncate">{enquiry.subject || 'Property Inquiry'}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 font-medium">{enquiry.message}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-400 font-bold text-xs tracking-tight bg-gray-50 px-2.5 py-1 rounded-lg w-fit">
                        <Calendar size={10} className="mr-1.5" />
                        {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center">
                      <MessageSquare className="mx-auto text-gray-100 mb-4" size={64} />
                      <p className="text-gray-400 font-bold tracking-tight text-sm">No enquiries found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EnquiriesPage;
