import React, { useState, useEffect } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Send, 
  User, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  MessageSquare,
  Activity,
  Plus,
  Loader2,
  CheckCircle,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { auth, db as firestore } from '@/admin/lib/firebase';
import { collection, query, where, orderBy, getDocs, onSnapshot, doc, deleteDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { sendNotification, markAsRead, deleteNotification } from '@/lib/notifications';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, admin, agent, owner, tenant
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state for new notification
  const [newNotif, setNewNotif] = useState({
    recipientRole: 'tenant',
    title: '',
    message: '',
    type: 'status_update',
    category: 'system'
  });

  useEffect(() => {
    const notificationsRef = collection(firestore, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(fetchedNotifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    const success = await sendNotification({
      recipientId: null, // Send to all in role for this example
      recipientRole: newNotif.recipientRole,
      type: newNotif.type,
      category: newNotif.category,
      title: newNotif.title,
      message: newNotif.message,
    });

    if (success) {
      toast.success("Notification sent successfully");
      setShowSendModal(false);
      setNewNotif({
        recipientRole: 'tenant',
        title: '',
        message: '',
        type: 'status_update',
        category: 'system'
      });
    } else {
      toast.error("Failed to send notification");
    }
    setSending(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      const success = await deleteNotification(id);
      if (success) toast.success("Notification deleted");
    }
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || n.recipientRole === activeTab;
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'payment': return <CreditCard size={18} />;
      case 'booking': return <Clock size={18} />;
      case 'approval': return <CheckCircle2 size={18} />;
      case 'property': return <Building2 size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'payment': return 'bg-green-50 text-green-600';
      case 'booking': return 'bg-amber-50 text-amber-600';
      case 'approval': return 'bg-blue-50 text-blue-600';
      case 'property': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-gray-400 mt-2 font-semibold tracking-tight text-xs flex items-center gap-2">
               <Bell size={14} className="text-[#087c7c]" /> Manage role-based alerts, activity logs, and system updates
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={async () => {
                const unread = notifications.filter(n => !n.isRead);
                for (const n of unread) if (n.id) await markAsRead(n.id);
                toast.success("All marked as read");
              }}
              className="h-14 px-8 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl font-bold text-xs tracking-tight flex items-center gap-3 shadow-xl shadow-gray-200/50 transition-all"
            >
               <CheckCircle size={18} /> Mark all read
            </button>
            <button 
              onClick={() => setShowSendModal(true)}
              className="h-14 px-8 bg-[#087c7c] text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-3 shadow-xl shadow-[#087c7c]/20 hover:bg-[#066666] transition-all"
            >
               <Plus size={18} /> Send new alert
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 mb-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              <input 
                type="text" 
                placeholder="Search notifications..." 
                className="w-full pl-16 pr-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#087c7c]/20 transition-all font-semibold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {['all', 'admin', 'agent', 'owner', 'tenant'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-4 rounded-xl text-xs font-bold tracking-tight transition-all capitalize",
                    activeTab === tab 
                      ? "bg-gray-900 text-white shadow-xl shadow-gray-900/10" 
                      : "bg-gray-50 text-gray-400 hover:text-gray-900"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#087c7c]" size={48} />
              <p className="text-gray-400 font-bold tracking-tight text-xs">Loading activities...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={cn(
                    "p-8 hover:bg-gray-50/50 transition-all group flex items-start gap-8",
                    !notif.isRead && "bg-[#087c7c]/5"
                  )}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm shrink-0",
                    getCategoryColor(notif.category)
                  )}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 tracking-tight">{notif.title}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold tracking-tight border",
                        notif.recipientRole === 'admin' ? "bg-purple-50 text-purple-600 border-purple-100" :
                        notif.recipientRole === 'agent' ? "bg-blue-50 text-blue-600 border-blue-100" :
                        notif.recipientRole === 'owner' ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-green-50 text-green-600 border-green-100"
                      )}>
                        {notif.recipientRole}
                      </span>
                      {notif.type === 'status_update' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#087c7c] bg-[#087c7c]/10 px-2 py-0.5 rounded-lg">
                          <Activity size={10} /> Status Update
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed mb-4">{notif.message}</p>
                    <div className="flex items-center gap-6 text-xs font-bold text-gray-300">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> 
                        {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                      </span>
                      {!notif.isRead && (
                        <button 
                          onClick={() => handleMarkRead(notif.id)}
                          className="text-[#087c7c] hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200">
                <Bell size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">No notifications found</h3>
              <p className="text-gray-400 text-sm font-semibold">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#087c7c] text-white rounded-2xl flex items-center justify-center shadow-xl shadow-[#087c7c]/20">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Send alert</h3>
                  <p className="text-gray-400 text-xs font-bold tracking-tight">Broadcast updates to specific user roles</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSendModal(false)}
                className="p-3 hover:bg-white rounded-2xl text-gray-300 hover:text-gray-900 transition-all border border-transparent hover:border-gray-100 shadow-sm"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 tracking-tight ml-2">Recipient role</label>
                  <div className="relative group">
                    <select 
                      className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none font-bold text-xs appearance-none cursor-pointer transition-all"
                      value={newNotif.recipientRole}
                      onChange={(e) => setNewNotif({...newNotif, recipientRole: e.target.value})}
                    >
                      <option value="tenant">Tenants</option>
                      <option value="owner">Owners</option>
                      <option value="agent">Agents</option>
                      <option value="admin">Admins</option>
                      <option value="all">All users</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 tracking-tight ml-2">Alert category</label>
                  <div className="relative group">
                    <select 
                      className="w-full px-8 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-[#087c7c] focus:bg-white outline-none font-bold text-xs appearance-none cursor-pointer transition-all"
                      value={newNotif.category}
                      onChange={(e) => setNewNotif({...newNotif, category: e.target.value})}
                    >
                      <option value="system">System update</option>
                      <option value="approval">Approval notice</option>
                      <option value="payment">Payment alert</option>
                      <option value="booking">Booking update</option>
                      <option value="property">Property alert</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#087c7c] transition-colors" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 tracking-tight ml-2">Alert title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Monthly system maintenance"
                  className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#087c7c]/20 outline-none font-bold text-sm"
                  value={newNotif.title}
                  onChange={(e) => setNewNotif({...newNotif, title: e.target.value})}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 tracking-tight ml-2">Detailed message</label>
                <textarea 
                  rows={4}
                  placeholder="Describe the update or activity..."
                  className="w-full px-8 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#087c7c]/20 outline-none font-bold text-sm resize-none"
                  value={newNotif.message}
                  onChange={(e) => setNewNotif({...newNotif, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={sending}
                className="w-full h-16 bg-gray-900 text-white rounded-2xl font-bold text-sm tracking-tight flex items-center justify-center gap-3 shadow-2xl shadow-gray-900/20 hover:bg-black transition-all disabled:opacity-50"
              >
                {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {sending ? "Broadcasting..." : "Broadcast alert"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

