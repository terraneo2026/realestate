'use client';

import React, { useEffect, useState } from 'react';
import { firestore, auth } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Zap, Check, Loader2, Star, ShieldCheck, Crown } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { subscribeToPackage } from '@/lib/subscriptions';
import { useRouter } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AgentPackagesClient() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        setUser(user);
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentPlan(userSnap.data().plan || 'free');
        }
      } else {
        router.push('/login');
      }
    });

    const unsubscribePackages = onSnapshot(collection(firestore, 'packages'), (snap) => {
      const pkgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Sort by price
      pkgs.sort((a, b) => (a.price || 0) - (b.price || 0));
      setPackages(pkgs);
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribePackages();
    };
  }, [router]);

  const handleSubscribe = async (pkg: any) => {
    if (!user) return;
    if (currentPlan === pkg.name) {
      toast.info("You are already on this plan");
      return;
    }

    setSubscribing(pkg.id);
    try {
      const success = await subscribeToPackage(user.uid, pkg);
      if (success) {
        setCurrentPlan(pkg.name);
        toast.success(`Successfully subscribed to ${pkg.name}!`);
      } else {
        toast.error("Failed to process subscription");
      }
    } catch (error) {
      toast.error("An error occurred during subscription");
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <DashboardLayout userRole="agent">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Premium Packages</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Upgrade your account to list more properties and get more leads</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary mb-4" size={48} />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading available plans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Free Plan (Hardcoded default) */}
          <div className={cn(
            "bg-white rounded-[3rem] p-10 shadow-xl border-2 transition-all flex flex-col justify-between relative overflow-hidden",
            currentPlan === 'free' ? "border-primary shadow-primary/10" : "border-gray-50 hover:border-gray-200"
          )}>
            {currentPlan === 'free' && (
              <div className="absolute top-6 right-6 bg-primary text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                Current Plan
              </div>
            )}
            <div>
              <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-400 mb-8">
                <Star size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase mb-2">Free Starter</h3>
              <p className="text-5xl font-black text-gray-900 mb-8">₹0<span className="text-sm font-bold text-gray-400 ml-1">/ lifetime</span></p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  2 Property Listings
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                  <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  Basic Lead Notifications
                </div>
              </div>
            </div>
            <button 
              disabled={currentPlan === 'free'}
              className={cn(
                "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                currentPlan === 'free' ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-black shadow-xl"
              )}
            >
              {currentPlan === 'free' ? 'Already Active' : 'Select Plan'}
            </button>
          </div>

          {/* Dynamic Plans from Firestore */}
          {packages.map((pkg) => {
            const isCurrent = currentPlan === pkg.name;
            const isSubscribingThis = subscribing === pkg.id;
            
            return (
              <div key={pkg.id} className={cn(
                "bg-white rounded-[3rem] p-10 shadow-xl border-2 transition-all flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02]",
                isCurrent ? "border-primary shadow-primary/10" : "border-gray-50 hover:border-primary/20"
              )}>
                {isCurrent && (
                  <div className="absolute top-6 right-6 bg-primary text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                    Current Plan
                  </div>
                )}
                
                {/* Visual Flair for premium plans */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl",
                    isCurrent ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  )}>
                    {pkg.price > 1000 ? <Crown size={32} /> : <Zap size={32} />}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase mb-2">{pkg.name}</h3>
                  <p className="text-5xl font-black text-primary mb-8">₹{pkg.price}<span className="text-sm font-bold text-gray-400 ml-1">/ {pkg.duration} days</span></p>
                  
                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                        <Check size={14} strokeWidth={4} />
                      </div>
                      {pkg.listingLimit} Property Listings
                    </div>
                    {pkg.features?.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-100">
                          <Check size={14} strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleSubscribe(pkg)}
                  disabled={isCurrent || !!subscribing}
                  className={cn(
                    "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                    isCurrent ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-95"
                  )}
                >
                  {isSubscribingThis ? <Loader2 className="animate-spin" size={18} /> : 
                   isCurrent ? 'Already Active' : 'Upgrade Now'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-20 p-12 bg-gray-900 rounded-[3.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-black text-white uppercase mb-4 tracking-tight">Need a custom enterprise solution?</h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Contact our sales team for high-volume listing packages and custom features</p>
          </div>
          <button className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
            Contact Support
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
