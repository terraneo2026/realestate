"use client";

import React, { useEffect, useState } from "react";
import { auth, firestore, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  FileText,
  Lock,
  ChevronRight,
  Save,
  X
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    occupation: "",
    address: "",
    companyName: "",
    agencyName: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, [locale, router]);

  const fetchUserData = async (uid: string) => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(firestore, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          fullName: data.fullName || "",
          email: data.email || "",
          mobile: data.mobile || "",
          occupation: data.occupation || "",
          address: data.address || "",
          companyName: data.companyName || "",
          agencyName: data.agencyName || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || saving) return;

    setSaving(true);
    try {
      await updateDoc(doc(firestore, "users", user.uid), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    try {
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(firestore, "users", auth.currentUser.uid), { photoURL: url });
      setUserData({ ...userData, photoURL: url });
      toast.success("Photo updated");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Photo upload failed");
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  if (authInitialized && !userData) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex flex-col items-center justify-center h-[600px] text-center p-10 bg-white rounded-[3rem] shadow-xl">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
              <AlertCircle size={40} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">Authentication Required</h2>
           <p className="text-gray-500 max-w-md mb-8 font-bold uppercase text-[10px] tracking-widest">You need to be logged in to view and manage your profile settings.</p>
           <Link 
             href={`/${locale}/login`}
             className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
           >
             Go to Login Page
           </Link>
        </div>
      </DashboardLayout>
    );
  }

  const role = userData?.role || "tenant";

  return (
    <DashboardLayout userRole={role}>
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
           <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Account Profile</h1>
              <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Manage your identity & personal preferences</p>
           </div>
           <div className={cn(
             "px-6 py-3 rounded-2xl flex items-center gap-3 border shadow-sm",
             userData?.kyc_status === 'verified' ? "bg-green-50 border-green-100 text-green-600" : "bg-amber-50 border-amber-100 text-amber-600"
           )}>
             {userData?.kyc_status === 'verified' ? <ShieldCheck size={20} /> : <AlertCircle size={20} />}
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">Account Status</p>
                <p className="text-xs font-black uppercase mt-1">{userData?.kyc_status || 'Unverified'}</p>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Sidebar: Avatar & Quick Info */}
           <div className="space-y-10">
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 right-0 h-32 bg-gray-50 -z-0" />
                 <div className="relative z-10">
                    <div className="relative inline-block group">
                       <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 shadow-2xl border-2 border-gray-50 overflow-hidden mb-6 mx-auto">
                          {userData?.photoURL ? (
                            <img src={userData.photoURL} alt="" className="w-full h-full object-cover rounded-[2.2rem]" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                               <User size={48} />
                            </div>
                          )}
                       </div>
                       <label className="absolute bottom-4 right-0 w-10 h-10 bg-primary text-white rounded-xl shadow-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-all">
                          <Camera size={18} />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                       </label>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{userData?.fullName}</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 bg-primary/5 px-4 py-1 rounded-full w-fit mx-auto border border-primary/10">
                       Verified {role}
                    </p>
                 </div>
                 
                 <div className="mt-10 pt-10 border-t border-gray-50 space-y-4 text-left">
                    <div className="flex items-center gap-4 text-gray-400">
                       <Mail size={16} />
                       <span className="text-xs font-bold truncate">{userData?.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                       <Phone size={16} />
                       <span className="text-xs font-bold">{userData?.mobile}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                       <MapPin size={16} />
                       <span className="text-xs font-bold truncate">{userData?.address || 'Address not set'}</span>
                    </div>
                 </div>
              </div>

              {/* KYC Status Card */}
              <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
                 <h3 className="text-xl font-black mb-4 tracking-tight">Identity Verification</h3>
                 <p className="text-gray-400 text-xs mb-8 leading-relaxed font-bold tracking-tight uppercase">Verified profiles have higher trust and unlock premium features.</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="flex items-center gap-3">
                          <FileText size={18} className="text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">ID Proof</span>
                       </div>
                       {userData?.kyc_status === 'verified' ? <CheckCircle2 size={16} className="text-green-400" /> : <Lock size={16} className="text-gray-600" />}
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                       <div className="flex items-center gap-3">
                          <Briefcase size={18} className="text-gray-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Work Details</span>
                       </div>
                       {userData?.kyc_status === 'verified' ? <CheckCircle2 size={16} className="text-green-400" /> : <Lock size={16} className="text-gray-600" />}
                    </div>
                    <button className="w-full mt-4 py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl">
                       {userData?.kyc_status === 'verified' ? 'View KYC Docs' : 'Start Verification'}
                    </button>
                 </div>
              </div>
           </div>

           {/* Main Form Area */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center">
                          <User size={20} className="text-primary" />
                       </div>
                       <h2 className="text-2xl font-black text-gray-900 tracking-tight">Profile Details</h2>
                    </div>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                 </div>

                 <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            type="text" 
                            disabled={true} // Locked after registration
                            value={formData.fullName}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none font-bold text-gray-400 cursor-not-allowed"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 disabled:text-gray-400"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                            type="email" 
                            disabled={!isEditing}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 disabled:text-gray-400"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Occupation</label>
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            value={formData.occupation}
                            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                            className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 disabled:text-gray-400"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Address</label>
                       <textarea 
                         disabled={!isEditing}
                         rows={3}
                         value={formData.address}
                         onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 disabled:text-gray-400 resize-none"
                         placeholder="Enter your current residential address"
                       />
                    </div>

                    {role === 'owner' && (
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Name (Optional)</label>
                             <input 
                               type="text" 
                               disabled={!isEditing}
                               value={formData.companyName}
                               onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                               className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 disabled:text-gray-400"
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Agency Name (Optional)</label>
                             <input 
                               type="text" 
                               disabled={!isEditing}
                               value={formData.agencyName}
                               onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                               className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 disabled:text-gray-400"
                             />
                          </div>
                       </div>
                    )}

                    {isEditing && (
                      <div className="pt-6">
                         <button 
                           type="submit"
                           disabled={saving}
                           className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                         >
                            {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            Save Profile Changes
                         </button>
                      </div>
                    )}
                 </form>

                 <div className="mt-12 pt-10 border-t border-gray-50">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Security & Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <button className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/20 transition-all group">
                          <div className="flex items-center gap-4 text-left">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shadow-sm">
                                <Lock size={18} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900">Change Password</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Update your security</p>
                             </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                       </button>
                       <button className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/20 transition-all group">
                          <div className="flex items-center gap-4 text-left">
                             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors shadow-sm">
                                <ShieldCheck size={18} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900">2FA Security</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Two-factor auth</p>
                             </div>
                          </div>
                          <div className="w-10 h-6 bg-gray-200 rounded-full relative">
                             <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                          </div>
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
