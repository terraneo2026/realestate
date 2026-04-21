'use client';

import { useState, useEffect } from 'react';
import { SearchFilter } from './SearchFilter';

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
    headline: 'Home',
    highlight: 'for sale',
    description:
      'Find your perfect sanctuary from our curated collection of premium residential properties across India.',
    mainImage:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Stunning properties',
    headline: 'Projects',
    highlight: 'collection',
    description:
      'Discover our exclusive collection of premium real estate properties in the most sought-after locations.',
    mainImage:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  },
];

/**
 * Hero Section
 * Full-width hero banner with image slider and search filter
 */
export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="relative w-full">
      {/* Sticky Search Filter Overlapping Hero */}
      <div className="absolute left-0 right-0 bottom-0 translate-y-1/2 z-40 w-full px-4">
        <div className="max-w-7xl mx-auto transition-all duration-300">
          <SearchFilter isSticky={false} />
        </div>
      </div>

      <section className="relative w-full h-[600px] sm:h-[700px] md:h-[750px] lg:h-[850px] overflow-hidden">
        {/* Slider Background */}
        <div className="absolute inset-0">
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
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white w-12 h-12 flex items-center justify-center rounded-full transition backdrop-blur-md border border-white/20"
          >
            <span className="text-3xl font-light">‹</span>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white w-12 h-12 flex items-center justify-center rounded-full transition backdrop-blur-md border border-white/20"
          >
            <span className="text-3xl font-light">›</span>
          </button>

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center z-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
              <div className="max-w-3xl text-left pt-12 md:pt-20">
                <div className="flex items-center gap-3 mb-6 animate-fade-in-down">
                  <div className="h-px w-12 bg-yellow-400"></div>
                  <p className="text-sm md:text-base font-black text-yellow-400 tracking-[0.3em] uppercase drop-shadow-md">
                    {currentSlideData.title}
                  </p>
                </div>
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] mb-8 animate-fade-in tracking-tighter text-white">
                  <span className="block drop-shadow-2xl">{currentSlideData.headline}</span>
                  <span className="text-yellow-400 block mt-2 drop-shadow-2xl">For {currentSlideData.highlight}</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-white/90 max-w-2xl mb-12 line-clamp-3 font-medium animate-fade-in drop-shadow-xl">
                  {currentSlideData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? 'bg-white w-12 md:w-20 h-2.5 rounded-full shadow-xl'
                    : 'bg-white/30 hover:bg-white/50 w-2.5 h-2.5 rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
