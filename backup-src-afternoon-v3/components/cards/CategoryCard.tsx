'use client';

import Link from 'next/link';
import { Category } from '@/types';
import { Card } from '@/components/ui';

interface CategoryCardProps {
  category: Category;
  locale?: string;
}

/**
 * CategoryCard Component
 * Displays a property category with icon and count
 */
export function CategoryCard({ category, locale = 'en' }: CategoryCardProps) {
  return (
    <Link
      href={`/${locale}/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Card clickable hover className={`${category.bgColor} p-6 h-full group`}>
        <div className="flex flex-col gap-4">
          {/* Icon Container */}
          <div
            className={`${category.iconBg} w-16 h-16 rounded-lg flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-200`}
          >
            {category.icon}
          </div>

          {/* Category Info */}
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-1">
              {category.name}
            </h3>
            <p className="text-sm md:text-base text-gray-600 font-medium mt-1">
              {category.count} {category.count === 1 ? 'Property' : 'Properties'}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
