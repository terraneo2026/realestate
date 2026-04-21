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
      href={`/${locale}/category/${(category.name || "").toLowerCase().replace(/\s+/g, "-")}`}
      className="block h-full"
    >
      <Card clickable hover className={`${category.bgColor} p-6 h-full group border-none shadow-sm hover:shadow-lg transition-all duration-300`}>
        <div className="flex flex-col items-center text-center gap-4">
          {/* Icon Container */}
          <div
            className={`${category.iconBg} w-14 h-14 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
          >
            {category.icon}
          </div>

          {/* Category Info */}
          <div className="space-y-1">
            <h3 className="text-sm md:text-base font-black text-gray-900 line-clamp-1 tracking-tight">
              {category.name}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest">
              {category.count} Listings
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
