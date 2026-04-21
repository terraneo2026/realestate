"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Categories = () => {
  const [categories] = useState([
    { id: 1, name: "Villa", count: 23, icon: "🏢", bgColor: "bg-cyan-50", iconBg: "bg-cyan-100" },
    { id: 2, name: "Penthouse", count: 3, icon: "🏗️", bgColor: "bg-blue-50", iconBg: "bg-blue-100" },
    { id: 3, name: "Banglow", count: 5, icon: "🏠", bgColor: "bg-green-50", iconBg: "bg-green-100" },
    { id: 4, name: "House", count: 7, icon: "🏡", bgColor: "bg-orange-50", iconBg: "bg-orange-100" },
    { id: 5, name: "Land", count: 1, icon: "🏞️", bgColor: "bg-yellow-50", iconBg: "bg-yellow-100" },
    { id: 6, name: "Piote", count: 4, icon: "📍", bgColor: "bg-red-50", iconBg: "bg-red-100" },
    { id: 7, name: "Commercial", count: 3, icon: "🏪", bgColor: "bg-purple-50", iconBg: "bg-purple-100" },
    { id: 8, name: "Condo", count: 3, icon: "🏢", bgColor: "bg-pink-50", iconBg: "bg-pink-100" },
    { id: 9, name: "Townhouse", count: 2, icon: "🏘️", bgColor: "bg-indigo-50", iconBg: "bg-indigo-100" },
  ]);

  const pathname = typeof window !== 'undefined' ? window.location.pathname : undefined;

  // Prefer Next's usePathname when available (client), fallback to window
  let locale = 'en';
  try {
    const pn = usePathname();
    if (pn) locale = pn.split('/')[1] || 'en';
  } catch (e) {
    if (pathname) locale = pathname.split('/')[1] || 'en';
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 mt-12 md:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 md:mb-4 leading-tight">
            Browse by Category
          </h2>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Discover properties across all our available categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/category/${(category.name || "").toLowerCase().replace(/\s+/g,'-')}`}
              className={`${category.bgColor} rounded-xl p-5 md:p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-100 block group`}
            >
              {/* Icon Container */}
              <div className={`${category.iconBg} rounded-lg w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-5 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>

              {/* Category Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1.5 line-clamp-1 leading-tight">
                {category.name}
              </h3>

              {/* Property Count */}
              <p className="text-sm text-gray-600 font-normal leading-relaxed">
                {category.count} {category.count === 1 ? 'Property' : 'Properties'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
