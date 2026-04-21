'use client';

import { usePathname } from 'next/navigation';
import { Section } from '@/components/layout';
import { CategoryCard } from '@/components/cards';
import { Category } from '@/types';

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Villa',
    count: 23,
    icon: '🏢',
    bgColor: 'bg-cyan-50',
    iconBg: 'bg-cyan-100',
  },
  {
    id: 2,
    name: 'Penthouse',
    count: 3,
    icon: '🏗️',
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
  },
  {
    id: 3,
    name: 'Banglow',
    count: 5,
    icon: '🏠',
    bgColor: 'bg-green-50',
    iconBg: 'bg-green-100',
  },
  {
    id: 4,
    name: 'House',
    count: 7,
    icon: '🏡',
    bgColor: 'bg-orange-50',
    iconBg: 'bg-orange-100',
  },
  {
    id: 5,
    name: 'Land',
    count: 1,
    icon: '🏞️',
    bgColor: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
  },
  {
    id: 6,
    name: 'Piote',
    count: 4,
    icon: '📍',
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-100',
  },
  {
    id: 7,
    name: 'Commercial',
    count: 3,
    icon: '🏪',
    bgColor: 'bg-purple-50',
    iconBg: 'bg-purple-100',
  },
  {
    id: 8,
    name: 'Condo',
    count: 3,
    icon: '🏢',
    bgColor: 'bg-pink-50',
    iconBg: 'bg-pink-100',
  },
  {
    id: 9,
    name: 'Townhouse',
    count: 2,
    icon: '🏘️',
    bgColor: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
  },
];

/**
 * Categories Section
 * Displays browsable property categories
 */
export function CategoriesSection() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <Section bg="gray" py="py-12 md:py-16 lg:py-20 mt-12 md:mt-16 lg:mt-20">
      {/* Section Header */}
      <div className="mb-10 md:mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
          Browse by Category
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl">
          Discover properties across all our available categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {CATEGORIES.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            locale={locale}
          />
        ))}
      </div>
    </Section>
  );
}
