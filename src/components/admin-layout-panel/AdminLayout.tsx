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
  CheckCircle2
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

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

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
            toast.error("Unauthorized access. Admin only.");
            await signOut(auth);
            router.push(`/${locale}/login`);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          router.push(`/${locale}/login`);
        }
      } else {
        router.push(`/${locale}/login`);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, locale]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: `/${locale}/admin`, icon: Home },
    { name: 'Notifications', href: `/${locale}/admin/notifications`, icon: Bell },
    { name: 'Properties', href: `/${locale}/admin/properties`, icon: Building2 },
    { name: 'Categories', href: `/${locale}/admin/categories`, icon: List },
    { name: 'Customers', href: `/${locale}/admin/customers`, icon: Users },
    { name: 'Agents / Staff', href: `/${locale}/admin/agents`, icon: Users2 },
    { name: 'Enquiries', href: `/${locale}/admin/enquiries`, icon: MessageSquare },
    { name: 'Users & Roles', href: `/${locale}/admin/users`, icon: UserCheck },
    { name: 'Payments & Transactions', href: `/${locale}/admin/payments`, icon: CreditCard },
    { name: 'Reports', href: `/${locale}/admin/reports`, icon: PieChart },
    { name: 'Subscriptions', href: `/${locale}/admin/subscriptions`, icon: Crown },
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
    <div className="min-h-screen bg-[#F2F4F7] flex font-sans selection:bg-black/10 selection:text-black relative">
      {/* Background soft gradients matching reference */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-100/30 blur-[150px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-yellow-100/30 blur-[150px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        relative z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isSidebarOpen ? 'w-72' : 'w-24 -translate-x-full lg:translate-x-0'}
        bg-white/70 backdrop-blur-3xl border-r border-white/40 flex flex-col shadow-[24px_0_80px_-20px_rgba(0,0,0,0.05)]
      `}>
        {/* Logo Section - Matching PROPIXO style */}
        <div className="h-[100px] flex items-center px-8 shrink-0">
          <Link href={`/${locale}/admin`} className="flex items-center gap-3 overflow-hidden group">
            <div className="w-10 h-10 bg-[#087c7c] rounded-xl flex items-center justify-center shrink-0 shadow-2xl shadow-[#087c7c]/20 group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck className="text-white" size={20} />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">Relocate.</span>
                <span className="text-xs font-medium text-[#087C7C] mt-1">Premium Operations</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-4 px-4 overflow-visible">
           <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`
                      group flex items-center h-12 rounded-xl transition-all duration-500 relative
                      ${isActive 
                        ? 'bg-[#087c7c] text-white shadow-[0_15px_30px_-5px_rgba(8,124,124,0.3)]' 
                        : 'text-gray-400 hover:bg-white hover:text-gray-900 hover:shadow-xl hover:shadow-gray-200/50'
                      }
                      ${!isSidebarOpen && 'justify-center px-0'}
                      ${isSidebarOpen && 'px-5'}
                    `}
                  >
                    <Icon size={18} className={cn(
                      "transition-all duration-500 shrink-0",
                      isActive ? 'text-white scale-110' : 'group-hover:text-[#087c7c] group-hover:scale-110'
                    )} />
                    <span className={cn(
                      "ml-3 text-sm font-semibold transition-all duration-500 whitespace-nowrap overflow-hidden",
                      isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 ml-0'
                    )}>
                      {item.name}
                    </span>
                    {isActive && isSidebarOpen && (
                      <div className="absolute right-5 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]" />
                    )}
                    {!isSidebarOpen && (
                       <div className="absolute left-full ml-6 px-4 py-3 bg-gray-900 text-white text-xs font-semibold rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl">
                          {item.name}
                       </div>
                    )}
                  </Link>
                );
              })}
           </div>
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 space-y-3">
           {isSidebarOpen && (
             <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl flex items-center gap-3 mb-2 border border-white/40 shadow-xl shadow-gray-200/30">
                <div className="w-10 h-10 bg-[#087c7c] rounded-xl flex items-center justify-center text-white font-bold shadow-xl shadow-[#087c7c]/10 border-2 border-white shrink-0 overflow-hidden">
                   {userProfile?.photoURL ? (
                     <img src={userProfile.photoURL} alt="" className="w-full h-full object-cover" />
                   ) : (
                     userProfile?.fullName?.charAt(0) || 'A'
                   )}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-gray-900 truncate">{userProfile?.fullName || 'Administrator'}</p>
                   <p className="text-xs font-medium text-gray-400 mt-0.5">Super Admin</p>
                </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className={`
               w-full h-12 flex items-center rounded-xl text-red-500 hover:bg-red-50 transition-all duration-500
               ${!isSidebarOpen ? 'justify-center px-0' : 'px-5'}
             `}
           >
             <div className={cn(
               "flex items-center gap-3",
               !isSidebarOpen && "justify-center w-full"
             )}>
                <LogOut size={18} />
                {isSidebarOpen && <span className="text-sm font-semibold">Logout</span>}
             </div>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {/* Header */}
        <header className="h-[100px] sticky top-0 z-40">
          <div className="h-full px-8 flex items-center justify-between max-w-[1800px] mx-auto w-full">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-3 bg-white text-gray-400 hover:text-[#087c7c] hover:bg-gray-50 rounded-xl transition-all border border-white shadow-xl shadow-gray-200/30 shrink-0"
              >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              
              {/* Reference Header Nav - Matching image layout */}
              <div className="hidden xl:flex items-center gap-2 bg-white/60 backdrop-blur-2xl p-1.5 rounded-full border border-white/40 shadow-2xl shadow-gray-200/20">
                 {[
                   { name: 'Dashboard', href: `/${locale}/admin` },
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

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-white/60 backdrop-blur-xl border border-white/40 rounded-xl px-4 py-2.5 shadow-xl shadow-gray-200/20 group focus-within:bg-white transition-all">
                 <Search size={16} className="text-gray-400 group-focus-within:text-[#087c7c] transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   className="bg-transparent border-none focus:ring-0 text-xs font-semibold w-32 ml-2 placeholder:text-gray-300"
                 />
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white text-gray-400 hover:text-[#087c7c] rounded-xl transition-all border border-white shadow-xl shadow-gray-200/30 shrink-0"
                >
                   <Bell size={18} />
                   {notifications.filter(n => !n.isRead).length > 0 && (
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
                              !n.isRead && "bg-[#087c7c]/5"
                            )}
                            onClick={async () => {
                              if (!n.isRead && n.id) await markNotificationAsRead(n.id);
                              if (n.metadata?.link) router.push(n.metadata.link);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                n.category === 'payment' ? "bg-green-100 text-green-600" :
                                n.category === 'approval' ? "bg-blue-100 text-blue-600" :
                                "bg-gray-100 text-gray-600"
                              )}>
                                {n.category === 'payment' ? <CreditCard size={14} /> :
                                 n.category === 'approval' ? <CheckCircle2 size={14} /> :
                                 <Bell size={14} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{n.title}</p>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1 font-semibold">
                                  {n.createdAt?.toDate ? n.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
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
              
              <div className="flex items-center gap-3 group cursor-pointer shrink-0">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#087C7C] transition-colors">{userProfile?.fullName || 'Administrator'}</p>
                    <p className="text-xs font-medium text-gray-400">Admin</p>
                 </div>
                 <div className="w-10 h-10 bg-[#087c7c] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-2xl shadow-[#087c7c]/20 border-2 border-white overflow-hidden group-hover:scale-105 transition-transform duration-500">
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
