import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db as firestore } from '@/admin/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, addDoc, deleteDoc, orderBy } from 'firebase/firestore';
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
  Map
} from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AgentsPage = () => {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newAgentForm, setNewAgentForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
    assignedArea: '',
    packageType: 'Internal',
    role: 'agent',
    accountStatus: 'active',
    kyc_status: 'unverified'
  });
  const [saving, setSaving] = useState(false);
  const [agentProperties, setAgentProperties] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    verified: 0,
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgentData = async (agentList) => {
    try {
      const propData = {};
      const propsSnap = await getDocs(collection(firestore, 'properties'));
      const allProps = propsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      agentList.forEach(agent => {
        const allocated = allProps.filter((p) => p.agentId === agent.id);
        propData[agent.id] = {
          count: allocated.length,
          properties: allocated
        };
      });
      setAgentProperties(propData);
    } catch (error) {
      console.error("Error fetching agent property data:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const q = query(collection(firestore, 'users'), where('role', '==', 'agent'));
      const snap = await getDocs(q);
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      fetched.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });

      setAgents(fetched);
      fetchAgentData(fetched);
      
      setStats({
        total: fetched.length,
        active: fetched.filter((a) => a.accountStatus === 'active' || !a.accountStatus).length,
        suspended: fetched.filter((a) => a.accountStatus === 'suspended').length,
        verified: fetched.filter((a) => a.kyc_status === 'verified').length,
      });
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (agentId, updates) => {
    try {
      await updateDoc(doc(firestore, 'users', agentId), {
        ...updates,
        updatedAt: new Date()
      });
      setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updates } : a));
      toast.success("Agent profile updated");
      
      if (updates.accountStatus || updates.kyc_status) {
        fetchAgents();
      }
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Operation failed");
    }
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    if (!newAgentForm.fullName || !newAgentForm.email) {
      toast.error("Please fill in required fields");
      return;
    }
    setSaving(true);
    try {
      const docRef = await addDoc(collection(firestore, 'users'), {
        ...newAgentForm,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false
      });
      
      const newAgent = { id: docRef.id, ...newAgentForm };
      setAgents(prev => [newAgent, ...prev]);
      toast.success("New employee added successfully");
      setIsAdding(false);
      setNewAgentForm({
        fullName: '',
        email: '',
        mobile: '',
        city: '',
        assignedArea: '',
        packageType: 'Internal',
        role: 'agent',
        accountStatus: 'active',
        kyc_status: 'unverified'
      });
      fetchAgents();
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Failed to add employee");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    if (!editForm) return;
    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', editForm.id), {
        ...editForm,
        updatedAt: new Date()
      });
      setAgents(prev => prev.map(a => a.id === editForm.id ? editForm : a));
      toast.success("Agent profile updated successfully");
      setIsEditing(false);
      setSelectedAgent(editForm);
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAgent = async (agentId) => {
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

  const filteredAgents = agents.filter(a => 
    (a.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.mobile || '').includes(searchTerm) ||
    (a.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Internal agents</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <Briefcase size={14} className="text-[#087c7c]" /> Manage in-house employees, assigned areas and property allocations
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => exportToCSV(agents, 'relocate_agents')}
             className="h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export list
           </button>
           <button 
             onClick={() => setIsAdding(true)}
             className="h-14 px-8 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-2 shadow-xl shadow-[#087c7c]/20 hover:scale-105 active:scale-95 transition-all"
           >
              <ShieldCheck size={18} /> Add new employee
           </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
         {[
           { label: 'Total agents', value: stats.total, color: 'gray' },
           { label: 'Active', value: stats.active, color: 'green' },
           { label: 'Suspended', value: stats.suspended, color: 'red' },
           { label: 'KYC verified', value: stats.verified, color: 'blue' },
         ].map((s) => (
           <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 text-center">
              <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">{s.label}</p>
              <h4 className={cn(
                "text-2xl font-bold",
                s.color === 'green' ? "text-green-500" :
                s.color === 'red' ? "text-red-500" :
                s.color === 'blue' ? "text-blue-500" : "text-gray-900"
              )}>{s.value}</h4>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-center gap-8 bg-white">
           <div className="relative w-full lg:w-96 group">
              <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by name, area, mobile..." 
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
                    <th className="px-10 py-8">Employee identity</th>
                    <th className="px-6 py-8">KYC status</th>
                    <th className="px-6 py-8">Account status</th>
                    <th className="px-6 py-8">Location & area</th>
                    <th className="px-6 py-8 text-center">Allocated props</th>
                    <th className="px-6 py-8 text-center">Package</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredAgents.length > 0 ? filteredAgents.map((agent) => (
                   <tr key={agent.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-[#087c7c] font-bold text-xl shadow-sm border border-gray-50 group-hover:bg-[#087c7c] group-hover:text-white transition-all">
                               {agent.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-gray-900 text-sm tracking-tight truncate max-w-[200px] leading-tight mb-1">{agent.fullName || 'Anonymous'}</h4>
                               <div className="flex items-center gap-2">
                                  <Phone size={10} className="text-[#087c7c]/50" />
                                  <span className="text-xs font-bold text-gray-600">{agent.mobile || 'No mobile'}</span>
                               </div>
                               <p className="text-xs font-bold text-gray-400 tracking-tight mt-1">UID: {agent.id.slice(0, 10)}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <div className={cn(
                               "px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border shadow-sm",
                               agent.kyc_status === 'verified' ? "bg-green-50 border-green-100 text-green-600" :
                               agent.kyc_status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                               "bg-red-50 border-red-100 text-red-600"
                            )}>
                               {agent.kyc_status || 'unverified'}
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex items-center gap-2">
                            <div className={cn(
                               "w-2 h-2 rounded-full",
                               agent.accountStatus === 'active' || !agent.accountStatus ? "bg-green-500" : "bg-red-500"
                            )} />
                            <span className="text-xs font-bold text-gray-700">{agent.accountStatus || 'active'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <MapPin size={12} className="text-[#087c7c]" />
                               <span className="text-xs font-bold text-gray-700">{agent.city || 'N/A'}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 tracking-tight">Area: {agent.assignedArea || 'Global'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8 text-center">
                         <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-gray-900">{agentProperties[agent.id]?.count || 0}</span>
                            <span className="text-xs font-bold text-gray-400 tracking-tight">Properties</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex justify-center">
                            <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-xs font-bold tracking-tight shadow-lg">
                               {agent.packageType || 'Internal'}
                            </span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            {agent.kyc_status !== 'verified' && (
                              <button 
                                onClick={() => handleStatusUpdate(agent.id, { kyc_status: 'verified' })}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-green-500 hover:border-green-100 rounded-xl shadow-sm transition-all"
                                title="Approve KYC"
                              >
                                 <UserCheck size={18} />
                              </button>
                            )}
                            {agent.accountStatus === 'suspended' ? (
                              <button 
                                onClick={() => handleStatusUpdate(agent.id, { accountStatus: 'active' })}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all"
                                title="Reactivate"
                              >
                                 <Unlock size={18} />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusUpdate(agent.id, { accountStatus: 'suspended' })}
                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-xl shadow-sm transition-all"
                                title="Suspend"
                              >
                                 <Lock size={18} />
                              </button>
                            )}
                            <div className="w-px h-8 bg-gray-100 mx-1" />
                            <button 
                              onClick={() => { setSelectedAgent(agent); setIsEditing(false); }}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all"
                              title="View details"
                            >
                               <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => { setSelectedAgent(agent); setIsEditing(true); setEditForm(agent); }}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-xl shadow-sm transition-all"
                              title="Edit employee"
                            >
                               <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteAgent(agent.id)}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 rounded-xl shadow-sm transition-all"
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
                            <Users2 size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No employees found</h3>
                         <p className="text-gray-400 max-w-xs mx-auto text-xs font-semibold leading-relaxed tracking-tight">
                            Try adjusting your filters or search terms.
                         </p>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Add New Agent Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Add new employee</h2>
                    <p className="text-xs font-bold text-gray-400 tracking-tight mt-1">Register a new in-house agent</p>
                 </div>
                 <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={32} /></button>
              </div>
              
              <form onSubmit={handleAddAgent} className="p-10 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Full name *</label>
                       <input 
                         type="text" 
                         required
                         placeholder="e.g. John Doe"
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                         value={newAgentForm.fullName}
                         onChange={(e) => setNewAgentForm({...newAgentForm, fullName: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Email address *</label>
                       <input 
                         type="email" 
                         required
                         placeholder="e.g. john@relocate.biz"
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                         value={newAgentForm.email}
                         onChange={(e) => setNewAgentForm({...newAgentForm, email: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Mobile number</label>
                       <input 
                         type="text" 
                         placeholder="e.g. +91 98765 43210"
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                         value={newAgentForm.mobile}
                         onChange={(e) => setNewAgentForm({...newAgentForm, mobile: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">City</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Chennai"
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                         value={newAgentForm.city}
                         onChange={(e) => setNewAgentForm({...newAgentForm, city: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Assigned area</label>
                       <input 
                         type="text" 
                         placeholder="e.g. OMR, Chennai"
                         className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                         value={newAgentForm.assignedArea}
                         onChange={(e) => setNewAgentForm({...newAgentForm, assignedArea: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-400 ml-2">Package type</label>
                       <div className="relative group">
                          <select 
                            className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                            value={newAgentForm.packageType}
                            onChange={(e) => setNewAgentForm({...newAgentForm, packageType: e.target.value})}
                          >
                             <option value="Internal">Internal Employee</option>
                             <option value="Premium">Premium Partner</option>
                             <option value="Standard">Standard Broker</option>
                          </select>
                          <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
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
                       {saving ? 'Creating account...' : 'Add employee'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {selectedAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {isEditing ? 'Edit employee profile' : selectedAgent.fullName || 'Employee profile'}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 tracking-tight mt-1">UID: {selectedAgent.id}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    {!isEditing && (
                      <button 
                        onClick={() => { setIsEditing(true); setEditForm(selectedAgent); }}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs tracking-tight hover:bg-black transition-all flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit mode
                      </button>
                    )}
                    <button onClick={() => { setSelectedAgent(null); setIsEditing(false); }} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={32} /></button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 {isEditing ? (
                   <form onSubmit={handleUpdateAgent} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-400 ml-2">Full name</label>
                               <input 
                                 type="text" 
                                 className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                                 value={editForm.fullName || ''}
                                 onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-400 ml-2">Mobile number</label>
                               <input 
                                 type="text" 
                                 className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                                 value={editForm.mobile || ''}
                                 onChange={(e) => setEditForm({...editForm, mobile: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-400 ml-2">Location (City)</label>
                               <input 
                                 type="text" 
                                 className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                                 value={editForm.city || ''}
                                 onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-400 ml-2">Assigned area</label>
                               <input 
                                 type="text" 
                                 className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                                 value={editForm.assignedArea || ''}
                                 onChange={(e) => setEditForm({...editForm, assignedArea: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-400 ml-2">Package type</label>
                               <div className="relative group">
                                  <select 
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                    value={editForm.packageType || 'Internal'}
                                    onChange={(e) => setEditForm({...editForm, packageType: e.target.value})}
                                  >
                                     <option value="Internal">Internal Employee</option>
                                     <option value="Premium">Premium Partner</option>
                                     <option value="Standard">Standard Broker</option>
                                  </select>
                                  <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-xs font-bold text-gray-400 ml-2">KYC status</label>
                               <div className="relative group">
                                  <select 
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                    value={editForm.kyc_status || 'unverified'}
                                    onChange={(e) => setEditForm({...editForm, kyc_status: e.target.value})}
                                  >
                                     <option value="unverified">Unverified</option>
                                     <option value="pending">Pending</option>
                                     <option value="verified">Verified</option>
                                  </select>
                                  <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                               </div>
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
                            {saving ? 'Saving changes...' : 'Save employee details'}
                         </button>
                      </div>
                   </form>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-10">
                         <div className="flex items-center gap-8">
                            <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-[#087c7c] font-bold text-4xl shadow-md border border-gray-100">
                               {selectedAgent.fullName?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="space-y-2">
                               <div className="flex items-center gap-3">
                                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{selectedAgent.fullName}</h3>
                                  <span className="px-3 py-1 bg-gray-900 text-white rounded-lg text-xs font-bold tracking-tight">
                                     {selectedAgent.packageType || 'Internal'}
                                  </span>
                               </div>
                               <p className="text-gray-400 font-bold flex items-center gap-2">
                                  <Phone size={16} /> {selectedAgent.mobile}
                               </p>
                               <p className="text-gray-400 font-bold flex items-center gap-2">
                                  <Mail size={16} /> {selectedAgent.email}
                               </p>
                            </div>
                         </div>
                         
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight">Allocated properties ({agentProperties[selectedAgent.id]?.count || 0})</h4>
                               <button className="text-xs font-bold text-[#087c7c] tracking-tight hover:underline">Manage all</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {agentProperties[selectedAgent.id]?.properties.length > 0 ? agentProperties[selectedAgent.id].properties.map((prop) => (
                                 <div key={prop.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0">
                                       <img src={prop.image || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                       <p className="text-xs font-bold text-gray-900 truncate">{prop.title}</p>
                                       <div className="flex items-center gap-2 mt-1">
                                          <span className={cn(
                                            "text-xs font-bold px-1.5 py-0.5 rounded border",
                                            prop.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                          )}>
                                             {prop.status}
                                          </span>
                                          <span className="text-xs font-bold text-gray-400 tracking-tight">ID: {prop.id.slice(0, 6)}</span>
                                       </div>
                                    </div>
                                 </div>
                               )) : (
                                 <div className="col-span-2 p-10 bg-gray-50 rounded-3xl text-center border-2 border-dashed border-gray-100">
                                    <Building2 size={32} className="text-gray-200 mx-auto mb-3" />
                                    <p className="text-xs font-bold text-gray-400 tracking-tight">No properties allocated yet</p>
                                 </div>
                               )}
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                            <div className="space-y-4">
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight">Assigned area</h4>
                               <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#087c7c]">
                                        <Map size={24} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-gray-900 tracking-tight">{selectedAgent.assignedArea || 'Global coverage'}</p>
                                        <p className="text-xs font-bold text-gray-400 tracking-tight">{selectedAgent.city || 'Multi-city'}</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight">KYC documentation</h4>
                               <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#087c7c]">
                                        <ShieldCheck size={24} />
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-gray-900 tracking-tight">{selectedAgent.kyc_status || 'Not started'}</p>
                                        <p className="text-xs font-bold text-gray-400 tracking-tight">ID Verification</p>
                                     </div>
                                  </div>
                                  {selectedAgent.kyc_status === 'verified' && <CheckCircle2 className="text-green-500" size={24} />}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                               <Activity size={16} className="text-[#087c7c]" /> Employee moderation
                            </h3>
                            <div className="space-y-4">
                               {selectedAgent.kyc_status !== 'verified' && (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedAgent.id, { kyc_status: 'verified' }); setSelectedAgent(null); }}
                                   className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                 >
                                    <UserCheck size={16} /> Approve KYC
                                 </button>
                               )}
                               <div className="w-full h-px bg-gray-200 my-4" />
                               {selectedAgent.accountStatus === 'suspended' ? (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedAgent.id, { accountStatus: 'active' }); setSelectedAgent(null); }}
                                   className="w-full py-4 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-[#087c7c]/90 transition-all shadow-lg shadow-[#087c7c]/20 flex items-center justify-center gap-2"
                                 >
                                    <Unlock size={16} /> Unblock employee
                                 </button>
                               ) : (
                                 <button 
                                   onClick={() => { handleStatusUpdate(selectedAgent.id, { accountStatus: 'suspended' }); setSelectedAgent(null); }}
                                   className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                 >
                                    <Lock size={16} /> Block / Suspend
                                 </button>
                               )}
                               <button 
                                 onClick={() => { handleDeleteAgent(selectedAgent.id); setSelectedAgent(null); }}
                                 className="w-full py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                               >
                                  <UserX size={16} /> Remove permanently
                               </button>
                            </div>
                         </div>
                         
                         <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                            <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-4">Quick allocation</h4>
                            <button className="w-full py-4 bg-gray-50 text-gray-900 border-2 border-dashed border-gray-200 rounded-2xl font-bold text-xs tracking-tight hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
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
};

export default AgentsPage;
