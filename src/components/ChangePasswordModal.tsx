"use client";

import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { 
  X, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("No user found");

      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);
      
      toast.success("Password updated successfully!");
      onClose();
      // Reset state
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect current password");
      } else {
        toast.error("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                 <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Security Update</h3>
           </div>
           <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all">
              <X size={20} />
           </button>
        </div>

        <form onSubmit={handleUpdatePassword} className="p-10 space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type={showCurrent ? "text" : "password"}
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                   required
                   className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                   placeholder="Enter current password"
                 />
                 <button 
                   type="button"
                   onClick={() => setShowCurrent(!showCurrent)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-all"
                 >
                   {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type={showNew ? "text" : "password"}
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   required
                   className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                   placeholder="At least 6 characters"
                 />
                 <button 
                   type="button"
                   onClick={() => setShowNew(!showNew)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-all"
                 >
                   {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                   type={showConfirm ? "text" : "password"}
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   required
                   className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                   placeholder="Confirm new password"
                 />
                 <button 
                   type="button"
                   onClick={() => setShowConfirm(!showConfirm)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-all"
                 >
                   {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
           </div>

           <div className="pt-4 flex gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/20 hover:bg-primary transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                {loading ? "Updating..." : "Confirm Update"}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}
