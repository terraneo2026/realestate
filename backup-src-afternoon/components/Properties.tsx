"use client";

import { useEffect, useState } from 'react';

interface SimpleProperty {
  id: number;
  title: string;
  price: string;
  location: string;
  image: string;
}

const Properties = () => {
  const [properties, setProperties] = useState<SimpleProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for now
    setProperties([
      {
        id: 1,
        title: "Beautiful Apartment",
        price: "$500,000",
        location: "New York, NY",
        image: "/property1.jpg"
      },
      {
        id: 2,
        title: "Modern House",
        price: "$750,000",
        location: "Los Angeles, CA",
        image: "/property2.jpg"
      },
      {
        id: 3,
        title: "Cozy Condo",
        price: "$300,000",
        location: "Chicago, IL",
        image: "/property3.jpg"
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="properties-loading grid grid-cols-1 md:grid-cols-3 gap-6 py-10 px-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-300 h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="properties-error text-center py-10">
        <p className="text-red-500">Failed to load properties</p>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="properties-empty text-center py-10">
        <p>No properties available</p>
      </div>
    );
  }

  return (
    <div className="properties-section py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-10 md:mb-12 lg:mb-16">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {properties.map((property) => (
            <div
              key={property.id}
              className="property-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                <p className="text-2xl font-bold primaryColor mb-2">{property.price}</p>
                <p className="text-gray-600">{property.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;