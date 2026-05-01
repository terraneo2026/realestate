"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Heart, Loader2 } from "lucide-react";
import { auth, firestore } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import AuthModal from "./AuthModal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PropertyCardProps {
  id: string | number;
  title: string;
  price: string;
  location: string;
  image: string;
  type: "rent" | "lease";
  bedrooms?: number;
  bathrooms?: number;
  slug: string;
  images?: string[];
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  image,
  type,
  bedrooms,
  bathrooms,
  slug,
  images,
}: PropertyCardProps) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const favorites = userDoc.data().favorites || [];
          setIsSaved(favorites.includes(String(id)));
        }
      } else {
        setIsSaved(false);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to save properties");
      setAuthModalOpen(true);
      return;
    }

    setSaving(true);
    try {
      const userRef = doc(firestore, "users", user.uid);
      if (isSaved) {
        await updateDoc(userRef, {
          favorites: arrayRemove(String(id))
        });
        setIsSaved(false);
        toast.success("Removed from saved properties");
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(String(id))
        });
        setIsSaved(true);
        toast.success("Property saved to dashboard");
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  const propertyImages = images && images.length > 0 ? images : [image || "/placeholder.svg"];
  
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

  const openPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPopup(true);
  };

  return (
    <>
      <Link href={`/${locale}/property/${slug}`}>
        <div className="group flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden">
          {/* Image Container */}
          <div className="relative w-full h-64 bg-gray-100 overflow-hidden flex-shrink-0">
            <Image
              src={propertyImages[currentImageIndex]}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
              onClick={openPopup}
            />
            
            {/* Image Navigation Arrows */}
            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition z-20 opacity-0 group-hover:opacity-100"
                >
                  <span className="text-gray-800 font-bold">‹</span>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition z-20 opacity-0 group-hover:opacity-100"
                >
                  <span className="text-gray-800 font-bold">›</span>
                </button>
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                  {propertyImages.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Type Badge - Top Right */}
            <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white z-10 ${
              type === "rent" ? "bg-primary" : "bg-blue-600"
            }`}>
              {type === "rent" ? "For Rent" : "For Lease"}
            </div>

            {/* Save Button - Top Left */}
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={cn(
                "absolute top-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10 shadow-lg",
                isSaved ? "bg-red-500 text-white" : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
              )}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} fill={isSaved ? "currentColor" : "none"} />}
            </button>
          </div>

          {/* Content Container */}
          <div className="flex flex-col flex-grow p-4 gap-3">
            <div className="flex-grow">
              <h3 className="text-base font-semibold text-gray-800 line-clamp-2 mb-1">
                {title}
              </h3>

              <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                📍 {location}
              </p>

              {(bedrooms || bathrooms) && (
                <div className="text-xs text-gray-600 space-x-3 flex">
                  {bedrooms && <span>🛏️ {bedrooms}</span>}
                  {bathrooms && <span>🚿 {bathrooms}</span>}
                </div>
              )}
            </div>

            {/* Price and Button */}
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="text-lg font-black text-primary">₹{price.replace('$', '')}</div>
              <Button variant="primary" size="md" className="w-full">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>

      {/* Image Popup Modal */}
      {showPopup && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10"
          onClick={() => setShowPopup(false)}
        >
          <button 
            className="absolute top-5 right-5 text-white hover:text-primary transition-colors z-[1010]"
            onClick={() => setShowPopup(false)}
          >
            <X size={40} />
          </button>

          <div 
            className="relative w-full max-w-5xl aspect-video md:aspect-[16/9] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={propertyImages[currentImageIndex]}
              alt={title}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {propertyImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20"
                >
                  <span className="text-2xl md:text-4xl">‹</span>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/20"
                >
                  <span className="text-2xl md:text-4xl">›</span>
                </button>
                
                <div className="absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
                  {propertyImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary w-6 md:w-8' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal if triggered from save */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
