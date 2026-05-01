'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Loader2, User, Globe, Laptop, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  adminId: string;
  adminName?: string;
  module: string;
  action: string;
  oldValue: any;
  newValue: any;
  ipAddress: string;
  deviceInfo: string;
  timestamp: any;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = moduleFilter 
        ? `/api/admin/configuration/logs?module=${moduleFilter}`
        : '/api/admin/configuration/logs';
      const res = await fetch(url);
      const result = await res.json();
      if (result.success) {
        setLogs(result.data);
      }
    } catch (error) {
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Handle Firestore timestamp
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleString();
  };

  const modules = [
    { id: '', label: 'All Modules' },
    { id: 'TOKEN_CONFIG', label: 'Tokens' },
    { id: 'COMMISSION_CONFIG', label: 'Commissions' },
    { id: 'AGENT_PACKAGES', label: 'Packages' },
    { id: 'PROPERTY_RULES', label: 'Property Rules' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
            <History className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Audit Trail</h2>
            <p className="text-sm text-gray-500 font-medium">Track all system configuration changes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
          {modules.map(mod => (
            <button
              key={mod.id}
              onClick={() => setModuleFilter(mod.id)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all ${
                moduleFilter === mod.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {mod.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action / Timestamp</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin / Device</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Module</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Changes</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="animate-spin inline text-primary" /></td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={4} className="py-12 text-center text-gray-400 font-bold">No audit logs found</td></tr>
            ) : logs.map(log => (
              <tr key={log.id} className="group hover:scale-[1.01] transition-all">
                <td className="px-6 py-6 bg-gray-50/50 rounded-l-[2rem] border-y border-l border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      log.action === 'CREATE' ? 'text-green-500' : 
                      log.action === 'UPDATE' ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{formatDate(log.timestamp)}</span>
                  </div>
                </td>
                <td className="px-6 py-6 bg-gray-50/50 border-y border-gray-100">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                      <User size={12} className="text-gray-400" /> {log.adminName || log.adminId}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-gray-400">
                      <Globe size={10} /> {log.ipAddress} <span className="mx-1">•</span> <Laptop size={10} /> {log.deviceInfo.split(' ')[0]}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 bg-gray-50/50 border-y border-gray-100">
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {log.module.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-6 bg-gray-50/50 rounded-r-[2rem] border-y border-r border-gray-100 text-right">
                  <button className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary rounded-xl shadow-sm transition-all">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
