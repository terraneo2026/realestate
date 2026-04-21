"use client";

import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import SearchFilter from "./SearchFilter";

interface Property {
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

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}get-property-list`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        // Transform API data to match our interface
        const transformedProperties: Property[] = (data.data || []).map((prop: any) => ({
          id: prop.id,
          title: prop.title,
          price: `$${prop.price}`,
          location: prop.city,
          image: prop.title_image,
          type: prop.property_type === "rent" ? "rent" : "sell",
          bedrooms: prop.parameters?.find((p: any) => p.name === "Bedroom")?.value,
          bathrooms: prop.parameters?.find((p: any) => p.name === "Bathroom")?.value,
          slug: prop.slug_id,
        }));

        setProperties(transformedProperties);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // Use mock data if API fails
        setProperties([
          {
            id: 1,
            title: "Beautiful Modern Apartment",
            price: "$1,500/month",
            location: "New York",
            image: "/property1.jpg",
            type: "rent",
            bedrooms: 2,
            bathrooms: 1,
            slug: "beautiful-modern-apartment",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Failed to load properties</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return <div className="text-center text-gray-500">No properties available</div>;
  }

  return (
    <div>
      <SearchFilter />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} {...property} />
        ))}
      </div>
    </div>
  );
}