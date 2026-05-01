"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User as UserIcon, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
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
  const isExpanded = sidebarOpen || isHovered;
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split("/")[1] || "en";

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
          { name: "Dashboard", href: `/${locale}/tenant/dashboard`, icon: "📊" },
          { name: "Browse Properties", href: `/${locale}/properties`, icon: "🔍" },
          { name: "Saved Properties", href: `/${locale}/tenant/saved`, icon: "❤️" },
          { name: "My Searches", href: `/${locale}/tenant/searches`, icon: "💾" },
          { name: "Messages", href: `/${locale}/tenant/messages`, icon: "💬" },
          { name: "Booking History", href: `/${locale}/tenant/bookings`, icon: "📅" },
          { name: "Payments", href: `/${locale}/tenant/payments`, icon: "💳" },
          ...base,
        ];
      case "owner":
        return [
          { name: "Overview", href: `/${locale}/owner/dashboard`, icon: "📊" },
          { name: "My Properties", href: `/${locale}/owner/properties`, icon: "🏢" },
          { name: "Add Property", href: `/${locale}/owner/add-property`, icon: "➕" },
          { name: "Analytics", href: `/${locale}/owner/analytics`, icon: "📈" },
          { name: "Messages", href: `/${locale}/owner/messages`, icon: "💬" },
          { name: "Bookings", href: `/${locale}/owner/bookings`, icon: "📅" },
          ...base,
        ];
      case "agent":
        return [
          { name: "Agent Panel", href: `/${locale}/agent/dashboard`, icon: "📊" },
          { name: "Active Listings", href: `/${locale}/agent/listings`, icon: "🏢" },
          { name: "Add Listing", href: `/${locale}/agent/add-listing`, icon: "➕" },
          { name: "Packages", href: `/${locale}/agent/packages`, icon: "📦" },
          { name: "Customer Leads", href: `/${locale}/agent/inquiries`, icon: "👥" },
          { name: "Messages", href: `/${locale}/agent/messages`, icon: "💬" },
          { name: "Analytics", href: `/${locale}/agent/analytics`, icon: "📈" },
          ...base,
        ];
      case "staff":
        return [
          { name: "Staff Operations", href: `/${locale}/staff/dashboard`, icon: "🏢" },
          { name: "Tasks", href: `/${locale}/staff/tasks`, icon: "📋" },
          { name: "Performance", href: `/${locale}/staff/performance`, icon: "📈" },
          ...base,
        ];
      default:
        return base;
    }
  };

  const currentMenu = getMenuItems();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          isExpanded ? "w-72 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="h-[100px] flex items-center px-6 shrink-0 overflow-hidden">
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

        {/* Navigation */}
        <nav className="flex-1 py-2 px-3 overflow-y-hidden no-scrollbar flex flex-col gap-1">
          {currentMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "group flex items-center rounded-2xl transition-all duration-300 relative",
                  isExpanded ? "px-4 py-3.5 gap-4" : "p-3.5 justify-center",
                  isActive 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                )}
              >
                {typeof item.icon === 'string' ? (
                  <span className="text-xl shrink-0 w-5 flex justify-center">{item.icon}</span>
                ) : (
                  <item.icon size={20} className={cn(
                    "transition-all duration-300 shrink-0",
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                )}
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

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
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
      <main className="flex-1 overflow-auto bg-[#F2F4F7]">
        <div className="p-4 lg:p-10 max-w-[1800px] w-full mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
           {children}
        </div>
      </main>
    </div>
  );
}
