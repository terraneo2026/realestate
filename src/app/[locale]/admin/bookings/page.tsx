import React from 'react';
import AdminBookingsClient from './AdminBookingsClient';

export const metadata = {
  title: 'Booking Management | Admin',
  description: 'Manage property visits and reservations',
};

export default function AdminBookingsPage() {
  return <AdminBookingsClient />;
}
