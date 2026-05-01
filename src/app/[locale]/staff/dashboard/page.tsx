'use client';

import React from 'react';
import StaffDashboard from '@/components/StaffWorkflow/StaffDashboard';
import DashboardLayout from '@/components/DashboardLayout';

export default function StaffDashboardPage() {
  // Mock stats for now
  const stats = {
    pendingTasks: 5,
    completedToday: 3,
    performanceScore: 94,
    activeEscorts: 2
  };

  return (
    <DashboardLayout userRole="staff">
      <div className="p-4 md:p-8">
        <StaffDashboard stats={stats} role="FIELD_VERIFICATION_STAFF" />
      </div>
    </DashboardLayout>
  );
}
