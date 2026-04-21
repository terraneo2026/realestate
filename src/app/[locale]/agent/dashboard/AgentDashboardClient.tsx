"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";

export default function AgentDashboardClient() {
  const [userName, setUserName] = useState("Agent");
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName || "Agent");
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <DashboardLayout userRole="agent">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {userName}!</h1>
        <p className="text-gray-600 mt-2 font-medium">Manage your listings and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label="My Listings"
          value="28"
          icon="📋"
          color="primary"
        />
        <StatsCard
          label="Total Views"
          value="2,451"
          icon="👁️"
          color="blue"
        />
        <StatsCard
          label="Inquiries"
          value="89"
          icon="💬"
          color="green"
        />
        <StatsCard
          label="Leases Completed"
          value="12"
          icon="✅"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Listings Overview */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Active Listings</h2>
              <Link href={`/${locale}/agent/listings`} className="text-primary font-semibold text-sm hover:underline">Manage All</Link>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 text-2xl">
                🏢
              </div>
              <p className="text-gray-500 font-medium">No listings yet.</p>
              <Link href={`/${locale}/agent/add-listing`} className="mt-4 text-primary font-bold hover:underline">Create Your First Listing</Link>
            </div>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Leads</h2>
              <Link href={`/${locale}/agent/inquiries`} className="text-primary font-semibold text-sm hover:underline">View All Leads</Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                  🎯
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">New Tour Request</h4>
                  <p className="text-sm text-gray-500">From: Amit Kumar • Apartment in Adyar • 30 mins ago</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all">✓</button>
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">✕</button>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl shadow-sm">
                  ✉️
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">Pricing Inquiry</h4>
                  <p className="text-sm text-gray-500">From: Sarah J. • Villa in ECR • 2 hours ago</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-opacity-90 transition-all">Reply</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Agent Actions</h2>
            <div className="space-y-3">
              <Link href={`/${locale}/agent/add-listing`} className="flex items-center justify-center gap-2 w-full primaryBg text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20">
                ➕ Add New Listing
              </Link>
              <Link href={`/${locale}/agent/inquiries`} className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-100 transition-all">
                👥 Lead Management
              </Link>
              <Link href={`/${locale}/agent/messages`} className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all">
                💬 Chat History
              </Link>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Goal</h3>
            <div className="space-y-4">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">Lease Target</span>
                <span className="text-primary">65% Achieved</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed italic">"Keep up the great work! You are 3 leases away from your monthly bonus."</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
