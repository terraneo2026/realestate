"use client";

import { useState } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import PropertyList from "@/components/PropertyList";

export default function PropertiesPage() {
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Pass filters to PropertyList via state if needed
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 md:mb-12 lg:mb-16">All Properties</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* Main Content - Properties */}
        <div className="lg:col-span-3">
          <PropertyList />
        </div>
      </div>
    </div>
  );
}