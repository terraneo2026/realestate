'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, addDoc, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  UserCheck, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Search, 
  MoreVertical, 
  ShieldAlert, 
  Activity, 
  Key, 
  Loader2, 
  Check, 
  X,
  UserPlus,
  Shield,
  Eye,
  Settings,
  Mail,
  Download,
  Users
} from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendNotification } from '@/lib/notifications';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const q = query(collection(firestore, 'users'), where('role', 'in', ['admin', 'staff', 'manager']));
    const unsubscribe = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching staff:", error);
      toast.error("Failed to load staff members");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVerify = async (userId: string, isVerified: boolean) => {
    try {
      const user = users.find(u => u.id === userId);
      await updateDoc(doc(firestore, 'users', userId), { 
        isVerified,
        updatedAt: new Date()
      });
      toast.success(isVerified ? "User verified successfully" : "Verification removed");

      if (user) {
        await sendNotification({
          user_id: userId,
          role: user.role || 'tenant',
          type: isVerified ? 'approval' : 'system',
          title: isVerified ? 'Account verified' : 'Verification update',
          message: isVerified 
            ? 'Your account has been successfully verified by the admin.' 
            : 'Your account verification status has been updated.',
          metadata: { userId, isVerified }
        });
      }
    } catch (error) {
      console.error("Error updating verification:", error);
      toast.error("Failed to update verification");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-4 md:px-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight truncate">User management</h1>
          <p className="text-gray-400 mt-1 md:mt-2 font-medium tracking-tight text-[10px] md:text-xs flex items-center gap-2">
             <ShieldCheck size={14} className="text-primary shrink-0" /> <span className="truncate">Platform participants directory</span>
          </p>
        </div>
        <div className="flex w-full md:w-auto">
           <button 
             className="w-full md:w-auto h-11 md:h-14 px-6 md:px-8 bg-white border border-gray-100 rounded-xl md:rounded-2xl font-semibold text-[10px] md:text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export directory
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0 pb-12">
         <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white rounded-2xl md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <div className="p-4 md:p-8 border-b border-gray-50 bg-white">
                  <div className="relative group max-w-md w-full">
                     <Search size={18} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                     <input 
                       type="text" 
                       placeholder="Search participants..." 
                       className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-[10px] md:text-xs"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>

               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left min-w-[800px] md:min-w-[1000px]">
                     <thead className="bg-gray-50/50 text-gray-400 text-[10px] md:text-xs font-semibold tracking-tight border-b border-gray-50">
                        <tr>
                           <th className="px-6 md:px-10 py-6 md:py-8">Participant info</th>
                           <th className="px-4 py-6 md:py-8">Role / tier</th>
                           <th className="px-4 py-6 md:py-8">Account status</th>
                           <th className="px-4 py-6 md:py-8">KYC documents</th>
                           <th className="px-6 md:px-10 py-6 md:py-8 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                          <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                             <td className="px-6 md:px-10 py-6 md:py-8">
                                <div className="flex items-center gap-3 md:gap-6">
                                   <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-100 rounded-lg md:rounded-2xl flex items-center justify-center text-primary font-bold text-base md:text-xl shadow-inner group-hover:bg-primary group-hover:text-white transition-all">
                                      {(user.fullName || 'U')[0]}
                                   </div>
                                   <div className="min-w-0">
                                      <h4 className="font-bold text-gray-900 text-[10px] md:text-sm truncate max-w-[150px] md:max-w-[200px] leading-tight mb-0.5 md:mb-1">{user.fullName || 'Anonymous User'}</h4>
                                      <div className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-medium text-gray-400 tracking-tight truncate max-w-[180px]">
                                         <Mail size={12} className="shrink-0" /> {user.email}
                                      </div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-4 py-6 md:py-8">
                                <div className="flex flex-col gap-1 md:gap-1.5">
                                   <span className={cn(
                                     "px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-xs font-semibold tracking-tight border w-fit capitalize",
                                     user.role === 'admin' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                                     user.role === 'manager' ? "bg-orange-50 text-orange-600 border-orange-100" : 
                                     "bg-gray-50 text-gray-600 border-gray-100"
                                   )}>
                                      {user.role || 'Staff'}
                                   </span>
                                   <span className="text-[8px] md:text-xs font-semibold text-gray-300 tracking-tight px-1 uppercase">Standard plan</span>
                                </div>
                             </td>
                             <td className="px-4 py-6 md:py-8">
                                <div className={cn(
                                  "inline-flex items-center gap-1 px-2.5 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-semibold tracking-tight border shadow-sm",
                                  user.isVerified ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-400"
                                )}>
                                   {user.isVerified ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                                   {user.isVerified ? 'Verified' : 'Pending'}
                                </div>
                             </td>
                             <td className="px-4 py-6 md:py-8">
                                {user.kycDocument ? (
                                  <a 
                                    href={user.kycDocument} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2.5 md:px-4 py-1.5 md:py-2 bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg md:rounded-xl transition-all text-[9px] md:text-xs font-semibold tracking-tight border border-transparent hover:border-primary/10"
                                  >
                                     <Download size={14} /> KYC Docs
                                  </a>
                                ) : (
                                  <span className="text-gray-300 text-[9px] md:text-xs font-semibold tracking-tight ml-2 md:ml-4">No documents</span>
                                )}
                             </td>
                             <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                                <div className="flex items-center justify-end gap-1.5 md:gap-2">
                                   {!user.isVerified && (
                                     <button 
                                       onClick={() => handleVerify(user.id, true)}
                                       className="p-1.5 md:p-2 bg-white border border-gray-100 text-gray-400 hover:text-green-500 rounded-lg shadow-sm"
                                       title="Verify User"
                                     >
                                        <UserCheck size={16} />
                                     </button>
                                   )}
                                   <button className="p-1.5 md:p-2 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-lg shadow-sm">
                                      <Settings size={16} />
                                   </button>
                                   <button className="p-1.5 md:p-2 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-lg shadow-sm">
                                      <Lock size={16} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                        )) : (
                          <tr>
                             <td colSpan={5} className="py-24 md:py-32 text-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                                   <Users size={40} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 tracking-tight">No participants found</h3>
                             </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-6 md:space-y-10">
            <div className="bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl shadow-gray-400/20">
               <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 tracking-tight">Security policies</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 flex justify-between items-center">
                     <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400">Password expiry</span>
                     <span className="text-[10px] md:text-xs font-bold">90 Days</span>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 flex justify-between items-center">
                     <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-gray-400">Session timeout</span>
                     <span className="text-[10px] md:text-xs font-bold">30 Min</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 p-6 md:p-10 shadow-xl shadow-gray-200/50">
               <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight flex items-center gap-3">
                  <Activity size={20} className="text-primary" /> Audit logs
               </h3>
               <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 text-[10px] md:text-xs font-medium text-gray-400">
                     <div className="w-2 h-2 bg-green-500 rounded-full" />
                     <span className="truncate">Admin login from 192.168.1.1</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] md:text-xs font-medium text-gray-400">
                     <div className="w-2 h-2 bg-amber-500 rounded-full" />
                     <span className="truncate">Category updated by Manager</span>
                  </div>
               </div>
               <button className="w-full mt-8 md:mt-10 py-4 bg-gray-50 text-gray-900 rounded-xl md:rounded-2xl font-semibold text-xs tracking-tight hover:bg-gray-100 transition-all border border-gray-100">
                  Full audit trail
               </button>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
}
