"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images = [], title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const validImages = images.filter(img => typeof img === 'string' && img.length > 0);

  // Sync thumbnail scroll when selectedIndex changes
  useEffect(() => {
    if (scrollRef.current) {
      const thumbnail = scrollRef.current.children[selectedIndex] as HTMLElement;
      if (thumbnail) {
        const scrollLeft = thumbnail.offsetLeft - (scrollRef.current.offsetWidth / 2) + (thumbnail.offsetWidth / 2);
        scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (validImages.length === 0) {
    return (
      <div className="bg-gray-100 rounded-2xl h-[300px] md:h-[500px] flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="text-center">
          <p className="text-gray-400 font-bold">No images available for this property</p>
        </div>
      </div>
    );
  }

  const currentImage = validImages[selectedIndex];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % validImages.length);
  };

  return (
    <div className="space-y-6">
      {/* Main Image Viewport */}
      <div className="relative bg-gray-900 rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl group border border-gray-100 flex items-center justify-center">
        <img
          src={currentImage}
          alt={`${title} - image ${selectedIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-all duration-700 ease-in-out"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {validImages.length > 1 && (
          <>
            {/* Left/Right Arrow Controls */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none">
              <button
                onClick={handlePrev}
                className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl transition-all border border-white/20 active:scale-90 group/btn"
                aria-label="Previous image"
              >
                <ChevronLeft size={32} className="group-hover/btn:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={handleNext}
                className="pointer-events-auto w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/30 backdrop-blur-xl text-white rounded-full flex items-center justify-center shadow-2xl transition-all border border-white/20 active:scale-90 group/btn"
                aria-label="Next image"
              >
                <ChevronRight size={32} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Image Counter Badge */}
            <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-xs font-black border border-white/10 tracking-widest ">
              {selectedIndex + 1} <span className="mx-1 text-white/40">/</span> {validImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {validImages.length > 1 && (
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto py-2 px-1 scrollbar-hide no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {validImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`relative flex-shrink-0 rounded-2xl overflow-hidden h-20 w-32 md:h-24 md:w-40 border-4 transition-all duration-500 ease-out ${
                  idx === selectedIndex 
                    ? "border-primary scale-105 shadow-xl ring-4 ring-primary/10" 
                    : "border-transparent opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
                }`}
              >
                <img src={img} alt={`${title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === selectedIndex && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
