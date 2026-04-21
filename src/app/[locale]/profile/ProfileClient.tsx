"use client";

import { useState, useEffect } from "react";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DashboardLayout from "@/components/DashboardLayout";
import { Loader2, Camera, Save, X, User, ShieldCheck, Briefcase, MapPin, FileText, CheckCircle2, AlertCircle, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProfileClient() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "tenant",
    image: "",
    occupation: "",
    work_details: "",
    current_address: "",
    identity_proof: "",
    kyc_status: "pending", // active, pending, inactive
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfile({
              name: data.fullName || user.displayName || "",
              email: user.email || "",
              phone: data.phone || data.mobile || "",
              role: data.role || "tenant",
              image: data.photoURL || user.photoURL || "",
              occupation: data.occupation || "",
              work_details: data.work_details || "",
              current_address: data.current_address || "",
              identity_proof: data.identity_proof || "",
              kyc_status: data.kyc_status || "pending",
            });
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(firestore, "users", user.uid), {
          fullName: profile.name,
          phone: profile.phone,
          occupation: profile.occupation,
          work_details: profile.work_details,
          current_address: profile.current_address,
          updated_at: new Date().toISOString(),
        });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err: any) {
      toast.error("Update failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Fetching Profile...</p>
        </div>
      </div>
    );
  }

  const isVerified = profile.kyc_status === 'active';

  const content = (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">Profile Settings</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Manage your identity and preferences</p>
        </div>
        <div className="flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-gray-900 to-black relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>
            <div className="px-8 pb-10 -mt-16 relative z-10 text-center">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl">
                  <div className="w-full h-full rounded-[2rem] bg-gray-100 overflow-hidden flex items-center justify-center border-4 border-white">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={48} className="text-gray-300" />
                    )}
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-2xl shadow-xl border-4 border-white hover:scale-110 transition-all">
                    <Camera size={18} />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{profile.name || "Anonymous User"}</h2>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6">{profile.role} • {profile.email}</p>
              
              <div className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                profile.kyc_status === 'active' ? "bg-green-50 border-green-100 text-green-600" : 
                profile.kyc_status === 'pending' ? "bg-orange-50 border-orange-100 text-orange-600" :
                "bg-gray-100 border-gray-200 text-gray-400"
              )}>
                {profile.kyc_status === 'active' ? <CheckCircle2 size={14} /> : profile.kyc_status === 'pending' ? <Clock size={14} /> : <AlertCircle size={14} />}
                Account Status: {profile.kyc_status}
              </div>
            </div>
          </div>

          {/* KYC Info Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                   <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Verification</h3>
             </div>
             <p className="text-gray-400 text-xs font-bold leading-relaxed mb-6">
                Identity documents are locked after verification to ensure platform security and legal compliance.
             </p>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID Document</span>
                   <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{profile.identity_proof ? 'Uploaded' : 'Not Provided'}</span>
                </div>
                {!isVerified && (
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">
                    Update KYC Info
                  </button>
                )}
             </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 space-y-10">
            {/* Personal Info Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Work Info Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500">
                  <Briefcase size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Work & Occupation</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={profile.occupation}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Software Engineer, Business Owner, etc."
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Work Details</label>
                  <input
                    type="text"
                    name="work_details"
                    value={profile.work_details}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="Company name, location"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Current Address</h3>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase ml-1">Address Details</label>
                <textarea
                  name="current_address"
                  value={profile.current_address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 disabled:opacity-60 resize-none"
                  placeholder="Street name, City, State, ZIP"
                />
              </div>
            </div>

            {/* Submit Button */}
            {isEditing && (
              <div className="pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-primary/30 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 text-sm uppercase tracking-widest"
                >
                  {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout userRole={profile.role as any}>
      {content}
    </DashboardLayout>
  );
}

