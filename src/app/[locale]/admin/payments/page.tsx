import React from 'react';
import AdminPaymentsClient from './AdminPaymentsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Financial Auditing | Admin | Relocate',
  description: 'Monitor platform revenue and transactions',
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsClient />;
}
