'use client';

import { SelectProps } from '@/types';
import { ChevronDown } from 'lucide-react';

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
        <label className="block text-[10px] font-bold text-gray-400 tracking-widest mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-4 py-2 text-sm rounded-xl border-2 border-gray-100 bg-gray-50/50
            focus:outline-none focus:border-[#087c7c] focus:ring-4 focus:ring-[#087c7c]/5
            transition-all duration-200 font-medium text-gray-800 shadow-sm
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            appearance-none pr-10
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
