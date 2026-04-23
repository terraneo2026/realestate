import React from 'react';
import AdminUsersClient from './AdminUsersClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'User & Role Management | Admin | Relocate',
  description: 'Manage platform staff roles and security permissions',
};

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
