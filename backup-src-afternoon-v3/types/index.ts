/**
 * Core Type Definitions
 * Shared interfaces for the entire application
 */

// Property Types
export interface Property {
  id: number;
  title: string;
  location: string;
  image: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'Villa' | 'Apartment' | 'House' | 'Penthouse' | 'Land' | 'Commercial' | 'Condo' | 'Townhouse';
  featured?: boolean;
  premium?: boolean;
  slug: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  count: number;
  icon: string;
  bgColor: string;
  iconBg: string;
}

// Article Types
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  slug: string;
}

// Component Props Types
export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  bg?: 'white' | 'gray' | 'primary' | 'transparent';
  py?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  hover?: boolean;
}

// Search Filter Types
export interface SearchFilters {
  type: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}
