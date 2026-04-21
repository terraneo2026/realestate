"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SearchFilter() {
  const [filters, setFilters] = useState({
    propertyType: "all",
    priceMin: "",
    priceMax: "",
    location: "",
    bedrooms: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Applying filters:", filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="relative">
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
            >
              <option value="all">All Types</option>
              <option value="rent">For Rent</option>
              <option value="lease">For Lease</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            name="location"
            placeholder="City or area"
            value={filters.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Budget</label>
          <div className="relative">
            <select
              name="priceMin"
              value={filters.priceMin}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
            >
              <option value="">Any</option>
              <option value="5000">₹5,000</option>
              <option value="10000">₹10,000</option>
              <option value="20000">₹20,000</option>
              <option value="30000">₹30,000</option>
              <option value="50000">₹50,000</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Budget</label>
          <div className="relative">
            <select
              name="priceMax"
              value={filters.priceMax}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none pr-10"
            >
              <option value="">Any</option>
              <option value="10000">₹10,000</option>
              <option value="20000">₹20,000</option>
              <option value="30000">₹30,000</option>
              <option value="50000">₹50,000</option>
              <option value="100000">₹1,00,000+</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full primaryBg text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
