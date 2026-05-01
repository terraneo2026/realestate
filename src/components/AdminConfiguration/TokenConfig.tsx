'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TokenConfig {
  id?: string;
  category: string;
  tokenAmount: number;
  active: boolean;
}

export default function TokenConfig() {
  const [configs, setConfigs] = useState<TokenConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/admin/configuration/tokens');
      const result = await res.json();
      if (result.success) {
        setConfigs(result.data);
      }
    } catch (error) {
      toast.error('Failed to load token configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (config: TokenConfig) => {
    setSaving(config.category);
    try {
      const res = await fetch('/api/admin/configuration/tokens', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`${config.category} tokens updated`);
        fetchConfigs();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(null);
    }
  };

  const updateLocalAmount = (category: string, amount: number) => {
    setConfigs(prev => prev.map(c => 
      c.category === category ? { ...c, tokenAmount: amount } : c
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const categories = ['Budget', 'Mid Range', 'Premium', 'Luxury'];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Coins className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Token Configuration</h2>
          <p className="text-sm text-gray-500 font-medium">Set token amounts per property category</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => {
          const config = configs.find(c => c.category === cat) || { category: cat, tokenAmount: 0, active: true };
          return (
            <div key={cat} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 hover:border-primary/20 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100">
                  {cat}
                </span>
                {config.active ? (
                  <CheckCircle2 size={16} className="text-green-500" />
                ) : (
                  <AlertCircle size={16} className="text-gray-300" />
                )}
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={config.tokenAmount}
                    onChange={(e) => updateLocalAmount(cat, Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold text-gray-900"
                    placeholder="0.00"
                  />
                </div>
                
                <button
                  onClick={() => handleUpdate(config)}
                  disabled={saving === cat}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all disabled:opacity-50"
                >
                  {saving === cat ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          <strong>Important:</strong> Changes to token amounts will only apply to future visit requests. Existing requests will maintain the price they were created with.
        </p>
      </div>
    </div>
  );
}
