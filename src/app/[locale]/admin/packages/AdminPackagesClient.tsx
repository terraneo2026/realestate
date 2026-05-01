'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { Plus, Trash2, Edit2, Zap, Loader2, X, Check } from 'lucide-react';
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { packageSchema, PackageFormData } from '@/lib/validations/package';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPackagesClient() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      price: 0,
      duration: 30,
      listingLimit: 10,
      features: []
    }
  });

  const features = watch('features');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'packages'), (snap) => {
      setPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (data: PackageFormData) => {
    try {
      if (editingPackage) {
        await updateDoc(doc(firestore, 'packages', editingPackage.id), {
          ...data,
          updatedAt: serverTimestamp()
        });
        toast.success("Package updated successfully");
      } else {
        await addDoc(collection(firestore, 'packages'), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        toast.success("Package created successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const openModal = (pkg?: any) => {
    if (pkg) {
      setEditingPackage(pkg);
      reset({
        name: pkg.name,
        price: pkg.price,
        duration: pkg.duration,
        listingLimit: pkg.listingLimit,
        features: pkg.features || []
      });
    } else {
      setEditingPackage(null);
      reset({
        name: '',
        price: 0,
        duration: 30,
        listingLimit: 10,
        features: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
    setFeatureInput('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package? This may affect existing subscriptions.")) return;
    try {
      await deleteDoc(doc(firestore, 'packages', id));
      toast.success("Package deleted successfully");
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setValue('features', [...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setValue('features', features.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Agent Packages</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage subscription tiers and listing limits</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="w-full sm:w-auto px-6 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Create Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-primary mb-4" size={40} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
              <Zap className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">No packages created yet</p>
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col justify-between group hover:border-primary/20 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                      <Zap size={24} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openModal(pkg)} className="p-2 bg-gray-50 text-gray-400 hover:text-primary rounded-xl transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(pkg.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase mb-2">{pkg.name}</h3>
                  <p className="text-4xl font-black text-primary mb-6">₹{pkg.price}<span className="text-sm font-bold text-gray-400 ml-1">/ {pkg.duration} days</span></p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                      <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      {pkg.listingLimit} Property Listings
                    </div>
                    {pkg.features?.map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                        <div className="w-5 h-5 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={4} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative my-8">
            <button onClick={closeModal} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black text-gray-900 uppercase mb-8">{editingPackage ? 'Edit Package' : 'New Package'}</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Package Name</label>
                <input 
                  {...register('name')}
                  className={cn(
                    "w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold",
                    errors.name && "border-red-500 focus:border-red-500"
                  )}
                  placeholder="e.g. Premium Monthly"
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input 
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    className={cn(
                      "w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold",
                      errors.price && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.price && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Duration (Days)</label>
                  <input 
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    className={cn(
                      "w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold",
                      errors.duration && "border-red-500 focus:border-red-500"
                    )}
                  />
                  {errors.duration && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.duration.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Listing Limit</label>
                <input 
                  type="number"
                  {...register('listingLimit', { valueAsNumber: true })}
                  className={cn(
                    "w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold",
                    errors.listingLimit && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.listingLimit && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.listingLimit.message}</p>}
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Features</label>
                <div className="flex gap-2">
                  <input 
                    className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none transition-all font-bold"
                    placeholder="Add a feature..."
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={addFeature}
                    className="p-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl border border-gray-100 text-[10px] font-bold uppercase tracking-widest group">
                      {feature}
                      <button 
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : editingPackage ? 'Update Package' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
