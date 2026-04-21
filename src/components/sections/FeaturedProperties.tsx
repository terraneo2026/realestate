'use client';

import { useEffect, useState } from 'react';
import { Section } from '@/components/layout';
import { PropertyCard } from '@/components/cards';
import { Property } from '@/types';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

/**
 * FeaturedProperties Section
 * Displays grid of featured properties fetched dynamically from Firestore
 */
export function FeaturedPropertiesSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const q = query(
          collection(firestore, 'properties'),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const propertiesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Property[];
        
        // If no featured properties in DB, use some defaults or leave empty
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (loading) return (
    <Section bg="white">
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </Section>
  );

  if (properties.length === 0) return null;

  return (
    <Section bg="white">
      {/* Section Header */}
      <div className="mb-10 md:mb-12 lg:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
          Featured Properties
        </h2>
        <p className="text-gray-500 font-bold text-xs tracking-widest max-w-2xl mx-auto">
          Explore our handpicked selection of premium properties in the market
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </Section>
  );
}

