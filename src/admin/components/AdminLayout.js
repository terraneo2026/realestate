import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  Activity,
  UserCheck,
  CreditCard,
  PieChart,
  Crown,
  CheckCircle2
} from 'lucide-react';
import { auth, db as firestore } from '../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { subscribeToNotifications, markAsRead as markNotificationAsRead } from '../../lib/notifications';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();
  const isExpanded = isSidebarOpen || isHovered;

  useEffect(() => {
    let unsubscribeNotifications = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          if (!firestore) {
            throw new Error('Firestore is not initialized.');
          }
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists() && userSnap.data().role === 'admin') {
            setAuthorized(true);
            setUserProfile(userSnap.data());

            // Subscribe to notifications
            unsubscribeNotifications = subscribeToNotifications(user.uid, 'admin', (newNotifications) => {
              setNotifications(newNotifications);
            });
          } else {
            await signOut(auth);
            router.push('/admin/login');
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeNotifications) unsubscribeNotifications();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Configuration', href: '/admin/configuration', icon: Settings },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Properties', href: '/admin/properties', icon: Building2 },
    { name: 'Categories', href: '/admin/categories', icon: List },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Agents / Staff', href: '/admin/agents', icon: Users2 },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Users & Roles', href: '/admin/users', icon: UserCheck },
    { name: 'Payments & Transactions', href: '/admin/payments', icon: CreditCard },
    { name: 'Reports', href: '/admin/reports', icon: PieChart },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: Crown },
    { name: 'System Monitoring', href: '/admin/monitoring', icon: Activity },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-gray-900" size={48} />
          <p className="text-xs font-semibold text-gray-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex font-sans selection:bg-black/10 selection:text-black relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />
      {/* Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/5 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
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
          isExpanded ? "w-72 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="h-[80px] flex items-center px-6 shrink-0 overflow-hidden">
          <Link href="/admin" className="flex items-center gap-4 group/logo">
            <div className="w-10 h-10 bg-[#087c7c] rounded-2xl flex items-center justify-center shadow-lg shadow-[#087c7c]/20 group-hover/logo:scale-110 transition-all duration-500 shrink-0">
               <ShieldCheck className="text-white" size={20} />
            </div>
            <div className={cn(
              "flex flex-col transition-all duration-500",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              <span className="text-lg font-black text-gray-900 tracking-tight leading-none">Relocate</span>
              <span className="text-[10px] font-black text-[#087c7c] uppercase tracking-[0.2em] mt-1">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav 
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          className="flex-1 py-4 px-3 overflow-y-auto no-scrollbar flex flex-col gap-1"
        >
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "group flex items-center rounded-2xl transition-all duration-300 relative",
                  isExpanded ? "px-4 py-3.5 gap-4" : "p-3.5 justify-center",
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
                  <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-[100] whitespace-nowrap shadow-2xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-gray-100">
           {isExpanded && (
             <div className="flex items-center gap-3 mb-6 px-2 animate-in fade-in slide-in-from-left-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-gray-100">
                   <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                     {userProfile?.fullName?.charAt(0) || 'A'}
                   </div>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-bold text-gray-900 truncate">{userProfile?.fullName || 'Administrator'}</p>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin</p>
                </div>
             </div>
           )}
           <button 
             onClick={handleLogout}
             className={cn(
               "w-full flex items-center rounded-2xl transition-all duration-300 relative group/logout",
               isExpanded ? "px-4 py-3.5 gap-4" : "p-3.5 justify-center",
               "text-gray-500 hover:bg-red-50 hover:text-red-500"
             )}
           >
              <LogOut size={20} className="shrink-0 transition-transform group-hover/logout:-translate-x-1" />
              <span className={cn(
                "text-sm font-bold tracking-tight transition-all duration-300",
                isExpanded ? "opacity-100" : "opacity-0 absolute"
              )}>
                Logout
              </span>

              {!isExpanded && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-[100] whitespace-nowrap shadow-2xl">
                  Logout
                </div>
              )}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {/* Content */}
        <main className="p-4 md:p-8 lg:p-10 max-w-[1800px] w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
           {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
