"use client";

import { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  bg?: 'white' | 'gray' | 'primary' | 'transparent';
  py?: string; // Custom padding override
}

/**
 * SectionContainer standardizes section layout across the app
 * Ensures consistent max-width, padding, and spacing
 */
export const SectionContainer = ({ 
  children, 
  className = '',
  bg = 'white',
  py = 'py-12 md:py-16 lg:py-20'
}: SectionContainerProps) => {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary text-white',
    transparent: 'bg-transparent'
  };

  return (
    <section className={`${bgClasses[bg]} ${py} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

/**
 * SectionHeader standardizes heading blocks
 */
export const SectionHeader = ({ 
  title, 
  subtitle,
  className = ''
}: { 
  title: string;
  subtitle?: string;
  className?: string;
}) => {
  return (
    <div className={`mb-10 md:mb-12 lg:mb-16 ${className}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-gray-600 max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/**
 * GridContainer standardizes grid layouts
 */
export const GridContainer = ({ 
  children,
  cols = 'lg:grid-cols-3',
  className = ''
}: { 
  children: ReactNode;
  cols?: string;
  className?: string;
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6 md:gap-8 ${className}`}>
      {children}
    </div>
  );
};
