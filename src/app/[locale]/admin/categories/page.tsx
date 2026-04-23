import React from 'react';
import AdminCategoriesClient from './AdminCategoriesClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Category Master | Admin | Relocate',
  description: 'Manage platform property categories and types',
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesClient />;
}
