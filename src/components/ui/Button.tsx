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
  const baseStyles = 'font-bold tracking-widest transition-all duration-300 rounded-xl inline-flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

  const variants = {
    primary: 'bg-primary hover:bg-[#066666] text-white shadow-lg shadow-primary/20',
    secondary: 'bg-[#0186d8] hover:bg-[#0175c1] text-white shadow-lg shadow-[#0186d8]/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    'white-outline': 'border-2 border-white text-white hover:bg-white hover:text-primary',
    white: 'bg-white hover:bg-gray-100 text-primary shadow-lg shadow-black/10',
    ghost: 'text-primary hover:bg-primary/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-[11px]',
    lg: 'px-8 py-4 text-xs',
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
