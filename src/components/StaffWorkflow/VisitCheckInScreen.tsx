'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Timer, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Navigation,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

export default function VisitCheckInScreen({ requestId, staffId, scheduledTime }: { requestId: string, staffId: string, scheduledTime: string }) {
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        try {
          // Mock API call to staff-engine check-in
          await new Promise(r => setTimeout(r, 1500));
          setCheckedIn(true);
          toast.success("Checked in successfully at property location");
        } catch (e) {
          toast.error("Check-in failed");
        } finally {
          setCheckingIn(false);
        }
      }, () => {
        setCheckingIn(false);
        toast.error("Location access denied. GPS is mandatory for check-in.");
      });
    }
  };

  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-2xl mx-auto overflow-hidden relative">
      {/* Visit Info Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
          <Navigation className="text-blue-500" size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Visit Check-In</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-2">
            <Timer size={14} className="text-primary" /> Scheduled: {scheduledTime}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Status Card */}
        <div className={cn(
          "p-8 rounded-[2rem] border-2 transition-all duration-500",
          checkedIn ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"
        )}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-white shadow-sm", checkedIn ? "text-green-500" : "text-gray-300")}>
                <UserCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Status</p>
                <p className="text-lg font-black text-gray-900 uppercase">
                  {checkedIn ? "Live Escort Active" : "Awaiting Arrival"}
                </p>
              </div>
            </div>
            {checkedIn && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
          </div>

          {!checkedIn ? (
            <button 
              onClick={handleCheckIn}
              disabled={checkingIn}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200"
            >
              {checkingIn ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
              Check-In at Location
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-green-100">
                <CheckCircle2 className="text-green-500" size={18} />
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Verified at {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                </span>
              </div>
              <button className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Complete Visit Report
              </button>
            </div>
          )}
        </div>

        {/* Security & Rules */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
            <ShieldCheck size={20} className="text-primary mb-3" />
            <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-tight">No Contact Exchange</p>
          </div>
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
            <AlertCircle size={20} className="text-orange-500 mb-3" />
            <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest leading-tight">Report Incidents</p>
          </div>
        </div>

        <button className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2">
          <AlertCircle size={14} /> Emergency Escalation
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
