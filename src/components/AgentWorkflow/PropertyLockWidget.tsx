'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Timer, ShieldCheck, AlertCircle, ChevronRight, Unlock } from 'lucide-react';

interface LockProps {
  propertyId: string;
  status: 'available' | 'locked_by_agent' | 'rented';
  expiresAt?: string;
  isOwnLock?: boolean;
  onUnlock: () => void;
}

export default function PropertyLockWidget({ propertyId, status, expiresAt, isOwnLock, onUnlock }: LockProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (expiresAt) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(expiresAt).getTime() - now;
        
        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft('EXPIRED');
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }, 60000);

      return () => clearInterval(timer);
    }
  }, [expiresAt]);

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl overflow-hidden relative group">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          status === 'locked_by_agent' ? (isOwnLock ? "bg-primary/10 text-primary" : "bg-red-50 text-red-500") : "bg-green-50 text-green-500"
        }`}>
          {status === 'locked_by_agent' ? <Lock size={28} /> : <Unlock size={28} />}
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">
            {status === 'locked_by_agent' ? (isOwnLock ? "Your Exclusive Lock" : "Property Locked") : "Available for Lock"}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">15-Day Protection Rules Apply</p>
        </div>
      </div>

      {status === 'locked_by_agent' && (
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                <Timer size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Time Remaining</p>
                <p className="text-lg font-black text-gray-900 leading-none mt-1 uppercase">{timeLeft}</p>
              </div>
            </div>
            {isOwnLock && (
              <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                Extend Lock
              </button>
            )}
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
            <ShieldCheck size={18} className="text-blue-500 shrink-0" />
            <p className="text-[10px] text-blue-700 font-bold uppercase tracking-tight leading-relaxed">
              {isOwnLock ? "No other agent can view owner details or close this deal for the next 15 days." : "This property is exclusively locked by another agent. It will be available if the lock expires."}
            </p>
          </div>
        </div>
      )}

      {status === 'available' && (
        <div className="space-y-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-tight leading-relaxed">
            Unlock this property exclusively for 15 days. Use 1 credit to get owner details and lock the deal.
          </p>
          <button 
            onClick={onUnlock}
            className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
          >
            Unlock Property <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
