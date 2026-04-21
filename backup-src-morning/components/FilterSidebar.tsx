"use client";

import { useState } from "react";

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  type: string;
  priceMin: string;
  priceMax: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    priceMin: "",
    priceMax: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
  });

  const amenityOptions = [
    "WiFi",
    "Parking",
    "Garden",
    "Pool",
    "Gym",
    "Elevator",
    "Security",
    "Pet Friendly",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleAmenityChange = (amenity: string) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];

    const updatedFilters = { ...filters, amenities: updatedAmenities };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  return (
    <aside className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit sticky top-4">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>

      {/* Type Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Type
        </label>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Types</option>
          <option value="rent">For Rent</option>
          <option value="sell">For Sale</option>
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          name="location"
          placeholder="City or area"
          value={filters.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="number"
            name="priceMin"
            placeholder="Min price"
            value={filters.priceMin}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="number"
            name="priceMax"
            placeholder="Max price"
            value={filters.priceMax}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bedrooms
        </label>
        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Bathrooms
        </label>
        <select
          name="bathrooms"
          value={filters.bathrooms}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Amenities
        </label>
        <div className="space-y-2">
          {amenityOptions.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleAmenityChange(amenity)}
                className="w-4 h-4 rounded border-gray-300 primaryColor focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          const resetFilters: FilterState = {
            type: "all",
            priceMin: "",
            priceMax: "",
            location: "",
            bedrooms: "",
            bathrooms: "",
            amenities: [],
          };
          setFilters(resetFilters);
          onFilterChange?.(resetFilters);
        }}
        className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
      >
        Reset Filters
      </button>
    </aside>
  );
}
