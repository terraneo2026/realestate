'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Bell, CheckCircle2, XCircle, Clock, CreditCard, ShieldCheck, Trash2, Check, ArrowRight, MessageSquare } from 'lucide-react';
import { subscribeToNotifications, markAsRead, Notification } from '@/lib/notifications';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDoc = await getDoc(doc(firestore, "users", authUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : 'tenant';
        
        const unsubscribeNotifications = subscribeToNotifications(
          authUser.uid,
          role,
          (updatedNotifications) => {
            setNotifications(updatedNotifications);
            setUnreadCount(updatedNotifications.filter(n => !n.is_read).length);
          }
        );
        
        return () => unsubscribeNotifications();
      } else {
        setUser(null);
        setNotifications([]);
        setUnreadCount(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'rejection': return <XCircle size={16} className="text-red-500" />;
      case 'booking': return <Clock size={16} className="text-amber-500" />;
      case 'payment': return <CreditCard size={16} className="text-blue-500" />;
      case 'message': return <MessageSquare size={16} className="text-indigo-500" />;
      case 'system': return <ShieldCheck size={16} className="text-purple-500" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors bg-gray-50 rounded-full border border-gray-100"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white -mr-1 -mt-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-1 rounded-lg uppercase">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative",
                      !n.is_read && "bg-primary/[0.02]"
                    )}
                    onClick={() => n.id && markAsRead(n.id)}
                  >
                    {!n.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:border-primary/20 transition-colors">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={cn(
                            "text-xs font-bold truncate pr-4",
                            !n.is_read ? "text-gray-900" : "text-gray-500"
                          )}>{n.title}</p>
                          <span className="text-[8px] font-bold text-gray-300 uppercase shrink-0">
                            {n.created_at?.toDate ? new Date(n.created_at.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                          </span>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-400 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                  <Bell size={24} />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No new alerts</p>
              </div>
            )}
          </div>

          <Link
            href={`/${locale}/${user?.role === 'admin' ? 'admin/notifications' : (user?.role || 'tenant') + '/notifications'}`}
            className="block p-4 bg-gray-50 hover:bg-gray-100 text-center text-[10px] font-black text-primary uppercase tracking-widest transition-colors border-t border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
