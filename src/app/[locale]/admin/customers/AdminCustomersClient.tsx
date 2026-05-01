'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, deleteDoc, orderBy, limit, onSnapshot, addDoc, QueryConstraint, getCountFromServer } from 'firebase/firestore';
import { getPaginatedData } from '@/lib/firestore-pagination';
import Pagination from '@/components/Pagination';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userValidationSchema, UserFormData } from '@/lib/validations/user';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Download, 
  Plus, 
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowUpRight,
  Loader2,
  Lock,
  Unlock,
  Activity,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Edit2,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminCustomersClient() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const pageSize = 10;
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const editForm = useForm<UserFormData>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      role: 'tenant',
      kyc_status: 'unverified',
      accountStatus: 'active'
    }
  });

  const createForm = useForm<UserFormData>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      role: 'tenant',
      kyc_status: 'unverified',
      accountStatus: 'active'
    }
  });

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', selectedUser.id), {
        ...data,
        updatedAt: new Date()
      });
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...data } : u));
      toast.success("User updated successfully");
      setIsEditing(false);
      setSelectedUser({ ...selectedUser, ...data });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (data: UserFormData) => {
     setSaving(true);
     try {
       await addDoc(collection(firestore, 'users'), {
         ...data,
         createdAt: new Date(),
         updatedAt: new Date()
       });
       
       toast.success("User created successfully");
       setIsCreating(false);
       createForm.reset();
       fetchUsers(true);
     } catch (error) {
       console.error("Error creating user:", error);
       toast.error("Failed to create user");
     } finally {
       setSaving(false);
     }
   };

  const [saving, setSaving] = useState(false);
  const [userInsights, setUserInsights] = useState<any>({});
  const [stats, setStats] = useState({
    total: 0,
    tenants: 0,
    owners: 0,
    agents: 0,
    verified: 0
  });

  const roles = [
    { id: 'all', label: 'All Users' },
    { id: 'tenant', label: 'Tenants' },
    { id: 'owner', label: 'Owners' },
    { id: 'agent', label: 'Agents' },
  ];

  // Fetch users with pagination
  const fetchUsers = async (isNext = true) => {
    setLoading(true);
    try {
      const filters: QueryConstraint[] = [];
      if (activeTab !== 'all') {
        filters.push(where('role', '==', activeTab));
      }

      const result = await getPaginatedData<any>({
        collectionName: 'users',
        pageSize,
        lastVisible: isNext ? lastVisible : (history[page - 2] || null),
        filters
      });

      setUsers(result.data);
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
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics using getCountFromServer for efficiency
  const fetchStats = async () => {
    try {
      const collRef = collection(firestore, 'users');
      
      const [
        totalSnap, 
        tenantSnap, 
        ownerSnap, 
        agentSnap, 
        verifiedSnap
      ] = await Promise.all([
        getCountFromServer(collRef),
        getCountFromServer(query(collRef, where('role', '==', 'tenant'))),
        getCountFromServer(query(collRef, where('role', '==', 'owner'))),
        getCountFromServer(query(collRef, where('role', '==', 'agent'))),
        getCountFromServer(query(collRef, where('kyc_status', '==', 'verified')))
      ]);

      setStats({
        total: totalSnap.data().count,
        tenants: tenantSnap.data().count,
        owners: ownerSnap.data().count,
        agents: agentSnap.data().count,
        verified: verifiedSnap.data().count
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    setPage(1);
    setLastVisible(null);
    setHistory([]);
    fetchUsers(true);
    fetchStats();
  }, [activeTab]);

  // Insights calculation for the visible users
  useEffect(() => {
    if (users.length === 0) return;

    const fetchInsights = async () => {
      try {
        const allPropsSnap = await getDocs(collection(firestore, 'properties'));
        const allProps = allPropsSnap.docs.map(d => d.data());
        
        const ownerCountMap: any = {};
        const agentCountMap: any = {};
        
        allProps.forEach(p => {
          if (p.ownerId) ownerCountMap[p.ownerId] = (ownerCountMap[p.ownerId] || 0) + 1;
          if (p.agentId) agentCountMap[p.agentId] = (agentCountMap[p.agentId] || 0) + 1;
        });

        const insights: any = {};
        users.forEach(user => {
          if (user.role === 'owner') {
            insights[user.id] = { type: 'listings', count: ownerCountMap[user.id] || 0 };
          } else if (user.role === 'agent') {
            insights[user.id] = { type: 'listings', count: agentCountMap[user.id] || 0 };
          } else {
            insights[user.id] = { type: 'bookings', count: 0 };
          }
        });
        
        setUserInsights(insights);
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    fetchInsights();
  }, [users]);

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently remove this user?")) return;
    try {
      await deleteDoc(doc(firestore, 'users', userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success("User removed permanently");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleStatusUpdate = async (userId: string, updates: any) => {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        ...updates,
        updatedAt: new Date()
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
      toast.success("User account updated");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 p-4 md:p-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Customer directory</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <Activity size={14} className="text-primary" /> Manage users, roles, and KYC verifications
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <button 
             onClick={() => exportToCSV(users, 'relocate_users')}
             className="h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export list
           </button>
           <button 
             onClick={() => setIsCreating(true)}
             className="h-14 px-8 bg-primary text-white rounded-2xl font-bold text-xs tracking-tight flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
           >
              <UserPlus size={18} /> Create user
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
         {[
           { label: 'Total users', value: stats.total, color: 'gray' },
           { label: 'Tenants', value: stats.tenants, color: 'blue' },
           { label: 'Owners', value: stats.owners, color: 'primary' },
           { label: 'Agents', value: stats.agents, color: 'amber' },
           { label: 'Verified', value: stats.verified, color: 'green' },
         ].map((s) => (
           <div key={s.label} className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 text-center flex flex-col justify-center min-w-0">
              <p className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest mb-1 uppercase truncate">{s.label}</p>
              <h4 className={cn(
                "text-xl md:text-2xl font-black truncate",
                s.color === 'blue' ? "text-blue-500" :
                s.color === 'primary' ? "text-primary" :
                s.color === 'amber' ? "text-amber-500" :
                s.color === 'green' ? "text-green-500" : "text-gray-900"
              )}>{s.value}</h4>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12 mx-4 md:mx-0">
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white">
           <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={cn(
                    "px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeTab === role.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-white hover:text-gray-900"
                  )}
                >
                  {role.label}
                </button>
              ))}
           </div>
           <div className="relative w-full lg:w-96 group">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-16 pr-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-[10px] md:text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
           <table className="w-full text-left min-w-[1100px]">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">User identity</th>
                    <th className="px-6 py-8">Contact info</th>
                    <th className="px-6 py-8 text-center">KYC status</th>
                    <th className="px-6 py-8 text-center">Insights</th>
                    <th className="px-6 py-8 text-center">Role</th>
                    <th className="px-6 py-8">Account status</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {users.length > 0 ? users.map((user) => (
                   <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-black text-xl shadow-sm border border-gray-50 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                               {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-gray-900 text-sm tracking-tight truncate max-w-[200px] leading-tight mb-1">{user.fullName || user.name || 'Anonymous'}</h4>
                               <p className="text-[9px] font-black text-gray-300 uppercase tracking-tight">UID: {user.id.slice(0, 10)}</p>
                               <div className="flex items-center gap-2 mt-2">
                                  <Calendar size={10} className="text-gray-300 shrink-0" />
                                  <span className="text-[10px] font-bold text-gray-300 tracking-tight uppercase">Joined: {user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : (user.created_at?.toDate ? new Date(user.created_at.toDate()).toLocaleDateString() : 'Recent')}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                               <Mail size={12} className="text-primary/50 shrink-0" />
                               <span className="text-[10px] font-bold text-gray-700 truncate max-w-[180px]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Phone size={12} className="text-primary/50 shrink-0" />
                               <span className="text-[10px] font-bold text-gray-700">{user.mobile}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <div className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm",
                              user.kyc_status === 'verified' ? "bg-green-50 border-green-100 text-green-600" :
                              user.kyc_status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                              "bg-red-50 border-red-100 text-red-600"
                            )}>
                               {user.kyc_status || 'unverified'}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         {userInsights[user.id] ? (
                           <div className="flex flex-col items-center">
                              <span className="text-base font-black text-gray-900">{userInsights[user.id].count}</span>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">{userInsights[user.id].type}</span>
                           </div>
                         ) : (
                           <span className="text-gray-300">-</span>
                         )}
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <span className={cn(
                              "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                              user.role === 'owner' ? "bg-primary/5 border-primary/10 text-primary" :
                              user.role === 'agent' ? "bg-amber-50 border-amber-100 text-amber-600" :
                              user.role === 'staff' ? "bg-purple-50 border-purple-100 text-purple-600" :
                              "bg-blue-50 border-blue-100 text-blue-600"
                            )}>
                               {user.role}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <div className={cn(
                                 "w-1.5 h-1.5 rounded-full shrink-0",
                                 user.accountStatus === 'active' || !user.accountStatus ? "bg-green-500" : "bg-red-500"
                               )} />
                               <span className="text-[10px] font-black uppercase text-gray-700">{user.accountStatus || 'active'}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(user.id, { kyc_status: 'verified' })}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-100 rounded-lg shadow-sm transition-all"
                              title="Verify KYC"
                            >
                               <UserCheck size={16} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(user.id, { kyc_status: 're-kyc' })}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-amber-500 hover:border-amber-100 rounded-lg shadow-sm transition-all"
                              title="Request Re-KYC"
                            >
                               <ShieldAlert size={16} />
                            </button>
                            {user.accountStatus === 'suspended' ? (
                              <button 
                                onClick={() => handleStatusUpdate(user.id, { accountStatus: 'active' })}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg shadow-sm transition-all"
                                title="Unsuspend"
                              >
                                 <Unlock size={16} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusUpdate(user.id, { accountStatus: 'suspended' })}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-lg shadow-sm transition-all"
                                title="Suspend Account"
                              >
                                 <Lock size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => { setSelectedUser(user); setIsEditing(false); }}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg shadow-sm transition-all"
                              title="View"
                            >
                               <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setIsEditing(true); editForm.reset(user); }}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-lg shadow-sm transition-all"
                              title="Edit"
                            >
                               <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 rounded-lg shadow-sm transition-all"
                              title="Delete"
                            >
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={7} className="py-32 text-center">
                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <Users size={32} />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-widest">No users found</h3>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             Showing {users.length} of {total} total users
           </p>
           <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    fetchUsers(false);
                  }
                }}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  if (users.length === pageSize) {
                    setPage(page + 1);
                    fetchUsers(true);
                  }
                }}
                disabled={users.length < pageSize}
                className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
              >
                Next
              </button>
           </div>
        </div>
      </div>

      {/* User Detail / Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-5 md:p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
                      {isEditing ? 'Edit user profile' : selectedUser.fullName || 'User profile'}
                    </h2>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight mt-1 truncate max-w-[200px] md:max-w-none uppercase">UID: {selectedUser.id}</p>
                 </div>
                 <div className="flex items-center gap-2 md:gap-4">
                    {!isEditing && (
                      <button 
                      onClick={() => { 
                        setIsEditing(true); 
                        editForm.reset(selectedUser); 
                      }}
                      className="hidden sm:flex px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs tracking-tight hover:bg-black transition-all items-center gap-2 uppercase"
                    >
                      <Edit2 size={14} /> Edit mode
                    </button>
                    )}
                    <button onClick={() => { setSelectedUser(null); setIsEditing(false); }} className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
                 {isEditing ? (
                   <form onSubmit={editForm.handleSubmit(handleUpdateUser)} className="space-y-8 md:space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Full name</label>
                            <input 
                              {...editForm.register('fullName')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            />
                            {editForm.formState.errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{editForm.formState.errors.fullName.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Email address</label>
                            <input 
                              {...editForm.register('email')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            />
                            {editForm.formState.errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{editForm.formState.errors.email.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Mobile number</label>
                            <input 
                              {...editForm.register('mobile')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            />
                            {editForm.formState.errors.mobile && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{editForm.formState.errors.mobile.message}</p>}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">User role</label>
                            <div className="relative group">
                               <select 
                                 {...editForm.register('role')}
                                 className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                               >
                                  <option value="tenant">Tenant</option>
                                  <option value="owner">Owner</option>
                                  <option value="agent">Agent</option>
                                  <option value="staff">Staff</option>
                                  <option value="manager">Manager</option>
                                  <option value="admin">Admin</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Occupation</label>
                            <input 
                              {...editForm.register('occupation')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">KYC status</label>
                            <div className="relative group">
                               <select 
                                 {...editForm.register('kyc_status')}
                                 className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                               >
                                  <option value="unverified">Unverified</option>
                                  <option value="pending">Pending</option>
                                  <option value="verified">Verified</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="re-kyc">Re-KYC requested</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                            </div>
                         </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Full address</label>
                            <textarea 
                              rows={3}
                              {...editForm.register('address')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm resize-none"
                            />
                         </div>
                      </div>

                      <div className="flex justify-end gap-3 md:gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-50">
                         <button 
                           type="button"
                           onClick={() => setIsEditing(false)}
                           className="px-6 py-3 md:px-8 md:py-4 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight text-gray-400 hover:bg-gray-50 transition-all uppercase"
                         >
                            Cancel
                         </button>
                         <button 
                           type="submit"
                           disabled={saving}
                           className="px-8 py-3 md:px-10 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2 uppercase"
                         >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            {saving ? 'Saving...' : 'Save details'}
                         </button>
                      </div>
                   </form>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                      {/* Left: User Overview */}
                      <div className="lg:col-span-2 space-y-8 md:space-y-10">
                         <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-primary font-bold text-3xl md:text-4xl shadow-md border border-gray-100 shrink-0">
                               {selectedUser.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="space-y-2 md:space-y-3">
                               <div className="flex flex-col sm:flex-row items-center gap-3">
                                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{selectedUser.fullName}</h3>
                                  <span className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-bold tracking-tight border uppercase",
                                    selectedUser.role === 'owner' ? "bg-primary/5 border-primary/10 text-primary" :
                                    selectedUser.role === 'agent' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                    "bg-blue-50 border-blue-100 text-blue-600"
                                  )}>
                                     {selectedUser.role}
                                  </span>
                               </div>
                               <div className="flex flex-col gap-1.5 md:gap-2">
                                  <p className="text-gray-400 font-bold text-xs flex items-center justify-center sm:justify-start gap-2">
                                     <Mail size={14} className="text-primary/50" /> {selectedUser.email}
                                  </p>
                                  <p className="text-gray-400 font-bold text-xs flex items-center justify-center sm:justify-start gap-2">
                                     <Phone size={14} className="text-primary/50" /> {selectedUser.mobile}
                                  </p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-gray-50">
                            <div className="space-y-4 md:space-y-6">
                               <h4 className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Personal details</h4>
                               <div className="space-y-3 md:space-y-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary shrink-0"><Activity size={18} /></div>
                                     <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Occupation</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900 truncate">{selectedUser.occupation || 'Not specified'}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary shrink-0"><MapPin size={18} /></div>
                                     <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Address</p>
                                        <p className="text-xs md:text-sm font-bold text-gray-900 line-clamp-2">{selectedUser.address || 'No address provided'}</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-4 md:space-y-6">
                               <h4 className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Platform insights</h4>
                               <div className="grid grid-cols-2 gap-3 md:gap-4">
                                  <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl text-center border border-gray-100">
                                     <p className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-tight mb-1 uppercase">
                                        {selectedUser.role === 'tenant' ? 'Bookings' : 'Listings'}
                                     </p>
                                     <p className="text-xl md:text-2xl font-black text-gray-900">{userInsights[selectedUser.id]?.count || 0}</p>
                                  </div>
                                  <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl text-center border border-gray-100">
                                     <p className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-tight mb-1 uppercase">KYC Status</p>
                                     <p className={cn(
                                       "text-[10px] md:text-xs font-black tracking-tight uppercase",
                                       selectedUser.kyc_status === 'verified' ? "text-green-500" : "text-amber-500"
                                     )}>{selectedUser.kyc_status || 'Unverified'}</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="pt-6 md:pt-8 border-t border-gray-50">
                            <h4 className="text-[10px] font-bold text-gray-400 tracking-tight mb-4 md:mb-6 uppercase">User activity timeline</h4>
                            <div className="relative pl-8 space-y-6 md:space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                               <div className="relative">
                                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-primary border-4 border-white shadow-sm" />
                                  <p className="text-xs font-bold text-gray-900 uppercase">Account created on platform</p>
                                  <p className="text-[10px] text-gray-400 mt-1 uppercase">{selectedUser.createdAt?.toDate ? new Date(selectedUser.createdAt.toDate()).toLocaleDateString() : 'Recent'}</p>
                               </div>
                               <div className="relative">
                                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-gray-200 border-4 border-white shadow-sm" />
                                  <p className="text-xs font-bold text-gray-900 uppercase">Last profile update</p>
                                  <p className="text-[10px] text-gray-400 mt-1 uppercase">{selectedUser.updatedAt?.toDate ? new Date(selectedUser.updatedAt.toDate()).toLocaleDateString() : 'Never'}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Right: Moderation Controls */}
                      <div className="space-y-6 md:space-y-8">
                         <div className="bg-gray-50 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100">
                            <h3 className="text-[10px] font-bold text-gray-900 tracking-tight mb-4 md:mb-6 flex items-center gap-2 uppercase">
                               <ShieldCheck size={14} className="text-primary" /> Moderation center
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                               {selectedUser.kyc_status !== 'verified' && (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedUser.id, { kyc_status: 'verified' }); setSelectedUser(null); }}
                                   className="w-full py-3 md:py-4 bg-green-500 text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 uppercase"
                                 >
                                    <UserCheck size={16} /> Approve KYC
                                 </button>
                               )}
                               <button 
                                 onClick={() => { handleStatusUpdate(selectedUser.id, { kyc_status: 're-kyc' }); setSelectedUser(null); }}
                                 className="w-full py-3 md:py-4 bg-white text-amber-600 border-2 border-amber-50 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-amber-50 transition-all flex items-center justify-center gap-2 uppercase"
                               >
                                  <ShieldAlert size={16} /> Request Re-KYC
                               </button>
                               <div className="w-full h-px bg-gray-200 my-2 md:my-4" />
                               {selectedUser.accountStatus === 'suspended' ? (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedUser.id, { accountStatus: 'active' }); setSelectedUser(null); }}
                                   className="w-full py-3 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 uppercase"
                                 >
                                    <Unlock size={16} /> Reactivate account
                                 </button>
                               ) : (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedUser.id, { accountStatus: 'suspended' }); setSelectedUser(null); }}
                                   className="w-full py-3 md:py-4 bg-red-50 text-red-500 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-red-100 transition-all flex items-center justify-center gap-2 uppercase"
                                 >
                                    <Lock size={16} /> Suspend user
                                 </button>
                               )}
                               <button 
                                 onClick={() => { handleDeleteUser(selectedUser.id); setSelectedUser(null); }}
                                 className="w-full py-3 md:py-4 bg-white text-red-600 border-2 border-red-50 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-red-50 transition-all flex items-center justify-center gap-2 uppercase"
                               >
                                  <UserX size={16} /> Remove permanently
                               </button>
                            </div>
                         </div>
                         
                         <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                            <h4 className="text-[10px] font-bold text-gray-400 tracking-tight mb-3 md:mb-4 uppercase">Account security</h4>
                            <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0"><ShieldCheck size={18} className="text-green-500" /></div>
                               <div className="min-w-0">
                                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 tracking-tight uppercase">Auth method</p>
                                  <p className="text-[10px] md:text-xs font-black text-gray-900 truncate">Email & password</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
      {/* Create User Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-3xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-5 md:p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">Create new user</h2>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight mt-1">Add a new member to the Relocate platform</p>
                 </div>
                 <button onClick={() => setIsCreating(false)} className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
                 <form onSubmit={createForm.handleSubmit(handleCreateUser)} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Full name</label>
                          <input 
                            {...createForm.register('fullName')}
                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            placeholder="e.g. Rahul Sharma"
                          />
                          {createForm.formState.errors.fullName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{createForm.formState.errors.fullName.message}</p>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Email address</label>
                          <input 
                            {...createForm.register('email')}
                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            placeholder="rahul@example.com"
                          />
                          {createForm.formState.errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{createForm.formState.errors.email.message}</p>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Mobile number</label>
                          <input 
                            {...createForm.register('mobile')}
                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                            placeholder="10-digit mobile"
                          />
                          {createForm.formState.errors.mobile && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{createForm.formState.errors.mobile.message}</p>}
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">User role</label>
                          <div className="relative group">
                            <select 
                              {...createForm.register('role')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none cursor-pointer"
                            >
                               <option value="tenant">Tenant</option>
                               <option value="owner">Owner</option>
                               <option value="agent">Agent</option>
                               <option value="staff">Staff</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Password</label>
                          <div className="relative group">
                            <input 
                              type="password"
                              {...createForm.register('password')}
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                              placeholder="Min 6 characters"
                            />
                            <Lock size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {createForm.formState.errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{createForm.formState.errors.password.message}</p>}
                       </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={saving}
                      className="w-full py-4 md:py-5 bg-primary text-white rounded-xl md:rounded-[1.5rem] font-bold text-[10px] md:text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase"
                    >
                       {saving ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                       CREATE USER ACCOUNT
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}
