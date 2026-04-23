"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from './ui';

interface Property {
  id: number;
  title: string;
  location: string;
  image: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  featured?: boolean;
  premium?: boolean;
  slug: string;
  createdAt?: Date;
}

const PropertyGrid = () => {
  const [properties] = useState<Property[]>([
    {
      id: 1,
      title: "Lakeside Sereni...",
      location: "Bhuj, Gujarat",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=500&h=300&fit=crop",
      price: "₹1.6M",
      bedrooms: 5,
      bathrooms: 5,
      area: 2000,
      type: "Villa",
      featured: true,
      slug: "lakeside-sereni"
    },
    {
      id: 2,
      title: "The Villa",
      location: "Bhuj, Gujarat",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop",
      price: "₹5.0K",
      bedrooms: 6,
      bathrooms: 5,
      area: 3000,
      type: "Villa",
      featured: true,
      premium: true,
      slug: "the-villa"
    },
    {
      id: 3,
      title: "Mountain Majes...",
      location: "Bhuj, Gujarat",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
      price: "₹1.8M",
      bedrooms: 5,
      bathrooms: 5,
      area: 3500,
      type: "Villa",
      featured: true,
      slug: "mountain-majes"
    },
    {
      id: 4,
      title: "Serene Oasis Villa",
      location: "Bhuj, Gujarat",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&h=300&fit=crop",
      price: "₹1.8M",
      bedrooms: 6,
      bathrooms: 2,
      area: 1500,
      type: "Villa",
      featured: true,
      slug: "serene-oasis-villa"
    },
    {
      id: 5,
      title: "Spotlight Homes",
      location: "Bhuj, Gujarat",
      image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=500&h=300&fit=crop",
      price: "₹2.2M",
      bedrooms: 4,
      bathrooms: 3,
      area: 1800,
      type: "House",
      slug: "spotlight-homes"
    },
    {
      id: 6,
      title: "Luxurious Haven Villa",
      location: "Bhuj, Gujarat",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop",
      price: "₹2.5M",
      bedrooms: 5,
      bathrooms: 4,
      area: 2200,
      type: "Villa",
      featured: true,
      slug: "luxurious-haven-villa"
    },
  ]);

  const [favorites, setFavorites] = useState<number[]>([]);

  // determine locale from pathname (client-side)
  let locale = 'en';
  try {
    const pn = usePathname();
    if (pn) locale = pn.split('/')[1] || 'en';
  } catch (e) {
    if (typeof window !== 'undefined') {
      const pn = window.location.pathname;
      locale = pn.split('/')[1] || 'en';
    }
  }

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 md:mb-4 leading-tight">
            Featured Properties
          </h2>
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
            Explore our handpicked selection of premium properties in the market
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image Container - Fixed aspect ratio */}
              <div className="relative w-full h-64 bg-gray-100 overflow-hidden flex-shrink-0">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Featured Badge - Top Left */}
                {property.featured && (
                  <div className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 z-10">
                    ● Featured
                  </div>
                )}

                {/* Premium Badge - Top Center */}
                {property.premium && (
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 z-10">
                    ⭐ Premium
                  </div>
                )}

                {/* Favorite Button - Top Right */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(property.id);
                  }}
                  className={`absolute top-3 right-3 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 z-10 text-lg md:text-xl flex-shrink-0 ${
                    favorites.includes(property.id)
                      ? 'bg-red-500 shadow-lg scale-100'
                      : 'bg-white/95 hover:bg-white shadow-md'
                  }`}
                  aria-label={favorites.includes(property.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favorites.includes(property.id) ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Content Container - Flex grow for proper spacing */}
              <div className="flex flex-col flex-grow p-4 md:p-5 gap-4">
                {/* Property Type Badge */}
                <div>
                  <span className="inline-block text-xs font-semibold text-primary bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                    {property.type}
                  </span>
                </div>

                {/* Main Content - Grows to fill available space */}
                <div className="flex-grow">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-4 leading-relaxed font-normal">
                    📍 {property.location}
                  </p>

                  {/* Property Details Grid */}
                  <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs text-gray-600 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <span>🛏️</span>
                      <span className="font-medium text-gray-900">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>🚿</span>
                      <span className="font-medium text-gray-900">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📐</span>
                      <span className="font-medium text-gray-900">{property.area}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Action - Always at bottom */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="text-xl font-semibold text-primary">
                    {property.price}
                  </div>
                  <Link href={`/${locale}/property/${property.slug}`}>
                    <Button variant="primary" size="sm" className="px-6 py-3 rounded-xl">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12 md:mt-16 lg:mt-20">
          <Link href={`/${locale}/properties`}>
            <Button variant="primary" size="lg" className="px-10 md:px-14 py-3.5 md:py-4 hover:scale-105">
              Explore All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PropertyGrid;
