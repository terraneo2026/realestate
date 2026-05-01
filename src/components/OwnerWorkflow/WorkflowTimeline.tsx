'use client';

import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, MapPin, FileText, CreditCard, ChevronRight } from 'lucide-react';

interface TimelineStep {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
  icon: any;
  date?: string;
}

export default function WorkflowTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="text-primary" size={20} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Verification Timeline</h2>
      </div>

      <div className="relative space-y-12">
        {/* Connector Line */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100 -z-0" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="relative flex items-start gap-8 group">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                step.status === 'completed' ? "bg-green-500 text-white shadow-xl shadow-green-200" :
                step.status === 'current' ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110 animate-pulse" :
                "bg-white border-2 border-gray-100 text-gray-300"
              )}>
                {step.status === 'completed' ? <CheckCircle2 size={20} /> : <Icon size={20} />}
              </div>

              <div className="flex-1 pt-1">
                <div className="flex justify-between items-center mb-1">
                  <h4 className={cn(
                    "text-sm font-black uppercase tracking-widest",
                    step.status === 'pending' ? "text-gray-300" : "text-gray-900"
                  )}>
                    {step.label}
                  </h4>
                  {step.date && (
                    <span className="text-[9px] font-black text-gray-400 uppercase">{step.date}</span>
                  )}
                </div>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-tight",
                  step.status === 'completed' ? "text-green-600" :
                  step.status === 'current' ? "text-primary" :
                  "text-gray-300"
                )}>
                  {step.status === 'completed' ? 'Successfully Verified' :
                   step.status === 'current' ? 'Currently in Progress' :
                   'Waiting for previous steps'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
