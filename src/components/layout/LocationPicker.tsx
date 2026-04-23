'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useLoadScript } from '@react-google-maps/api';
import { MapPin, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const libraries: ("places")[] = ["places"];

interface LocationPickerProps {
  locale: string;
  onLocationChange?: (location: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationPicker({ locale, onLocationChange, placeholder, className }: LocationPickerProps) {
  console.log("LocationPicker API Key:", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? "Present" : "Missing");

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    console.error("Google Maps Load Error:", loadError);
    return <div className="text-red-500 text-xs">Error loading maps</div>;
  }
  
  if (!isLoaded) {
    return (
      <div className={cn("flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl border border-transparent w-full", className)}>
        <div className="animate-pulse flex items-center gap-2 w-full">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className={cn("h-10 w-full bg-gray-100 animate-pulse rounded-xl", className)} />}>
      <LocationPickerChild locale={locale} onLocationChange={onLocationChange} placeholder={placeholder} className={className} />
    </Suspense>
  );
}

function LocationPickerChild({ locale, onLocationChange, placeholder, className }: LocationPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed */
    },
    debounce: 300,
  });

  // Sync with URL if location changes and not in "form mode"
  useEffect(() => {
    if (!searchParams || onLocationChange) return;
    const fromQuery = searchParams.get('location');
    if (fromQuery) {
      setValue(fromQuery, false);
    }
  }, [searchParams, setValue, onLocationChange]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsOpen(true);
    if (onLocationChange) {
      onLocationChange(e.target.value);
    }
  };

  const handleSelect = ({ description }: { description: string }) => () => {
    setValue(description, false);
    clearSuggestions();
    setIsOpen(false);
    
    if (onLocationChange) {
      onLocationChange(description);
    } else {
      // Navigate with new location only if not in "form mode"
      router.push(`/${locale}/properties?location=${encodeURIComponent(description)}`);
    }
  };

  const clearInput = () => {
    setValue("");
    clearSuggestions();
    setIsOpen(false);
    if (onLocationChange) {
      onLocationChange("");
    } else {
      router.push(`/${locale}/properties`);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl border border-transparent focus-within:border-primary/20 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 group shadow-sm">
        <div className="flex items-center gap-1.5 shrink-0">
          <Search className="w-4 h-4 text-primary transition-transform group-hover:scale-110" />
          <MapPin className="w-4 h-4 text-primary/60 transition-transform group-hover:scale-110" />
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-gray-500 block font-bold  tracking-wider leading-none mb-1 uppercase">
            Location
          </label>
          <div className="flex items-center">
            <input
              value={value}
              onChange={handleInput}
              disabled={!ready}
              placeholder={placeholder || "Search location..."}
              className="bg-transparent border-0 font-semibold text-gray-800 text-xs focus:outline-none w-full placeholder:text-gray-400 placeholder:font-normal"
              onFocus={() => setIsOpen(true)}
            />
            {value && (
              <button onClick={clearInput} className="text-gray-400 hover:text-gray-600 ml-1">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && status === "OK" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2">
          <ul className="py-2">
            {data.map((suggestion) => {
              const {
                place_id,
                structured_formatting: { main_text, secondary_text },
              } = suggestion;

              return (
                <li
                  key={place_id}
                  onClick={handleSelect(suggestion)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 group-hover:text-primary transition-colors" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                      {main_text}
                    </p>
                    <p className="text-xs text-gray-500 truncate leading-tight mt-1">
                      {secondary_text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
