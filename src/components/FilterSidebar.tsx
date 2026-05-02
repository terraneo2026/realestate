"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, Filter, X, Search, MapPin, Bed, Bath, Clock, Users, ShieldCheck, Home, Compass, Info, List } from "lucide-react";
import { firestore } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  type: string;
  priceMin: string;
  priceMax: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  amenities: string[];
  postedBy: string;
  possession: string;
  furnishing: string;
  facing: string;
  category: string;
}

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
];

const POSTED_BY_OPTIONS = [
  { value: 'all', label: 'Any' },
  { value: 'owner', label: 'Owner' },
  { value: 'agent', label: 'Agent' },
  { value: 'builder', label: 'Builder' },
];

const POSSESSION_OPTIONS = [
  { value: 'all', label: 'Any' },
  { value: '1w', label: '1W' },
  { value: '1m', label: '1M' },
  { value: '6m', label: '6M' },
  { value: '1y', label: '1Y' },
  { value: 'custom', label: 'Custom' },
];

const FACING_OPTIONS = [
  { value: 'all', label: 'Any' },
  { value: 'north', label: 'North' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'south', label: 'South' },
];

const AMENITY_OPTIONS = [
  "WiFi", "Parking", "Garden", "Pool", "Gym", "Elevator", "Security", "Power Backup"
];

export default function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catSnap = await getDocs(collection(firestore, "categories"));
        const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cats.length > 0) {
          setCategories(cats);
        } else {
          setCategories([
            { id: 'apartment', name: 'Apartment' },
            { id: 'villa', name: 'Villa' },
            { id: 'commercial', name: 'Commercial' }
          ]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (name: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handleAmenityToggle = (amenity: string) => {
    const updatedAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    
    onFilterChange({ ...filters, amenities: updatedAmenities });
  };

  const resetFilters = () => {
    onFilterChange({
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
      category: "all",
    });
  };

  const FilterGroup = ({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) => (
    <div className="space-y-4 py-6 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">{label}</span>
      </div>
      {children}
    </div>
  );

  const ChipSelector = ({ options, value, onChange }: { options: any[]; value: string; onChange: (val: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300",
            value === opt.value
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center animate-bounce"
      >
        <Filter size={24} strokeWidth={3} />
      </button>

      {/* Filter Sidebar Container */}
      <aside className={cn(
        "fixed inset-0 z-[100] lg:relative lg:inset-auto lg:z-auto transition-all duration-500 bg-black/60 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none",
        isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto"
      )}>
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white lg:bg-white/80 lg:backdrop-blur-xl lg:rounded-[3rem] lg:shadow-2xl lg:border lg:border-gray-100 p-8 flex flex-col h-full lg:h-fit lg:sticky lg:top-[120px] transition-transform duration-500",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Filter className="text-primary" size={20} strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Filters</h2>
                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase">Refine Selection</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={resetFilters}
                className="text-[10px] font-black text-primary hover:underline tracking-widest uppercase p-2"
              >
                Reset
              </button>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Scrollable Filters */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-hide space-y-2">
            
            {/* Location Search */}
            <FilterGroup label="Location" icon={<MapPin className="text-primary/70" size={14} />}>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search city, area..."
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold placeholder:text-gray-300"
                  value={filters.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {['Chennai', 'Mumbai', 'Bangalore'].map(city => (
                  <button
                    key={city}
                    onClick={() => handleChange("location", city)}
                    className="px-3 py-1.5 rounded-xl bg-gray-50 text-[10px] font-black text-gray-400 hover:text-primary hover:bg-primary/5 transition-all border border-gray-100 uppercase tracking-widest"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </FilterGroup>

            {/* Budget Range Slider */}
            <FilterGroup label="Budget Range" icon={<Info className="text-primary/70" size={14} />}>
              <RangeSlider
                min={0}
                max={10000000}
                step={50000}
                initialMin={Number(filters.priceMin) || 0}
                initialMax={Number(filters.priceMax) || 10000000}
                onChange={(min, max) => {
                  onFilterChange({
                    ...filters,
                    priceMin: min.toString(),
                    priceMax: max.toString(),
                  });
                }}
              />
            </FilterGroup>

            {/* Property Type Chips */}
            <FilterGroup label="Type" icon={<Home className="text-primary/70" size={14} />}>
              <ChipSelector options={PROPERTY_TYPES} value={filters.type} onChange={(val) => handleChange("type", val)} />
            </FilterGroup>

            {/* Dynamic Categories */}
            <FilterGroup label="Category" icon={<List className="text-primary/70" size={14} />}>
              <div className="relative group">
                <select
                  value={filters.category || 'all'}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary transition-all text-sm font-bold appearance-none pr-12"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name || cat.category}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors" size={16} />
              </div>
            </FilterGroup>

            {/* Posted By Chips */}
            <FilterGroup label="Posted By" icon={<Users className="text-primary/70" size={14} />}>
              <ChipSelector options={POSTED_BY_OPTIONS} value={filters.postedBy} onChange={(val) => handleChange("postedBy", val)} />
            </FilterGroup>

            {/* Bedrooms (BHK) */}
            <FilterGroup label="Bedrooms" icon={<Bed className="text-primary/70" size={14} />}>
              <div className="grid grid-cols-5 gap-2">
                {['1', '2', '3', '4', '5+'].map(val => (
                  <button
                    key={val}
                    onClick={() => handleChange("bedrooms", val)}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                      filters.bedrooms === val 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </FilterGroup>

            {/* Bathrooms */}
            <FilterGroup label="Bathrooms" icon={<Bath className="text-primary/70" size={14} />}>
              <div className="grid grid-cols-4 gap-2">
                {['1', '2', '3', '4+'].map(val => (
                  <button
                    key={val}
                    onClick={() => handleChange("bathrooms", val)}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                      filters.bathrooms === val 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </FilterGroup>

            {/* Facing Chips */}
            <FilterGroup label="Facing" icon={<Compass className="text-primary/70" size={14} />}>
              <ChipSelector options={FACING_OPTIONS} value={filters.facing} onChange={(val) => handleChange("facing", val)} />
            </FilterGroup>

            {/* Possession Quick Selectors */}
            <FilterGroup label="Possession" icon={<Clock className="text-primary/70" size={14} />}>
              <ChipSelector options={POSSESSION_OPTIONS} value={filters.possession} onChange={(val) => handleChange("possession", val)} />
            </FilterGroup>

            {/* Amenities Chips */}
            <FilterGroup label="Amenities" icon={<ShieldCheck className="text-primary/70" size={14} />}>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleAmenityToggle(opt)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all duration-300",
                      filters.amenities.includes(opt)
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </FilterGroup>
          </div>

          {/* Sticky Reset Button at Bottom (for mobile) */}
          <div className="mt-8 lg:hidden">
            <button
              onClick={resetFilters}
              className="w-full py-4 bg-gray-900 text-white rounded-[1.5rem] font-black tracking-widest text-xs uppercase shadow-2xl transition-transform active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
