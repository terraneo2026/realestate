"use client";

import { useEffect, useState } from 'react';

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
    'https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460932960985-90a2e59df800?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672527689-408aa28e3a19?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535576661393-b8e8a40ae803?w=400&h=400&fit=crop',
  ];

  const slides = [
    {
      id: 1,
      title: "Real estate business",
      headline: "HOME",
      highlight: "FOR SALE",
      description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper.",
      mainImage: 'https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: "Stunning properties",
      headline: "PROJECTS",
      highlight: "COLLECTION",
      description: "Discover our exclusive collection of premium real estate properties in the most sought-after locations.",
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
    <section className="relative bg-gray-900 text-white">
      {/* Full Width Background Slider */}
      <div className="relative w-full h-64 md:h-96 lg:h-[80vh]">
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
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-xs md:text-sm font-medium opacity-90 mb-2">{slide.title}</p>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-3 md:mb-4">
              <span>{slide.headline}</span>
              <br />
              <span className="text-yellow-400">FOR {slide.highlight}</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed opacity-90 max-w-xl mx-auto mb-4 md:mb-6 line-clamp-2">
              {slide.description}
            </p>

            <div className="flex flex-col xs:flex-row gap-2 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-white font-bold rounded text-xs md:text-sm py-2.5 md:py-3 px-6 md:px-8 transition transform hover:scale-105 whitespace-nowrap">
                Explore Properties
              </button>
              <button className="border-2 border-white text-white font-bold rounded text-xs md:text-sm py-2.5 md:py-3 px-6 md:px-8 hover:bg-white hover:text-gray-900 transition transform hover:scale-105 whitespace-nowrap">
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

      {/* Smart Search Filter - Overlay positioned */}
      <div className="absolute left-0 right-0 bottom-0 translate-y-1/2 z-30 w-full px-4">
        <div className="max-w-7xl mx-auto">
          <SearchFilterSection
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
          />
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
    <div className="bg-white shadow-xl rounded-xl border border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Property Type Tabs - Compact and aligned */}
        <div className="flex gap-0 mb-6 border-b border-gray-200 flex-wrap">
          {[
            { key: 'rent', label: 'Rent' },
            { key: 'sale', label: 'Sale' },
            { key: 'project', label: 'Projects' }
          ].map(type => (
            <button
              key={type.key}
              onClick={() => setSearchFilters({ ...searchFilters, type: type.key })}
              className={`px-6 md:px-8 py-3.5 font-semibold text-sm md:text-base transition border-b-2 whitespace-nowrap ${
                searchFilters.type === type.key
                  ? 'text-primary border-primary'
                  : 'text-gray-600 border-b-transparent hover:text-gray-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Search Fields Grid - Responsive with proper gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 mb-5 relative z-10">
          {/* Location */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-semibold text-gray-700">Location</label>
            <select
              name="location"
              value={searchFilters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white relative z-20"
            >
              <option value="">Select Location</option>
              <option value="chennai">Chennai</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="delhi">Delhi</option>
              <option value="hyderabad">Hyderabad</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-semibold text-gray-700">Type</label>
            <select
              name="propertyType"
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white relative z-20"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Min Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Min Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-medium">₹</span>
              <input
                type="number"
                name="minPrice"
                value={searchFilters.minPrice}
                onChange={handleFilterChange}
                placeholder="0"
                className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Max Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm font-medium">₹</span>
              <input
                type="number"
                name="maxPrice"
                value={searchFilters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Any"
                className="w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div className="space-y-2 relative">
            <label className="block text-sm font-semibold text-gray-700">Bedrooms</label>
            <select
              name="bedrooms"
              value={searchFilters.bedrooms}
              onChange={handleFilterChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white relative z-20"
            >
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold py-3 px-10 rounded-lg transition text-base shadow-md hover:shadow-lg"
        >
          Search Properties
        </button>
      </div>
    </div>
  );
};

export default Hero;