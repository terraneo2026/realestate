"use client";

import Link from "next/link";
import { useState } from "react";

interface DashboardLayoutProps {
  userRole: "tenant" | "owner" | "agent";
  children: React.ReactNode;
}

export default function DashboardLayout({
  userRole,
  children,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = {
    tenant: [
      { label: "Dashboard", href: "/tenant/dashboard" },
      { label: "Saved Properties", href: "/tenant/saved" },
      { label: "My Searches", href: "/tenant/searches" },
      { label: "Messages", href: "/tenant/messages" },
      { label: "Profile", href: "/tenant/profile" },
      { label: "Logout", href: "/logout" },
    ],
    owner: [
      { label: "Dashboard", href: "/owner/dashboard" },
      { label: "My Properties", href: "/owner/properties" },
      { label: "Add Property", href: "/owner/add-property" },
      { label: "Analytics", href: "/owner/analytics" },
      { label: "Messages", href: "/owner/messages" },
      { label: "Profile", href: "/owner/profile" },
      { label: "Logout", href: "/logout" },
    ],
    agent: [
      { label: "Dashboard", href: "/agent/dashboard" },
      { label: "My Listings", href: "/agent/listings" },
      { label: "Add Listing", href: "/agent/add-listing" },
      { label: "Inquiries", href: "/agent/inquiries" },
      { label: "Messages", href: "/agent/messages" },
      { label: "Profile", href: "/agent/profile" },
      { label: "Logout", href: "/logout" },
    ],
  };

  const currentMenu = menuItems[userRole];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl hover:bg-gray-100 p-2 rounded-lg"
          >
            ☰
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {currentMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg text-gray-700 hover:primaryBg hover:text-white transition-all text-sm"
            >
              {sidebarOpen ? item.label : item.label[0]}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
