"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function FavoritesClient({ hideHeader = false }: { hideHeader?: boolean }) {
  const [favorites, setFavorites] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's saved properties from API
    // For now, show empty state
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  const content = (
    <>
      {!hideHeader && <h1 className="text-3xl font-bold mb-8">Saved Properties</h1>}

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6 text-3xl">
            ❤️
          </div>
          <p className="text-gray-600 text-lg mb-4 font-medium">
            You haven't saved any properties yet.
          </p>
          <Link
            href="/properties"
            className="inline-block primaryBg text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
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
    </>
  );

  if (hideHeader) return content;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
      {content}
    </div>
  );
}
