"use client";

import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";

export default function OwnerDashboardPage() {
  return (
    <DashboardLayout userRole="owner">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Owner!</h1>
        <p className="text-gray-600 mt-2">Manage your properties and track inquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          label="My Properties"
          value="12"
          icon="🏠"
          color="primary"
        />
        <StatsCard
          label="Total Views"
          value="847"
          icon="👁️"
          color="blue"
        />
        <StatsCard
          label="Inquiries"
          value="24"
          icon="💬"
          color="green"
        />
        <StatsCard
          label="Messages"
          value="15"
          icon="📧"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Properties</h2>
          <div className="space-y-3">
            <p className="text-gray-500">No properties listed yet.</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Property Management</h2>
          <div className="space-y-3">
            <a href="/owner/add-property" className="block w-full primaryBg text-white py-2 rounded-lg text-center font-semibold hover:bg-opacity-90 transition-all">
              ➕ Add New Property
            </a>
            <a href="/owner/properties" className="block w-full border border-primary primaryColor py-2 rounded-lg text-center font-semibold hover:primaryBgLight transition-all">
              View All Properties
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}