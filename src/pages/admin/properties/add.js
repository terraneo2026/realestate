import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/admin/components/AdminLayout';
import { db, storage } from '@/admin/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  Plus, 
  X,
  Loader2,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

const AddProperty = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    propertyType: 'Apartment',
    ownerName: '',
    ownerMobile: '',
    price: '',
    address: '',
    propery_type: 0, // 0 for Sell, 1 for Rent (as per Laravel)
    possession: 'one-week',
    furnishing: 'none',
    facing: 'north',
    published_by_admin: false,
    amenities: [],
  });

  const AMENITIES_LIST = [
    'WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Security', 
    'Power Backup', 'Lift', 'Air Conditioning', 'CCTV', 
    'Garden', 'Club House', 'Playground'
  ];

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catSnap = await getDocs(collection(db, 'categories'));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    setLoading(true);
    setUploadProgress(0);

    try {
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        const image = await compressImage(images[i]);
        const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const overallProgress = ((i / images.length) * 100) + (progress / images.length);
              setUploadProgress(Math.round(overallProgress));
            }, 
            (error) => reject(error), 
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              imageUrls.push(url);
              resolve(url);
            }
          );
        });
      }

      await addDoc(collection(db, 'properties'), {
        ...formData,
        price: parseFloat(formData.price),
        budget: parseFloat(formData.price), // Support both price and budget fields
        image: imageUrls[0], // Main image
        images: imageUrls, // All images
        company_name: formData.published_by_admin ? 'Relocate' : '',
        status: 'approved', // Admin added properties are approved by default
        city: formData.address.split(',').pop()?.trim() || '', // Try to extract city from address
        category: categories.find(c => c.id === formData.category_id)?.category || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      router.push('/admin/properties');
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Error adding property: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href="/admin/properties" 
            className="flex items-center text-gray-500 hover:text-[#087C7C] font-bold group transition-colors"
          >
            <ArrowLeft size={22} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Properties
          </Link>
          <h2 className="text-3xl font-black text-gray-800">New Listing</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Property Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Villa in Downtown"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Category</label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer pr-12"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.category}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Property Type</label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer pr-12"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Studio">Studio</option>
                    <option value="Office Space">Office Space</option>
                    <option value="Shop">Shop</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Owner Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter owner name"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Owner Contact</label>
                <input
                  type="text"
                  required
                  placeholder="10 digit mobile number"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.ownerMobile}
                  onChange={(e) => setFormData({ ...formData, ownerMobile: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Rental Amount or Budget (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="25,00,000"
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Listing Type</label>
                <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs  tracking-widest transition-all ${formData.propery_type === 0 ? 'bg-white text-[#087C7C] shadow-sm' : 'text-gray-400'}`}
                    onClick={() => setFormData({ ...formData, propery_type: 0 })}
                  >
                    For Lease
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs  tracking-widest transition-all ${formData.propery_type === 1 ? 'bg-white text-[#087C7C] shadow-sm' : 'text-gray-400'}`}
                    onClick={() => setFormData({ ...formData, propery_type: 1 })}
                  >
                    For Rent
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Possession Period</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer pr-12"
                    value={formData.possession}
                    onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                  >
                    <option value="one-week">One Week</option>
                    <option value="one-month">One Month</option>
                    <option value="more-than-month">More than a Month</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Furnishing Status</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer pr-12"
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  >
                    <option value="none">Unfurnished</option>
                    <option value="semi">Semi Furnished</option>
                    <option value="full">Furnished</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Property Facing</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 appearance-none cursor-pointer pr-12"
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  >
                    <option value="north">North</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                    <option value="south">South</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Address</label>
              <input
                type="text"
                required
                placeholder="123 Luxury Ave, Beverly Hills, CA"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-6">
              <label className="text-sm font-black text-gray-400 tracking-widest ml-1 block">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-xs tracking-wider ${
                      formData.amenities.includes(amenity)
                        ? 'bg-[#087C7C]/5 border-[#087C7C] text-[#087C7C]'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      formData.amenities.includes(amenity) ? 'bg-[#087C7C] border-[#087C7C]' : 'bg-white border-gray-200'
                    }`}>
                      {formData.amenities.includes(amenity) && <Plus size={12} className="text-white rotate-45" />}
                    </div>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-6 bg-gray-50 rounded-2xl border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-all" onClick={() => setFormData({ ...formData, published_by_admin: !formData.published_by_admin })}>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.published_by_admin ? 'bg-[#087C7C] border-[#087C7C]' : 'bg-white border-gray-200'}`}>
                {formData.published_by_admin && <Plus size={16} className="text-white rotate-45" />}
              </div>
              <span className={`text-sm font-black  tracking-widest transition-all ${formData.published_by_admin ? 'text-[#087C7C]' : 'text-gray-400'}`}>Published by Admin</span>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-gray-400  tracking-widest ml-1">Description</label>
              <textarea
                required
                rows="5"
                placeholder="Describe this property..."
                className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-3xl focus:border-[#087C7C] focus:ring-4 focus:ring-[#087C7C]/10 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-300 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
            <label className="text-sm font-black text-gray-400  tracking-widest block mb-6 ml-1">Property Media (Upload 2 or more photos)</label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all aspect-square flex flex-col items-center justify-center text-center p-4 cursor-pointer">
                <Plus size={24} className="text-gray-400 group-hover:scale-110 transition-all" />
                <span className="text-xs font-bold text-gray-400  mt-2">Add Photo</span>
                <input 
                  type="file" 
                  multiple
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {loading && uploadProgress > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="bg-[#087C7C] h-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#087C7C] text-white font-black py-6 rounded-3xl shadow-2xl shadow-[#087C7C]/40 hover:bg-[#066666] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center text-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-3" size={28} />
            ) : (
              <>
                <Save className="mr-3" size={28} />
                Publish Property
              </>
            )}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProperty;
