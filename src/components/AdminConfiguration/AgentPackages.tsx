'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Save, Trash2, Loader2, GripVertical, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AgentPackage {
  id?: string;
  name: string;
  price: number;
  credits: number;
  expiryDuration: number;
  active: boolean;
  features: string[];
  sortOrder: number;
}

export default function AgentPackages() {
  const [packages, setPackages] = useState<AgentPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [formData, setFormData] = useState<AgentPackage>({
    name: '',
    price: 0,
    credits: 0,
    expiryDuration: 30,
    active: true,
    features: [],
    sortOrder: 0
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/admin/configuration/packages');
      const result = await res.json();
      if (result.success) {
        setPackages(result.data);
      }
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingId === 'new' ? '/api/admin/configuration/packages' : `/api/admin/configuration/packages/${editingId}`;
      const method = editingId === 'new' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();
      if (result.success) {
        toast.success(editingId === 'new' ? 'Package created' : 'Package updated');
        setEditingId(null);
        fetchPackages();
      }
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/admin/configuration/packages/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        toast.success('Package deleted');
        fetchPackages();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <div className="p-12 text-center"><Loader2 className="animate-spin inline text-primary" /></div>;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <Package className="text-emerald-500" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Agent Subscription Packages</h2>
            <p className="text-sm text-gray-500 font-medium">Control credit limits and pricing</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setEditingId('new');
            setFormData({ name: '', price: 0, credits: 0, expiryDuration: 30, active: true, features: [], sortOrder: packages.length });
          }}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={16} /> New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="relative group bg-gray-50 rounded-[2.5rem] border border-gray-100 p-8 hover:border-emerald-500/30 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={() => {
                  setEditingId(pkg.id!);
                  setFormData(pkg);
                }}
                className="p-2 bg-white rounded-lg text-gray-400 hover:text-primary shadow-sm"
              >
                <Save size={14} />
              </button>
              <button 
                onClick={() => handleDelete(pkg.id!)}
                className="p-2 bg-white rounded-lg text-gray-400 hover:text-red-500 shadow-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mb-6">
              <span className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                {pkg.active ? 'Active' : 'Inactive'}
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-3 tracking-tight">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-emerald-500">₹{pkg.price}</span>
                <span className="text-gray-400 font-bold text-xs">/ {pkg.expiryDuration} days</span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Credits</span>
                <span className="text-lg font-black text-gray-900">{pkg.credits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Visibility</span>
                <span className="text-lg font-black text-gray-900">{pkg.active ? 'Global' : 'Hidden'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">
              {editingId === 'new' ? 'Create New Package' : 'Edit Package'}
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Credits</label>
                  <input 
                    type="number" 
                    value={formData.credits}
                    onChange={(e) => setFormData({...formData, credits: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry (Days)</label>
                  <input 
                    type="number" 
                    value={formData.expiryDuration}
                    onChange={(e) => setFormData({...formData, expiryDuration: Number(e.target.value)})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-primary outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Save Package
                </button>
                <button 
                  onClick={() => setEditingId(null)}
                  className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
