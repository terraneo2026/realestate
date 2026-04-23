'use client';

import React from 'react';
import PropertyForm from '@/components/PropertyForm/PropertyForm';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminAddPropertyPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <AdminLayout>
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/admin/properties`}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Add New Property</h1>
            <p className="text-gray-500 font-bold tracking-tight uppercase text-[10px] mt-1">Directly list a property on the platform</p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-8">
          <PropertyForm />
        </div>
      </div>
    </AdminLayout>
  );
}
