"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, X, LogOut, User as UserIcon, ShieldCheck, 
  ChevronLeft, ChevronRight, LayoutDashboard, Building2, 
  Plus, BarChart3, MessageSquare, Calendar, Wallet, 
  Search, Heart, History, ClipboardList, TrendingUp,
  Loader2
} from "lucide-react";
import { auth, firestore } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardLayoutProps {
  userRole: "tenant" | "owner" | "agent" | "staff";
  children: React.ReactNode;
}

export default function DashboardLayout({
  userRole,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  const isExpanded = sidebarOpen || isHovered;
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role === userRole || data.role === 'admin') {
              setAuthorized(true);
              if (timer) clearTimeout(timer);
            } else {
              router.push(`/${locale}/${data.role}/dashboard`);
            }
          } else {
             await signOut(auth);
             router.push(`/${locale}/login`);
          }
        } catch (error) {
          console.error("Dashboard Auth Error:", error);
          router.push(`/${locale}/login`);
        }
      } else {
        timer = setTimeout(() => {
          if (!auth.currentUser) {
            router.push(`/${locale}/login`);
          }
        }, 800);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, [userRole, locale, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        const saved = localStorage.getItem('sidebarOpen');
        setSidebarOpen(saved === null ? true : saved === 'true');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userProfile');
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getMenuItems = () => {
    const base = [
      { name: "My Profile", href: `/${locale}/${userRole}/profile`, icon: UserIcon },
    ];

    switch (userRole) {
      case "tenant":
        return [
          { name: "Dashboard", href: `/${locale}/tenant/dashboard`, icon: LayoutDashboard },
          { name: "Browse Properties", href: `/${locale}/properties`, icon: Search },
          { name: "Saved Properties", href: `/${locale}/tenant/saved`, icon: Heart },
          { name: "My Searches", href: `/${locale}/tenant/searches`, icon: History },
          { name: "Messages", href: `/${locale}/tenant/messages`, icon: MessageSquare },
          { name: "Booking History", href: `/${locale}/tenant/bookings`, icon: Calendar },
          { name: "Payments", href: `/${locale}/tenant/payments`, icon: Wallet },
          ...base,
        ];
      case "owner":
        return [
          { name: "Overview", href: `/${locale}/owner/dashboard`, icon: LayoutDashboard },
          { name: "My Properties", href: `/${locale}/owner/properties`, icon: Building2 },
          { name: "Add Property", href: `/${locale}/owner/add-property`, icon: Plus },
          { name: "Analytics", href: `/${locale}/owner/analytics`, icon: BarChart3 },
          { name: "Messages", href: `/${locale}/owner/messages`, icon: MessageSquare },
          { name: "Bookings", href: `/${locale}/owner/bookings`, icon: Calendar },
          { name: "Payments", href: `/${locale}/owner/payments`, icon: Wallet },
          ...base,
        ];
      case "agent":
        return [
          { name: "Agent Panel", href: `/${locale}/agent/dashboard`, icon: LayoutDashboard },
          { name: "Active Listings", href: `/${locale}/agent/listings`, icon: Building2 },
          { name: "Add Property", href: `/${locale}/agent/add-property`, icon: Plus },
          { name: "Packages", href: `/${locale}/agent/packages`, icon: ShieldCheck },
          { name: "Customer Leads", href: `/${locale}/agent/inquiries`, icon: MessageSquare },
          { name: "Messages", href: `/${locale}/agent/messages`, icon: MessageSquare },
          { name: "Analytics", href: `/${locale}/agent/analytics`, icon: TrendingUp },
          ...base,
        ];
      case "staff":
        return [
          { name: "Staff Operations", href: `/${locale}/staff/dashboard`, icon: LayoutDashboard },
          { name: "Tasks", href: `/${locale}/staff/tasks`, icon: ClipboardList },
          { name: "Performance", href: `/${locale}/staff/performance`, icon: TrendingUp },
          ...base,
        ];
      default:
        return base;
    }
  };

  const currentMenu = getMenuItems();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F4F7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verifying Portal Access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#F2F4F7] flex font-sans selection:bg-black/10 selection:text-black relative overflow-x-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col no-scrollbar",
          "bg-white border-r border-gray-100 shadow-2xl shrink-0 group/sidebar",
          isExpanded ? "w-72" : "w-0 lg:w-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className={cn("h-[100px] flex items-center shrink-0 relative transition-all duration-500", isExpanded ? "px-6" : "px-5")}>
          <Link href={`/${locale}`} className="flex items-center gap-4 group/logo">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center shadow-lg group-hover/logo:scale-110 transition-all duration-500 shrink-0">
               <ShieldCheck className="text-primary" size={20} />
            </div>
            <div className={cn(
              "flex flex-col transition-all duration-500",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              <span className="text-xl font-black text-primary tracking-tight leading-none">Relocate</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{userRole} Panel</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Toggle Button - Centered on Sidebar Height */}
        <button
          onClick={() => {
            const newState = !sidebarOpen;
            setSidebarOpen(newState);
            localStorage.setItem('sidebarOpen', String(newState));
          }}
          className={cn(
            "absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary text-white rounded-full hidden lg:flex items-center justify-center shadow-lg transition-all duration-500 hover:scale-110 z-[60]",
            !isExpanded && "opacity-0 scale-0"
          )}
        >
          {sidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-8 p-2 text-gray-400 hover:text-primary transition-all lg:hidden"
        >
          <X size={20} />
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-3 overflow-y-auto no-scrollbar flex flex-col gap-1">
          {currentMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  "group flex items-center rounded-2xl transition-all duration-300 relative",
                  isExpanded ? "px-4 py-3.5 gap-4" : "p-3.5 justify-center",
                  isActive 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                )}
              >
                <item.icon size={20} className={cn(
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

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-100 shrink-0">
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
      <main className="flex-1 overflow-auto bg-[#F2F4F7] flex flex-col">
        {/* Mobile Header */}
        <header className="h-[80px] lg:hidden bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-30">
          <Link href={`/${locale}`} className="flex items-center gap-3">
             <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-primary" size={16} />
             </div>
             <span className="text-lg font-black text-primary tracking-tight uppercase">Relocate</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-500 hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Menu size={20} />
          </button>
        </header>

        <div className="p-4 lg:p-10 max-w-[1800px] w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
           {children}
        </div>
      </main>
    </div>
  );
}
