"use client";

import { useEffect, useMemo, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar, Footer, PageHero } from "@/components/layout";
import FilterSidebar, { type FilterState } from "@/components/FilterSidebar";
import PropertyList from "@/components/PropertyList";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFilters = useMemo<Partial<FilterState>>(() => {
    if (!searchParams) return {};
    const location = searchParams.get("location") ?? "";
    const type = searchParams.get("type") ?? "all";
    const priceMin = searchParams.get("minPrice") ?? "";
    const priceMax = searchParams.get("maxPrice") ?? "";
    const bedrooms = searchParams.get("bedrooms") ?? "";
    const bathrooms = searchParams.get("bathrooms") ?? "";

    return { location, type, priceMin, priceMax, bedrooms, bathrooms };
  }, [searchParams]);

  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    priceMin: "",
    priceMax: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    postedBy: "all",
    possession: "all",
    furnishing: "all",
    facing: "all",
    ...initialFilters
  });

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      ...initialFilters
    }));
  }, [initialFilters]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
      {/* Sidebar - Filters */}
      <div className="lg:col-span-1">
        <FilterSidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
        />
      </div>

      {/* Main Content - Properties */}
      <div className="lg:col-span-3">
        <PropertyList filters={filters} />
      </div>
    </div>
  );
}

export default function PropertiesClient() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <PageHero 
          title="All Properties" 
          description="Browse our extensive collection of residential and commercial properties"
          backgroundImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
          <Suspense fallback={<div>Loading properties...</div>}>
            <PropertiesContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}
