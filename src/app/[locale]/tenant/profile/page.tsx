"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";

import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TenantProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const [authInitialized, setAuthInitialized] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(firestore, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || data.mobile || "",
          });
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, [locale, router]);

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  if (authInitialized && !auth.currentUser) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="flex flex-col items-center justify-center h-[600px] text-center p-10 bg-white rounded-[3rem] shadow-xl">
           <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
              <AlertCircle size={40} />
           </div>
           <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase">Authentication Required</h2>
           <p className="text-gray-500 max-w-md mb-8 font-bold uppercase text-[10px] tracking-widest">You need to be logged in to view and manage your tenant profile.</p>
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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(firestore, "users", user.uid), profile);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-gray-600 mt-2 font-medium">Manage your personal information</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        {loading ? (
          <div className="py-10 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 tracking-widest">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary outline-none font-bold disabled:opacity-60"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 tracking-widest">Email Address</label>
              <input
                type="email"
                disabled
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold opacity-60"
                value={profile.email}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 tracking-widest">Phone Number</label>
              <input
                type="tel"
                disabled={!isEditing}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary outline-none font-bold disabled:opacity-60"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="pt-4 flex gap-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 primaryBg text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 primaryBg text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
