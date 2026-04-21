'use client';

import { ButtonProps } from '@/types';

/**
 * Button Component
 * Flexible button with variants and sizes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold transition-all duration-200 rounded-lg inline-flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#087c7c] hover:bg-[#066666] text-white shadow-sm hover:shadow-md',
    secondary: 'bg-[#0186d8] hover:bg-[#0175c1] text-white shadow-sm hover:shadow-md',
    outline: 'border-2 border-[#087c7c] text-[#087c7c] hover:bg-[#087c7c] hover:text-white',
    'white-outline': 'border-2 border-white text-white hover:bg-white hover:text-primary',
    ghost: 'text-[#087c7c] hover:bg-[#087c7c]/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
