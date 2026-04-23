import React from 'react';
import AdminAgentsClient from './AdminAgentsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Agents & Partners | Admin | Relocate',
  description: 'Manage sales staff, brokers, and partner agencies',
};

export default function AdminAgentsPage() {
  return <AdminAgentsClient />;
}
