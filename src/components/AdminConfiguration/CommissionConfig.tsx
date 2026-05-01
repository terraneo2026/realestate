'use client';

import React, { useState, useEffect } from 'react';
import { Percent, Save, Loader2, Calendar, FileText, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CommissionConfig {
  id?: string;
  side: 'tenant' | 'owner_direct' | 'owner_agent';
  type: 'fixed' | 'percentage' | 'per_day';
  value: number;
  active: boolean;
  effectiveFrom: string;
  remarks: string;
}

export default function CommissionConfig() {
  const [configs, setConfigs] = useState<CommissionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/admin/configuration/commissions');
      const result = await res.json();
      if (result.success) {
        setConfigs(result.data);
      }
    } catch (error) {
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: CommissionConfig) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/configuration/commissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Commission configuration saved');
        fetchConfigs();
      }
    } catch (error) {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const sides = [
    { id: 'tenant', label: 'Tenant Commission' },
    { id: 'owner_direct', label: 'Owner (Direct Deal)' },
    { id: 'owner_agent', label: 'Owner (Agent Deal)' }
  ];

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin inline text-primary" /></div>;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
          <Percent className="text-indigo-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Commission Engine</h2>
          <p className="text-sm text-gray-500 font-medium">Manage multi-side commission rules</p>
        </div>
      </div>

      <div className="space-y-8">
        {sides.map(side => {
          const config = configs.find(c => c.side === side.id && c.active) || {
            side: side.id as any,
            type: 'percentage',
            value: 0,
            active: true,
            effectiveFrom: new Date().toISOString().split('T')[0],
            remarks: ''
          };

          return (
            <div key={side.id} className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900">{side.label}</h3>
                <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-gray-100 shadow-sm">
                  {['fixed', 'percentage', 'per_day'].map(type => (
                    <button
                      key={type}
                      onClick={() => setConfigs(prev => prev.map(c => c.side === side.id ? { ...c, type: type as any } : c))}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${
                        config.type === type ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                      {config.type === 'fixed' ? '₹' : config.type === 'percentage' ? '%' : 'D'}
                    </span>
                    <input
                      type="number"
                      value={config.value}
                      onChange={(e) => setConfigs(prev => prev.map(c => c.side === side.id ? { ...c, value: Number(e.target.value) } : c))}
                      className="w-full pl-8 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Effective From</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      value={config.effectiveFrom}
                      onChange={(e) => setConfigs(prev => prev.map(c => c.side === side.id ? { ...c, effectiveFrom: e.target.value } : c))}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Actions</label>
                  <button
                    onClick={() => handleSave(config)}
                    disabled={saving}
                    className="w-full h-[58px] bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Apply Rules
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <textarea
                  placeholder="Add internal remarks about this change..."
                  value={config.remarks}
                  onChange={(e) => setConfigs(prev => prev.map(c => c.side === side.id ? { ...c, remarks: e.target.value } : c))}
                  className="w-full p-4 bg-white border-2 border-transparent rounded-2xl focus:border-indigo-500 outline-none transition-all font-medium text-sm min-h-[80px]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
