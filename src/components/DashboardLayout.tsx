"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface DashboardLayoutProps {
  userRole: "tenant" | "owner" | "agent";
  children: React.ReactNode;
}

export default function DashboardLayout({
  userRole,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      { name: "My Profile", href: `/${locale}/${userRole}/profile`, icon: "👤" },
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
          { name: "Customer Leads", href: `/${locale}/agent/inquiries`, icon: "👥" },
          { name: "Messages", href: `/${locale}/agent/messages`, icon: "💬" },
          { name: "Analytics", href: `/${locale}/agent/analytics`, icon: "📈" },
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
    <div className="min-h-screen bg-[#f2f7ff] flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        } bg-white shadow-2xl transition-all duration-300 flex flex-col flex-shrink-0 border-r border-gray-100 z-50 fixed lg:relative h-full`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-50 h-[81px]">
          <Link href={`/${locale}`} className="flex items-center">
            <img 
              src="/logo.jpeg" 
              alt="Relocate" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150x50?text=Relocate';
              }}
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#087C7C] transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {currentMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl transition-all text-sm font-bold cursor-pointer group ${
                  isActive
                    ? "primaryBg text-white shadow-lg shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-bold group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            {sidebarOpen && <span className="ml-3 font-black tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-[#f8fafc]">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
