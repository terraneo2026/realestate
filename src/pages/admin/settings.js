import React, { useState, useEffect } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db } from '@/admin/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Save, Settings as SettingsIcon, Globe, Palette, MessageSquare, Loader2 } from 'lucide-react';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data());
        } else {
          // Default settings if none exist
          setSettings({
            system_name: 'Relocate',
            company_email: 'info@relocate.biz',
            company_phone: '+91 81253 84888',
            company_address: 'Bhuj, Gujarat',
            system_color: '#087C7C',
            facebook: '',
            instagram: '',
            twitter: '',
            linkedin: '',
            seo_title: 'Relocate - Premium Properties for Rent & Lease',
            seo_description: 'Discover the best rental and lease properties in your area.'
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, 'settings', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, settings);
      } else {
        const { setDoc } = await import('firebase/firestore');
        await setDoc(docRef, settings);
      }
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update failed: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#087C7C]" size={48} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">System settings</h2>
          <p className="text-gray-500 mt-2 font-semibold">Manage your website's global configuration</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-10">
            {/* General Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 text-[#087C7C]">
                <Globe size={20} />
                <h3 className="text-lg font-bold tracking-tight">General configuration</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">System name</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold"
                    value={settings.system_name || ''}
                    onChange={(e) => setSettings({ ...settings, system_name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">Contact email</label>
                  <input
                    type="email"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold"
                    value={settings.company_email || ''}
                    onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">Contact phone</label>
                  <input
                    type="tel"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold"
                    value={settings.company_phone || ''}
                    onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">Company address</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold"
                    value={settings.company_address || ''}
                    onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Social Media Settings */}
            <div className="space-y-6 pt-10 border-t border-gray-50">
              <div className="flex items-center space-x-3 text-[#087C7C]">
                <MessageSquare size={20} />
                <h3 className="text-lg font-bold tracking-tight">Social media links</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {['facebook', 'instagram', 'twitter', 'linkedin'].map(platform => (
                  <div key={platform} className="space-y-3">
                    <label className="text-sm font-bold text-gray-400 capitalize tracking-tight">{platform} URL</label>
                    <input
                      type="url"
                      placeholder={`https://${platform}.com/yourprofile`}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold"
                      value={settings[platform] || ''}
                      onChange={(e) => setSettings({ ...settings, [platform]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SEO Settings */}
            <div className="space-y-6 pt-10 border-t border-gray-50">
              <div className="flex items-center space-x-3 text-[#087C7C]">
                <Globe size={20} />
                <h3 className="text-lg font-bold tracking-tight">SEO configuration</h3>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">Meta title</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold"
                    value={settings.seo_title || ''}
                    onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">Meta description</label>
                  <textarea
                    rows={3}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold resize-none"
                    value={settings.seo_description || ''}
                    onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="space-y-6 pt-10 border-t border-gray-50">
              <div className="flex items-center space-x-3 text-[#087C7C]">
                <Palette size={20} />
                <h3 className="text-lg font-bold tracking-tight">Theme & appearance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400 tracking-tight">Primary color</label>
                  <div className="flex space-x-4">
                    <input
                      type="color"
                      className="w-16 h-14 bg-transparent border-none outline-none cursor-pointer"
                      value={settings.system_color || '#087C7C'}
                      onChange={(e) => setSettings({ ...settings, system_color: e.target.value })}
                    />
                    <input
                      type="text"
                      className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none font-bold "
                      value={settings.system_color || '#087C7C'}
                      onChange={(e) => setSettings({ ...settings, system_color: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={saving}
              className="w-full max-w-xs bg-[#087C7C] text-white font-bold py-4 rounded-2xl shadow-xl shadow-[#087C7C]/20 hover:bg-[#066666] transition-all disabled:opacity-50 flex items-center justify-center text-base tracking-tight"
            >
              {saving ? <Loader2 className="animate-spin mr-3" size={20} /> : <Save className="mr-3" size={20} />}
              Save changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
