"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/cards/PropertyCard";
import type { FilterState } from "./FilterSidebar";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { X, Search } from "lucide-react";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  image: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  slug: string;
  postedBy?: string;
  possession?: string;
  furnishing?: string;
  facing?: string;
  images?: string[];
  status: string;
}

export default function PropertyList({ 
  filters, 
  categorySlug 
}: { 
  filters?: Partial<FilterState>;
  categorySlug?: string;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch active properties. 
        // Note: Composite index (status, created_at) is required for server-side sorting.
        // If the index isn't ready, we'll sort on the client side.
        const q = query(
          collection(firestore, "properties"), 
          where("status", "in", ["active", "published", "approved"])
        );
        const querySnapshot = await getDocs(q);
        
        const transformedProperties: Property[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // Extract location string from nested object if needed
          const locationStr = data.address || 
                             (data.location && typeof data.location === 'object' 
                               ? `${data.location.area || ''} ${data.location.city || ''}`.trim() 
                               : data.location) || 
                             data.city || 
                             "Location N/A";

          return {
            id: doc.id,
            title: data.title || "Untitled Property",
            price: Number(data.price || data.budget) || 0,
            location: locationStr,
            image: data.coverImage || data.image || (data.images && data.images[0]) || "/placeholder.svg",
            type: data.type || "Apartment",
            bedrooms: Number(data.totalBedrooms || data.bedrooms?.length || data.bedrooms) || 0,
            bathrooms: Number(data.commonBathrooms || data.bathrooms) || 0,
            sqft: Number(data.size_sqft || data.area_sqft || data.sqft || data.totalArea) || 0,
            slug: data.slug || doc.id,
            postedBy: data.ownerName || data.postedBy || 'Individual',
            possession: data.possession || 'Ready to move',
            furnishing: data.furnishing || 'Unfurnished',
            facing: data.facing || 'East',
            images: data.images || [],
            status: data.status || 'active',
            createdAt: (data.createdAt || data.created_at)?.toDate?.() || new Date(data.createdAt || data.created_at || 0)
          };
        });

        // Client-side sort by createdAt desc
        transformedProperties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setProperties(transformedProperties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProperties = properties.filter((p) => {
    // Keyword Filter
    if (filters?.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    
    // Type Filter
    if (filters?.type && filters.type !== 'all' && p.type.toLowerCase() !== filters.type.toLowerCase()) return false;
    
    // Price Filter
    if (filters?.priceMin && p.price < Number(filters.priceMin)) return false;
    if (filters?.priceMax && p.price > Number(filters.priceMax)) return false;
    
    // Bedrooms Filter
    if (filters?.bedrooms) {
      const minBhk = parseInt(filters.bedrooms);
      if (p.bedrooms! < minBhk) return false;
    }
    
    // Bathrooms Filter
    if (filters?.bathrooms) {
      const minBath = parseInt(filters.bathrooms);
      if (p.bathrooms! < minBath) return false;
    }
    
    // Posted By Filter
    if (filters?.postedBy && filters.postedBy !== 'all' && p.postedBy?.toLowerCase() !== filters.postedBy.toLowerCase()) return false;
    
    // Possession Filter
    if (filters?.possession && filters.possession !== 'all' && p.possession?.toLowerCase() !== filters.possession.toLowerCase()) return false;
    
    // Facing Filter
    if (filters?.facing && filters.facing !== 'all' && p.facing?.toLowerCase() !== filters.facing.toLowerCase()) return false;
    
    // Amenities Filter
    if (filters?.amenities && filters.amenities.length > 0) {
      // Assuming property has an amenities array. If not, this filter might need adjustment.
      // For now, let's assume it matches if any selected amenity is present (or skip if not implemented)
    }

    return true;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-[2.5rem] h-[450px] animate-pulse border border-gray-100"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <X className="text-red-500" size={32} />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Error Loading Properties</h3>
        <p className="text-gray-500 max-w-xs">{error}</p>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Search className="text-gray-300" size={32} />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">No Properties Found</h3>
        <p className="text-gray-500 max-w-xs">Try adjusting your filters to find what you're looking for.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 text-sm font-black text-primary hover:underline tracking-widest uppercase"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-500">
          Showing <span className="text-gray-900 font-black">{filteredProperties.length}</span> properties
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property as any} />
        ))}
      </div>
    </div>
  );
}
