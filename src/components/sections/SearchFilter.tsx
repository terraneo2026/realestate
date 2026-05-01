'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Home, MapPin, IndianRupee, ChevronDown, List, Building2, User, Calendar, Filter, X, Bed, Bath, Clock, Users, ShieldCheck } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PROPERTY_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'plot', label: 'Plot' },
];

const LOCATIONS = [
  { value: 'chennai', label: 'Chennai' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'hyderabad', label: 'Hyderabad' },
];

const BUDGET_RANGES = [
  { value: '', label: 'Any Budget' },
  { value: '0-500000', label: 'Under 5L' },
  { value: '500000-1000000', label: '5L - 10L' },
  { value: '1000000-5000000', label: '10L - 50L' },
  { value: '5000000-10000000', label: '50L - 1Cr' },
  { value: '10000000+', label: '1Cr+' },
];

const POSSESSION_OPTIONS = [
  { value: '', label: 'Anytime' },
  { value: 'ready', label: 'Ready to move' },
  { value: '1w', label: 'Within 1 Week' },
  { value: '1m', label: 'Within 1 Month' },
  { value: '6m', label: 'Within 6 Months' },
  { value: '1y', label: 'Within 1 Year' },
];

const AMENITIES_OPTIONS = [
  { value: 'gym', label: 'Gym' },
  { value: 'pool', label: 'Swimming Pool' },
  { value: 'parking', label: 'Parking' },
  { value: 'security', label: '24/7 Security' },
  { value: 'power_backup', label: 'Power Backup' },
];

interface Category {
  id: string;
  category: string;
}

export function SearchFilter({ isSticky = false }: { isSticky?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  const [categories, setCategories] = useState<Category[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'all',
    category: '',
    location: 'chennai',
    budget: '',
    bedrooms: '',
    bathrooms: '',
    possession: '',
    postedBy: '',
    amenities: [] as string[],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(firestore, 'categories'));
        const categoriesList = snap.docs.map(doc => ({
          id: doc.id,
          category: doc.data().category || doc.data().name || 'Uncategorized'
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSearch = () => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          if (value.length > 0) query.set(key, value.join(','));
        } else {
          query.set(key, value.toString());
        }
      }
    });
    router.push(`/${locale}/properties?${query.toString()}`);
  };

  return (
    <div className={cn(
      "w-full transition-all duration-500 ease-in-out",
      isSticky ? "bg-white/95 backdrop-blur-xl shadow-2xl py-3" : "bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] py-6 md:py-8 rounded-2xl md:rounded-3xl"
    )}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-0">
          {/* Keyword Search */}
          <div className="flex-[1.5] px-6 lg:border-r border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-primary/70" />
              <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Keyword</span>
            </div>
            <input
              type="text"
              placeholder="Search properties, projects..."
              className="w-full bg-transparent text-sm md:text-base font-black text-gray-900 focus:outline-none placeholder:text-gray-300"
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
            />
          </div>

          {/* Property Type */}
          <div className="flex-1 px-6 lg:border-r border-gray-100">
            <SearchableDropdown
              label="Type"
              icon={<Home className="w-4 h-4 text-primary/70" />}
              options={PROPERTY_TYPES}
              value={filters.type}
              onChange={(val) => handleFilterChange('type', val)}
              placeholder="All Types"
            />
          </div>

          {/* Location */}
          <div className="flex-1 px-6 lg:border-r border-gray-100">
            <SearchableDropdown
              label="Location"
              icon={<MapPin className="w-4 h-4 text-primary/70" />}
              options={LOCATIONS}
              value={filters.location}
              onChange={(val) => handleFilterChange('location', val)}
              placeholder="Select City"
            />
          </div>

          {/* Budget */}
          <div className="flex-1 px-6 lg:border-r border-gray-100">
            <SearchableDropdown
              label="Budget"
              icon={<IndianRupee className="w-4 h-4 text-primary/70" />}
              options={BUDGET_RANGES}
              value={filters.budget}
              onChange={(val) => handleFilterChange('budget', val)}
              placeholder="Any Budget"
            />
          </div>

          {/* Actions */}
          <div className="px-6 flex items-center gap-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all duration-300",
                showAdvanced ? "bg-primary/10 border-primary text-primary" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
              )}
            >
              <Filter size={20} />
            </button>
            <button
              onClick={handleSearch}
              className="h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl font-black tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all active:scale-95 text-sm md:text-base"
            >
              <Search size={20} strokeWidth={3} />
              <span>SEARCH</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Category */}
            <div className="space-y-2">
              <SearchableDropdown
                label="Category"
                options={[{ value: '', label: 'All Categories' }, ...categories.map(c => ({ value: c.id, label: c.category }))]}
                value={filters.category}
                onChange={(val) => handleFilterChange('category', val)}
                placeholder="All Categories"
              />
            </div>

            {/* Bedrooms */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-primary/70" />
                <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Bedrooms</label>
              </div>
              <div className="flex gap-2">
                {['1', '2', '3', '4', '5+'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleFilterChange('bedrooms', val)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                      filters.bedrooms === val ? "bg-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-primary/70" />
                <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Bathrooms</label>
              </div>
              <div className="flex gap-2">
                {['1', '2', '3', '4+'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleFilterChange('bathrooms', val)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-xs font-black transition-all",
                      filters.bathrooms === val ? "bg-primary text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Possession */}
            <div className="space-y-2">
              <SearchableDropdown
                label="Possession"
                icon={<Clock className="w-4 h-4 text-primary/70" />}
                options={POSSESSION_OPTIONS}
                value={filters.possession}
                onChange={(val) => handleFilterChange('possession', val)}
                placeholder="Anytime"
              />
            </div>

            {/* Posted By */}
            <div className="space-y-2">
              <SearchableDropdown
                label="Posted By"
                icon={<Users className="w-4 h-4 text-primary/70" />}
                options={[
                  { value: '', label: 'Anyone' },
                  { value: 'owner', label: 'Owner' },
                  { value: 'agent', label: 'Agent' },
                  { value: 'builder', label: 'Builder' },
                ]}
                value={filters.postedBy}
                onChange={(val) => handleFilterChange('postedBy', val)}
                placeholder="Anyone"
              />
            </div>

            {/* Amenities */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary/70" />
                <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Amenities</label>
              </div>
              <div className="flex flex-wrap gap-2">
                {AMENITIES_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleAmenity(opt.value)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all",
                      filters.amenities.includes(opt.value)
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setFilters({
                  keyword: '',
                  type: 'all',
                  category: '',
                  location: 'chennai',
                  budget: '',
                  bedrooms: '',
                  bathrooms: '',
                  possession: '',
                  postedBy: '',
                  amenities: [],
                })}
                className="w-full py-3 rounded-2xl border-2 border-gray-100 text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <X size={14} />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

  );
}
