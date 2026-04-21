"use client";

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchFilters {
  type: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

interface SearchFilterSectionProps {
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  handleSearch: () => void;
}

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'rent',
    location: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: ''
  });

  // Property images for circular carousel
  const propertyImages = [
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop',
  ];

  const slides = [
    {
      id: 1,
      title: "Real estate business",
      headline: "HOME",
      highlight: "FOR LEASE",
      description: "Discover our premium rental properties and exclusive lease options in the most sought-after locations.",
      mainImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: "Stunning properties",
      headline: "PROJECTS",
      highlight: "COLLECTION",
      description: "Discover our exclusive collection of premium real estate properties available for rent and lease.",
      mainImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const imageTimer = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % propertyImages.length);
    }, 3000);

    return () => {
      clearInterval(slideTimer);
      clearInterval(imageTimer);
    };
  }, []);

  const slide = slides[currentSlide];

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', searchFilters);
    // Add search logic here
  };

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden flex flex-col">
      {/* Smart Search Filter - Sticky Top UI */}
      <div className="sticky top-0 z-40 w-full px-4 sm:px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <SearchFilterSection
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
          />
        </div>
      </div>

      {/* Full Width Background Slider */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[70vh]">
        {/* Background Images */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.mainImage}
              alt={slide.headline}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        {/* Slider Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 md:p-3 rounded-full transition text-xl md:text-2xl"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 md:p-3 rounded-full transition text-xl md:text-2xl"
        >
          ›
        </button>

        {/* Hero Content - Centered Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-sm md:text-base font-semibold tracking-widest  opacity-90 mb-2 md:mb-3">{slide.title}</p>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 md:mb-6">
              <span className="block mb-1">{slide.headline}</span>
              <span className="text-yellow-400 block">FOR {slide.highlight}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl leading-relaxed opacity-90 max-w-2xl mx-auto mb-6 md:mb-8 line-clamp-3 md:line-clamp-none px-4 font-normal">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg text-base py-3.5 md:py-4 px-8 md:px-10 transition transform hover:scale-105 shadow-lg whitespace-nowrap">
                Explore Properties
              </button>
              <button className="w-full sm:w-auto border-2 border-white text-white font-semibold rounded-lg text-base py-3.5 md:py-4 px-8 md:px-10 hover:bg-white hover:text-gray-900 transition transform hover:scale-105 shadow-lg whitespace-nowrap">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Slide Indicators - Bottom */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all ${
                index === currentSlide
                  ? 'bg-white w-6 md:w-8 h-2 rounded-full'
                  : 'bg-white/50 hover:bg-white/75 w-2 h-2 rounded-full'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Separate Search Filter Component
const SearchFilterSection = ({ 
  searchFilters, 
  setSearchFilters, 
  handleFilterChange, 
  handleSearch 
}: SearchFilterSectionProps) => {
  return (
    <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden transform transition-all duration-300">
      <div className="px-5 sm:px-8 py-8 md:py-10">
        {/* Property Type Tabs - Compact and aligned */}
        <div className="flex gap-1 mb-8 border-b border-gray-100 overflow-x-auto no-scrollbar pb-1">
          {[
            { key: 'rent', label: 'Rent', icon: '🏠' },
            { key: 'lease', label: 'Lease', icon: '💰' },
            { key: 'project', label: 'Projects', icon: '🏗️' }
          ].map(type => (
            <button
              key={type.key}
              onClick={() => setSearchFilters({ ...searchFilters, type: type.key })}
              className={`px-8 md:px-12 py-4 font-bold text-sm md:text-lg transition-all border-b-4 whitespace-nowrap flex items-center gap-3 ${
                searchFilters.type === type.key
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-gray-500 border-b-transparent hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Fields Grid - Responsive with proper gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6 mb-8 relative z-10">
          {/* Location */}
          <div className="space-y-3 relative group">
            <label className="block text-sm font-bold text-gray-800  tracking-wider ml-1">Location</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-30 text-xl">📍</span>
              <select
                name="location"
                value={searchFilters.location}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-10 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition bg-gray-50/50 relative z-20 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Select Location</option>
                <option value="chennai">Chennai</option>
                <option value="mumbai">Mumbai</option>
                <option value="bangalore">Bangalore</option>
                <option value="delhi">Delhi</option>
                <option value="hyderabad">Hyderabad</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 z-30 pointer-events-none">
                <ChevronDown size={18} />
              </span>
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-3 relative group">
            <label className="block text-sm font-bold text-gray-800  tracking-wider ml-1">Type</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-30 text-xl">�️</span>
              <select
                name="propertyType"
                onChange={handleFilterChange}
                className="w-full pl-12 pr-10 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition bg-gray-50/50 relative z-20 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="house">House</option>
                <option value="commercial">Commercial</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 z-30 pointer-events-none">
                <ChevronDown size={18} />
              </span>
            </div>
          </div>

          {/* Min Budget */}
          <div className="space-y-3 group">
            <label className="block text-sm font-bold text-gray-800  tracking-wider ml-1">Min Budget</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold z-30 text-lg">₹</span>
              <input
                type="number"
                name="minPrice"
                value={searchFilters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition bg-gray-50/50 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Max Budget */}
          <div className="space-y-3 group">
            <label className="block text-sm font-bold text-gray-800  tracking-wider ml-1">Max Budget</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold z-30 text-lg">₹</span>
              <input
                type="number"
                name="maxPrice"
                value={searchFilters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Any"
                className="w-full pl-10 pr-4 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition bg-gray-50/50 shadow-sm hover:shadow-md"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-3 relative group">
            <label className="block text-sm font-bold text-gray-800  tracking-wider ml-1">Bedrooms</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-30 text-xl">🛏️</span>
              <select
                name="bedrooms"
                value={searchFilters.bedrooms}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-10 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition bg-gray-50/50 relative z-20 shadow-sm hover:shadow-md appearance-none cursor-pointer"
              >
                <option value="">Any</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 z-30 pointer-events-none">
                <ChevronDown size={18} />
              </span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-5 px-16 rounded-2xl transition-all duration-300 text-lg shadow-xl hover:shadow-primary/30 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-4 group"
          >
            <span className="text-2xl group-hover:rotate-12 transition-transform">🔍</span>
            Search Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
