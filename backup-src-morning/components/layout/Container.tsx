'use client';

import { ContainerProps } from '@/types';

/**
 * Container Component
 * Centered container with standard max-width and responsive padding
 */
export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
