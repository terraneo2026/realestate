'use client';

import React, { useEffect, useState } from 'react';
import { firestore, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Trash2, 
  CheckCheck,
  Filter,
  Loader2,
  ArrowRight,
  CreditCard,
  Check
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function TenantNotificationsClient() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'notifications'),
      where('recipientId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(firestore, 'notifications', id), { status: 'read' });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => n.status === 'unread');
      await Promise.all(unread.map(n => updateDoc(doc(firestore, 'notifications', n.id), { status: 'read' })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'notifications', id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const filteredNotifications = notifications.filter(n => 
    filterType === 'all' || n.type === filterType
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle2 size={20} className="text-green-500" />;
      case 'rejection': return <XCircle size={20} className="text-red-500" />;
      case 'payment': return <CreditCard size={20} className="text-blue-500" />;
      case 'booking': return <Clock size={20} className="text-amber-500" />;
      case 'system': return <ShieldCheck size={20} className="text-purple-500" />;
      default: return <Bell size={20} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Notifications</h1>
          <p className="text-gray-400 mt-2 font-bold tracking-tight text-[10px] uppercase flex items-center gap-2">
             <Bell size={14} className="text-primary" /> Stay updated with your property activities
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="h-12 px-6 bg-white border border-gray-100 rounded-2xl font-bold text-xs tracking-tight text-gray-400 hover:text-primary hover:border-primary/20 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/50"
        >
           <CheckCheck size={18} /> Mark all read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100">
               <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Filter size={14} className="text-primary" /> Filter
               </h3>
               <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All', icon: Bell },
                    { id: 'approval', label: 'Approvals', icon: CheckCircle2 },
                    { id: 'rejection', label: 'Rejections', icon: XCircle },
                    { id: 'booking', label: 'Bookings', icon: Clock },
                    { id: 'payment', label: 'Payments', icon: CreditCard },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFilterType(type.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filterType === type.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                       <type.icon size={16} />
                       {type.label}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="lg:col-span-3 space-y-4">
            {filteredNotifications.length > 0 ? filteredNotifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "group bg-white rounded-[2rem] p-6 border-2 transition-all flex items-center gap-6 relative overflow-hidden",
                  n.status === 'unread' ? "border-primary/20 shadow-xl shadow-primary/5 bg-primary/[0.02]" : "border-gray-50 shadow-sm"
                )}
              >
                 {n.status === 'unread' && (
                   <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                 )}
                 <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:bg-white transition-colors">
                    {getIcon(n.type)}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className={cn(
                         "text-sm font-bold tracking-tight",
                         n.status === 'unread' ? "text-gray-900" : "text-gray-500"
                       )}>{n.title}</h4>
                       <span className="text-[10px] font-bold text-gray-300 tracking-tight">
                          {n.createdAt?.toDate ? new Date(n.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                       </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-400 leading-relaxed max-w-2xl">{n.message}</p>
                    {n.targetUrl && (
                      <Link href={n.targetUrl} className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary tracking-tight hover:underline">
                         View details <ArrowRight size={10} />
                      </Link>
                    )}
                 </div>
                 <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {n.status === 'unread' && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-xl shadow-sm"
                        title="Mark as Read"
                      >
                         <Check size={18} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(n.id)}
                      className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 rounded-xl shadow-sm"
                      title="Delete"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            )) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-gray-200">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mx-auto mb-6">
                    <Bell size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight uppercase">No notifications</h3>
                 <p className="text-gray-400 max-w-xs mx-auto text-xs font-bold uppercase tracking-tight">Stay tuned for updates!</p>
              </div>
            )}
         </div>
      </div>
    </DashboardLayout>
  );
}
