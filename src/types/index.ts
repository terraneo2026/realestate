/**
 * Core Type Definitions
 * Shared interfaces for the entire application
 */

// Property Types
export interface Property {
  id: string | number;
  title: string;
  location: string;
  image: string;
  images?: string[];
  price: string;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  size?: number;
  sqft?: number;
  type: string;
  featured?: boolean;
  premium?: boolean;
  slug: string;
  postedBy?: string;
  published_by?: string;
  possession?: string;
  furnishing?: string;
  facing?: string;
  category_id?: string;
}

// Category Types
export interface Category {
  id: string | number;
  name: string;
  count: number;
  icon: string | React.ReactNode;
  bgColor: string;
  iconBg: string;
}

// Article Types
export interface Article {
  id: string | number;
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
  variant?: 'primary' | 'secondary' | 'outline' | 'white-outline' | 'white' | 'ghost';
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
