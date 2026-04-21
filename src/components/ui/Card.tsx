'use client';

import { CardProps } from '@/types';

/**
 * Card Component
 * Reusable card wrapper with optional hover effect
 */
export function Card({
  children,
  className = '',
  clickable = false,
  hover = true,
}: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl overflow-hidden border border-gray-100
        ${hover ? 'shadow-sm hover:shadow-md' : 'shadow-sm'}
        transition-all duration-200
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
