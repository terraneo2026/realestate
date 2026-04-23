import React from 'react';
import AdminCustomersClient from './AdminCustomersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Customer Management | Admin | Relocate',
  description: 'Manage platform users, tenants, and owners',
};

export default function AdminCustomersPage() {
  return <AdminCustomersClient />;
}
