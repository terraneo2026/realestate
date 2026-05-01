'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { 
  Settings, 
  Coins, 
  Percent, 
  Package, 
  ShieldCheck, 
  History, 
  Map, 
  LayoutDashboard,
  BellRing
} from 'lucide-react';
import TokenConfig from '@/components/AdminConfiguration/TokenConfig';
import CommissionConfig from '@/components/AdminConfiguration/CommissionConfig';
import AgentPackages from '@/components/AdminConfiguration/AgentPackages';
import TerritoryRadiusConfig from '@/components/AdminConfiguration/TerritoryRadiusConfig';
import CreditExpiryConfig from '@/components/AdminConfiguration/CreditExpiryConfig';
import AuditLogs from '@/components/AdminConfiguration/AuditLogs';

const TABS = [
  { id: 'tokens', label: 'Tokens', icon: Coins, color: 'text-primary' },
  { id: 'commissions', label: 'Commissions', icon: Percent, color: 'text-indigo-500' },
  { id: 'packages', label: 'Agent Packages', icon: Package, color: 'text-emerald-500' },
  { id: 'radius', label: 'Territory Radius', icon: Map, color: 'text-orange-500' },
  { id: 'expiry', label: 'Credit Expiry', icon: BellRing, color: 'text-red-500' },
  { id: 'audit', label: 'Audit Logs', icon: History, color: 'text-gray-900' },
];

export default function AdminConfigurationPage() {
  const [activeTab, setActiveTab] = useState('tokens');

  const renderContent = () => {
    switch (activeTab) {
      case 'tokens': return <TokenConfig />;
      case 'commissions': return <CommissionConfig />;
      case 'packages': return <AgentPackages />;
      case 'audit': return <AuditLogs />;
      case 'radius': return <TerritoryRadiusConfig />;
      case 'expiry': return <CreditExpiryConfig />;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tight uppercase truncate">Configuration</h1>
            <p className="text-gray-500 font-bold tracking-tight uppercase text-[10px] md:text-xs mt-1 md:mt-2 flex items-center gap-2">
              <Settings size={14} className="text-primary" /> System-wide business rules and platform settings
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl md:rounded-2xl transition-all whitespace-nowrap group ${
                  isActive 
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-400/20' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : tab.color} />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </div>
    </AdminLayout>
  );
}
