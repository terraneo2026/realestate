'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, orderBy, limit, serverTimestamp, QueryConstraint } from 'firebase/firestore';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Info, 
  AlertCircle, 
  Trash2, 
  CheckCheck,
  Filter,
  Search,
  Loader2,
  MoreVertical,
  ArrowRight,
  ShieldCheck,
  User,
  Building2,
  CreditCard,
  Check
} from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getPaginatedData } from '@/lib/firestore-pagination';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminNotificationsClient() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const pageSize = 20;

  const fetchNotifications = async (isNext = true) => {
    setLoading(true);
    try {
      const filters: QueryConstraint[] = [];
      if (filterType !== 'all') {
        filters.push(where('type', '==', filterType));
      }

      const result = await getPaginatedData<any>({
        collectionName: 'notifications',
        pageSize,
        lastVisible: isNext ? lastVisible : (history[page - 2] || null),
        filters,
        orderByField: 'created_at'
      });

      setNotifications(result.data);
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
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setLastVisible(null);
    setHistory([]);
    fetchNotifications(true);
  }, [filterType]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(firestore, 'notifications', id), { is_read: true });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.is_read);
      await Promise.all(unread.map(n => updateDoc(doc(firestore, 'notifications', n.id), { is_read: true })));
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All visible notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'notifications', id));
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle2 size={20} className="text-green-500" />;
      case 'rejection': return <XCircle size={20} className="text-red-500" />;
      case 'payment': return <CreditCard size={20} className="text-blue-500" />;
      case 'booking': return <Clock size={20} className="text-amber-500" />;
      case 'message': return <Bell size={20} className="text-gray-400" />;
      case 'system': return <ShieldCheck size={20} className="text-purple-500" />;
      default: return <Bell size={20} className="text-gray-400" />;
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-4 md:px-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight truncate">Notifications hub</h1>
          <p className="text-gray-400 mt-1 md:mt-2 font-semibold tracking-tight text-[10px] md:text-xs flex items-center gap-2">
             <Bell size={14} className="text-primary shrink-0" /> <span className="truncate">Centralized alert engine</span>
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="w-full md:w-auto h-11 md:h-14 px-6 md:px-8 bg-white border border-gray-100 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
        >
           <CheckCheck size={18} /> Mark all read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-10 px-4 md:px-0 pb-12">
         {/* Filters Sidebar */}
         <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <div className="bg-white rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
               <h3 className="text-[10px] md:text-xs font-bold text-gray-900 uppercase tracking-tight mb-4 md:mb-6 flex items-center gap-2">
                  <Filter size={14} className="text-primary" /> Filter alerts
               </h3>
               <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
                  {[
                    { id: 'all', label: 'All', icon: Bell },
                    { id: 'approval', label: 'Approvals', icon: CheckCircle2 },
                    { id: 'rejection', label: 'Rejections', icon: XCircle },
                    { id: 'booking', label: 'Bookings', icon: Clock },
                    { id: 'payment', label: 'Payments', icon: CreditCard },
                    { id: 'system', label: 'System', icon: ShieldCheck },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFilterType(type.id)}
                      className={cn(
                        "flex items-center gap-2 md:gap-3 px-3 py-2 md:px-6 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-xs font-bold uppercase tracking-tight transition-all whitespace-nowrap min-w-max md:min-w-0",
                        filterType === type.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900 bg-gray-50 md:bg-transparent"
                      )}
                    >
                       <type.icon size={16} />
                       {type.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="hidden lg:block bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-400/20">
               <h3 className="text-xs font-bold mb-4 tracking-tight uppercase">Quick summary</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold tracking-tight text-gray-400">
                     <span>Unread alerts</span>
                     <span className="text-white bg-red-500 px-2 py-0.5 rounded-lg text-xs">{notifications.filter(n => !n.is_read).length}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold tracking-tight text-gray-400">
                     <span>Total alerts</span>
                     <span className="text-white">{total}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Notifications List */}
         <div className="lg:col-span-3 space-y-3 md:space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : notifications.length > 0 ? (
              <>
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={cn(
                      "group bg-white rounded-xl md:rounded-[2rem] p-4 md:p-6 border-2 transition-all flex flex-col md:flex-row md:items-center gap-3 md:gap-6 relative overflow-hidden",
                      !n.is_read ? "border-primary/20 shadow-xl shadow-primary/5 bg-primary/[0.02]" : "border-gray-50 shadow-sm"
                    )}
                  >
                     {!n.is_read && (
                       <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                     )}
                     <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-white transition-colors">
                           {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0 md:hidden">
                           <div className="flex justify-between items-center mb-0.5">
                              <h4 className={cn(
                                "text-[10px] font-bold tracking-tight truncate pr-2",
                                !n.is_read ? "text-gray-900" : "text-gray-500"
                              )}>{n.title}</h4>
                              <span className="text-[8px] font-bold text-gray-300 tracking-tight shrink-0">
                                 {n.created_at?.toDate ? new Date(n.created_at.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                              </span>
                           </div>
                        </div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="hidden md:flex md:justify-between md:items-start mb-1 gap-1">
                           <h4 className={cn(
                             "text-xs md:text-sm font-bold tracking-tight",
                             !n.is_read ? "text-gray-900" : "text-gray-500"
                           )}>{n.title}</h4>
                           <span className="text-[10px] md:text-xs font-bold text-gray-300 tracking-tight">
                              {n.created_at?.toDate ? new Date(n.created_at.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                           </span>
                        </div>
                        <p className="text-[10px] md:text-xs font-semibold text-gray-400 leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-none">{n.message}</p>
                        {n.targetUrl && (
                          <Link href={n.targetUrl} className="mt-1.5 md:mt-3 flex items-center gap-1.5 text-[9px] md:text-xs font-bold text-primary tracking-tight hover:underline">
                             View details <ArrowRight size={10} />
                          </Link>
                        )}
                     </div>
                     <div className="flex items-center gap-1.5 md:gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity mt-2 md:mt-0 justify-end">
                        {!n.is_read && (
                          <button 
                            onClick={() => markAsRead(n.id)}
                            className="p-1.5 md:p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-lg md:rounded-xl shadow-sm"
                            title="Mark as Read"
                          >
                             <Check size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(n.id)}
                          className="p-1.5 md:p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 rounded-lg md:rounded-xl shadow-sm"
                          title="Delete"
                        >
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                ))}
                
                {/* Pagination Controls */}
                <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Showing {notifications.length} of {total} alerts
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (page > 1) {
                          setPage(page - 1);
                          fetchNotifications(false);
                        }
                      }}
                      disabled={page === 1}
                      className="px-6 py-3 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => {
                        if (notifications.length === pageSize) {
                          setPage(page + 1);
                          fetchNotifications(true);
                        }
                      }}
                      disabled={notifications.length < pageSize}
                      className="px-6 py-3 bg-white border border-gray-100 text-gray-400 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 text-[10px] font-black uppercase tracking-widest"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-12 md:p-32 text-center border border-dashed border-gray-200">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                    <Bell size={40} />
                 </div>
                 <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 tracking-tight uppercase">Inbox is empty</h3>
                 <p className="text-gray-400 max-w-xs mx-auto text-[10px] md:text-xs font-bold uppercase tracking-tight">No notifications found</p>
              </div>
            )}
         </div>
      </div>
    </AdminLayout>
  );
}
