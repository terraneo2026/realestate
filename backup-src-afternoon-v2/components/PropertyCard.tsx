"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface PropertyCardProps {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
  type: "rent" | "sell";
  bedrooms?: number;
  bathrooms?: number;
  slug: string;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  image,
  type,
  bedrooms,
  bathrooms,
  slug,
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = !imageError ? (image || "/placeholder.svg") : "/placeholder.svg";

  return (
    <Link href={`/property/${slug}`}>
      <div className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden">
        {/* Image Container - Fixed height with proper aspect ratio */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
          
          {/* Type Badge - Top Right */}
          <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white z-10 ${
            type === "rent" ? "primaryBg" : "bg-blue-600"
          }`}>
            {type === "rent" ? "For Rent" : "For Sale"}
          </div>
        </div>

        {/* Content Container - Flex grow to fill space */}
        <div className="flex flex-col flex-grow p-4 gap-3">
          <div className="flex-grow">
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
              {title}
            </h3>

            <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
              📍 {location}
            </p>

            {(bedrooms || bathrooms) && (
              <div className="text-xs text-gray-600 space-x-3 flex">
                {bedrooms && <span>🛏️ {bedrooms}</span>}
                {bathrooms && <span>🚿 {bathrooms}</span>}
              </div>
            )}
          </div>

          {/* Price and Button - Always at bottom */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="text-lg font-black text-primary">{price}</div>
            <button className="w-full bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-semibold transition-colors duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}