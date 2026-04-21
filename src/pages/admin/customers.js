import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db as firestore } from '@/admin/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
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
  X,
  Check,
  Edit2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminCustomers = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    tenants: 0,
    owners: 0,
    agents: 0,
    verified: 0,
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [userInsights, setUserInsights] = useState({});

  const roles = [
    { id: 'all', label: 'All Users' },
    { id: 'tenant', label: 'Tenants' },
    { id: 'owner', label: 'Owners' },
    { id: 'agent', label: 'Agents' },
  ];

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUserInsights = async (userList) => {
    try {
      const insights = {};
      const propsSnap = await getDocs(collection(firestore, 'properties'));
      const allProps = propsSnap.docs.map(d => d.data());
      
      userList.forEach(user => {
        if (user.role === 'owner' || user.role === 'agent') {
          insights[user.id] = {
            type: 'listings',
            count: allProps.filter(p => p.ownerId === user.id || p.agentId === user.id).length
          };
        } else if (user.role === 'tenant') {
          insights[user.id] = {
            type: 'bookings',
            count: 0 
          };
        }
      });
      setUserInsights(insights);
    } catch (error) {
      console.error("Error fetching user insights:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const q = collection(firestore, 'users');
      const snap = await getDocs(q);
      let fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (activeTab !== 'all') {
        fetched = fetched.filter(u => u.role === activeTab);
      }

      fetched.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setUsers(fetched);
      fetchUserInsights(fetched);
      
      setStats({
        total: fetched.length,
        tenants: fetched.filter(u => u.role === 'tenant').length,
        owners: fetched.filter(u => u.role === 'owner').length,
        agents: fetched.filter(u => u.role === 'agent').length,
        verified: fetched.filter(u => u.kyc_status === 'verified').length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId, updates) => {
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

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editForm) return;
    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', editForm.id), {
        ...editForm,
        updatedAt: new Date()
      });
      setUsers(prev => prev.map(u => u.id === editForm.id ? editForm : u));
      toast.success("User updated successfully");
      setIsEditing(false);
      setSelectedUser(editForm);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
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

  const filteredUsers = users.filter(u => 
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.mobile || '').includes(searchTerm)
  );

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Customer Directory</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <Activity size={14} className="text-[#087c7c]" /> Manage users, roles, and KYC verifications
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => exportToCSV(users, 'relocate_users')}
             className="h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export List
           </button>
           <button className="h-14 px-8 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-2 shadow-xl shadow-[#087c7c]/20 hover:scale-105 active:scale-95 transition-all">
              <UserPlus size={18} /> Create User
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
         {[
           { label: 'Total Users', value: stats.total, color: 'gray' },
           { label: 'Tenants', value: stats.tenants, color: 'blue' },
           { label: 'Owners', value: stats.owners, color: 'primary' },
           { label: 'Agents', value: stats.agents, color: 'amber' },
           { label: 'Verified', value: stats.verified, color: 'green' },
         ].map((s) => (
           <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 text-center">
              <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">{s.label}</p>
              <h4 className={cn(
                "text-2xl font-bold",
                s.color === 'blue' ? "text-blue-500" :
                s.color === 'primary' ? "text-[#087c7c]" :
                s.color === 'amber' ? "text-amber-500" :
                s.color === 'green' ? "text-green-500" : "text-gray-900"
              )}>{s.value}</h4>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-8 bg-white">
           <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-xs font-bold tracking-tight transition-all whitespace-nowrap",
                    activeTab === role.id ? "bg-[#087c7c] text-white shadow-lg shadow-[#087c7c]/20" : "text-gray-400 hover:bg-white hover:text-gray-900"
                  )}
                >
                  {role.label}
                </button>
              ))}
           </div>
           <div className="relative w-full lg:w-96 group">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name, email, or mobile..." 
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none transition-all font-bold text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">User Identity</th>
                    <th className="px-6 py-8">Contact Info</th>
                    <th className="px-6 py-8 text-center">KYC Status</th>
                    <th className="px-6 py-8 text-center">Insights</th>
                    <th className="px-6 py-8 text-center">Role</th>
                    <th className="px-6 py-8">Account Status</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                   <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-[#087c7c] font-bold text-xl shadow-sm border border-gray-100 group-hover:bg-[#087c7c] group-hover:text-white transition-all">
                               {user.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-gray-900 text-sm tracking-tight truncate max-w-[200px] leading-tight mb-1">{user.fullName || 'Anonymous'}</h4>
                               <p className="text-xs font-bold text-gray-400 tracking-tight">UID: {user.id.slice(0, 10)}</p>
                               <div className="flex items-center gap-2 mt-2">
                                  <Calendar size={10} className="text-gray-300" />
                                  <span className="text-xs font-bold text-gray-300 tracking-tight">Joined: {user.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'Recent'}</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                               <Mail size={12} className="text-[#087c7c]/50" />
                               <span className="text-xs font-bold text-gray-700 truncate max-w-[180px]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <Phone size={12} className="text-[#087c7c]/50" />
                               <span className="text-xs font-bold text-gray-700">{user.mobile || user.phone}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <div className={cn(
                               "px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border shadow-sm",
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
                              <span className="text-lg font-bold text-gray-900">{userInsights[user.id].count}</span>
                              <span className="text-xs font-bold text-gray-400 tracking-tight">{userInsights[user.id].type}</span>
                           </div>
                         ) : (
                           <span className="text-gray-300">-</span>
                         )}
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-xs font-bold tracking-tight border",
                              user.role === 'owner' ? "bg-[#087c7c]/5 border-[#087c7c]/10 text-[#087c7c]" :
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
                                 "w-2 h-2 rounded-full",
                                 user.accountStatus === 'active' || !user.accountStatus ? "bg-green-500" : "bg-red-500"
                               )} />
                               <span className="text-xs font-bold text-gray-700">{user.accountStatus || 'active'}</span>
                            </div>
                            <p className="text-xs font-bold text-gray-300 tracking-tight">Last active: Today</p>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(user.id, { kyc_status: 'verified' })}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-100 rounded-xl shadow-sm transition-all"
                              title="Verify KYC"
                            >
                               <UserCheck size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(user.id, { kyc_status: 're-kyc' })}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-amber-500 hover:border-amber-100 rounded-xl shadow-sm transition-all"
                              title="Request Re-KYC"
                            >
                               <ShieldAlert size={18} />
                            </button>
                            {user.accountStatus === 'suspended' ? (
                              <button 
                                onClick={() => handleStatusUpdate(user.id, { accountStatus: 'active' })}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all"
                                title="Unsuspend"
                              >
                                 <Unlock size={18} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusUpdate(user.id, { accountStatus: 'suspended' })}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-xl shadow-sm transition-all"
                                title="Suspend Account"
                              >
                                 <Lock size={18} />
                              </button>
                            )}
                            <div className="w-px h-8 bg-gray-100 mx-1" />
                            <button 
                              onClick={() => { setSelectedUser(user); setIsEditing(false); }}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all"
                              title="View full profile"
                            >
                               <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => { setSelectedUser(user); setIsEditing(true); setEditForm(user); }}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-xl shadow-sm transition-all"
                              title="Edit user"
                            >
                               <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 rounded-xl shadow-sm transition-all"
                              title="Remove user"
                            >
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 )) : (
                   <tr>
                      <td colSpan={7} className="py-32 text-center">
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <Users size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight uppercase">No users found</h3>
                         <p className="text-gray-400 max-w-xs mx-auto text-xs font-bold leading-relaxed tracking-tight">
                            Try adjusting your filters or searching for another user.
                         </p>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        <div className="p-8 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
           <p className="text-xs font-bold text-gray-400 tracking-tight">Showing {filteredUsers.length} of {stats.total} total users</p>
           <div className="flex gap-2">
              <button className="p-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-[#087c7c] hover:text-white transition-all"><ChevronLeft size={16} /></button>
              <button className="p-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-[#087c7c] hover:text-white transition-all"><ChevronRight size={16} /></button>
           </div>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {isEditing ? 'Edit User Profile' : selectedUser.fullName || 'User Profile'}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 tracking-tight mt-1">UID: {selectedUser.id}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    {!isEditing && (
                      <button 
                        onClick={() => { setIsEditing(true); setEditForm(selectedUser); }}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs tracking-tight hover:bg-black transition-all flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit Mode
                      </button>
                    )}
                    <button onClick={() => { setSelectedUser(null); setIsEditing(false); }} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={32} /></button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 {isEditing ? (
                   <form onSubmit={handleUpdateUser} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Full Name</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.fullName || ''}
                              onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Email Address</label>
                            <input 
                              type="email" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Mobile Number</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.mobile || editForm.phone || ''}
                              onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">User Role</label>
                            <div className="relative group">
                               <select 
                                 className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                 value={editForm.role || 'tenant'}
                                 onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                               >
                                  <option value="tenant">Tenant</option>
                                  <option value="owner">Owner</option>
                                  <option value="agent">Agent</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Occupation</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.occupation || ''}
                              onChange={(e) => setEditForm({...editForm, occupation: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">KYC Status</label>
                            <div className="relative group">
                               <select 
                                 className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                 value={editForm.kyc_status || 'unverified'}
                                 onChange={(e) => setEditForm({...editForm, kyc_status: e.target.value})}
                               >
                                  <option value="unverified">Unverified</option>
                                  <option value="pending">Pending</option>
                                  <option value="verified">Verified</option>
                                  <option value="rejected">Rejected</option>
                                  <option value="re-kyc">Re-KYC Requested</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                            </div>
                         </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Full Address</label>
                            <textarea 
                              rows={3}
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm resize-none"
                              value={editForm.address || ''}
                              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="flex justify-end gap-4">
                         <button 
                           type="button"
                           onClick={() => setIsEditing(false)}
                           className="px-8 py-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:bg-gray-50 transition-all"
                         >
                            Cancel
                         </button>
                         <button 
                           type="submit"
                           disabled={saving}
                           className="px-10 py-4 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight shadow-xl shadow-[#087c7c]/20 hover:bg-[#087c7c]/90 transition-all flex items-center gap-2"
                         >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            {saving ? 'Saving changes...' : 'Save User Profile'}
                         </button>
                      </div>
                   </form>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-10">
                         <div className="flex items-center gap-8">
                            <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-[#087c7c] font-bold text-4xl shadow-md border border-gray-100">
                               {selectedUser.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="space-y-2">
                               <div className="flex items-center gap-3">
                                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedUser.fullName}</h3>
                                  <span className={cn(
                                    "px-3 py-1 rounded-lg text-xs font-bold tracking-tight border",
                                    selectedUser.role === 'owner' ? "bg-[#087c7c]/5 border-[#087c7c]/10 text-[#087c7c]" :
                                    selectedUser.role === 'agent' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                    "bg-blue-50 border-blue-100 text-blue-600"
                                  )}>
                                     {selectedUser.role}
                                  </span>
                               </div>
                               <p className="text-gray-400 font-bold flex items-center gap-2 text-xs">
                                  <Mail size={16} /> {selectedUser.email}
                               </p>
                               <p className="text-gray-400 font-bold flex items-center gap-2 text-xs">
                                  <Phone size={16} /> {selectedUser.mobile || selectedUser.phone}
                               </p>
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                            <div className="space-y-6">
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight">Personal Details</h4>
                               <div className="space-y-4">
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#087c7c]"><Activity size={18} /></div>
                                     <div>
                                        <p className="text-xs font-bold text-gray-400 tracking-tight">Occupation</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedUser.occupation || 'Not specified'}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#087c7c]"><MapPin size={18} /></div>
                                     <div>
                                        <p className="text-xs font-bold text-gray-400 tracking-tight">Address</p>
                                        <p className="text-sm font-bold text-gray-900">{selectedUser.address || 'No address provided'}</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-6">
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight">Platform Insights</h4>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                                     <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">
                                        {selectedUser.role === 'tenant' ? 'Properties Booked' : 'Properties Listed'}
                                     </p>
                                     <p className="text-2xl font-bold text-gray-900">{userInsights[selectedUser.id]?.count || 0}</p>
                                  </div>
                                  <div className="p-4 bg-gray-50 rounded-2xl text-center border border-gray-100">
                                     <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">KYC Status</p>
                                     <p className={cn(
                                       "text-xs font-bold tracking-tight",
                                       selectedUser.kyc_status === 'verified' ? "text-green-500" : "text-amber-500"
                                     )}>{selectedUser.kyc_status || 'Unverified'}</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-gray-50">
                            <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-6">User Activity Timeline</h4>
                            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                               <div className="relative">
                                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-[#087c7c] border-4 border-white shadow-sm" />
                                  <p className="text-xs font-bold text-gray-900">Account created on Relocate platform</p>
                                  <p className="text-xs text-gray-400 mt-1 font-semibold">{selectedUser.createdAt?.toDate ? new Date(selectedUser.createdAt.toDate()).toLocaleDateString() : 'Recent'}</p>
                               </div>
                               <div className="relative">
                                  <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-gray-200 border-4 border-white shadow-sm" />
                                  <p className="text-xs font-bold text-gray-900">Last profile update by user</p>
                                  <p className="text-xs text-gray-400 mt-1 font-semibold">{selectedUser.updatedAt?.toDate ? new Date(selectedUser.updatedAt.toDate()).toLocaleDateString() : 'Never'}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                               <ShieldCheck size={16} className="text-[#087c7c]" /> Moderation Center
                            </h3>
                            <div className="space-y-4">
                               {selectedUser.kyc_status !== 'verified' && (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedUser.id, { kyc_status: 'verified' }); setSelectedUser(null); }}
                                   className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                 >
                                    <UserCheck size={16} /> Approve KYC
                                 </button>
                               )}
                               <button 
                                 onClick={() => { handleStatusUpdate(selectedUser.id, { kyc_status: 're-kyc' }); setSelectedUser(null); }}
                                 className="w-full py-4 bg-white text-amber-600 border-2 border-amber-50 rounded-2xl font-bold text-xs tracking-tight hover:bg-amber-50 transition-all flex items-center justify-center gap-2"
                               >
                                  <ShieldAlert size={16} /> Request Re-KYC
                               </button>
                               <div className="w-full h-px bg-gray-200 my-4" />
                               {selectedUser.accountStatus === 'suspended' ? (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedUser.id, { accountStatus: 'active' }); setSelectedUser(null); }}
                                   className="w-full py-4 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-[#087c7c]/90 transition-all shadow-lg shadow-[#087c7c]/20 flex items-center justify-center gap-2"
                                 >
                                    <Unlock size={16} /> Reactivate Account
                                 </button>
                               ) : (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedUser.id, { accountStatus: 'suspended' }); setSelectedUser(null); }}
                                   className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                 >
                                    <Lock size={16} /> Suspend User
                                 </button>
                               )}
                               <button 
                                 onClick={() => { handleDeleteUser(selectedUser.id); setSelectedUser(null); }}
                                 className="w-full py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                               >
                                  <UserX size={16} /> Remove Permanently
                               </button>
                            </div>
                         </div>
                         
                         <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                            <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-4">Account Security</h4>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><ShieldCheck size={18} className="text-green-500" /></div>
                               <div>
                                  <p className="text-xs font-bold text-gray-400 tracking-tight">Auth Method</p>
                                  <p className="text-xs font-bold text-gray-900">Email & Password</p>
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
    </AdminLayout>
  );
};

export default AdminCustomers;
