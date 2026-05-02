'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyValidationSchema, PropertyFormData } from '@/lib/validations/property';
import { auth, firestore, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc, updateDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  Plus, 
  Trash2, 
  Upload, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  Home,
  Building2,
  Info,
  Image as ImageIcon,
  Check,
  Maximize2,
  ShieldCheck
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STEPS = [
  { id: 1, title: 'Basic Info', icon: <Info size={18} /> },
  { id: 2, title: 'Config', icon: <Home size={18} /> },
  { id: 3, title: 'Location', icon: <MapPin size={18} /> },
  { id: 4, title: 'Media', icon: <ImageIcon size={18} /> },
  { id: 5, title: 'Preview', icon: <CheckCircle2 size={18} /> },
];

import { checkListingLimit } from '@/lib/auth-guards';

export default function PropertyForm({ propertyId }: { propertyId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSending] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(!!propertyId);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyValidationSchema) as any,
    defaultValues: {
      projectType: 'existing',
      type: 'rent',
      propertyType: 'Apartment',
      category: '',
      ownerName: '',
      ownerMobile: '',
      title: '',
      budget: 0,
      possessionType: '1m',
      furnishing: 'unfurnished',
      bedrooms: [{
        type: 'Master Bedroom',
        size: '',
        flooring: 'Vitrified Tiles',
        wallFinish: 'Emulsion Paint',
        amenities: [],
        hasBathroom: true,
        bathroom: {
          type: 'western',
          features: []
        }
      }],
      location: {
        doorNo: '',
        street: '',
        area: '',
        city: '',
        pincode: '',
        state: ''
      },
      projectDetails: {
        park: false,
        playArea: false,
        communityHall: false,
        gym: false,
        security: true,
        lift: true,
        powerBackup: true,
        waterSupply: true
      },
      floors: 1,
      totalBedrooms: 0,
      bedroomsWithAttachedBath: 0,
      bedroomsWithoutAttachedBath: 0,
      kitchens: 1,
      halls: 1,
      commonBathrooms: 0,
      poojaRooms: 0,
      drawingRooms: 0,
      customParameters: [],
      images: [],
      amenities: [],
      description: '',
      coverImage: ''
    },
    mode: 'onChange'
  });

  const { fields: bedroomFields, append: appendBedroom, remove: removeBedroom } = useFieldArray({
    control,
    name: "bedrooms"
  });

  const { fields: customParamFields, append: appendCustomParam, remove: removeCustomParam } = useFieldArray({
    control,
    name: "customParameters"
  });

  const watchProjectType = watch('projectType');
  const watchType = watch('type');
  const watchImages = watch('images');

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) return;
      try {
        const docSnap = await getDoc(doc(firestore, 'properties', propertyId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPropertyData(data);
          // Reset form with existing data
          Object.keys(data).forEach((key) => {
            setValue(key as any, data[key]);
          });
          if (data.images) setPreviews(data.images);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast.error("Failed to load property data");
      } finally {
        setLoadingProperty(false);
      }
    };
    fetchProperty();
  }, [propertyId, setValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projSnap = await getDocs(query(collection(firestore, 'projects'), orderBy('name', 'asc')));
        setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const catSnap = await getDocs(collection(firestore, 'categories'));
        const cats = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (cats.length > 0) {
          setCategories(cats);
        } else {
          // Fallback categories for better UX if none exist in DB
          setCategories([
            { id: 'residential', name: 'Residential' },
            { id: 'commercial', name: 'Commercial' },
            { id: 'villa', name: 'Villa' },
            { id: 'apartment', name: 'Apartment' }
          ]);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchData();
  }, []);

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['title', 'budget', 'category', 'propertyType', 'ownerName', 'ownerMobile', 'type', 'projectType'];
      if (watchProjectType === 'new') fieldsToValidate.push('newProjectName', 'builderName');
    } else if (currentStep === 2) {
      fieldsToValidate = ['bedrooms'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['location', 'projectDetails'];
    } else if (currentStep === 4) {
      fieldsToValidate = ['description', 'images', 'coverImage'];
    }

    const result = await trigger(fieldsToValidate as any);
    if (result) setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    else toast.error("Please fix the errors before proceeding");
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(true);
    const newImages: string[] = [];
    const newPreviews: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newImages.push(url);
        newPreviews.push(url);
      }

      const currentImages = watch('images') || [];
      setValue('images', [...currentImages, ...newImages]);
      setPreviews(prev => [...prev, ...newPreviews]);
      
      if (!watch('coverImage') && newImages.length > 0) {
        setValue('coverImage', newImages[0]);
      }
      
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingFiles(false);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to list property");
      return;
    }

    setIsSending(true);
    try {
      // 1. Uniqueness Checks for Reference IDs
      if (data.propertyReferenceId) {
        const q = query(collection(firestore, 'properties'), where('propertyReferenceId', '==', data.propertyReferenceId));
        const snap = await getDocs(q);
        if (!snap.empty && (!propertyId || snap.docs[0].id !== propertyId)) {
          toast.error("This Property ID is already in use. Please use a unique ID.");
          setIsSending(false);
          return;
        }
      }

      if (data.projectType === 'new' && data.projectReferenceId) {
        const q = query(collection(firestore, 'projects'), where('projectReferenceId', '==', data.projectReferenceId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          toast.error("This Project ID is already in use. Please use a unique ID.");
          setIsSending(false);
          return;
        }
      }

      // Senior Architect: Enforce Listing Limits
      const limitCheck = await checkListingLimit(user.uid);
      if (!limitCheck.allowed) {
        toast.error(limitCheck.message);
        setIsSending(false);
        return;
      }

      // 1. Create/Get Project
      let finalProjectId = data.projectId;
      if (data.projectType === 'new') {
        const projRef = await addDoc(collection(firestore, 'projects'), {
          name: data.newProjectName,
          builder: data.builderName,
          projectReferenceId: data.projectReferenceId || '',
          totalUnits: data.projectDetails.totalUnits,
          buildYear: data.projectDetails.buildYear,
          amenities: Object.keys(data.projectDetails).filter(k => (data.projectDetails as any)[k] === true),
          created_at: serverTimestamp()
        });
        finalProjectId = projRef.id;
      }

      // 2. Add / Update Property
      const isAdmin = pathname?.includes('/admin/');
      const propertyPayload = {
        ...data,
        projectId: finalProjectId,
        ownerId: user.uid,
        ownerName: data.ownerName || user.displayName || 'Owner',
        ownerMobile: data.ownerMobile || '',
        status: isAdmin ? 'approved' : (propertyId ? (propertyData?.status || 'pending') : 'pending'),
        views: propertyId ? (propertyData?.views || 0) : 0,
        price: Number(data.budget),
        address: `${data.location.doorNo}, ${data.location.street}, ${data.location.area}, ${data.location.city}`,
        updatedAt: serverTimestamp()
      };

      if (propertyId) {
        await updateDoc(doc(firestore, 'properties', propertyId), propertyPayload);
        toast.success("Property updated successfully!");
      } else {
        await addDoc(collection(firestore, 'properties'), {
          ...propertyPayload,
          createdAt: serverTimestamp()
        });
        toast.success("Property listed successfully! Awaiting admin approval.");
      }
      
      if (pathname?.includes('/admin/')) {
        router.push(`/${locale}/admin/properties`);
      } else if (pathname?.includes('/agent/')) {
        router.push(`/${locale}/agent/listings`);
      } else {
        router.push(`/${locale}/owner/properties`);
      }
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-32">
      {/* Stepper */}
      <div className="mb-8 md:mb-12 flex items-center justify-between px-2 md:px-4">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center relative flex-1">
            <div className={cn(
              "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
              currentStep === step.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" :
              currentStep > step.id ? "bg-green-500 text-white shadow-lg shadow-green-200" :
              "bg-gray-100 text-gray-400"
            )}>
              {currentStep > step.id ? <Check size={18} strokeWidth={3} /> : step.icon}
            </div>
            <span className={cn(
              "mt-2 md:mt-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors duration-500 text-center px-1",
              currentStep === step.id ? "text-primary" : "text-gray-400",
              "hidden sm:block" // Hide labels on extra small screens
            )}>
              {step.title}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "absolute h-0.5 top-5 md:top-6 left-1/2 w-full -z-0 transition-all duration-1000",
                currentStep > step.id ? "bg-green-500" : "bg-gray-100"
              )} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 px-4 md:px-0">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Basic Details</h2>
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Project & Pricing</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3 md:space-y-4">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Status</label>
                   <div className="flex gap-3 md:gap-4">
                      {['existing', 'new'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue('projectType', type as any)}
                          className={cn(
                            "flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all",
                            watchProjectType === type ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                          )}
                        >
                          {type === 'existing' ? 'Existing' : 'New'}
                        </button>
                      ))}
                   </div>
                </div>

                {watchProjectType === 'existing' ? (
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Project</label>
                    <div className="relative group">
                      <select 
                        {...register('projectId')}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800 text-xs md:text-base appearance-none pr-10 md:pr-12"
                      >
                        <option value="">Choose Project</option>
                        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary" size={20} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Name</label>
                      <input 
                        {...register('newProjectName')}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                        placeholder="Enter project name"
                      />
                      {errors.newProjectName && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.newProjectName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Builder Name</label>
                      <input 
                        {...register('builderName')}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                        placeholder="Enter builder name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project ID (Unique)</label>
                      <input 
                        {...register('projectReferenceId')}
                        className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                        placeholder="e.g. PRJ-1001"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property ID (Unique)</label>
                  <input 
                    {...register('propertyReferenceId')}
                    className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                    placeholder="e.g. PID-5001"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Title</label>
                  <input 
                    {...register('title')}
                    className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                    placeholder="e.g. Luxury 3BHK Apartment"
                  />
                  {errors.title && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Budget / Rent (₹) {propertyData?.rentLocked && <span className="text-red-500 font-bold ml-2">(Locked)</span>}
                  </label>
                  <input 
                    type="number"
                    {...register('budget')}
                    disabled={propertyData?.rentLocked}
                    className={cn(
                      "w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base",
                      propertyData?.rentLocked && "opacity-50 cursor-not-allowed bg-gray-100"
                    )}
                    placeholder="50000"
                  />
                  {errors.budget && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.budget.message}</p>}
                  {propertyData?.rentLocked && (
                    <p className="text-[8px] font-bold text-amber-600 mt-1 uppercase tracking-tight">
                      Rent is locked because of active visit requests.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Category</label>
                   <div className="relative group">
                     <select 
                       {...register('category')}
                       className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base appearance-none pr-10 md:pr-12"
                     >
                       <option value="">Select Category</option>
                       {categories.map(c => <option key={c.id} value={c.id}>{c.category || c.name || 'Untitled Category'}</option>)}
                     </select>
                     <ChevronDown className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary" size={20} />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Type</label>
                   <div className="relative group">
                     <select 
                       {...register('propertyType')}
                       className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base appearance-none pr-10 md:pr-12"
                     >
                       <option value="Apartment">Apartment</option>
                       <option value="Villa">Villa</option>
                       <option value="Penthouse">Penthouse</option>
                       <option value="Studio">Studio</option>
                       <option value="Office Space">Office Space</option>
                       <option value="Shop">Shop</option>
                       <option value="Warehouse">Warehouse</option>
                     </select>
                     <ChevronDown className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary" size={20} />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Name</label>
                  <input 
                    {...register('ownerName')}
                    className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                    placeholder="Enter owner name"
                  />
                  {errors.ownerName && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.ownerName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Contact</label>
                  <input 
                    {...register('ownerMobile')}
                    className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                    placeholder="10 digit mobile number"
                  />
                  {errors.ownerMobile && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.ownerMobile.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Rooms (Bedrooms)</label>
                  <input 
                    type="number"
                    {...register('totalBedrooms')}
                    className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-xs md:text-base"
                    placeholder="e.g. 3"
                  />
                </div>

                <div className="space-y-3 md:space-y-4">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Type</label>
                   <div className="flex gap-3 md:gap-4">
                      {['rent', 'lease'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue('type', type as any)}
                          className={cn(
                            "flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest border transition-all",
                            watchType === type ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Property Fee Rules (Admin/Advanced Only) */}
                <div className="md:col-span-2 mt-8 p-6 md:p-8 bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                         <ShieldCheck className="text-primary" size={20} />
                      </div>
                      <div>
                         <h3 className="text-lg font-black tracking-tight uppercase">Property Fee Rules</h3>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Platform-level overrides</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                         <span className="text-[10px] font-black uppercase tracking-widest">Token Fee</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                         </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                         <span className="text-[10px] font-black uppercase tracking-widest">Commission</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                         </label>
                      </div>
                      <div className="flex flex-col gap-2">
                         <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Applies To</label>
                         <div className="relative group">
                            <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none font-bold text-[10px] uppercase appearance-none pr-10">
                               <option value="both" className="bg-gray-900">Both</option>
                               <option value="tenant" className="bg-gray-900">Tenant Only</option>
                               <option value="owner" className="bg-gray-900">Owner Only</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-primary" size={14} />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Step 2: Bedroom Config */}
        {currentStep === 2 && (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                    <Home size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Configuration</h2>
                    <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Rooms & Bathrooms</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => appendBedroom({
                    type: 'Guest Bedroom',
                    size: '',
                    flooring: 'Vitrified Tiles',
                    wallFinish: 'Emulsion Paint',
                    amenities: [],
                    hasBathroom: true,
                    bathroom: { type: 'western', features: [] }
                  })}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all"
                >
                  <Plus size={14} /> Add Room
                </button>
             </div>

             {/* Global Property Config */}
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mb-8 md:mb-12 p-4 md:p-8 bg-gray-50 rounded-2xl md:rounded-[2.5rem] border border-gray-100">
                {[
                  { label: 'Total Floors', name: 'floors' },
                  { label: 'Total Bedrooms', name: 'totalBedrooms' },
                  { label: 'Attached Bath', name: 'bedroomsWithAttachedBath' },
                  { label: 'Common Bath', name: 'bedroomsWithoutAttachedBath' },
                  { label: 'Kitchens', name: 'kitchens' },
                  { label: 'Halls', name: 'halls' },
                  { label: 'Common Bathrooms', name: 'commonBathrooms' },
                  { label: 'Pooja Rooms', name: 'poojaRooms' },
                  { label: 'Drawing Rooms', name: 'drawingRooms' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1.5 md:space-y-2">
                    <label className="text-[7px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 truncate block">{item.label}</label>
                    <input 
                      type="number"
                      {...register(item.name as any)}
                      className="w-full px-3 py-2 md:px-4 md:py-3 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs md:text-base"
                      min={0}
                    />
                  </div>
                ))}
             </div>

             <div className="space-y-6 md:space-y-8">
                {bedroomFields.map((field, index) => (
                  <div key={field.id} className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/30 relative group">
                     <button
                       type="button"
                       onClick={() => removeBedroom(index)}
                       className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-100 text-red-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                     >
                       <Trash2 size={18} />
                     </button>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="space-y-2">
                           <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Type</label>
                           <div className="relative group">
                             <select 
                               {...register(`bedrooms.${index}.type` as const)}
                               className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs md:text-sm appearance-none pr-10"
                             >
                               {[
                                 "Master Bedroom", "Children’s Bedroom", "Guest Bedroom", 
                                 "Secondary Bedroom", "Study / Home Office", "Servant Room", "Common Bedroom"
                               ].map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary" size={16} />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Size</label>
                           <input 
                             {...register(`bedrooms.${index}.size` as const)}
                             className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs md:text-sm"
                             placeholder="e.g. 12x14 ft"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Flooring</label>
                           <input 
                             {...register(`bedrooms.${index}.flooring` as const)}
                             className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-xs md:text-sm"
                           />
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-6 bg-white rounded-2xl md:rounded-3xl border border-gray-100">
                        <div className="flex items-center gap-3">
                           <input 
                             type="checkbox" 
                             {...register(`bedrooms.${index}.hasBathroom` as const)}
                             id={`bath-${index}`}
                             className="w-5 h-5 rounded-lg accent-primary"
                           />
                           <label htmlFor={`bath-${index}`} className="text-xs md:text-sm font-black text-gray-700 uppercase tracking-widest">Attached Bathroom</label>
                        </div>
                        
                        {watch(`bedrooms.${index}.hasBathroom`) && (
                          <div className="flex-1 flex gap-4 sm:ml-8 animate-in fade-in slide-in-from-left-4 duration-300">
                             <div className="relative group flex-1 sm:flex-initial">
                               <select 
                                 {...register(`bedrooms.${index}.bathroom.type` as const)}
                                 className="w-full sm:w-auto px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase appearance-none pr-8"
                               >
                                 <option value="western">Western</option>
                                 <option value="indian">Indian</option>
                               </select>
                               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary" size={14} />
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
                ))}

                {/* Custom Parameters */}
                <div className="mt-8 md:mt-12 p-6 md:p-8 bg-gray-50 rounded-2xl md:rounded-[2.5rem] border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h4 className="text-xs md:text-sm font-black text-gray-900 uppercase tracking-widest">Custom Parameters</h4>
                    <button
                      type="button"
                      onClick={() => appendCustomParam({ label: '', value: '' })}
                      className="w-full sm:w-auto px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[8px] md:text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 transition-all"
                    >
                      <Plus size={14} /> Add Parameter
                    </button>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    {customParamFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 md:gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                        <input 
                          {...register(`customParameters.${index}.label` as const)}
                          placeholder="Label (e.g. Garden Size)"
                          className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary outline-none transition-all font-bold text-[10px] md:text-xs"
                        />
                        <input 
                          {...register(`customParameters.${index}.value` as const)}
                          placeholder="Value (e.g. 500 sqft)"
                          className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary outline-none transition-all font-bold text-[10px] md:text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomParam(index)}
                          className="p-2 md:p-3 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Location</h2>
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Address</p>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                <div className="space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Door / Flat No</label>
                   <input {...register('location.doorNo')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Block / Tower</label>
                   <input {...register('location.block')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Street / Landmark</label>
                   <input {...register('location.street')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Area</label>
                   <input {...register('location.area')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                   <input {...register('location.city')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                   <input {...register('location.pincode')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
                <div className="space-y-2">
                   <label className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                   <input {...register('location.state')} className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl md:rounded-2xl focus:border-primary outline-none transition-all font-bold text-sm" />
                </div>
             </div>

             <div className="aspect-video bg-gray-50 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-4 p-4 text-center">
                <MapPin size={48} className="opacity-20" />
                <p className="text-[10px] md:text-xs font-black uppercase tracking-widest">Map Integration</p>
                <button type="button" className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-100 transition-all">Set Exact Location</button>
             </div>
          </div>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Media & Content</h2>
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Images & Description</p>
                </div>
             </div>

             <div className="space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Description (Min 50 chars)</label>
                   <textarea 
                     {...register('description')}
                     rows={6}
                     className="w-full px-5 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl md:rounded-3xl focus:border-primary outline-none transition-all font-bold text-gray-800 resize-none text-sm"
                     placeholder="Tell us about the property..."
                   />
                   {errors.description && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.description.message}</p>}
                </div>

                <div className="space-y-4 md:space-y-6">
                   <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                     <span>Property Images (Min 4)</span>
                     <span className="text-primary">{watchImages?.length || 0} uploaded</span>
                   </label>
                   
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                      {previews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 border-gray-100 group shadow-sm">
                           <img src={url} alt="" className="object-cover w-full h-full" />
                           <div className="absolute inset-0 bg-black/40 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button 
                                type="button"
                                onClick={() => {
                                  const newImgs = watchImages.filter((_, i) => i !== idx);
                                  const newPrevs = previews.filter((_, i) => i !== idx);
                                  setValue('images', newImgs);
                                  setPreviews(newPrevs);
                                }}
                                className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button 
                                type="button"
                                onClick={() => setValue('coverImage', url)}
                                className={cn(
                                  "p-2 rounded-lg transition-transform",
                                  watch('coverImage') === url ? "bg-green-500 text-white" : "bg-white text-gray-900 hover:scale-110"
                                )}
                              >
                                <Check size={14} />
                              </button>
                           </div>
                           {watch('coverImage') === url && (
                             <div className="absolute top-1 left-1 md:top-2 md:left-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-green-500 text-white text-[7px] md:text-[8px] font-black uppercase rounded-md shadow-lg">Cover</div>
                           )}
                        </div>
                      ))}
                      
                      <label className="aspect-square rounded-xl md:rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group">
                         <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                         {uploadingFiles ? (
                           <Loader2 size={24} className="animate-spin text-primary" />
                         ) : (
                           <>
                             <Upload size={24} className="text-gray-300 group-hover:text-primary transition-colors" />
                             <span className="mt-1 md:mt-2 text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest">Upload</span>
                           </>
                         )}
                      </label>
                   </div>
                   {errors.images && <p className="text-[9px] md:text-[10px] text-red-500 font-bold">{errors.images.message}</p>}
                </div>
             </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {currentStep === 5 && (
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/10 rounded-xl md:rounded-2xl flex items-center justify-center text-green-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Final Preview</h2>
                  <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Review your submission</p>
                </div>
             </div>

             <div className="space-y-8 md:space-y-12">
                {/* Preview Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                   <div className="space-y-6 md:space-y-8">
                      <div className="aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                         <img src={watch('coverImage') || previews[0]} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div className="grid grid-cols-4 gap-2 md:gap-3">
                         {previews.slice(0, 4).map((url, i) => (
                           <div key={i} className="aspect-square rounded-lg md:rounded-2xl overflow-hidden border-2 border-white shadow-md">
                              <img src={url} alt="" className="object-cover w-full h-full" />
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6 md:space-y-8">
                      <div>
                         <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">{watch('title')}</h3>
                         <p className="text-base md:text-lg font-black text-primary mt-1 md:mt-2">₹{watch('budget')?.toLocaleString()}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                         <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                            <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                            <p className="text-[10px] md:text-xs font-black text-gray-900 truncate">{watch('location.area')}, {watch('location.city')}</p>
                         </div>
                         <div className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                            <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rooms</p>
                            <p className="text-[10px] md:text-xs font-black text-gray-900">{bedroomFields.length} Bedrooms</p>
                         </div>
                      </div>

                      <div className="p-4 md:p-6 bg-primary/5 rounded-2xl md:rounded-3xl border border-primary/10">
                         <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-2">Description</p>
                         <p className="text-[10px] md:text-xs font-medium text-gray-600 leading-relaxed line-clamp-4">{watch('description')}</p>
                      </div>
                   </div>
                </div>

                <div className="p-6 md:p-8 bg-gray-900 rounded-2xl md:rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-400/20">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                         <AlertCircle className="text-yellow-400" size={24} />
                      </div>
                      <div>
                         <p className="text-xs md:text-sm font-black tracking-tight">Ready to publish?</p>
                         <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin review takes 24-48 hours</p>
                      </div>
                   </div>
                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-primary text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3"
                   >
                     {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publish Property'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40">
           <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all disabled:opacity-30 flex items-center gap-2"
              >
                <ChevronLeft size={16} /> Back
              </button>
              
              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : null}
           </div>
        </div>
      </form>
    </div>
  );
}
