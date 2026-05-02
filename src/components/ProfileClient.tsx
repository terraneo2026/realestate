"use client";

import React, { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ChevronRight,
  Edit2,
  Save,
  X,
  Lock,
  Building2,
  Briefcase
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import OwnerKYCForm from "@/components/OwnerWorkflow/OwnerKYCForm";
import AgentKYCForm from "@/components/AgentWorkflow/AgentKYCForm";
import TenantKYCForm from "@/components/TenantWorkflow/TenantKYCForm";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProfileClientProps {
  role: "tenant" | "owner" | "agent" | "staff";
}

export default function ProfileClient({ role }: ProfileClientProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    aadhaarNumber: "",
    licenseNumber: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          fullName: data.fullName || data.name || "",
          mobile: data.mobile || "",
          address: data.address || "",
          aadhaarNumber: data.aadhaarNumber || "",
          licenseNumber: data.licenseNumber || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
        ...formData,
        updatedAt: new Date()
      });
      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole={role}>
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  if (showKYC) {
    return (
      <DashboardLayout userRole={role}>
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => setShowKYC(false)}
            className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all"
          >
            <ChevronRight className="rotate-180" size={14} /> Back to Profile
          </button>
          {role === 'owner' && <OwnerKYCForm onComplete={() => { setShowKYC(false); fetchUserData(auth.currentUser?.uid || ""); }} />}
          {role === 'agent' && <AgentKYCForm onComplete={() => { setShowKYC(false); fetchUserData(auth.currentUser?.uid || ""); }} />}
          {role === 'tenant' && <TenantKYCForm onComplete={() => { setShowKYC(false); fetchUserData(auth.currentUser?.uid || ""); }} />}
        </div>
      </DashboardLayout>
    );
  }

  const kycStatus = userData?.kyc_status || 'unverified';
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <DashboardLayout userRole={role}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">{roleName} Profile</h1>
            <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Manage your personal information and account settings</p>
          </div>
          <div className="flex items-center gap-3">
             <div className={cn(
               "px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest border-2",
               kycStatus === 'verified' ? "bg-green-50 border-green-100 text-green-600" :
               kycStatus === 'pending' ? "bg-orange-50 border-orange-100 text-orange-600" :
               "bg-red-50 border-red-100 text-red-600"
             )}>
                {kycStatus === 'verified' ? <CheckCircle2 size={16} /> : 
                 kycStatus === 'pending' ? <Clock size={16} /> : 
                 <AlertCircle size={16} />}
                KYC Status: {kycStatus}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-32 bg-primary/5" />
               
               <div className="relative mt-8">
                  <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl border-4 border-white flex items-center justify-center text-primary overflow-hidden group">
                     {userData?.photoURL ? (
                       <img src={userData.photoURL} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                       <UserIcon size={48} strokeWidth={1.5} />
                     )}
                     <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white backdrop-blur-sm">
                        <Camera size={24} />
                     </button>
                  </div>
                  {kycStatus === 'verified' && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                       <CheckCircle2 size={18} />
                    </div>
                  )}
               </div>

               <h2 className="text-2xl font-black text-gray-900 mt-6 tracking-tight">{userData?.fullName || userData?.name || "User Name"}</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Relocate {roleName}</p>
               
               <div className="w-full mt-10 pt-10 border-t border-gray-50 space-y-4">
                  <div className="flex items-center gap-4 text-left">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <Mail size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-sm font-bold text-gray-700 truncate">{userData?.email}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-left">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                        <ShieldCheck size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">User ID</p>
                        <p className="text-sm font-bold text-gray-700 truncate">{auth.currentUser?.uid.substring(0, 12)}...</p>
                     </div>
                  </div>
               </div>
            </div>

            {kycStatus !== 'verified' && (
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
                <h3 className="text-xl font-black mb-4 tracking-tight">KYC Verification</h3>
                <p className="text-gray-400 text-[10px] mb-8 leading-relaxed font-bold tracking-tight uppercase">Submit your documents to get verified and unlock full platform benefits.</p>
                <button 
                  onClick={() => setShowKYC(true)}
                  className="flex items-center justify-center gap-3 w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
                >
                  Start Verification <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Main Form Section */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                   <h3 className="text-xl font-black text-gray-900 tracking-tight">Account Details</h3>
                   {!isEditing ? (
                     <button 
                       onClick={() => setIsEditing(true)}
                       className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                     >
                       <Edit2 size={14} /> Edit Profile
                     </button>
                   ) : (
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                         >
                          <X size={16} />
                        </button>
                        <button 
                          onClick={handleUpdateProfile}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                          Save Changes
                        </button>
                     </div>
                   )}
                </div>

                <form className="p-10 space-y-8" onSubmit={handleUpdateProfile}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                         <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                              disabled={!isEditing}
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm disabled:opacity-60"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                         <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                              disabled={!isEditing}
                              type="text"
                              value={formData.mobile}
                              onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm disabled:opacity-60"
                            />
                         </div>
                      </div>
                      {role === 'agent' && (
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">RERA / License Number</label>
                           <div className="relative">
                              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input 
                                disabled={!isEditing}
                                type="text"
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm disabled:opacity-60"
                                placeholder="TS-RERA-XXXXX"
                              />
                           </div>
                        </div>
                      )}
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
                         <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                              disabled
                              type="text"
                              value={`Relocate ${roleName}`}
                              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-100 rounded-2xl outline-none transition-all font-black text-[10px] uppercase tracking-widest text-gray-500"
                            />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Permanent Address</label>
                      <div className="relative">
                         <MapPin className="absolute left-4 top-4 text-gray-400" size={16} />
                         <textarea 
                           disabled={!isEditing}
                           value={formData.address}
                           onChange={(e) => setFormData({...formData, address: e.target.value})}
                           className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm min-h-[120px] disabled:opacity-60"
                           placeholder="Enter your full address..."
                         />
                      </div>
                   </div>
                </form>

                <div className="p-10 bg-gray-50/50 border-t border-gray-50">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm border border-gray-100">
                            <Lock size={20} />
                         </div>
                         <div>
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Security & Password</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update your login credentials securely</p>
                         </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                      >
                         Change Password
                      </button>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </DashboardLayout>
  );
}
