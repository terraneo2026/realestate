'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, addDoc, deleteDoc, orderBy, onSnapshot, QueryConstraint, getCountFromServer } from 'firebase/firestore';
import { getPaginatedData } from '@/lib/firestore-pagination';
import { 
  Users2, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Download, 
  ShieldCheck,
  ShieldAlert,
  Briefcase,
  MapPin,
  TrendingUp,
  Activity,
  Star,
  Award,
  Loader2,
  Lock,
  Unlock,
  Building2,
  Mail,
  Phone,
  Package,
  Check,
  X,
  Edit2,
  Pause,
  Play,
  UserCheck,
  UserX,
  Layers,
  Map,
  ChevronDown,
  Key
} from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import LocationPicker from '@/components/layout/LocationPicker';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userValidationSchema, UserFormData } from '@/lib/validations/user';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminAgentsClient() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const pageSize = 10;

  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const editForm = useForm<UserFormData>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      role: 'agent',
      kyc_status: 'unverified',
      accountStatus: 'active',
      packageType: 'Internal',
      assignedArea: '',
      city: ''
    }
  });

  const addForm = useForm<UserFormData>({
    resolver: zodResolver(userValidationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      role: 'agent',
      kyc_status: 'unverified',
      accountStatus: 'active',
      packageType: 'Internal',
      assignedArea: '',
      city: ''
    }
  });

  const [saving, setSaving] = useState(false);
  const [agentProperties, setAgentProperties] = useState<any>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    verified: 0,
  });

  const fetchAgents = async (isNext = true) => {
    setLoading(true);
    try {
      const filters: QueryConstraint[] = [where('role', '==', 'agent')];
      
      const result = await getPaginatedData<any>({
        collectionName: 'users',
        pageSize,
        lastVisible: isNext ? lastVisible : (history[page - 2] || null),
        filters
      });

      setAgents(result.data);
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
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const collRef = collection(firestore, 'users');
      const agentQuery = query(collRef, where('role', '==', 'agent'));
      
      const [
        totalSnap,
        activeSnap,
        suspendedSnap,
        verifiedSnap
      ] = await Promise.all([
        getCountFromServer(agentQuery),
        getCountFromServer(query(agentQuery, where('accountStatus', '==', 'active'))),
        getCountFromServer(query(agentQuery, where('accountStatus', '==', 'suspended'))),
        getCountFromServer(query(agentQuery, where('kyc_status', '==', 'verified')))
      ]);

      setStats({
        total: totalSnap.data().count,
        active: activeSnap.data().count,
        suspended: suspendedSnap.data().count,
        verified: verifiedSnap.data().count,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchAgentProperties = async () => {
    try {
      const propsSnap = await getDocs(collection(firestore, 'properties'));
      setAgentProperties(propsSnap.docs.map(d => ({ id: d.id, ...d.data() as any })));
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchAgents(true);
    fetchStats();
    fetchAgentProperties();
  }, []);

  // Simplified property counting logic
  const getAgentPropertyCount = (agentId: string) => {
    if (!Array.isArray(agentProperties)) return 0;
    return agentProperties.filter((p: any) => p.agentId === agentId).length;
  };

  const getAgentProperties = (agentId: string) => {
    if (!Array.isArray(agentProperties)) return [];
    return agentProperties.filter((p: any) => p.agentId === agentId);
  };

  const handleStatusUpdate = async (agentId: string, updates: any) => {
    try {
      await updateDoc(doc(firestore, 'users', agentId), {
        ...updates,
        updatedAt: new Date()
      });
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updates } : a));
      toast.success("Agent profile updated");
      
      // Update stats if accountStatus or kyc_status changed
      if (updates.accountStatus || updates.kyc_status) {
        // Stats are updated via onSnapshot
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Operation failed");
    }
  };

  const handleAddAgent = async (data: UserFormData) => {
    setSaving(true);
    try {
      // 1. Create user via Auth API to ensure Firebase Auth account is created
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
          role: 'agent'
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed');

      // 2. Update the newly created user document with additional fields
      const userId = result.uid;
      const { password, ...updateData } = data;
      await updateDoc(doc(firestore, 'users', userId), {
        ...updateData,
        updatedAt: new Date()
      });
      
      toast.success("New employee added successfully");
      setIsAdding(false);
      addForm.reset();
      fetchAgents(true);
    } catch (error: any) {
      console.error("Error adding agent:", error);
      toast.error(error.message || "Failed to add employee");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (agent: any) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: agent.email })
      });
      if (!response.ok) throw new Error('Reset failed');
      toast.success(`Password reset email sent to ${agent.email}`);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to send reset email");
    }
  };

  const handleUpdateAgent = async (data: UserFormData) => {
    if (!selectedAgent) return;
    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', selectedAgent.id), {
        ...data,
        updatedAt: new Date()
      });
      setAgents(prev => prev.map(a => a.id === selectedAgent.id ? { ...a, ...data } : a));
      toast.success("Agent profile updated successfully");
      setIsEditing(false);
      setSelectedAgent({ ...selectedAgent, ...data });
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!window.confirm("Are you sure you want to permanently remove this agent?")) return;
    try {
      await deleteDoc(doc(firestore, 'users', agentId));
      setAgents(prev => prev.filter(a => a.id !== agentId));
      toast.success("Agent removed permanently");
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Failed to delete agent");
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 px-4 md:px-0">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight truncate uppercase">Internal agents</h1>
          <p className="text-gray-400 mt-2 font-bold tracking-tight text-[10px] md:text-xs flex items-center gap-2 uppercase">
             <Briefcase size={14} className="text-primary shrink-0" /> Manage in-house employees and areas
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
           <button 
             onClick={() => exportToCSV(agents, 'relocate_agents')}
             className="h-12 md:h-14 px-6 md:px-8 bg-white border border-gray-100 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export
           </button>
           <button 
             onClick={() => setIsAdding(true)}
             className="h-12 md:h-14 px-6 md:px-8 bg-primary text-white rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
           >
              <ShieldCheck size={18} /> Add new employee
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 px-4 md:px-0">
         {[
           { label: 'Total agents', value: stats.total, color: 'gray' },
           { label: 'Active', value: stats.active, color: 'green' },
           { label: 'Suspended', value: stats.suspended, color: 'red' },
           { label: 'KYC verified', value: stats.verified, color: 'blue' },
         ].map((s) => (
           <div key={s.label} className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 text-center flex flex-col justify-center min-w-0">
              <p className="text-[9px] md:text-[10px] font-black text-gray-400 tracking-widest mb-1 uppercase truncate">{s.label}</p>
              <h4 className={cn(
                "text-xl md:text-2xl font-black truncate",
                s.color === 'green' ? "text-green-500" :
                s.color === 'red' ? "text-red-500" :
                s.color === 'blue' ? "text-blue-500" : "text-gray-900"
              )}>{s.value}</h4>
           </div>
         ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12 mx-4 md:mx-0">
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white">
           <div className="relative w-full lg:w-96 group">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search employees..." 
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
                    <th className="px-8 py-6">Employee identity</th>
                    <th className="px-6 py-6 text-center">KYC status</th>
                    <th className="px-6 py-6 text-center">Account</th>
                    <th className="px-6 py-6">Location & area</th>
                    <th className="px-6 py-6 text-center">Props</th>
                    <th className="px-6 py-6 text-center">Package</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {agents.length > 0 ? agents.map((agent) => (
                   <tr key={agent.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center text-primary font-black text-lg shadow-sm border border-gray-50 group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                               {agent.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-gray-900 text-xs md:text-sm tracking-tight truncate max-w-[150px] leading-tight mb-0.5">{agent.fullName || 'Anonymous'}</h4>
                               <div className="flex items-center gap-1.5">
                                  <Phone size={10} className="text-primary/50 shrink-0" />
                                  <span className="text-[10px] font-bold text-gray-600 truncate">{agent.mobile || 'No mobile'}</span>
                               </div>
                               <p className="text-[9px] font-black text-gray-300 uppercase mt-0.5">UID: {agent.id.slice(0, 10)}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex justify-center">
                            <div className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm",
                              agent.kyc_status === 'verified' ? "bg-green-50 border-green-100 text-green-600" :
                              agent.kyc_status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                              "bg-red-50 border-red-100 text-red-600"
                            )}>
                               {agent.kyc_status || 'unverified'}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex items-center justify-center gap-2">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              agent.accountStatus === 'active' || !agent.accountStatus ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="text-[10px] font-black uppercase text-gray-700">{agent.accountStatus || 'active'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex flex-col gap-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                               <MapPin size={10} className="text-primary shrink-0" />
                               <span className="text-[10px] font-black uppercase text-gray-700 truncate">{agent.city || 'N/A'}</span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase truncate">Area: {agent.assignedArea || 'Global'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                         <div className="flex flex-col items-center">
                            <span className="text-sm md:text-base font-black text-gray-900">{getAgentPropertyCount(agent.id)}</span>
                            <span className="text-[9px] font-black text-gray-400 uppercase">Props</span>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="flex justify-center">
                            <span className="px-2 py-1 bg-gray-900 text-white rounded-lg text-[9px] font-black uppercase tracking-wider shadow-lg">
                               {agent.packageType || 'Internal'}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            {agent.kyc_status !== 'verified' && (
                              <button 
                                onClick={() => handleStatusUpdate(agent.id, { kyc_status: 'verified' })}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-100 rounded-lg shadow-sm transition-all"
                                title="Approve KYC"
                              >
                                 <UserCheck size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => { setSelectedAgent(agent); setIsEditing(false); }}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg shadow-sm transition-all"
                              title="View"
                            >
                               <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => { setSelectedAgent(agent); setIsEditing(true); editForm.reset(agent); }}
                              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-lg shadow-sm transition-all"
                              title="Edit"
                            >
                               <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAgent(agent.id)}
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
                      <td colSpan={7} className="py-24 md:py-32 text-center">
                         <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                            <Users2 size={32} />
                         </div>
                         <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-widest">No employees found</h3>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
             Showing {agents.length} of {total} total agents
           </p>
           <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1);
                    fetchAgents(false);
                  }
                }}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
              >
                Previous
              </button>
              <button 
                onClick={() => {
                  if (agents.length === pageSize) {
                    setPage(page + 1);
                    fetchAgents(true);
                  }
                }}
                disabled={agents.length < pageSize}
                className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
              >
                Next
              </button>
           </div>
        </div>
      </div>

      {/* Add New Agent Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-2xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-5 md:p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">Add new employee</h2>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight mt-1">Register a new in-house agent</p>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
                <form onSubmit={addForm.handleSubmit(handleAddAgent)} className="space-y-6 md:space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Full name *</label>
                         <input 
                           type="text" 
                           placeholder="e.g. John Doe"
                           className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                           {...addForm.register('fullName')}
                         />
                         {addForm.formState.errors.fullName && (
                            <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">{addForm.formState.errors.fullName.message}</p>
                         )}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Email address *</label>
                         <input 
                           type="email" 
                           placeholder="e.g. john@relocate.biz"
                           className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                           {...addForm.register('email')}
                         />
                         {addForm.formState.errors.email && (
                            <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">{addForm.formState.errors.email.message}</p>
                         )}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Mobile number</label>
                         <input 
                           type="text" 
                           placeholder="e.g. 9876543210"
                           className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                           {...addForm.register('mobile')}
                         />
                         {addForm.formState.errors.mobile && (
                            <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">{addForm.formState.errors.mobile.message}</p>
                         )}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Initial Password *</label>
                         <input 
                           type="password" 
                           placeholder="At least 6 characters"
                           className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                           {...addForm.register('password')}
                         />
                         {addForm.formState.errors.password && (
                            <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">{addForm.formState.errors.password.message}</p>
                         )}
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">City Selection</label>
                         <LocationPicker 
                           locale="en" 
                           onLocationChange={(city) => addForm.setValue('city', city)} 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Assigned area</label>
                         <input 
                           type="text" 
                           placeholder="e.g. OMR, Chennai"
                           className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                           {...addForm.register('assignedArea')}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] md:text-xs font-bold text-gray-400 ml-2 uppercase">Package type</label>
                         <div className="relative group">
                            <select 
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                              {...addForm.register('packageType')}
                            >
                               <option value="Internal">Internal Employee</option>
                               <option value="Premium">Premium Partner</option>
                               <option value="Standard">Standard Broker</option>
                            </select>
                            <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                         </div>
                      </div>
                   </div>

                   <div className="flex justify-end gap-3 md:gap-4 pt-4 sticky bottom-0 bg-white py-4 border-t border-gray-50">
                      <button 
                        type="button"
                        onClick={() => setIsAdding(false)}
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
                         {saving ? 'Creating account...' : 'Add employee'}
                      </button>
                   </div>
                </form>
              </div>
           </div>
        </div>
      )}

      {/* Agent Detail / Edit Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-5 md:p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-xl md:text-3xl font-bold text-gray-900 tracking-tight">
                      {isEditing ? 'Edit employee profile' : selectedAgent.fullName || 'Employee profile'}
                    </h2>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight mt-1 truncate max-w-[150px] sm:max-w-none uppercase">UID: {selectedAgent.id}</p>
                 </div>
                 <div className="flex items-center gap-2 md:gap-4">
                    {isEditing && (
                      <button 
                        onClick={() => handleResetPassword(selectedAgent)}
                        className="hidden sm:flex px-4 py-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl font-bold text-[10px] tracking-tight hover:bg-amber-100 transition-all items-center gap-2 uppercase"
                        type="button"
                      >
                        <Key size={14} /> Reset password
                      </button>
                    )}
                    {!isEditing && (
                      <button 
                        onClick={() => { setIsEditing(true); editForm.reset(selectedAgent); }}
                        className="hidden sm:flex px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-[10px] tracking-tight hover:bg-black transition-all items-center gap-2 uppercase"
                      >
                        <Edit2 size={14} /> Edit mode
                      </button>
                    )}
                    <button onClick={() => { setSelectedAgent(null); setIsEditing(false); }} className="p-2 md:p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar">
                 {isEditing ? (
                   <form onSubmit={editForm.handleSubmit(handleUpdateAgent)} className="space-y-8 md:space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Full name</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                              {...editForm.register('fullName')}
                            />
                            {editForm.formState.errors.fullName && (
                               <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">{editForm.formState.errors.fullName.message}</p>
                            )}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Mobile number</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                              {...editForm.register('mobile')}
                            />
                            {editForm.formState.errors.mobile && (
                               <p className="text-red-500 text-[10px] ml-2 font-bold uppercase">{editForm.formState.errors.mobile.message}</p>
                            )}
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Location (City)</label>
                            <LocationPicker 
                              locale="en" 
                              onLocationChange={(city) => editForm.setValue('city', city)} 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Assigned area</label>
                            <input 
                              type="text" 
                              className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm"
                              {...editForm.register('assignedArea')}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">Package type</label>
                            <div className="relative group">
                               <select 
                                 className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                 {...editForm.register('packageType')}
                               >
                                  <option value="Internal">Internal Employee</option>
                                  <option value="Premium">Premium Partner</option>
                                  <option value="Standard">Standard Broker</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-400 ml-2 uppercase">KYC status</label>
                            <div className="relative group">
                               <select 
                                 className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary outline-none font-bold text-xs md:text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                 {...editForm.register('kyc_status')}
                               >
                                  <option value="unverified">Unverified</option>
                                  <option value="pending">Pending</option>
                                  <option value="verified">Verified</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" />
                            </div>
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
                      <div className="lg:col-span-2 space-y-8 md:space-y-10">
                         <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 md:gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-primary font-bold text-3xl md:text-4xl shadow-md border border-gray-100 shrink-0">
                               {selectedAgent.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="space-y-2 md:space-y-3">
                               <div className="flex flex-col sm:flex-row items-center gap-3">
                                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{selectedAgent.fullName}</h3>
                                  <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[10px] font-bold tracking-tight uppercase">
                                     {selectedAgent.packageType || 'Internal'}
                                  </span>
                               </div>
                               <div className="flex flex-col gap-1.5 md:gap-2">
                                  <p className="text-gray-400 font-bold text-xs flex items-center justify-center sm:justify-start gap-2">
                                     <Phone size={14} className="text-primary/50" /> {selectedAgent.mobile}
                                  </p>
                                  <p className="text-gray-400 font-bold text-xs flex items-center justify-center sm:justify-start gap-2">
                                     <Mail size={14} className="text-primary/50" /> {selectedAgent.email}
                                  </p>
                               </div>
                            </div>
                         </div>
                         
                         <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center justify-between">
                               <h4 className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Allocated properties ({getAgentPropertyCount(selectedAgent.id)})</h4>
                               <button className="text-[10px] font-bold text-primary tracking-tight hover:underline uppercase">Manage all</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                               {getAgentProperties(selectedAgent.id).length > 0 ? getAgentProperties(selectedAgent.id).map((prop: any) => (
                                 <div key={prop.id} className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 flex items-center gap-3 md:gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden shadow-sm shrink-0">
                                       <img src={prop.image || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-xs font-bold text-gray-900 truncate">{prop.title}</p>
                                       <div className="flex items-center gap-2 mt-0.5">
                                          <span className={cn(
                                            "text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded border uppercase",
                                            prop.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                          )}>
                                             {prop.status}
                                          </span>
                                          <span className="text-[8px] font-bold text-gray-400 tracking-tight uppercase">ID: {prop.id.slice(0, 6)}</span>
                                       </div>
                                    </div>
                                 </div>
                               )) : (
                                 <div className="col-span-1 sm:col-span-2 p-8 md:p-10 bg-gray-50 rounded-2xl md:rounded-3xl text-center border-2 border-dashed border-gray-100">
                                    <Building2 size={28} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">No properties allocated yet</p>
                                 </div>
                               )}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-gray-50">
                            <div className="space-y-3 md:space-y-4">
                               <h4 className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">Assigned area</h4>
                               <div className="p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-[2rem] border border-gray-100">
                                  <div className="flex items-center gap-3 md:gap-4">
                                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm text-primary shrink-0">
                                        <Map size={24} />
                                     </div>
                                     <div className="min-w-0">
                                        <p className="text-xs md:text-sm font-bold text-gray-900 tracking-tight truncate">{selectedAgent.assignedArea || 'Global coverage'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 tracking-tight truncate uppercase">{selectedAgent.city || 'Multi-city'}</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-3 md:space-y-4">
                               <h4 className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">KYC documentation</h4>
                               <div className="p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-[2rem] border border-gray-100 flex items-center justify-between">
                                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                     <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm text-primary shrink-0">
                                        <ShieldCheck size={24} />
                                     </div>
                                     <div className="min-w-0">
                                        <p className="text-xs md:text-sm font-bold text-gray-900 tracking-tight truncate uppercase">{selectedAgent.kyc_status || 'Not started'}</p>
                                        <p className="text-[10px] font-bold text-gray-400 tracking-tight uppercase">ID Verification</p>
                                     </div>
                                  </div>
                                  {selectedAgent.kyc_status === 'verified' && <CheckCircle2 className="text-green-500 shrink-0" size={24} />}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6 md:space-y-8">
                         <div className="bg-gray-50 rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100">
                            <h3 className="text-[10px] font-bold text-gray-900 tracking-tight mb-4 md:mb-6 flex items-center gap-2 uppercase">
                               <Activity size={14} className="text-primary" /> Employee moderation
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                               {selectedAgent.kyc_status !== 'verified' && (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedAgent.id, { kyc_status: 'verified' }); setSelectedAgent(null); }}
                                   className="w-full py-3 md:py-4 bg-green-500 text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 uppercase"
                                 >
                                    <UserCheck size={16} /> Approve KYC
                                 </button>
                               )}
                               <div className="w-full h-px bg-gray-200 my-2 md:my-4" />
                               {selectedAgent.accountStatus === 'suspended' ? (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedAgent.id, { accountStatus: 'active' }); setSelectedAgent(null); }}
                                   className="w-full py-3 md:py-4 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 uppercase"
                                 >
                                    <Unlock size={16} /> Unblock employee
                                 </button>
                               ) : (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedAgent.id, { accountStatus: 'suspended' }); setSelectedAgent(null); }}
                                   className="w-full py-3 md:py-4 bg-red-50 text-red-500 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-red-100 transition-all flex items-center justify-center gap-2 uppercase"
                                 >
                                    <Lock size={16} /> Block / Suspend
                                 </button>
                               )}
                               <button 
                                 onClick={() => { handleDeleteAgent(selectedAgent.id); setSelectedAgent(null); }}
                                 className="w-full py-3 md:py-4 bg-white text-red-600 border-2 border-red-50 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-red-50 transition-all flex items-center justify-center gap-2 uppercase"
                               >
                                  <UserX size={16} /> Remove permanently
                               </button>
                            </div>
                         </div>
                         
                         <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                            <h4 className="text-[10px] font-bold text-gray-400 tracking-tight mb-3 md:mb-4 uppercase">Quick allocation</h4>
                            <button className="w-full py-3 md:py-4 bg-gray-50 text-gray-900 border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-gray-100 transition-all flex items-center justify-center gap-2 uppercase">
                               <Layers size={16} /> Assign property
                            </button>
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
}
