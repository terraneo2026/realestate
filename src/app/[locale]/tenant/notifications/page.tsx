import React from 'react';
import TenantNotificationsClient from './TenantNotificationsClient';

export const metadata = {
  title: 'My Notifications | Relocate',
  description: 'Stay updated with your property activities',
};

export default function TenantNotificationsPage() {
  return <TenantNotificationsClient />;
}
