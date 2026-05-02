"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import Loader from "@/components/Loader";

interface SavedProperty {
  id: string | number;
  title: string;
  price: string;
  location: string;
  image: string;
  type: "rent" | "lease";
  bedrooms?: number;
  bathrooms?: number;
  slug: string;
}

import { useParams } from "next/navigation";
import Link from "next/link";

export default function FavoritesPage() {
  const { locale } = useParams();
  const [favorites, setFavorites] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's saved properties from API
    // For now, show empty state
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Saved Properties</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">
            You haven't saved any properties yet.
          </p>
          <Link
            href={`/${locale}/properties`}
            className="inline-block primaryBg text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      )}
    </div>
  );
}
