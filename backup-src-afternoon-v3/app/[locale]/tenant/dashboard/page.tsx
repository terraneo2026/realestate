"use client";

import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";

export default function TenantDashboardPage() {
  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, John!</h1>
        <p className="text-gray-600 mt-2">Here's an overview of your activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label="Saved Properties"
          value="8"
          icon="❤️"
          color="primary"
        />
        <StatsCard
          label="Recent Searches"
          value="5"
          icon="🔍"
          color="blue"
        />
        <StatsCard
          label="Inquiries Sent"
          value="3"
          icon="💬"
          color="green"
        />
        <StatsCard
          label="Tours Scheduled"
          value="2"
          icon="📅"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Saved Properties */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Saved Properties</h2>
          <div className="space-y-3">
            <p className="text-gray-500">No saved properties yet.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/properties" className="block w-full primaryBg text-white py-2 rounded-lg text-center font-semibold hover:bg-opacity-90 transition-all">
              Browse Properties
            </a>
            <a href="/saved" className="block w-full border border-primary primaryColor py-2 rounded-lg text-center font-semibold hover:primaryBgLight transition-all">
              View Saved Properties
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}