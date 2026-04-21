'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Card } from '@/components/ui';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
}

/**
 * PropertyCard Component
 * Displays a single property with image, details, and action buttons
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setisFavorite] = useState(false);

  const imageUrl = !imageError ? property.image : '/placeholder.svg';

  return (
    <Link href={`/property/${property.slug}`}>
      <Card clickable className="group flex flex-col h-full overflow-hidden">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />

          {/* Type Badge */}
          <div
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white z-10 ${
              property.type === 'Villa' ? 'bg-[#0186d8]' : 'bg-[#db9305]'
            }`}
          >
            {property.type}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setisFavorite(!isFavorite);
            }}
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition z-10"
          >
            <span className="text-lg">{isFavorite ? '❤️' : '🤍'}</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-4 gap-3">
          {/* Title and Location */}
          <div className="flex-grow">
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
              {property.title}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              📍 {property.location}
            </p>
          </div>

          {/* Property Details */}
          {(property.bedrooms || property.bathrooms) && (
            <div className="text-xs text-gray-600 space-x-3 flex">
              {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
              {property.bathrooms && <span>🚿 {property.bathrooms} Bath</span>}
            </div>
          )}

          {/* Price and Button */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-lg font-bold text-[#087c7c] mb-2">
              {property.price}
            </div>
            <button className="w-full bg-[#087c7c] hover:bg-[#066666] text-white py-2 rounded-lg font-semibold transition-colors duration-200">
              View Details
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
