"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import StatsCard from "@/components/StatsCard";
import DashboardLayout from "@/components/DashboardLayout";
import AgentKYCForm from "@/components/AgentWorkflow/AgentKYCForm";
import SubscriptionDashboard from "@/components/AgentWorkflow/SubscriptionDashboard";
import PropertyLockWidget from "@/components/AgentWorkflow/PropertyLockWidget";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Coins, 
  Lock, 
  MapPin, 
  Briefcase, 
  Plus, 
  Users, 
  Settings, 
  ChevronRight,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AgentDashboardClient() {
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc' | 'subscriptions' | 'locks'>('overview');
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, []);

  return (
    <DashboardLayout userRole="agent">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Welcome, {userData?.fullName?.split(' ')[0] || 'Agent'}!</h1>
          <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Relocate Agent Dashboard • {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setActiveTab('kyc')}
             className={cn(
               "px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest uppercase border transition-all",
               userData?.kyc_status === 'approved' ? "bg-green-50 border-green-100 text-green-600" : 
               userData?.kyc_status === 'rejected' ? "bg-red-50 border-red-100 text-red-600" :
               "bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100"
             )}
           >
             KYC: {userData?.kyc_status || 'Action Required'}
           </button>
           <div className="px-6 py-2.5 bg-gray-900 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-gray-400/20">
             <Coins size={16} className="text-primary" />
             <span className="text-xs font-black uppercase tracking-widest">120 Credits</span>
           </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 mb-10">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'locks', label: 'My Locks', icon: Lock },
          { id: 'subscriptions', label: 'Subscription', icon: Zap },
          { id: 'kyc', label: 'Verification', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-xl md:rounded-2xl transition-all whitespace-nowrap group",
                isActive 
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-400/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              )}
            >
              <Icon size={18} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard label="Active Locks" value="4" icon={<Lock size={20} className="text-primary" />} />
            <StatsCard label="Used Credits" value="12" icon={<Coins size={20} className="text-blue-500" />} />
            <StatsCard label="Leads" value="89" icon={<Users size={20} className="text-green-500" />} />
            <StatsCard label="Deals Closed" value="3" icon={<CheckCircle2 size={20} className="text-orange-500" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Property Lock Management Preview */}
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Lock size={20} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Locks</h2>
                  </div>
                  <button onClick={() => setActiveTab('locks')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Manage All</button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: 'Luxury Villa in Kokapet', expiresAt: '2026-05-10T10:00:00Z' },
                    { title: '3BHK in Gachibowli', expiresAt: '2026-05-12T15:30:00Z' },
                  ].map((lock, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <MapPin size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 uppercase text-xs">{lock.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={12} className="text-orange-500" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Expires in 12 days</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {/* Territory Widget */}
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10">
                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">My Territory</h3>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-primary" size={20} />
                    <span className="text-xs font-black text-gray-900 uppercase">Kokapet, Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-500" size={20} />
                    <span className="text-xs font-black text-gray-900 uppercase">5 KM Operating Radius</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
                  Update Territory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'locks' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-8">
          <PropertyLockWidget 
            propertyId="prop_123" 
            status="locked_by_agent" 
            isOwnLock={true} 
            expiresAt="2026-05-15T10:00:00Z" 
            onUnlock={() => {}} 
          />
          <PropertyLockWidget 
            propertyId="prop_456" 
            status="available" 
            onUnlock={() => {}} 
          />
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SubscriptionDashboard onSelect={() => {}} />
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AgentKYCForm onComplete={() => setActiveTab('overview')} />
        </div>
      )}
    </DashboardLayout>
  );
}
