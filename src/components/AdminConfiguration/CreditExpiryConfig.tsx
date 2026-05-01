'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CreditExpiryRule {
  id?: string;
  policyName: string;
  durationDays: number;
  active: boolean;
}

export default function CreditExpiryConfig() {
  const [rules, setRules] = useState<CreditExpiryRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/admin/configuration/expiry');
      const result = await res.json();
      if (result.success) {
        setRules(result.data || []);
      }
    } catch (error) {
      toast.error('Failed to load credit expiry rules');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (rule: CreditExpiryRule) => {
    setSaving(rule.id || rule.policyName);
    try {
      const res = await fetch('/api/admin/configuration/expiry', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`${rule.policyName} policy updated`);
        fetchRules();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(null);
    }
  };

  const updateLocalRule = (index: number, field: keyof CreditExpiryRule, value: any) => {
    setRules(prev => prev.map((r, i) => 
      i === index ? { ...r, [field]: value } : r
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
          <BellRing className="text-red-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Credit Expiry Rules</h2>
          <p className="text-sm text-gray-500 font-medium">Manage how and when agent credits expire</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule, index) => (
          <div key={rule.id || index} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-red-500/20 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                  {rule.policyName}
                </span>
              </div>
              <button
                onClick={() => updateLocalRule(index, 'active', !rule.active)}
                className={`w-10 h-5 rounded-full transition-all relative ${rule.active ? 'bg-red-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${rule.active ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">
                  Duration (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={rule.durationDays}
                    onChange={(e) => updateLocalRule(index, 'durationDays', Number(e.target.value))}
                    className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-red-500 outline-none transition-all font-bold text-gray-900"
                    placeholder="30"
                    min="1"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase text-[10px]">Days</span>
                </div>
              </div>
              
              <button
                onClick={() => handleUpdate(rule)}
                disabled={!!saving}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 transition-all shadow-lg shadow-gray-200 disabled:opacity-50"
              >
                {saving === (rule.id || rule.policyName) ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Apply Policy
              </button>
            </div>
          </div>
        ))}
        
        {rules.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">No expiry policies found</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
        <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 font-medium leading-relaxed">
          <strong>Important:</strong> Credit expiry rules apply ONLY to newly purchased credits. Credits already in an agent's wallet will maintain their original expiry date. Expired credits are automatically removed via a scheduled background job.
        </p>
      </div>
    </div>
  );
}
