'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyValidationSchema, PropertyFormData } from '@/lib/validations/property';
import { auth, firestore, storage } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  ChevronRight, 
  ChevronLeft, 
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
  Maximize2
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

export default function PropertyForm() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSending] = useState(false);
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
    const fetchData = async () => {
      try {
        const projSnap = await getDocs(query(collection(firestore, 'projects'), orderBy('name', 'asc')));
        setProjects(projSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const catSnap = await getDocs(collection(firestore, 'categories'));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      // 1. Create/Get Project
      let finalProjectId = data.projectId;
      if (data.projectType === 'new') {
        const projRef = await addDoc(collection(firestore, 'projects'), {
          name: data.newProjectName,
          builder: data.builderName,
          totalUnits: data.projectDetails.totalUnits,
          buildYear: data.projectDetails.buildYear,
          amenities: Object.keys(data.projectDetails).filter(k => (data.projectDetails as any)[k] === true),
          created_at: serverTimestamp()
        });
        finalProjectId = projRef.id;
      }

      // 2. Add Property
      const isAdmin = pathname.includes('/admin/');
      await addDoc(collection(firestore, 'properties'), {
        ...data,
        projectId: finalProjectId,
        ownerId: user.uid,
        ownerName: data.ownerName || user.displayName || 'Owner',
        ownerMobile: data.ownerMobile || '',
        status: isAdmin ? 'approved' : 'pending', // Auto-approve if added by admin
        views: 0,
        price: Number(data.budget), // Unified price field
        address: `${data.location.doorNo}, ${data.location.street}, ${data.location.area}, ${data.location.city}`, // Unified address string
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      toast.success("Property listed successfully! Awaiting admin approval.");
      
      if (pathname.includes('/admin/')) {
        router.push(`/${locale}/admin/properties`);
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
    <div className="max-w-6xl mx-auto pb-24">
      {/* Stepper */}
      <div className="mb-12 flex items-center justify-between px-4">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center relative flex-1">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10",
              currentStep === step.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" :
              currentStep > step.id ? "bg-green-500 text-white shadow-lg shadow-green-200" :
              "bg-gray-100 text-gray-400"
            )}>
              {currentStep > step.id ? <Check size={20} strokeWidth={3} /> : step.icon}
            </div>
            <span className={cn(
              "mt-3 text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
              currentStep === step.id ? "text-primary" : "text-gray-400"
            )}>
              {step.title}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "absolute h-0.5 top-6 left-1/2 w-full -z-0 transition-all duration-1000",
                currentStep > step.id ? "bg-green-500" : "bg-gray-100"
              )} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Basic Details</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project & Pricing Information</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Status</label>
                   <div className="flex gap-4">
                      {['existing', 'new'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue('projectType', type as any)}
                          className={cn(
                            "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            watchProjectType === type ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                          )}
                        >
                          {type === 'existing' ? 'Select Project' : 'New Project'}
                        </button>
                      ))}
                   </div>
                </div>

                {watchProjectType === 'existing' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Project</label>
                    <select 
                      {...register('projectId')}
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-gray-800"
                    >
                      <option value="">Choose Project</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Name</label>
                      <input 
                        {...register('newProjectName')}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                        placeholder="Enter project name"
                      />
                      {errors.newProjectName && <p className="text-[10px] text-red-500 font-bold">{errors.newProjectName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Builder Name</label>
                      <input 
                        {...register('builderName')}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                        placeholder="Enter builder name"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Title</label>
                  <input 
                    {...register('title')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                    placeholder="e.g. Luxury 3BHK Apartment in OMR"
                  />
                  {errors.title && <p className="text-[10px] text-red-500 font-bold">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Budget / Rent (₹)</label>
                  <input 
                    type="number"
                    {...register('budget')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                    placeholder="50000"
                  />
                  {errors.budget && <p className="text-[10px] text-red-500 font-bold">{errors.budget.message}</p>}
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Category</label>
                   <select 
                     {...register('category')}
                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                   >
                     <option value="">Select Category</option>
                     {categories.map(c => <option key={c.id} value={c.id}>{c.category || c.name || 'Untitled Category'}</option>)}
                   </select>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Type</label>
                   <select 
                     {...register('propertyType')}
                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                   >
                     <option value="Apartment">Apartment</option>
                     <option value="Villa">Villa</option>
                     <option value="Penthouse">Penthouse</option>
                     <option value="Studio">Studio</option>
                     <option value="Office Space">Office Space</option>
                     <option value="Shop">Shop</option>
                     <option value="Warehouse">Warehouse</option>
                   </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Name</label>
                  <input 
                    {...register('ownerName')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                    placeholder="Enter owner name"
                  />
                  {errors.ownerName && <p className="text-[10px] text-red-500 font-bold">{errors.ownerName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Owner Contact</label>
                  <input 
                    {...register('ownerMobile')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                    placeholder="10 digit mobile number"
                  />
                  {errors.ownerMobile && <p className="text-[10px] text-red-500 font-bold">{errors.ownerMobile.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Rooms (Bedrooms)</label>
                  <input 
                    type="number"
                    {...register('totalBedrooms')}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
                    placeholder="e.g. 3"
                  />
                </div>

                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Type</label>
                   <div className="flex gap-4">
                      {['rent', 'lease'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setValue('type', type as any)}
                          className={cn(
                            "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            watchType === type ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Step 2: Bedroom Config */}
        {currentStep === 2 && (
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Home size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Configuration</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bedrooms & Bathrooms Detail</p>
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
                  className="px-6 py-3 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all"
                >
                  <Plus size={14} /> Add Room
                </button>
             </div>

             {/* Global Property Config */}
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                {[
                  { label: 'Total Floors', name: 'floors' },
                  { label: 'Total Bedrooms', name: 'totalBedrooms' },
                  { label: 'Bedroom (Attached Bath)', name: 'bedroomsWithAttachedBath' },
                  { label: 'Bedroom (Common Bath)', name: 'bedroomsWithoutAttachedBath' },
                  { label: 'Kitchens', name: 'kitchens' },
                  { label: 'Halls', name: 'halls' },
                  { label: 'Common Bathrooms', name: 'commonBathrooms' },
                  { label: 'Pooja Rooms', name: 'poojaRooms' },
                  { label: 'Drawing Rooms', name: 'drawingRooms' },
                ].map((item) => (
                  <div key={item.name} className="space-y-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">{item.label}</label>
                    <input 
                      type="number"
                      {...register(item.name as any)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold"
                      min={0}
                    />
                  </div>
                ))}
             </div>

             <div className="space-y-8">
                {bedroomFields.map((field, index) => (
                  <div key={field.id} className="p-8 rounded-[2.5rem] border-2 border-gray-50 bg-gray-50/30 relative group">
                     <button
                       type="button"
                       onClick={() => removeBedroom(index)}
                       className="absolute -top-3 -right-3 w-10 h-10 bg-white border border-gray-100 text-red-500 rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                     >
                       <Trash2 size={18} />
                     </button>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Type</label>
                           <select 
                             {...register(`bedrooms.${index}.type` as const)}
                             className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold"
                           >
                             {[
                               "Master Bedroom", "Children’s Bedroom", "Guest Bedroom", 
                               "Secondary Bedroom", "Study / Home Office", "Servant Room", "Common Bedroom"
                             ].map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Size (e.g. 12x14 ft)</label>
                           <input 
                             {...register(`bedrooms.${index}.size` as const)}
                             className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold"
                             placeholder="Size"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Flooring</label>
                           <input 
                             {...register(`bedrooms.${index}.flooring` as const)}
                             className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold"
                           />
                        </div>
                     </div>

                     <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100">
                        <input 
                          type="checkbox" 
                          {...register(`bedrooms.${index}.hasBathroom` as const)}
                          id={`bath-${index}`}
                          className="w-5 h-5 rounded-lg accent-primary"
                        />
                        <label htmlFor={`bath-${index}`} className="text-sm font-black text-gray-700 uppercase tracking-widest">Attached Bathroom</label>
                        
                        {watch(`bedrooms.${index}.hasBathroom`) && (
                          <div className="flex-1 flex gap-4 ml-8 animate-in fade-in slide-in-from-left-4 duration-300">
                             <select 
                               {...register(`bedrooms.${index}.bathroom.type` as const)}
                               className="px-4 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-[10px] font-black uppercase"
                             >
                               <option value="western">Western</option>
                               <option value="indian">Indian</option>
                             </select>
                          </div>
                        )}
                     </div>
                  </div>
                ))}

                {/* Custom Parameters */}
                <div className="mt-12 p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Custom Parameters</h4>
                    <button
                      type="button"
                      onClick={() => appendCustomParam({ label: '', value: '' })}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary/20 transition-all"
                    >
                      <Plus size={14} /> Add Parameter
                    </button>
                  </div>
                  <div className="space-y-4">
                    {customParamFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                        <input 
                          {...register(`customParameters.${index}.label` as const)}
                          placeholder="Label (e.g. Garden Size)"
                          className="flex-1 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary outline-none transition-all font-bold text-xs"
                        />
                        <input 
                          {...register(`customParameters.${index}.value` as const)}
                          placeholder="Value (e.g. 500 sqft)"
                          className="flex-1 px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-primary outline-none transition-all font-bold text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeCustomParam(index)}
                          className="p-3 text-red-400 hover:text-red-600 transition-colors"
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
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Location</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Address & Map</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Door / Flat No</label>
                   <input {...register('location.doorNo')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Block / Tower</label>
                   <input {...register('location.block')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Street / Landmark</label>
                   <input {...register('location.street')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Area</label>
                   <input {...register('location.area')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                   <input {...register('location.city')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                   <input {...register('location.pincode')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                   <input {...register('location.state')} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold" />
                </div>
             </div>

             <div className="aspect-video bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-4">
                <MapPin size={48} className="opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest">Interactive Map Integration</p>
                <button type="button" className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-100 transition-all">Set Exact Location</button>
             </div>
          </div>
        )}

        {/* Step 4: Media */}
        {currentStep === 4 && (
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Media & Content</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Images & Detailed Description</p>
                </div>
             </div>

             <div className="space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Property Description (Min 50 chars)</label>
                   <textarea 
                     {...register('description')}
                     rows={6}
                     className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-primary outline-none transition-all font-bold text-gray-800 resize-none"
                     placeholder="Tell us about the property, nearby facilities, and uniqueness..."
                   />
                   {errors.description && <p className="text-[10px] text-red-500 font-bold">{errors.description.message}</p>}
                </div>

                <div className="space-y-6">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                     <span>Property Images (Min 4)</span>
                     <span className="text-primary">{watchImages?.length || 0} uploaded</span>
                   </label>
                   
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {previews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group shadow-sm">
                           <img src={url} alt="" className="object-cover w-full h-full" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                             <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-[8px] font-black uppercase rounded-md shadow-lg">Cover</div>
                           )}
                        </div>
                      ))}
                      
                      <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group">
                         <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                         {uploadingFiles ? (
                           <Loader2 size={24} className="animate-spin text-primary" />
                         ) : (
                           <>
                             <Upload size={24} className="text-gray-300 group-hover:text-primary transition-colors" />
                             <span className="mt-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">Upload</span>
                           </>
                         )}
                      </label>
                   </div>
                   {errors.images && <p className="text-[10px] text-red-500 font-bold">{errors.images.message}</p>}
                </div>
             </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {currentStep === 5 && (
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Final Preview</h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Review your submission</p>
                </div>
             </div>

             <div className="space-y-12">
                {/* Preview Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl">
                         <img src={watch('coverImage') || previews[0]} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                         {previews.slice(0, 4).map((url, i) => (
                           <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-md">
                              <img src={url} alt="" className="object-cover w-full h-full" />
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div>
                         <h3 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{watch('title')}</h3>
                         <p className="text-lg font-black text-primary mt-2">₹{watch('budget')?.toLocaleString()}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                            <p className="text-xs font-black text-gray-900 truncate">{watch('location.area')}, {watch('location.city')}</p>
                         </div>
                         <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Rooms</p>
                            <p className="text-xs font-black text-gray-900">{bedroomFields.length} Bedrooms</p>
                         </div>
                      </div>

                      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Description</p>
                         <p className="text-xs font-medium text-gray-600 leading-relaxed line-clamp-4">{watch('description')}</p>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-gray-400/20">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                         <AlertCircle className="text-yellow-400" size={24} />
                      </div>
                      <div>
                         <p className="text-sm font-black tracking-tight">Ready to publish?</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin review takes 24-48 hours</p>
                      </div>
                   </div>
                   <button
                     type="submit"
                     disabled={isSubmitting}
                     className="w-full md:w-auto px-12 py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3"
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
