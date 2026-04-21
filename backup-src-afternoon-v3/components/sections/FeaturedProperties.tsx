'use client';

import { Section, Container } from '@/components/layout';
import { PropertyCard } from '@/components/cards';
import { Property } from '@/types';

const FEATURED_PROPERTIES: Property[] = [
  {
    id: 1,
    title: 'Lakeside Sereni...',
    location: 'Bhuj, Gujarat',
    image: 'https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=500&h=300&fit=crop',
    price: '₹1.6M',
    bedrooms: 5,
    bathrooms: 5,
    area: 2000,
    type: 'Villa',
    featured: true,
    slug: 'lakeside-sereni',
  },
  {
    id: 2,
    title: 'The Villa',
    location: 'Bhuj, Gujarat',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
    price: '₹5.0K',
    bedrooms: 6,
    bathrooms: 5,
    area: 3000,
    type: 'Villa',
    featured: true,
    premium: true,
    slug: 'the-villa',
  },
  {
    id: 3,
    title: 'Mountain Majes...',
    location: 'Bhuj, Gujarat',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    price: '₹1.8M',
    bedrooms: 5,
    bathrooms: 5,
    area: 3500,
    type: 'Villa',
    featured: true,
    slug: 'mountain-majes',
  },
  {
    id: 4,
    title: 'Serene Oasis Villa',
    location: 'Bhuj, Gujarat',
    image: 'https://images.unsplash.com/photo-1460932960985-90a2e59df800?w=500&h=300&fit=crop',
    price: '₹1.8M',
    bedrooms: 6,
    bathrooms: 2,
    area: 1500,
    type: 'Villa',
    featured: true,
    slug: 'serene-oasis-villa',
  },
  {
    id: 5,
    title: 'Spotlight Homes',
    location: 'Bhuj, Gujarat',
    image: 'https://images.unsplash.com/photo-1502672527689-408aa28e3a19?w=500&h=300&fit=crop',
    price: '₹2.2M',
    bedrooms: 4,
    bathrooms: 3,
    area: 1800,
    type: 'House',
    slug: 'spotlight-homes',
  },
  {
    id: 6,
    title: 'Luxurious Haven Villa',
    location: 'Bhuj, Gujarat',
    image: 'https://images.unsplash.com/photo-1535576661393-b8e8a40ae803?w=500&h=300&fit=crop',
    price: '₹2.5M',
    bedrooms: 5,
    bathrooms: 4,
    area: 2200,
    type: 'Villa',
    featured: true,
    slug: 'luxurious-haven-villa',
  },
];

/**
 * FeaturedProperties Section
 * Displays grid of featured properties
 */
export function FeaturedPropertiesSection() {
  return (
    <Section bg="white">
      {/* Section Header */}
      <div className="mb-10 md:mb-12 lg:mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
          Featured Properties
        </h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl">
          Explore our handpicked selection of premium properties in the market
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {FEATURED_PROPERTIES.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </Section>
  );
}
