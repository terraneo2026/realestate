'use client';

import { SelectProps } from '@/types';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Select Component
 * Form select with label and error handling
 */
export function Select({
  label,
  options,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase mb-2 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={cn(
            "w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-gray-800 text-xs md:text-sm appearance-none cursor-pointer pr-10 md:pr-12",
            "focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10",
            "hover:border-gray-200 hover:bg-gray-100/50",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="py-2 font-medium">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 md:pr-5 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
          <ChevronDown size={18} strokeWidth={3} />
        </div>
      </div>
      {error && (
        <p className="text-[10px] text-red-500 mt-1.5 font-bold uppercase tracking-tight ml-1">{error}</p>
      )}
    </div>
  );
}
