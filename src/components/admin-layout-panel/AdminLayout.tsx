'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Building2,
  Settings,
  Users,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Loader2,
  List,
  MessageSquare,
  Users2,
  Layout,
  Bell,
  Search,
  ChevronDown,
  Wallet,
  PieChart,
  Activity,
  UserCheck,
  CreditCard,
  FileText,
  Crown,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { auth, firestore } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { subscribeToNotifications, Notification, markAsRead as markNotificationAsRead } from '@/lib/notifications';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { handleError } from '@/lib/error-handler';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  // Initialize sidebar state from localStorage and handle responsiveness
  useEffect(() => {
    const savedState = localStorage.getItem('adminSidebarOpen');
    const isSmallScreen = window.innerWidth < 1024;
    setIsMobile(isSmallScreen);

    if (isSmallScreen) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(savedState !== 'false');
    }

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update localStorage when sidebar state changes (on desktop only)
  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('adminSidebarOpen', String(isSidebarOpen));
    }
  }, [isSidebarOpen, isMobile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().role === 'admin') {
            setAuthorized(true);
            setUserProfile(userSnap.data());

            // Subscribe to notifications
            const unsubscribeNotifications = subscribeToNotifications(user.uid, 'admin', (newNotifications) => {
              setNotifications(newNotifications);
            });

            return () => unsubscribeNotifications();
          } else {
            const role = userSnap.data()?.role;
            toast.error(`Unauthorized access. ${role ? 'Admin only.' : 'Please login.'}`);
            if (role) {
              router.push(`/${locale}/${role}/dashboard`);
            } else {
              await signOut(auth);
              router.push(`/${locale}/login`);
            }
          }
        } catch (error) {
          handleError(error, 'high', { userId: user.uid, context: 'Admin Auth Check' });
          router.push(`/${locale}/login`);
        }
      } else {
        router.push(`/${locale}/login`);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, locale]);

  useEffect(() => {
    // Close sidebar on navigation on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push(`/${locale}/login`);
    } catch (error) {
      handleError(error, 'medium', { context: 'Logout' });
    }
  };

  const navItems = [
    { name: 'Dashboard', href: `/${locale}/admin`, icon: Home },
    { name: 'Configuration', href: `/${locale}/admin/configuration`, icon: Settings },
    { name: 'Notifications', href: `/${locale}/admin/notifications`, icon: Bell },
    { name: 'Properties', href: `/${locale}/admin/properties`, icon: Building2 },
    { name: 'Categories', href: `/${locale}/admin/categories`, icon: List },
    { name: 'Customers', href: `/${locale}/admin/customers`, icon: Users },
    { name: 'Agents / Staff', href: `/${locale}/admin/agents`, icon: Users2 },
    { name: 'Enquiries', href: `/${locale}/admin/enquiries`, icon: MessageSquare },
    { name: 'Bookings', href: `/${locale}/admin/bookings`, icon: Calendar },
    { name: 'Users & Roles', href: `/${locale}/admin/users`, icon: UserCheck },
    { name: 'Payments & Transactions', href: `/${locale}/admin/payments`, icon: CreditCard },
    { name: 'Reports', href: `/${locale}/admin/reports`, icon: PieChart },
    { name: 'Subscriptions', href: `/${locale}/admin/subscriptions`, icon: Crown },
    { name: 'Packages', href: `/${locale}/admin/packages`, icon: ShieldCheck },
    { name: 'System Monitoring', href: `/${locale}/admin/monitoring`, icon: Activity },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-xs font-semibold text-gray-400">Authenticating Admin...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex font-sans selection:bg-black/10 selection:text-black relative overflow-x-hidden">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      {/* Sidebar Overlay - Only on mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col no-scrollbar",
          "bg-white border-r border-gray-100 shadow-2xl shrink-0 group/sidebar",
          isSidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-[80px] flex items-center px-6 shrink-0 overflow-hidden">
          <Link href={`/${locale}/admin`} className="flex items-center gap-4 group/logo">
            <div className="w-10 h-10 bg-[#087c7c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#087c7c]/20 group-hover/logo:scale-110 transition-all duration-500 shrink-0">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <div className={cn(
              "flex flex-col transition-all duration-500",
              isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              <span className="text-lg font-black text-gray-900 tracking-tight leading-none">Relocate</span>
              <span className="text-[10px] font-black text-[#087c7c] uppercase tracking-[0.2em] mt-1">Admin Panel</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#087c7c] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110",
              !isSidebarOpen && !isHovered && "opacity-0 scale-0"
            )}
          >
            {isSidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
          </button>
        </div>

        <nav
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="flex-1 py-4 px-3 overflow-y-auto no-scrollbar flex flex-col gap-1"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isExpanded = isSidebarOpen;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-2xl transition-all duration-300 relative",
                  isExpanded ? "px-4 py-2.5 gap-4" : "p-3 justify-center",
                  isActive
                    ? 'bg-[#087c7c] text-white shadow-xl shadow-[#087c7c]/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#087c7c]'
                )}
              >
                <Icon size={20} className={cn(
                  "transition-all duration-300 shrink-0",
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                )} />

                <span className={cn(
                  "text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300",
                  isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute"
                )}>
                  {item.name}
                </span>

                {!isExpanded && (
                  <div className="absolute left-full ml-6 px-4 py-2 bg-[#087c7c] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 pointer-events-none z-[100] whitespace-nowrap shadow-2xl shadow-[#087c7c]/40 flex items-center gap-2">
                    <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-[#087c7c] rotate-45" />
                    {item.name}
                  </div>
                )}

                {isActive && (
                  <div className={cn(
                    "absolute right-2 w-1.5 h-1.5 bg-white rounded-full",
                    !isExpanded && "hidden"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className={cn(
            "flex items-center mb-4 transition-all duration-500 overflow-hidden",
            (isSidebarOpen || isHovered) ? "px-2 gap-3" : "px-0 justify-center"
          )}>
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-100 shrink-0">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#087c7c]/10 flex items-center justify-center text-[#087c7c] font-black text-xs">
                  {userProfile?.fullName?.charAt(0) || 'A'}
                </div>
              )}
            </div>
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-500",
              (isSidebarOpen || isHovered) ? "opacity-100" : "opacity-0 w-0"
            )}>
              <p className="text-xs font-bold text-gray-900 truncate">{userProfile?.fullName || 'Administrator'}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center rounded-2xl transition-all duration-300 relative group/logout",
              (isSidebarOpen || isHovered) ? "px-4 py-3.5 gap-4" : "p-3.5 justify-center",
              "text-gray-500 hover:bg-red-50 hover:text-red-500"
            )}
          >
            <LogOut size={20} className="shrink-0 transition-transform group-hover/logout:-translate-x-1" />
            <span className={cn(
              "text-sm font-bold tracking-tight transition-all duration-300",
              (isSidebarOpen || isHovered) ? "opacity-100" : "opacity-0 absolute"
            )}>
              Logout
            </span>

            {!(isSidebarOpen || isHovered) && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-[100] whitespace-nowrap shadow-2xl">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {/* Header */}
        <header className="h-[80px] lg:h-[100px] sticky top-0 z-40 bg-[#F2F4F7]/80 backdrop-blur-md lg:bg-transparent">
          <div className="h-full px-4 md:px-8 flex items-center justify-between max-w-[1800px] mx-auto w-full">
            <div className="flex items-center gap-4 md:gap-8">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 md:p-3 bg-white text-gray-400 hover:text-[#087c7c] hover:bg-gray-50 rounded-xl transition-all border border-white shadow-xl shadow-gray-200/30 shrink-0"
              >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              {/* Reference Header Nav - Matching image layout */}
              <div className="hidden xl:flex items-center gap-2 bg-white/60 backdrop-blur-2xl p-1.5 rounded-full border border-white/40 shadow-2xl shadow-gray-200/20">
                {[
                  { name: 'Dashboard', href: `/${locale}/admin` },
                  { name: 'Config', href: `/${locale}/admin/configuration` },
                  { name: 'Agents', href: `/${locale}/admin/agents` },
                  { name: 'Clients', href: `/${locale}/admin/customers` },
                  { name: 'Analytics', href: `/${locale}/admin/reports` },
                  { name: 'Calendar', href: `/${locale}/admin/monitoring` },
                  { name: 'Messages', href: `/${locale}/admin/enquiries` }
                ].map((item) => (
                  <Link key={item.name} href={item.href}>
                    <button className={cn(
                      "px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-500",
                      pathname === item.href ? "bg-[#064e4e] text-white shadow-xl shadow-[#064e4e]/20" : "text-gray-400 hover:text-[#087c7c] hover:bg-white"
                    )}>
                      {item.name}
                    </button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden sm:flex items-center bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl px-3 py-2 md:px-4 md:py-2.5 shadow-xl shadow-gray-200/20 group focus-within:bg-white transition-all">
                <Search size={16} className="text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none focus:ring-0 text-xs font-semibold w-24 md:w-32 ml-2 placeholder:text-gray-300"
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white text-gray-400 hover:text-[#087c7c] rounded-xl transition-all border border-white shadow-xl shadow-gray-200/30 shrink-0"
                >
                  <Bell size={18} />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#087c7c] border-2 border-white rounded-full shadow-[0_0_15px_rgba(8,124,124,0.5)] animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900">Recent Notifications</h3>
                      <Link href={`/${locale}/admin/notifications`} className="text-xs font-bold text-[#087c7c] hover:underline" onClick={() => setShowNotifications(false)}>
                        View all
                      </Link>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer",
                              !n.is_read && "bg-[#087c7c]/5"
                            )}
                            onClick={async () => {
                              if (!n.is_read && n.id) await markNotificationAsRead(n.id);
                              if (n.metadata?.link) router.push(n.metadata.link);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                n.type === 'payment' ? "bg-green-100 text-green-600" :
                                  n.type === 'approval' ? "bg-blue-100 text-blue-600" :
                                    "bg-gray-100 text-gray-600"
                              )}>
                                {n.type === 'payment' ? <CreditCard size={14} /> :
                                  n.type === 'approval' ? <CheckCircle2 size={14} /> :
                                    <Bell size={14} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{n.title}</p>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1 font-semibold">
                                  {n.created_at?.toDate ? n.created_at.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-xs text-gray-400">No new notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200 mx-1 shrink-0" />

              <div className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-gray-900 group-hover:text-[#087C7C] transition-colors">{userProfile?.fullName || 'Administrator'}</p>
                  <p className="text-xs font-medium text-gray-400">Admin</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#087c7c] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-2xl shadow-[#087c7c]/20 border-2 border-white overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {userProfile?.photoURL ? (
                    <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    'A'
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 md:p-8 lg:p-10 max-w-[1800px] w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
