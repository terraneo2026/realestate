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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2.5 text-base rounded-lg border-2 border-gray-200
          focus:outline-none focus:border-[#087c7c] focus:ring-2 focus:ring-[#087c7c]/20
          transition-all duration-200
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
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
