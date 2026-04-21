'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui';
import { Property } from '@/types';
import { X, Heart, MapPin, Bed, Bath, ArrowRight, Maximize2 } from 'lucide-react';
import { auth, firestore } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PropertyCardProps {
  property: Property;
}

/**
 * Formats price to Indian numbering system with short notation
 */
const formatPrice = (price: number | string) => {
  if (!price) return 'N/A';
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if (isNaN(numPrice)) return price;

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const formattedValue = formatter.format(numPrice);
  
  let shortPrice = '';
  if (numPrice >= 10000000) {
    shortPrice = `(${(numPrice / 10000000).toFixed(1)}Cr)`;
  } else if (numPrice >= 100000) {
    shortPrice = `(${(numPrice / 100000).toFixed(1)}L)`;
  } else if (numPrice >= 1000) {
    shortPrice = `(${(numPrice / 1000).toFixed(1)}K)`;
  }

  return `${formattedValue} ${shortPrice}`;
};

/**
 * PropertyCard Component
 * Displays a single property with image, details, and action buttons
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const propertyImages = property.images && property.images.length > 0 ? property.images : [property.image || '/placeholder.svg'];
  
  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const favorites = userDoc.data().favorites || [];
          setIsFavorite(favorites.includes(property.id));
        }
      }
    };
    checkFavorite();
  }, [property.id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to save properties");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(firestore, "users", user.uid);
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(property.id)
        });
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(property.id)
        });
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <div className="h-full">
      <Link href={`/${locale}/property/${property.slug}`}>
        <Card clickable className="group flex flex-col h-full overflow-hidden bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
          {/* Image Container */}
          <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
            <Image
              src={propertyImages[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            {/* Image Navigation Arrows */}
            {propertyImages.length > 1 && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={prevImage}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white text-white hover:text-gray-900 transition-all z-20"
                >
                  <span className="text-xl font-bold leading-none mb-0.5">‹</span>
                </button>
                <button
                  onClick={nextImage}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white text-white hover:text-gray-900 transition-all z-20"
                >
                  <span className="text-xl font-bold leading-none mb-0.5">›</span>
                </button>
              </div>
            )}

            {/* Type Badge */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
              <div className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white uppercase shadow-lg",
                property.type === 'Villa' ? 'bg-primary' : 'bg-orange-500'
              )}>
                {property.type}
              </div>
              {property.furnishing && (
                <div className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-gray-900 bg-white shadow-lg uppercase">
                  {property.furnishing}
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              disabled={loading}
              className={cn(
                "absolute top-4 left-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 z-10 backdrop-blur-md shadow-lg",
                isFavorite 
                  ? "bg-red-500 text-white" 
                  : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
              )}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} className={loading ? "animate-pulse" : ""} />
            </button>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-primary-foreground" />
                <span className="text-xs font-bold truncate max-w-[150px]">{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Maximize2 size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex flex-col flex-grow p-6 gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
                {property.postedBy || 'Individual'} • {property.possession || 'Ready to move'}
              </p>
            </div>

            {/* Property Details Chips */}
            <div className="flex flex-wrap gap-3">
              {property.bedrooms && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Bed size={14} className="text-primary" />
                  <span className="text-[11px] font-bold text-gray-600">{property.bedrooms} BHK</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Bath size={14} className="text-primary" />
                  <span className="text-[11px] font-bold text-gray-600">{property.bathrooms} Bath</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                  <Maximize2 size={14} className="text-primary" />
                  <span className="text-[11px] font-bold text-gray-600">{property.sqft} sqft</span>
                </div>
              )}
            </div>

            {/* Price and Button */}
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-0.5">Budget / Rental</p>
                <p className="text-xl font-black text-primary leading-none">
                  {formatPrice(property.price)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <ArrowRight size={20} strokeWidth={3} />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
