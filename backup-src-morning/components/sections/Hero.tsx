'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select } from '@/components/ui';

interface HeroSlide {
  id: number;
  title: string;
  headline: string;
  highlight: string;
  description: string;
  mainImage: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Real estate business',
    headline: 'HOME',
    highlight: 'FOR SALE',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.',
    mainImage:
      'https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Stunning properties',
    headline: 'PROJECTS',
    highlight: 'COLLECTION',
    description:
      'Discover our exclusive collection of premium real estate properties in the most sought-after locations.',
    mainImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  },
];

const PROPERTY_TYPES = [
  { value: 'rent', label: 'For Rent' },
  { value: 'sale', label: 'For Sale' },
];

const LOCATIONS = [
  { value: 'chennai', label: 'Chennai' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
];

/**
 * Hero Section
 * Full-width hero banner with image slider and search filter
 */
export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [filters, setFilters] = useState({
    type: 'rent',
    location: 'chennai',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const currentSlideData = HERO_SLIDES[currentSlide];

  return (
    <section className="relative bg-gray-900 text-white mt-[80px]">
      {/* Background Slider */}
      <div className="relative w-full h-64 md:h-96 lg:h-[70vh]">
        {HERO_SLIDES.map((slide, index) => (
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
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 md:p-3 rounded-full transition text-xl md:text-2xl"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-white p-2 md:p-3 rounded-full transition text-xl md:text-2xl"
        >
          ›
        </button>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-xs md:text-sm font-medium opacity-90 mb-2">
              {currentSlideData.title}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 md:mb-4">
              <span>{currentSlideData.headline}</span>
              <br />
              <span className="text-yellow-400">FOR {currentSlideData.highlight}</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed opacity-90 max-w-xl mx-auto mb-4 md:mb-6 line-clamp-2">
              {currentSlideData.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="primary">
                Explore Properties
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, index) => (
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

      {/* Search Filter Overlay */}
      <div className="absolute left-0 right-0 bottom-0 translate-y-1/2 z-30 w-full px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="bg-white shadow-xl rounded-xl p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                options={PROPERTY_TYPES}
                label="Property Type"
              />
              <Select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                options={LOCATIONS}
                label="Location"
              />
              <Input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                label="Min Price"
              />
              <Input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                label="Max Price"
              />
              <div className="flex items-end">
                <Button size="md" variant="primary" className="w-full">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
