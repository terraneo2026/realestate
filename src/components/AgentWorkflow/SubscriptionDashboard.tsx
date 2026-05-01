'use client';

import React, { useState } from 'react';
import { Package, Check, Coins, ShieldCheck, MapPin, Zap, Crown, Award, ChevronRight } from 'lucide-react';

const PACKAGES = [
  {
    id: 'silver',
    name: 'Silver',
    price: 5000,
    credits: 20,
    color: 'bg-gray-100',
    textColor: 'text-gray-600',
    icon: Award,
    features: ['20 Property Unlocks', '1 Territory Selection', 'Standard Support', '15-Day Exclusive Lock']
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 15000,
    credits: 100,
    color: 'bg-orange-50',
    textColor: 'text-orange-600',
    icon: Zap,
    features: ['100 Property Unlocks', '3 Territory Selections', 'Priority Support', 'Extended Lock Extensions']
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 25000,
    credits: 500,
    color: 'bg-primary/10',
    textColor: 'text-primary',
    icon: Crown,
    features: ['500 Property Unlocks', 'Unlimited Territories', 'Dedicated Relationship Manager', 'Advanced Analytics']
  }
];

export default function SubscriptionDashboard({ onSelect }: { onSelect: (pkg: any) => void }) {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Subscription Plans</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Select a package to start unlocking properties</p>
        </div>
        <div className="px-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/50 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Coins className="text-primary" size={20} />
          </div>
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Your Balance</p>
            <p className="text-lg font-black text-gray-900 leading-none mt-1">0 Credits</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div key={pkg.id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl hover:shadow-primary/10 transition-all group relative overflow-hidden">
              <div className={`absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform ${pkg.textColor}`}>
                <Icon size={120} />
              </div>
              
              <div className="relative z-10">
                <div className={`w-14 h-14 ${pkg.color} ${pkg.textColor} rounded-2xl flex items-center justify-center mb-8`}>
                  <Icon size={28} />
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-gray-900">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ One-time</span>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <Coins className="text-primary" size={16} />
                    <span className="text-xs font-black text-gray-900 uppercase">{pkg.credits} Credits Included</span>
                  </div>
                  {pkg.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                        <Check className="text-white" size={10} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onSelect(pkg)}
                  className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                >
                  Purchase Package <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-blue-50 rounded-[3rem] border border-blue-100 flex items-start gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
          <ShieldCheck className="text-blue-500" size={32} />
        </div>
        <div>
          <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-2">Exclusive Territory Protection</h4>
          <p className="text-[10px] text-blue-700/80 font-bold uppercase tracking-tight leading-relaxed max-w-2xl">
            Subscription credits allow you to unlock and lock properties exclusively for 15 days. During this period, no other agent can access the owner details or list the same property on our platform.
          </p>
        </div>
      </div>
    </div>
  );
}
