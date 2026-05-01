'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, usePathname } from 'next/navigation';
import { auth, firestore, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  X,
  Loader2,
  Building2,
  MapPin,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from './DashboardLayout';
import { propertySchema, PropertyFormData } from '@/lib/validations/property';
import { toast } from 'sonner';
import { checkListingLimit } from '@/lib/auth-guards';
import { cn } from '@/lib/utils';

export default function PropertyForm({ role }: { role: 'owner' | 'agent' }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      projectType: 'existing',
      type: 'rent',
      possessionType: '1m',
      furnishing: 'unfurnished',
      amenities: [],
      totalBedrooms: 1,
      bedroomsWithAttachedBath: 0,
      bedroomsWithoutAttachedBath: 1,
      kitchens: 1,
      halls: 1,
      commonBathrooms: 1,
      poojaRooms: 0,
      drawingRooms: 0,
      size_sqft: 0,
      bedrooms: [{ type: 'Master Bedroom', size: '', flooring: '', wallFinish: '', amenities: [], hasBathroom: false }],
      projectDetails: {
        park: false,
        playArea: false,
        communityHall: false,
        gym: false,
        security: false,
        lift: false,
        powerBackup: false,
        waterSupply: false
      },
      images: [],
      coverImage: ''
    }
  });

  const { fields: bedroomFields, append: appendBedroom, remove: removeBedroom } = useFieldArray({
    control,
    name: 'bedrooms'
  });

  const watchProjectType = watch('projectType');
  const watchAmenities = watch('amenities');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catSnap = await getDocs(collection(firestore, "categories"));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
    if (coverImageIndex === index) setCoverImageIndex(0);
    else if (coverImageIndex > index) setCoverImageIndex(coverImageIndex - 1);
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');
  };

  const onSubmit = async (data: PropertyFormData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to list a property");
      return;
    }

    // Check Listing Limit
    const limitCheck = await checkListingLimit(user.uid);
    if (!limitCheck.allowed) {
      toast.error(limitCheck.message);
      return;
    }

    if (images.length < 4) {
      toast.error("Minimum 4 images are mandatory");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Images
      const imageUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}_${i}`);
        const uploadTask = await uploadBytesResumable(storageRef, img);
        const url = await getDownloadURL(uploadTask.ref);
        imageUrls.push(url);
      }

      // 2. Save to Firestore
      const propertyData = {
        ...data,
        ownerId: user.uid,
        published_by: role,
        images: imageUrls,
        coverImage: imageUrls[coverImageIndex],
        image: imageUrls[coverImageIndex], // for backward compatibility
        slug: generateSlug(data.title) + '-' + Math.random().toString(36).substring(7),
        status: 'pending', // Admins must approve
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(firestore, "properties"), propertyData);
      
      toast.success("Property submitted for review!");
      router.push(`/${locale}/${role}/dashboard`);
    } catch (error: any) {
      console.error("Error adding property:", error);
      toast.error("Failed to list property: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const AMENITIES_LIST = [
    "Swimming Pool", "Gym", "Parking", "Security", "Garden", 
    "Air Conditioning", "WiFi", "Balcony", "Pet Friendly", "Furnished"
  ];

  return (
    <DashboardLayout userRole={role}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">List Your Property</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Complete all mandatory fields for faster approval</p>
          </div>
          <Link 
            href={`/${locale}/${role}/dashboard`}
            className="flex items-center text-gray-400 hover:text-primary font-bold transition-colors uppercase text-xs tracking-widest"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Type</label>
                <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                      watchProjectType === 'existing' ? "bg-white text-primary shadow-lg shadow-primary/10" : "text-gray-400"
                    )}
                    onClick={() => setValue('projectType', 'existing')}
                  >
                    Existing Project
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                      watchProjectType === 'new' ? "bg-white text-primary shadow-lg shadow-primary/10" : "text-gray-400"
                    )}
                    onClick={() => setValue('projectType', 'new')}
                  >
                    New Project
                  </button>
                </div>
              </div>

              {watchProjectType === 'new' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Project Name</label>
                  <input 
                    {...register('newProjectName')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                    placeholder="Enter project name"
                  />
                  {errors.newProjectName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.newProjectName.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Title</label>
                <input 
                  {...register('title')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                  placeholder="e.g. Luxury 3BHK Apartment in Kokapet"
                />
                {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    {...register('category')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm appearance-none"
                  >
                    <option value="">Select</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Type</label>
                  <select 
                    {...register('type')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm appearance-none"
                  >
                    <option value="rent">For Rent</option>
                    <option value="lease">For Lease</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Monthly Rent / Budget (₹)</label>
                <input 
                  type="number"
                  {...register('budget', { valueAsNumber: true })}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                />
                {errors.budget && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.budget.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Name</label>
                  <input 
                    {...register('ownerName')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                  />
                  {errors.ownerName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.ownerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Mobile</label>
                  <input 
                    {...register('ownerMobile')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                    placeholder="10 digits"
                  />
                  {errors.ownerMobile && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.ownerMobile.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Property Configuration */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Building2 size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Property Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Furnishing</label>
                <select 
                  {...register('furnishing')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm appearance-none"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-Furnished</option>
                  <option value="furnished">Fully Furnished</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Floors</label>
                <input 
                  type="number"
                  {...register('floors', { valueAsNumber: true })}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Area (Sq Ft)</label>
                <input 
                  type="number"
                  {...register('size_sqft', { valueAsNumber: true })}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>

            {/* Bedrooms Configuration */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bedroom Configurations</h4>
                <button 
                  type="button"
                  onClick={() => appendBedroom({ type: 'Common Bedroom', size: '', flooring: '', wallFinish: '', amenities: [], hasBathroom: false })}
                  className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                >
                  <Plus size={14} /> Add Bedroom
                </button>
              </div>

              <div className="space-y-4">
                {bedroomFields.map((field, index) => (
                  <div key={field.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 relative group">
                    <button 
                      type="button"
                      onClick={() => removeBedroom(index)}
                      className="absolute top-6 right-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Type</label>
                        <select 
                          {...register(`bedrooms.${index}.type` as const)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-xs"
                        >
                          <option value="Master Bedroom">Master</option>
                          <option value="Children’s Bedroom">Children's</option>
                          <option value="Guest Bedroom">Guest</option>
                          <option value="Common Bedroom">Common</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Size</label>
                        <input 
                          {...register(`bedrooms.${index}.size` as const)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-xs"
                          placeholder="12x14 ft"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Flooring</label>
                        <input 
                          {...register(`bedrooms.${index}.flooring` as const)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-xs"
                          placeholder="Marble / Tiles"
                        />
                      </div>
                      <div className="flex items-center pt-6 gap-2">
                        <input 
                          type="checkbox"
                          {...register(`bedrooms.${index}.hasBathroom` as const)}
                          className="w-5 h-5 rounded-lg border-gray-200 text-primary focus:ring-primary transition-all"
                        />
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Attached Bath</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Location Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Door / Flat No</label>
                  <input 
                    {...register('location.doorNo')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street</label>
                  <input 
                    {...register('location.street')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Area / Locality</label>
                <input 
                  {...register('location.area')}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input 
                    {...register('location.city')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                  <input 
                    {...register('location.pincode')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-sm"
                    placeholder="6 digits"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Media & Photos */}
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase">Media & Gallery</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previews.map((preview, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer border-4 transition-all",
                      coverImageIndex === index ? "border-primary shadow-xl" : "border-transparent"
                    )}
                    onClick={() => setCoverImageIndex(index)}
                  >
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-[8px] font-black text-white uppercase tracking-widest">Set as Cover</p>
                    </div>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={14} />
                    </button>
                    {coverImageIndex === index && (
                      <div className="absolute top-3 left-3 bg-primary text-white p-1.5 rounded-lg shadow-lg">
                        <CheckCircle2 size={12} />
                      </div>
                    )}
                  </div>
                ))}
                <label className="aspect-square rounded-[2rem] border-4 border-dashed border-gray-100 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                    <Plus size={24} />
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-3">Add Photos</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                Minimum 4 images required. First image or selected image will be used as cover.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
             <div className="space-y-2 mb-6">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Description</label>
                <textarea 
                  {...register('description')}
                  rows={6}
                  className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-50 rounded-[2rem] focus:border-primary focus:bg-white outline-none transition-all font-medium text-sm resize-none leading-relaxed"
                  placeholder="Describe your property in detail... features, neighborhood, etc."
                />
                {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.description.message}</p>}
             </div>
             
             <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 group transition-all">
                   <ShieldCheck className="text-primary shrink-0" size={32} />
                   <div>
                      <h4 className="text-sm font-black text-gray-900 uppercase">Verification Guarantee</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed mt-1">
                        By submitting, you agree that the information provided is accurate. Our team will verify the listing before it goes live globally.
                      </p>
                   </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full py-6 md:py-8 bg-primary text-white rounded-[2.5rem] font-black text-base md:text-xl uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={28} />
                      <span className="animate-pulse">Processing Submission...</span>
                    </>
                  ) : (
                    <>
                      <Save size={28} />
                      Submit Property for Review
                    </>
                  )}
                </button>
             </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


