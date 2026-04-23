import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db as firestore } from '@/admin/lib/firebase';
import { collection, query, getDocs, where, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Trash2, 
  Download, 
  Plus, 
  ChevronDown,
  MapPin,
  ArrowUpRight,
  Loader2,
  Phone,
  Edit2,
  Check,
  X,
  Pause,
  Play,
  Star,
  Shield,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendNotification } from '@/lib/notifications';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminProperties = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    rented: 0,
  });

  const tabs = [
    { id: 'all', label: 'All Listings' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'rented', label: 'Rented' },
    { id: 'inactive', label: 'On Hold' },
  ];

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, [activeTab, filterType, filterLocation, filterProject]);

  const fetchStats = async () => {
    try {
      const snap = await getDocs(collection(firestore, 'properties'));
      const all = snap.docs.map(d => d.data());
      setStats({
        total: all.length,
        approved: all.filter(p => {
          const s = String(p.status || '').toLowerCase();
          return s === 'approved' || s === 'active' || s === 'published';
        }).length,
        pending: all.filter(p => String(p.status || 'pending').toLowerCase() === 'pending').length,
        rejected: all.filter(p => String(p.status || '').toLowerCase() === 'rejected').length,
        rented: all.filter(p => String(p.status || '').toLowerCase() === 'rented').length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Fetch all properties and sort client-side to avoid index requirement
      const q = collection(firestore, 'properties');
      
      const snap = await getDocs(q);
      let fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client-side sorting by date
      fetched.sort((a, b) => {
        const getDate = (val) => {
          if (!val) return new Date(0);
          if (typeof val.toDate === 'function') return val.toDate();
          return new Date(val);
        };
        const dateA = getDate(a.createdAt || a.created_at);
        const dateB = getDate(b.createdAt || b.created_at);
        return dateB - dateA;
      });

      // Client-side filtering
      if (activeTab !== 'all') {
        fetched = fetched.filter(p => {
          const status = String(p.status || 'pending').toLowerCase();
          if (activeTab === 'approved') return status === 'approved' || status === 'active' || status === 'published';
          return status === activeTab;
        });
      }

      if (filterType !== 'all') {
        fetched = fetched.filter(p => (p.category || p.category_id) === filterType);
      }

      if (filterLocation !== 'all') {
        fetched = fetched.filter(p => (p.city || p.location?.city) === filterLocation);
      }

      if (filterProject !== 'all') {
        fetched = fetched.filter(p => p.projectId === filterProject || p.projectName === filterProject || p.newProjectName === filterProject);
      }

      if (budgetRange.min) {
        fetched = fetched.filter(p => Number(p.price || p.budget || 0) >= Number(budgetRange.min));
      }
      if (budgetRange.max) {
        fetched = fetched.filter(p => Number(p.price || p.budget || 0) <= Number(budgetRange.max));
      }

      setProperties(fetched);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const property = properties.find(p => p.id === id);
      await updateDoc(doc(firestore, 'properties', id), {
        status: newStatus,
        updatedAt: new Date()
      });
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      toast.success(`Property marked as ${newStatus}`);
      fetchStats();

      if (property) {
        await sendNotification({
          recipientId: property.ownerId || property.agentId || null,
          recipientRole: property.ownerId ? 'owner' : 'agent',
          type: 'status_update',
          category: 'property',
          title: `Property ${newStatus}`,
          message: `Your property "${property.title}" has been ${newStatus} by the admin.`,
          metadata: { propertyId: id, status: newStatus }
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleMarkRented = async (id) => {
    await handleStatusUpdate(id, 'rented');
  };

  const handleMarkAvailable = async (id) => {
    await handleStatusUpdate(id, 'approved');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteDoc(doc(firestore, 'properties', id));
      setProperties(prev => prev.filter(p => p.id !== id));
      toast.success("Property deleted permanently");
      fetchStats();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    if (!editForm) return;
    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'properties', editForm.id), {
        ...editForm,
        updatedAt: new Date()
      });
      setProperties(prev => prev.map(p => p.id === editForm.id ? editForm : p));
      toast.success("Property updated successfully");
      setIsEditing(false);
      setSelectedProperty(editForm);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  const filteredProperties = properties.filter(p => {
    const s = searchTerm.toLowerCase();
    const city = (p.city || p.location?.city || '').toLowerCase();
    const title = (p.title || '').toLowerCase();
    const ownerName = (p.ownerName || '').toLowerCase();
    const ownerMobile = (p.ownerMobile || '').toLowerCase();
    const id = (p.id || '').toLowerCase();
    const projectId = (p.projectId || '').toLowerCase();
    const projectName = (p.projectName || p.newProjectName || '').toLowerCase();
    
    return title.includes(s) || 
           ownerName.includes(s) || 
           ownerMobile.includes(s) || 
           city.includes(s) || 
           id.includes(s) || 
           projectId.includes(s) ||
           projectName.includes(s);
  });

  const projects = Array.from(new Set(properties.map(p => p.projectName || p.projectId).filter(Boolean)));
  const locations = Array.from(new Set(properties.map(p => p.city).filter(Boolean)));
  const types = Array.from(new Set(properties.map(p => p.category).filter(Boolean)));

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Properties management</h1>
          <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
             <Shield size={14} className="text-[#087c7c]" /> Global moderation & inventory control center
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => exportToCSV(properties, 'relocate_properties')}
             className="h-14 px-8 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/50"
           >
              <Download size={18} /> Export data
           </button>
           <Link href="/admin/properties/add" className="h-14 px-8 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-2 shadow-xl shadow-[#087c7c]/20 hover:scale-105 active:scale-95 transition-all">
              <Plus size={18} /> Add property
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
         {[
           { label: 'Total', value: stats.total, color: 'gray' },
           { label: 'Approved', value: stats.approved, color: 'green' },
           { label: 'Pending', value: stats.pending, color: 'amber' },
           { label: 'Rejected', value: stats.rejected, color: 'red' },
           { label: 'Rented', value: stats.rented, color: 'blue' },
         ].map((s) => (
           <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-200/50 text-center">
              <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">{s.label}</p>
              <h4 className={cn(
                "text-2xl font-bold",
                s.color === 'green' ? "text-green-500" :
                s.color === 'amber' ? "text-amber-500" :
                s.color === 'red' ? "text-red-500" :
                s.color === 'blue' ? "text-blue-500" : "text-gray-900"
              )}>{s.value}</h4>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden mb-12">
        <div className="p-8 border-b border-gray-50 bg-white space-y-8">
           <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
              <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                 {tabs.map((tab) => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={cn(
                       "px-6 py-3 rounded-xl text-xs font-bold tracking-tight transition-all whitespace-nowrap",
                       activeTab === tab.id ? "bg-[#087c7c] text-white shadow-lg shadow-[#087c7c]/20" : "text-gray-400 hover:bg-white hover:text-gray-900"
                     )}
                   >
                     {tab.label}
                   </button>
                 ))}
              </div>
              <div className="relative w-full lg:w-96 group">
                 <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search by ID, owner, city, mobile..." 
                   className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none transition-all font-bold text-xs"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tight">Project</label>
                 <div className="relative group">
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none appearance-none cursor-pointer focus:border-[#087c7c] focus:bg-white transition-all"
                      value={filterProject}
                      onChange={(e) => setFilterProject(e.target.value)}
                    >
                       <option value="all">All Projects</option>
                       {projects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tight">Property Type</label>
                 <div className="relative group">
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none appearance-none cursor-pointer focus:border-[#087c7c] focus:bg-white transition-all"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                       <option value="all">All Types</option>
                       {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tight">Location</label>
                 <div className="relative group">
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none appearance-none cursor-pointer focus:border-[#087c7c] focus:bg-white transition-all"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    >
                       <option value="all">All Locations</option>
                       {locations.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                 </div>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                 <label className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-tight">Budget Range (₹)</label>
                 <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none focus:border-[#087c7c] focus:bg-white transition-all"
                      value={budgetRange.min}
                      onChange={(e) => setBudgetRange({...budgetRange, min: e.target.value})}
                    />
                    <span className="text-gray-300">-</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-bold text-xs text-gray-700 outline-none focus:border-[#087c7c] focus:bg-white transition-all"
                      value={budgetRange.max}
                      onChange={(e) => setBudgetRange({...budgetRange, max: e.target.value})}
                    />
                    <button 
                      onClick={() => fetchProperties()}
                      className="h-14 w-14 shrink-0 bg-[#087c7c] text-white rounded-2xl hover:bg-[#066666] transition-all shadow-lg shadow-[#087c7c]/20 flex items-center justify-center"
                    >
                       <Filter size={20} />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-gray-400 text-xs font-bold tracking-tight border-b border-gray-50">
                 <tr>
                    <th className="px-10 py-8">Property / Project ID</th>
                    <th className="px-6 py-8">Project & Prop Type</th>
                    <th className="px-6 py-8">Location & Address</th>
                    <th className="px-6 py-8 text-center">Status & Possession</th>
                    <th className="px-6 py-8 text-center">Budget & Leads</th>
                    <th className="px-6 py-8">Owner & Contact</th>
                    <th className="px-10 py-8 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredProperties.length > 0 ? filteredProperties.map((prop) => (
                   <tr key={prop.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-6">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border border-gray-50">
                               <img src={prop.image || prop.coverImage || '/placeholder.svg'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                               {prop.featured && (
                                 <div className="absolute top-1 left-1 bg-amber-500 text-white p-1 rounded-lg">
                                    <Star size={10} fill="currentColor" />
                                 </div>
                               )}
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-gray-900 text-sm truncate max-w-[200px] leading-tight mb-1">{prop.title}</h4>
                               <p className="text-xs font-bold text-gray-400 tracking-tight">Prop ID: <span className="text-gray-900">{prop.id?.slice(0, 8)}</span></p>
                               <p className="text-xs font-bold text-gray-400 tracking-tight">Proj ID: <span className="text-[#087c7c]">{prop.projectId || 'N/A'}</span></p>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-[#087c7c] tracking-tight px-2 py-0.5 bg-[#087c7c]/5 rounded-md border border-[#087c7c]/10 w-fit">Project: {prop.category || 'N/A'}</span>
                            <span className="text-xs font-bold text-gray-400 tracking-tight">Property: <span className="text-gray-700">{prop.type || 'N/A'}</span></span>
                            <span className="text-xs font-bold text-gray-300 tracking-tight mt-1 italic">{prop.createdAt?.toDate ? new Date(prop.createdAt.toDate()).toLocaleDateString() : 'Recent'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                               <MapPin size={12} className="text-[#087c7c]" />
                               <span className="text-xs font-bold text-gray-700">{prop.city}</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-400 line-clamp-2 max-w-[200px]">{prop.address || prop.area || 'N/A'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col items-center gap-2">
                            {(() => {
                               const status = String(prop.status || 'pending').toLowerCase();
                               return (
                                 <div className={cn(
                                   "px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight border shadow-sm",
                                   (status === 'approved' || status === 'active' || status === 'published') ? "bg-green-50 border-green-100 text-green-600" :
                                   status === 'pending' ? "bg-amber-50 border-amber-100 text-amber-600" :
                                   status === 'rejected' ? "bg-red-50 border-red-100 text-red-600" :
                                   status === 'rented' ? "bg-blue-50 border-blue-100 text-blue-600" :
                                   "bg-gray-50 border-gray-100 text-gray-400"
                                 )}>
                                    {prop.status || 'pending'}
                                 </div>
                               );
                            })()}
                            <div className="flex flex-col items-center">
                               <span className="text-xs font-bold text-gray-300 uppercase">Possession</span>
                               <span className="text-xs font-bold text-gray-600">{prop.possessionStatus || 'Ready'} ({prop.possessionType || 'Self'})</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col items-center gap-3">
                            <div className="text-center">
                               <span className="text-base font-bold text-gray-900 block">₹{(prop.price || prop.budget || 0).toLocaleString()}</span>
                               <span className="text-xs font-bold text-gray-400 tracking-tight uppercase">{prop.paymentFrequency || 'Per Month'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                               <ArrowUpRight size={12} className="text-[#087c7c]" />
                               <span className="text-xs font-bold text-[#087c7c]">{prop.leadsCount || 0} Leads</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-8">
                         <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[#087c7c] font-bold text-xs">
                                  {prop.ownerName?.charAt(0) || 'O'}
                               </div>
                               <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{prop.ownerName || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                               <Phone size={12} />
                               <span className="text-xs font-bold">{prop.ownerMobile || 'No mobile'}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <div className="flex items-center justify-end gap-2">
                            {prop.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(prop.id, 'approved')}
                                  className="p-3 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-all border border-green-100 shadow-sm"
                                  title="Approve"
                                >
                                   <Check size={18} />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(prop.id, 'rejected')}
                                  className="p-3 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm"
                                  title="Reject"
                                >
                                   <X size={18} />
                                </button>
                              </>
                            )}
                            {(prop.status === 'approved' || prop.status === 'active') && (
                              <>
                                <button 
                                  onClick={() => handleMarkRented(prop.id)}
                                  className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm"
                                  title="Mark as Rented"
                                >
                                   <CheckCircle2 size={18} />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(prop.id, 'inactive')}
                                  className="p-3 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all border border-amber-100 shadow-sm"
                                  title="Put on Hold"
                                >
                                   <Pause size={18} />
                                </button>
                              </>
                            )}
                            {prop.status === 'rented' && (
                              <button 
                                onClick={() => handleMarkAvailable(prop.id)}
                                className="p-3 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-xl transition-all border border-green-100 shadow-sm"
                                title="Mark as Available"
                              >
                                 <Building2 size={18} />
                              </button>
                            )}
                            {prop.status === 'inactive' && (
                              <button 
                                onClick={() => handleStatusUpdate(prop.id, 'approved')}
                                className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-all border border-blue-100 shadow-sm"
                                title="Activate"
                              >
                                 <Play size={18} />
                              </button>
                            )}
                            <div className="w-px h-8 bg-gray-100 mx-1" />
                            <button 
                              onClick={() => { setSelectedProperty(prop); setIsEditing(false); }}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-[#087c7c] hover:border-[#087c7c]/20 rounded-xl shadow-sm transition-all"
                              title="View details"
                            >
                               <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => { setSelectedProperty(prop); setIsEditing(true); setEditForm(prop); }}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-blue-500 hover:border-blue-100 rounded-xl shadow-sm transition-all"
                              title="Edit property"
                            >
                               <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(prop.id)}
                              className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-xl shadow-sm transition-all"
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
                            <Building2 size={40} />
                         </div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No properties found</h3>
                         <p className="text-gray-400 max-w-xs mx-auto text-xs font-semibold leading-relaxed tracking-tight">
                            Try adjusting your search or filters to find what you're looking for.
                         </p>
                      </td>
                   </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Property Detail / Edit Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
           <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center shrink-0">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                      {isEditing ? 'Edit property' : selectedProperty.title}
                    </h2>
                    <p className="text-xs font-bold text-gray-400 tracking-tight mt-1">Property ID: {selectedProperty.id}</p>
                 </div>
                 <div className="flex items-center gap-4">
                    {!isEditing && (
                      <button 
                        onClick={() => { setIsEditing(true); setEditForm(selectedProperty); }}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs tracking-tight hover:bg-black transition-all flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit Mode
                      </button>
                    )}
                    <button onClick={() => { setSelectedProperty(null); setIsEditing(false); }} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={32} /></button>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                 {isEditing ? (
                   <form onSubmit={handleUpdateProperty} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Property Title</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Project ID</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.projectId || ''}
                              onChange={(e) => setEditForm({...editForm, projectId: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Project Type</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.category || ''}
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                              placeholder="e.g. Residential, Commercial"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Property Type</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.type || ''}
                              onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                              placeholder="e.g. Apartment, Villa, Office"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Location (City)</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.city}
                              onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Full Address</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.address || ''}
                              onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Budget / Price (₹)</label>
                            <input 
                              type="number" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.price || editForm.budget || 0}
                              onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2 font-semibold">Possession Status</label>
                            <div className="relative group">
                               <select 
                                 className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm appearance-none cursor-pointer focus:bg-white transition-all"
                                 value={editForm.possessionStatus || 'Ready to move'}
                                 onChange={(e) => setEditForm({...editForm, possessionStatus: e.target.value})}
                               >
                                  <option value="Ready to move">Ready to move</option>
                                  <option value="Under construction">Under construction</option>
                                  <option value="Planned">Planned</option>
                               </select>
                               <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Owner Name</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.ownerName || ''}
                              onChange={(e) => setEditForm({...editForm, ownerName: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 ml-2">Owner Mobile</label>
                            <input 
                              type="text" 
                              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm"
                              value={editForm.ownerMobile || ''}
                              onChange={(e) => setEditForm({...editForm, ownerMobile: e.target.value})}
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 ml-2">Property Description</label>
                         <textarea 
                           rows={5}
                           className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087c7c] outline-none font-bold text-sm resize-none"
                           value={editForm.description || ''}
                           onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                         />
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
                           className="px-10 py-4 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight shadow-xl shadow-[#087c7c]/20 hover:bg-[#066666] transition-all flex items-center gap-2"
                         >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            {saving ? 'Saving changes...' : 'Save property details'}
                         </button>
                      </div>
                   </form>
                 ) : (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                      <div className="lg:col-span-2 space-y-10">
                         <div className="grid grid-cols-2 gap-4">
                            {(selectedProperty.images || [selectedProperty.image]).map((img, i) => (
                              <div key={i} className="aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                                 <img src={img || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                         </div>
                         
                         <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900 tracking-tight">Description</h3>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed whitespace-pre-wrap">{selectedProperty.description || 'No description provided.'}</p>
                         </div>

                         <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-50">
                            <div>
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-4">Location details</h4>
                               <div className="space-y-3">
                                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                     <MapPin size={16} className="text-[#087c7c]" /> {selectedProperty.address || 'Address hidden from public'}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs font-bold text-gray-700">
                                     <Building2 size={16} className="text-[#087c7c]" /> {selectedProperty.city}, {selectedProperty.area}
                                  </div>
                               </div>
                            </div>
                            <div>
                               <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-4">Configuration</h4>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="p-3 bg-gray-50 rounded-2xl text-center">
                                     <p className="text-xs font-bold text-gray-400 tracking-tight">BHK</p>
                                     <p className="text-sm font-bold text-gray-900">{selectedProperty.bhk || 'N/A'}</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-2xl text-center">
                                     <p className="text-xs font-bold text-gray-400 tracking-tight">Sq.Ft</p>
                                     <p className="text-sm font-bold text-gray-900">{selectedProperty.sqft || 'N/A'}</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-gray-50">
                            <h4 className="text-xs font-bold text-gray-400 tracking-tight mb-4">Additional Information</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-300">Project ID</p>
                                  <p className="text-xs font-bold text-gray-700">{selectedProperty.projectId || 'Not assigned'}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-300">Project Type</p>
                                  <p className="text-xs font-bold text-gray-700">{selectedProperty.category || 'N/A'}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-300">Property Type</p>
                                  <p className="text-xs font-bold text-gray-700">{selectedProperty.type || 'N/A'}</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-300">Possession</p>
                                  <p className="text-xs font-bold text-gray-700">{selectedProperty.possessionStatus || 'Ready'} ({selectedProperty.possessionType || 'Self'})</p>
                               </div>
                               <div className="space-y-1">
                                  <p className="text-xs font-bold text-gray-300">Leads / Interests</p>
                                  <p className="text-xs font-bold text-[#087c7c]">{selectedProperty.leadsCount || 0} active leads</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 tracking-tight mb-6">Owner information</h3>
                            <div className="flex items-center gap-4 mb-6">
                               <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#087c7c] font-bold text-xl shadow-sm border border-gray-100">
                                  {selectedProperty.ownerName?.charAt(0) || 'O'}
                               </div>
                               <div>
                                  <h4 className="font-bold text-gray-900 tracking-tight">{selectedProperty.ownerName}</h4>
                                  <p className="text-xs font-bold text-gray-400 tracking-tight">Verified owner</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                               <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                  <Mail size={14} className="text-gray-400" /> {selectedProperty.ownerEmail || 'Email not provided'}
                               </div>
                               <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                  <Phone size={14} className="text-gray-400" /> {selectedProperty.ownerMobile || 'Mobile not provided'}
                               </div>
                            </div>
                         </div>

                         <div className="bg-white rounded-[2.5rem] p-8 border-2 border-[#087c7c]/10 shadow-xl shadow-[#087c7c]/5">
                            <h3 className="text-xs font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
                               <Shield size={14} className="text-[#087c7c]" /> Moderation panel
                            </h3>
                            <div className="space-y-4">
                               {selectedProperty.status === 'pending' ? (
                                 <>
                                   <button 
                                     onClick={() => { handleStatusUpdate(selectedProperty.id, 'approved'); setSelectedProperty(null); }}
                                     className="w-full py-4 bg-green-500 text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                   >
                                      <Check size={16} /> Approve listing
                                   </button>
                                   <button 
                                     onClick={() => { handleStatusUpdate(selectedProperty.id, 'rejected'); setSelectedProperty(null); }}
                                     className="w-full py-4 bg-white text-red-500 border-2 border-red-50 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                   >
                                      <X size={16} /> Reject submission
                                   </button>
                                 </>
                               ) : (
                                 <div className="flex flex-col gap-3">
                                   <div className="p-4 bg-gray-50 rounded-2xl text-center">
                                      <p className="text-xs font-bold text-gray-400 tracking-tight mb-1">Current status</p>
                                      <p className="text-sm font-bold text-gray-900 capitalize">{selectedProperty.status}</p>
                                   </div>
                                   <div className="grid grid-cols-2 gap-3">
                                      {selectedProperty.status !== 'rented' ? (
                                        <button 
                                          onClick={() => { handleMarkRented(selectedProperty.id); setSelectedProperty(null); }}
                                          className="py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs tracking-tight hover:bg-blue-500 hover:text-white transition-all"
                                        >
                                          Mark Rented
                                        </button>
                                      ) : (
                                        <button 
                                          onClick={() => { handleMarkAvailable(selectedProperty.id); setSelectedProperty(null); }}
                                          className="py-3 bg-green-50 text-green-600 rounded-xl font-bold text-xs tracking-tight hover:bg-green-500 hover:text-white transition-all"
                                        >
                                          Set Available
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => { handleStatusUpdate(selectedProperty.id, 'inactive'); setSelectedProperty(null); }}
                                        className="py-3 bg-amber-50 text-amber-600 rounded-xl font-bold text-xs tracking-tight hover:bg-amber-500 hover:text-white transition-all"
                                      >
                                        Hold Listing
                                      </button>
                                   </div>
                                 </div>
                               )}
                               <button 
                                 onClick={() => { setIsEditing(true); setEditForm(selectedProperty); }}
                                 className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xs tracking-tight hover:bg-black transition-all flex items-center justify-center gap-2"
                               >
                                  <Edit2 size={16} /> Edit details
                               </button>
                               <button 
                                 onClick={() => { handleDelete(selectedProperty.id); setSelectedProperty(null); }}
                                 className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-xs tracking-tight hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                               >
                                  <Trash2 size={16} /> Delete permanently
                               </button>
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

export default AdminProperties;
