'use client';

import React, { useState, useEffect } from 'react';
import { Map, Save, CheckCircle2, AlertCircle, Loader2, Plus, Trash2, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface RadiusConfig {
  id?: string;
  radiusKm: number;
  areaRestrictions: string[];
  cityRestrictions: string[];
  premiumOverride: boolean;
}

export default function TerritoryRadiusConfig() {
  const [configs, setConfigs] = useState<RadiusConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/admin/configuration/radius');
      const result = await res.json();
      if (result.success) {
        setConfigs(result.data || []);
      }
    } catch (error) {
      toast.error('Failed to load radius configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (config: RadiusConfig) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/configuration/radius', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Radius configuration updated');
        fetchConfigs();
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const addRestriction = (type: 'area' | 'city', value: string) => {
    if (!value.trim()) return;
    setConfigs(prev => prev.map(c => ({
      ...c,
      [type === 'area' ? 'areaRestrictions' : 'cityRestrictions']: [
        ...(type === 'area' ? c.areaRestrictions : c.cityRestrictions),
        value.trim()
      ]
    })));
  };

  const removeRestriction = (type: 'area' | 'city', index: number) => {
    setConfigs(prev => prev.map(c => ({
      ...c,
      [type === 'area' ? 'areaRestrictions' : 'cityRestrictions']: 
        (type === 'area' ? c.areaRestrictions : c.cityRestrictions).filter((_, i) => i !== index)
    })));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Default config if none exists
  const config = configs[0] || {
    radiusKm: 10,
    areaRestrictions: [],
    cityRestrictions: [],
    premiumOverride: false
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
          <Map className="text-orange-500" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Territory Radius Settings</h2>
          <p className="text-sm text-gray-500 font-medium">Configure agent operating radius and restrictions</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Radius Setting */}
        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">
            Maximum Operating Radius (KM)
          </label>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="number"
                value={config.radiusKm}
                onChange={(e) => setConfigs([{ ...config, radiusKm: Number(e.target.value) }])}
                className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl focus:border-orange-500 outline-none transition-all font-bold text-gray-900"
                placeholder="10"
                min="1"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold uppercase text-[10px]">KM</span>
            </div>
          </div>
        </div>

        {/* Restrictions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City Restrictions */}
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">
              Restricted Cities
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter city name..."
                  className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-xl focus:border-orange-500 outline-none text-sm font-medium"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addRestriction('city', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {config.cityRestrictions.map((city, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
                    {city}
                    <button onClick={() => removeRestriction('city', i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
                {config.cityRestrictions.length === 0 && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase italic">No city restrictions</span>
                )}
              </div>
            </div>
          </div>

          {/* Area Restrictions */}
          <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 px-1">
              Restricted Localities
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter locality..."
                  className="flex-1 px-4 py-2 bg-white border border-gray-100 rounded-xl focus:border-orange-500 outline-none text-sm font-medium"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addRestriction('area', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {config.areaRestrictions.map((area, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold text-gray-600 flex items-center gap-2">
                    {area}
                    <button onClick={() => removeRestriction('area', i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
                {config.areaRestrictions.length === 0 && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase italic">No locality restrictions</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Settings */}
        <div className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-orange-100">
              <Globe className="text-orange-500" size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 tracking-tight">Premium Override</p>
              <p className="text-[10px] text-gray-500 font-medium">Allow Platinum agents to bypass radius limits</p>
            </div>
          </div>
          <button
            onClick={() => setConfigs([{ ...config, premiumOverride: !config.premiumOverride }])}
            className={`w-12 h-6 rounded-full transition-all relative ${config.premiumOverride ? 'bg-orange-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.premiumOverride ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => handleUpdate(config)}
            disabled={saving}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-orange-500 transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save Territory Settings
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          <strong>Note:</strong> Radius settings affect lead allocation and property visibility for agents. Existing locks will not be affected until they expire.
        </p>
      </div>
    </div>
  );
}
