"use client";

import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";

export default function AgentDashboardPage() {
  return (
    <DashboardLayout userRole="agent">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your listings and track sales performance</p>
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
          label="Completed Sales"
          value="12"
          icon="✅"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Listings */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Listings</h2>
          <div className="space-y-3">
            <p className="text-gray-500">No listings yet.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Listing Management</h2>
          <div className="space-y-3">
            <a href="/agent/add-listing" className="block w-full primaryBg text-white py-2 rounded-lg text-center font-semibold hover:bg-opacity-90 transition-all">
              ➕ Add New Listing
            </a>
            <a href="/agent/listings" className="block w-full border border-primary primaryColor py-2 rounded-lg text-center font-semibold hover:primaryBgLight transition-all">
              View All Listings
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}