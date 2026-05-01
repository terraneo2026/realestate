"use client";

import { notFound, useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyInfo from "@/components/PropertyInfo";
import AmenitiesList from "@/components/AmenitiesList";
import AgentCard from "@/components/AgentCard";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Navbar, Footer, PageHero } from "@/components/layout";
import { Button } from "@/components/ui";
import { firestore, auth } from "@/lib/firebase";
import { collection, query, where, getDocs, getDoc, limit, doc, setDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2, Heart, Calendar, ShieldCheck, MapPin, Share2, AlertCircle } from "lucide-react";
import { BOOKING_STATUS, TOKEN_AMOUNT } from "@/lib/constants";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { sendNotification } from "@/lib/notifications";
import { lockPropertyRent } from "@/lib/safety-engine";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats price to Indian numbering system with short notation
 */
const formatPrice = (price: number | string) => {
  if (!price) return 'Price on Request';
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
  if (isNaN(numPrice)) return String(price);

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

export default function PropertyDetailClient({ slug, locale }: { slug: string, locale: string }) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentTokenAmount, setCurrentTokenAmount] = useState(500);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTokenConfig = async () => {
      if (!property?.category) return;
      try {
        const categoryMap: any = { 'Budget': 'Budget', 'Mid Range': 'Mid Range', 'Premium': 'Premium', 'Luxury': 'Luxury' };
        const categoryName = categoryMap[property.category] || 'Budget';
        const res = await fetch(`/api/admin/configuration/tokens`);
        const result = await res.json();
        if (result.success) {
          const config = result.data.find((c: any) => c.category === categoryName);
          if (config) setCurrentTokenAmount(config.tokenAmount);
        }
      } catch (e) {
        console.error("Error fetching token config:", e);
      }
    };
    fetchTokenConfig();
  }, [property]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        let data = null;

        const q = query(collection(firestore, "properties"), where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          data = { id: docSnap.id, ...docSnap.data() };
        } else {
          // Try to find by document ID if no slug match
          const docRef = doc(firestore, "properties", slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data = { id: docSnap.id, ...docSnap.data() };
          }
        }

        if (data) {
          setProperty(data);
          // Check if saved
          if (user) {
            const userDoc = await getDoc(doc(firestore, "users", user.uid));
            if (userDoc.exists()) {
              const favorites = userDoc.data().favorites || [];
              setIsSaved(favorites.includes(data.id));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [slug, user]);

  const handleSaveProperty = async () => {
    if (!user) {
      toast.error("Please login to save properties");
      return;
    }

    setActionLoading(true);
    try {
      const userRef = doc(firestore, "users", user.uid);
      if (isSaved) {
        await setDoc(userRef, {
          favorites: (property.favorites || []).filter((id: string) => id !== property.id)
        }, { merge: true });
        setIsSaved(false);
        toast.success("Removed from favorites");
      } else {
        await setDoc(userRef, {
          favorites: [...(property.favorites || []), property.id]
        }, { merge: true });
        setIsSaved(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("Failed to update favorites");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBookingSubmit = async (date: Date, slot: string) => {
    if (!user) {
      toast.error("Please login to book a visit");
      return;
    }

    setBookingLoading(true);
    try {
      // 0. Check for duplicate visit requests
      const duplicateQuery = query(
        collection(firestore, "bookings"),
        where("userId", "==", user.uid),
        where("propertyId", "==", property.id),
        where("status", "==", BOOKING_STATUS.VISIT_REQUESTED)
      );
      const duplicateSnap = await getDocs(duplicateQuery);
      if (!duplicateSnap.empty) {
        toast.error("You already have an active visit request for this property.");
        return;
      }

      // 1. Fetch Latest Commission Config (Tokens are already in state)
      const commissionRes = await fetch(`/api/admin/configuration/commissions`);
      const commissionData = await commissionRes.json();
      const tenantCommission = commissionData.data?.find((c: any) => c.side === 'tenant' && c.active);

      // 2. Simulate Token Payment Flow
      toast.info(`Initializing token payment of ₹${currentTokenAmount}...`);
      
      // Simulating Razorpay popup and success
      const paymentSuccess = await new Promise((resolve) => {
        setTimeout(() => {
          toast.success("Payment successful! Transaction ID: TXN_" + Math.random().toString(36).substr(2, 9));
          resolve(true);
        }, 2000);
      });

      if (!paymentSuccess) {
        toast.error("Payment failed. Please try again.");
        return;
      }

      // 3. Create Immutable Configuration Snapshot
      const configSnapshot = {
        token_amount: currentTokenAmount,
        commission_type: tenantCommission?.type || 'percentage',
        commission_value: tenantCommission?.value || 0,
        applied_at: new Date().toISOString(),
        version: '1.0'
      };

      // 4. Create booking request with new status and snapshot
      const bookingRef = await addDoc(collection(firestore, "bookings"), {
        userId: user.uid,
        userName: user.displayName || "User",
        userEmail: user.email,
        ownerId: property.ownerId || "",
        propertyId: property.id,
        propertyTitle: property.title,
        propertySlug: property.slug,
        propertyImage: property.image || (property.images && property.images[0]),
        bookingDate: date.toISOString(),
        bookingSlot: slot,
        status: BOOKING_STATUS.VISIT_REQUESTED,
        tokenPaid: true,
        tokenAmount: currentTokenAmount,
        configuration_snapshot: configSnapshot, // CRITICAL: Immutable snapshot
        createdAt: serverTimestamp(),
      });

      // 5. Trigger Rent Locking (Automated Enforcement)
      if (!property.rentLocked) {
        await lockPropertyRent(property.id, property.price, user.uid);
      }

      // 3. Send notifications
      // To Owner
      if (property.ownerId) {
        await sendNotification({
          user_id: property.ownerId,
          role: 'owner',
          type: 'booking',
          title: 'New Visit Request!',
          message: `A new visit has been requested for your property "${property.title}" by ${user.displayName || "a tenant"}.`,
          metadata: { bookingId: bookingRef.id, propertyId: property.id }
        });
      }

      // To Tenant
      await sendNotification({
        user_id: user.uid,
        role: 'tenant',
        type: 'booking',
        title: 'Booking Request Sent',
        message: `Your visit request for "${property.title}" has been sent. The owner will review it soon.`,
        metadata: { bookingId: bookingRef.id, propertyId: property.id }
      });

      // To Admin
      await sendNotification({
        user_id: null,
        role: 'admin',
        type: 'booking',
        title: 'New Booking Request',
        message: `New booking request for "${property.title}" (ID: ${property.id}). Token ₹${TOKEN_AMOUNT} paid.`,
        metadata: { bookingId: bookingRef.id, propertyId: property.id }
      });

      toast.success("Visit requested successfully! Token payment confirmed.");
      router.push(`/${locale}/tenant/bookings`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to send booking request");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Loading Property Details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    notFound();
  }

  const title = property.title || "Property Detail";
  const images = (property.images && property.images.length > 0) ? property.images : [property.image || property.title_image];
  const amenities = property.amenities || [];
  const agent = property.agent || {
    name: property.postedBy || "Relocate Support",
    title: "Property Consultant",
    phone: "8125384888",
    email: "support@relocate.biz",
    image: "/logo.jpeg"
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50/30">
      <Navbar />
      <main className="flex-1 w-full pb-24">
        {/* Gallery Section - Full Width */}
        <div className="w-full bg-white border-b border-gray-100">
          <div className="max-w-[1600px] mx-auto">
            <PropertyGallery images={images} title={title} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-12">
              <PropertyInfo
                title={title}
                price={formatPrice(property.price)}
                location={property.address || property.city || "Location N/A"}
                type={property.type || "rent"}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.size_sqft || property.area_sqft || property.sqft}
                possession={property.possession}
                furnishing={property.furnishing}
                facing={property.facing}
                description={property.description}
                postedBy={property.postedBy}
                floor={property.floor}
                total_floors={property.total_floors}
                age={property.age}
                landmarks={property.landmarks}
                loan_eligible={property.loan_eligible}
              />

              {/* Amenities Section */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="text-primary" size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Amenities</h3>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Premium Features & Facilities</p>
                  </div>
                </div>
                {amenities.length > 0 ? (
                  <AmenitiesList amenities={amenities} />
                ) : (
                  <p className="text-gray-400 font-medium italic">No amenities listed for this property.</p>
                )}
              </div>

              {/* Location Map Placeholder */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="text-primary" size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Location Map</h3>
                    <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Explore the Neighborhood</p>
                  </div>
                </div>
                <div className="aspect-video w-full bg-gray-100 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 gap-4 border-2 border-dashed border-gray-200">
                   <MapPin size={48} className="opacity-20" />
                   <p className="text-sm font-bold uppercase tracking-widest">Map View (Approximate Area)</p>
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="space-y-8">
              {/* Agent Card */}
              <AgentCard
                name={agent.name}
                title={agent.title}
                phone={agent.phone}
                email={agent.email}
                image={agent.image}
              />

              {/* Booking Calendar */}
              <BookingCalendar 
                propertyId={property.id} 
                onBookingSubmit={handleBookingSubmit}
                loading={bookingLoading}
                tokenAmount={currentTokenAmount}
              />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-14 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all",
                    isSaved ? "bg-red-50 border-red-100 text-red-500" : "bg-white"
                  )}
                  onClick={handleSaveProperty}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
                      <span>{isSaved ? "Saved" : "Save"}</span>
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 bg-white"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: property.title,
                        text: property.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
