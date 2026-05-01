'use client';

import React from 'react';
import { 
  MessageSquare, 
  Scale, 
  Gavel, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface Dispute {
  id: string;
  category: string;
  title: string;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'CLOSED';
  raisedBy: string;
  createdAt: string;
}

export default function DisputeManagementPanel({ disputes }: { disputes: Dispute[] }) {
  return (
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
      <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
            <Scale className="text-gray-900" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Arbitration Panel</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Managing platform disputes & resolutions</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/30">
              <th className="px-10 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Case Details</th>
              <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-6 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-10 py-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Resolve</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {disputes.map((caseItem) => (
              <tr key={caseItem.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-10 py-6">
                  <div>
                    <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{caseItem.title}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Case ID: {caseItem.id.slice(0,8)} • {caseItem.createdAt}</p>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-lg">
                    {caseItem.category}
                  </span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    {caseItem.status === 'OPEN' ? <Clock className="text-orange-500" size={14} /> : <ShieldCheck className="text-green-500" size={14} />}
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      caseItem.status === 'OPEN' ? "text-orange-600" : "text-green-600"
                    )}>
                      {caseItem.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all">
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all">
                      <XCircle size={16} />
                    </button>
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {disputes.length === 0 && (
        <div className="p-20 text-center">
          <Gavel size={48} className="mx-auto text-gray-100 mb-6" />
          <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter">No Active Disputes</h4>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-2">The platform is operating within safety thresholds</p>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
