'use client';

import { InputProps } from '@/types';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Input Component
 * Form input with optional label, error, and hint
 */
export function Input({
  label,
  error,
  hint,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-2 ml-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-gray-800 text-xs md:text-sm placeholder:text-gray-300 shadow-sm",
          "focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10",
          "hover:border-gray-200 hover:bg-gray-100/50",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-red-500 mt-1.5 font-bold uppercase tracking-tight ml-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-tight ml-1">{hint}</p>
      )}
    </div>
  );
}
