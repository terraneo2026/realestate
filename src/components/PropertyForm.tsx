"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, firestore, storage } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  X,
  Loader2
} from "lucide-react";
import Link from "next/link";
import DashboardLayout from "./DashboardLayout";

interface PropertyFormProps {
  role: "owner" | "agent";
}

const PropertyForm = ({ role }: PropertyFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    price: "",
    address: "",
    property_type: 1, // Default to 1 for Rent
    bedrooms: "",
    bathrooms: "",
    size_sqft: "",
    amenities: [] as string[],
    published_by_admin: false,
  });

  const AMENITIES_LIST = [
    "Swimming Pool", "Gym", "Parking", "Security", "Garden", 
    "Air Conditioning", "WiFi", "Balcony", "Pet Friendly", "Furnished"
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push(`/${locale}/login`);
      }
    });

    const fetchCategories = async () => {
      try {
        const catSnap = await getDocs(collection(firestore, "categories"));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    
    fetchCategories();
    return () => unsubscribe();
  }, [locale, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (text: any) => {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;

    setLoading(true);
    setLoadingStatus("Uploading images...");

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadPromises = images.map(async (img, i) => {
          const storageRef = ref(storage, `properties/${Date.now()}_${i}_${img.name}`);
          const uploadTask = uploadBytesResumable(storageRef, img);
          
          return new Promise<string>((resolve, reject) => {
            uploadTask.on("state_changed", 
              null, 
              (error) => reject(error), 
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });
        });

        imageUrls = await Promise.all(uploadPromises);
      }

      setLoadingStatus("Saving property...");
      
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id,
        address: formData.address.trim(),
        amenities: formData.amenities,
        slug: generateSlug(formData.title),
        price: parseFloat(formData.price) || 0,
        property_type: parseInt(formData.property_type.toString()) || 1, 
        bedrooms: parseInt(formData.bedrooms.toString()) || 0,
        bathrooms: parseInt(formData.bathrooms.toString()) || 0,
        size_sqft: parseFloat(formData.size_sqft.toString()) || 0,
        published_by: role,
        company_name: formData.published_by_admin ? "Relocate" : "",
        ownerId: currentUser.uid,
        images: imageUrls,
        image: imageUrls[0] || "https://placehold.co/600x400?text=No+Image",
        status: "published",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await addDoc(collection(firestore, "properties"), propertyData);
      
      alert("Property listed successfully!");
      router.push(`/${locale}/${role}/${role === 'owner' ? 'properties' : 'listings'}`);
    } catch (error: any) {
      console.error("Error adding property:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
      setLoadingStatus("");
    }
  };

  return (
    <DashboardLayout userRole={role}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href={`/${locale}/${role}/${role === 'owner' ? 'properties' : 'listings'}`}
            className="flex items-center text-gray-500 hover:text-primary font-bold group transition-colors"
          >
            <ArrowLeft size={22} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to {role === 'owner' ? 'Properties' : 'Listings'}
          </Link>
          <h2 className="text-3xl font-black text-gray-800">Add New {role === 'owner' ? 'Property' : 'Listing'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Apartment in Adyar"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Category</label>
                <select
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Rental Amount or Budget (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="Monthly rent or lease amount"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Type</label>
                <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs  tracking-widest transition-all ${formData.property_type === 1 ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                    onClick={() => setFormData({ ...formData, property_type: 1 })}
                  >
                    Rent
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs  tracking-widest transition-all ${formData.property_type === 2 ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
                    onClick={() => setFormData({ ...formData, property_type: 2 })}
                  >
                    Lease
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Bedrooms</label>
                <input
                  type="number"
                  required
                  placeholder="3"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Bathrooms</label>
                <input
                  type="number"
                  required
                  placeholder="2"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Size (Sq Ft)</label>
                <input
                  type="number"
                  required
                  placeholder="1200"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                  value={formData.size_sqft}
                  onChange={(e) => setFormData({ ...formData, size_sqft: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Location Address</label>
              <input
                type="text"
                required
                placeholder="Full address of the property"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-all" onClick={() => setFormData({ ...formData, published_by_admin: !formData.published_by_admin })}>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.published_by_admin ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}>
                {formData.published_by_admin && <Plus size={16} className="text-white rotate-45" />}
              </div>
              <span className={`text-sm font-black  tracking-widest transition-all ${formData.published_by_admin ? 'text-primary' : 'text-gray-400'}`}>Published by Admin</span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Description</label>
              <textarea
                required
                rows={4}
                placeholder="Tell potential tenants about your property..."
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium text-gray-800 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400  tracking-widest ml-1">Amenities</label>
              <div className="flex flex-wrap gap-3">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                      formData.amenities.includes(amenity)
                        ? "bg-primary text-white border-primary"
                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
            <label className="text-xs font-black text-gray-400  tracking-widest block mb-6 ml-1">Property Photos</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label className="relative aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer">
                <Plus size={24} className="text-gray-400 mb-1" />
                <span className="text-[10px] font-black text-gray-400 ">Add Photo</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full primaryBg text-white font-black py-6 rounded-3xl shadow-2xl shadow-primary/40 hover:bg-opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center text-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-3" size={28} />
                {loadingStatus || "Processing..."}
              </>
            ) : (
              <>
                <Save className="mr-3" size={28} />
                List Property Now
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PropertyForm;
