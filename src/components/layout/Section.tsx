'use client';

import { SectionProps } from '@/types';
import { Container } from './Container';

/**
 * Section Component
 * Wraps Container with consistent section spacing and backgrounds
 */
export function Section({
  children,
  className = '',
  bg = 'white',
  py = 'py-16 md:py-20 lg:py-24',
}: SectionProps) {
  const bgStyles = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-[#087c7c] text-white',
    transparent: 'bg-transparent',
  };

  return (
    <section className={`${bgStyles[bg]} ${py} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
