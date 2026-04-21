import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Category {
  id: number | string;
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
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop",
    slug: "land-plots"
  },
  {
    id: 5,
    name: "Townhouses",
    description: "Modern townhouses with shared amenities",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop",
    slug: "townhouses"
  },
  {
    id: 6,
    name: "Studios",
    description: "Compact studios for professionals",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop",
    slug: "studios"
  }
];

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  let categories: any[] = [];

  try {
    const querySnapshot = await getDocs(collection(firestore, 'categories'));
    categories = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
  }

  if (categories.length === 0) {
    categories = MOCK_CATEGORIES;
  }

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
