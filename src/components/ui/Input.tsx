'use client';

import { InputProps } from '@/types';

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
        <label className="block text-[10px] font-bold text-gray-400 tracking-widest mb-1.5 ml-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2 text-sm rounded-xl border-2 border-gray-100 bg-gray-50/50
          focus:outline-none focus:border-[#087c7c] focus:ring-4 focus:ring-[#087c7c]/5
          transition-all duration-200 font-medium text-gray-800 placeholder:text-gray-300 shadow-sm
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-sm text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  );
}
