"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Loader from "@/components/Loader";
import { firestore } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Category {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
}

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "categories"));
        const list: Category[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Category));
        
        setCategories(list);
      } catch (error) {
        console.error("Failed to fetch categories from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
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
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      <button className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-black text-lg transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2">
                        View Properties <span>→</span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
