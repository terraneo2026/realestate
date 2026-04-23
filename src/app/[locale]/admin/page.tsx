import React from 'react';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard | Relocate',
  description: 'Relocate Operational Control Center',
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
