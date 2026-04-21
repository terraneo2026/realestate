'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Section } from '@/components/layout';
import { CategoryCard } from '@/components/cards';
import { Category } from '@/types';
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Building2, Home, Landmark, Palmtree, Warehouse, Building, Hotel, Tent, Trees } from 'lucide-react';

/**
 * Categories Section
 * Displays browsable property categories fetched dynamically from Firestore
 */
export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'categories'));
        const categoriesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.category || data.name || 'Uncategorized',
            count: data.count || 0,
            icon: data.icon,
            bgColor: data.bgColor || 'bg-gray-50',
            iconBg: data.iconBg || 'bg-white'
          };
        });
        
        // Map names to Lucide icons for a more professional look
        const getIconForCategory = (name: string, existingIcon: any) => {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('villa')) return <Landmark className="w-8 h-8 text-primary" />;
          if (lowerName.includes('apartment')) return <Building2 className="w-8 h-8 text-primary" />;
          if (lowerName.includes('house')) return <Home className="w-8 h-8 text-primary" />;
          if (lowerName.includes('penthouse')) return <Building className="w-8 h-8 text-primary" />;
          if (lowerName.includes('studio')) return <Hotel className="w-8 h-8 text-primary" />;
          if (lowerName.includes('office')) return <Warehouse className="w-8 h-8 text-primary" />;
          if (lowerName.includes('land')) return <Trees className="w-8 h-8 text-primary" />;
          return existingIcon || <Home className="w-8 h-8 text-primary" />;
        };

        const processedCategories: Category[] = categoriesData.map(cat => ({
          ...cat,
          icon: getIconForCategory(cat.name, cat.icon)
        }));
        
        // If no categories in DB, fallback to some defaults to avoid empty section
        if (processedCategories.length === 0) {
          setCategories([
            { id: '1', name: 'Villa', count: 23, icon: <Landmark className="w-8 h-8 text-primary" />, bgColor: 'bg-cyan-50', iconBg: 'bg-cyan-100' },
            { id: '2', name: 'Penthouse', count: 3, icon: <Building className="w-8 h-8 text-primary" />, bgColor: 'bg-blue-50', iconBg: 'bg-blue-100' },
            { id: '3', name: 'House', count: 7, icon: <Home className="w-8 h-8 text-primary" />, bgColor: 'bg-orange-50', iconBg: 'bg-orange-100' },
            { id: '4', name: 'Apartment', count: 45, icon: <Building2 className="w-8 h-8 text-primary" />, bgColor: 'bg-teal-50', iconBg: 'bg-teal-100' },
            { id: '5', name: 'Studio', count: 12, icon: <Hotel className="w-8 h-8 text-primary" />, bgColor: 'bg-purple-50', iconBg: 'bg-purple-100' },
          ]);
        } else {
          setCategories(processedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return null;

  return (
    <Section bg="gray" py="py-12 md:py-16 lg:py-20">
      {/* Section Header */}
      <div className="mb-10 md:mb-12 lg:mb-16 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Browse by Category
        </h2>
        <p className="text-gray-500 text-[10px] md:text-xs font-black tracking-[0.2em] max-w-2xl mx-auto opacity-70">
          Find properties that match your lifestyle
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            locale={locale}
          />
        ))}
      </div>
    </Section>
  );
}
