"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
}

// Mock data for fallback
const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Apartments",
    description: "Modern apartments in prime locations",
    image: "https://images.unsplash.com/photo-1545324418-cc1a9cf32edc?w=600&h=400&fit=crop",
    slug: "apartments"
  },
  {
    id: 2,
    name: "Villas",
    description: "Luxury villas with premium amenities",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
    slug: "villas"
  },
  {
    id: 3,
    name: "Commercial",
    description: "Office spaces and commercial properties",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    slug: "commercial"
  },
  {
    id: 4,
    name: "Land/Plots",
    description: "Residential and commercial land plots",
    image: "https://images.unsplash.com/photo-1500382017468-f049863256f0?w=600&h=400&fit=crop",
    slug: "land-plots"
  },
  {
    id: 5,
    name: "Townhouses",
    description: "Modern townhouses with shared amenities",
    image: "https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=600&h=400&fit=crop",
    slug: "townhouses"
  },
  {
    id: 6,
    name: "Studios",
    description: "Compact studios for professionals",
    image: "https://images.unsplash.com/photo-1502643158240-07d52ac0bfeb?w=600&h=400&fit=crop",
    slug: "studios"
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiUrl) {
          setCategories(MOCK_CATEGORIES);
          return;
        }

        const response = await fetch(`${apiUrl}get_categories`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setCategories(data.data && data.data.length > 0 ? data.data : MOCK_CATEGORIES);
        } else {
          setCategories(MOCK_CATEGORIES);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories(MOCK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-12 lg:mb-16">All Categories</h1>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug || category.id}`}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                {category.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  )}
                  <button className="mt-4 w-full primaryBg text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                    View Properties
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
