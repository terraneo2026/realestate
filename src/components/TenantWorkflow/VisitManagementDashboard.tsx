'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  User,
  ArrowUpRight,
  Lock,
  Timer
} from 'lucide-react';

interface VisitRequest {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  status: string;
  scheduledAt?: any;
  tokenAmount: number;
  ownerStatus: string;
  staffAssigned?: string;
}

export default function VisitManagementDashboard({ requests }: { requests: VisitRequest[] }) {
  return (
    <div className="space-y-8">
      {/* Active Requests Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Visit Management</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Track your active property requests</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active Slots</p>
            <p className="text-sm font-black text-gray-900 leading-none">{requests.length}/2 Used</p>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
            {/* Status Badge */}
            <div className="absolute top-0 right-0 p-8">
              <div className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                request.status === 'pending_owner_review' ? "bg-orange-50 text-orange-600 border border-orange-100" :
                request.status === 'visit_scheduled' ? "bg-blue-50 text-blue-600 border border-blue-100" :
                "bg-green-50 text-green-600 border border-green-100"
              )}>
                {request.status.replace(/_/g, ' ')}
                {request.status === 'pending_owner_review' && <Timer size={14} className="animate-pulse" />}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Property Image */}
              <div className="w-full md:w-64 h-48 rounded-3xl overflow-hidden relative shadow-lg">
                <img src={request.propertyImage} alt={request.propertyTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-black text-xs uppercase tracking-tight">{request.propertyTitle}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Token Paid</p>
                    <p className="text-sm font-black text-gray-900 uppercase">₹{request.tokenAmount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Owner Review</p>
                    <p className="text-sm font-black text-[#087c7c] uppercase">{request.ownerStatus}</p>
                  </div>
                  {request.scheduledAt && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Scheduled For</p>
                      <p className="text-sm font-black text-gray-900 uppercase">{request.scheduledAt}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Escort Staff</p>
                    <p className="text-sm font-black text-gray-900 uppercase">{request.staffAssigned || 'Assigning...'}</p>
                  </div>
                </div>

                {/* Anti-Bypass Alert */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-[#087c7c]" />
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight leading-relaxed">
                    Staff-supervised visit mandatory. Direct contact with owner is prohibited for safety.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  {request.status === 'visit_scheduled' ? (
                    <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      <MapPin size={14} /> View Location Proof
                    </button>
                  ) : request.status === 'completed' ? (
                    <div className="flex gap-4 w-full">
                      <button className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100">
                        <CheckCircle2 size={14} /> YES - Book Now
                      </button>
                      <button className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all">
                        NO - Skip Property
                      </button>
                    </div>
                  ) : (
                    <button disabled className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                      <Lock size={14} /> Waiting for Owner
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 shadow-xl">
            <Calendar size={48} className="mx-auto text-gray-100 mb-6" />
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">No Active Visits</h3>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">Browse properties to start your journey</p>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
