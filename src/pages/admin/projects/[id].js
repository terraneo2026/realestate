import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/admin/components/AdminLayout';
import { db, storage } from '@/admin/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  Save, 
  ArrowLeft, 
  X,
  Loader2,
  Plus
} from 'lucide-react';
import Link from 'next/link';

const EditProject = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    units: '',
    description: '',
    image: '',
    images: [],
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
      amenities: prev.amenities ? (prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]) : [amenity]
    }));
  };
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const projectRef = doc(db, 'projects', id);
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const data = projectSnap.data();
        setFormData(data);
        setPreviews(data.images || [data.image]);
      } else {
        router.push('/admin/projects');
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const existingImagesCount = formData.images?.length || 0;
    if (index < existingImagesCount) {
      const updatedImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: updatedImages, image: updatedImages[0] || '' });
      setPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const newImgIndex = index - existingImagesCount;
      setNewImages(prev => prev.filter((_, i) => i !== newImgIndex));
      setPreviews(prev => prev.filter((_, i) => i !== index));
    }
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
    setSaving(true);
    setUploadProgress(0);

    try {
      const imageUrls = [...(formData.images || [])];
      
      for (let i = 0; i < newImages.length; i++) {
        const image = await compressImage(newImages[i]);
        const storageRef = ref(storage, `projects/${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const overallProgress = ((i / newImages.length) * 100) + (progress / newImages.length);
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

      const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, {
        ...formData,
        slug: slug,
        units: parseInt(formData.units),
        image: imageUrls[0] || '',
        images: imageUrls,
        updated_at: new Date().toISOString(),
      });

      router.push('/admin/projects');
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#087C7C]" size={48} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <Link 
            href="/admin/projects" 
            className="flex items-center text-gray-500 hover:text-[#087C7C] font-bold group transition-colors"
          >
            <ArrowLeft size={22} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Edit Project</h2>
          <div className="w-16 h-1 bg-[#087C7C] rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-400 tracking-widest ml-1">Project Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-100 focus:border-[#087C7C] focus:bg-white px-4 py-4 rounded-2xl transition-all outline-none font-bold text-gray-800"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-400 tracking-widest ml-1">Location</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-100 focus:border-[#087C7C] focus:bg-white px-4 py-4 rounded-2xl transition-all outline-none font-bold text-gray-800"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-400 tracking-widest ml-1">Price Range</label>
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-100 focus:border-[#087C7C] focus:bg-white px-4 py-4 rounded-2xl transition-all outline-none font-bold text-gray-800"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-400 tracking-widest ml-1">Total Units</label>
                <input
                  type="number"
                  required
                  className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-100 focus:border-[#087C7C] focus:bg-white px-4 py-4 rounded-2xl transition-all outline-none font-bold text-gray-800"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-12 space-y-6">
              <label className="text-sm font-black text-gray-400 tracking-widest ml-1 block">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {AMENITIES_LIST.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all font-bold text-xs tracking-wider ${
                      formData.amenities?.includes(amenity)
                        ? 'bg-[#087C7C]/5 border-[#087C7C] text-[#087C7C]'
                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      formData.amenities?.includes(amenity) ? 'bg-[#087C7C] border-[#087C7C]' : 'bg-white border-gray-200'
                    }`}>
                      {formData.amenities?.includes(amenity) && <Plus size={12} className="text-white rotate-45" />}
                    </div>
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-2 group">
              <label className="text-sm font-black text-gray-400 tracking-widest ml-1">Project Description</label>
              <textarea
                required
                rows="5"
                className="w-full bg-gray-50/50 border-0 border-b-2 border-gray-100 focus:border-[#087C7C] focus:bg-white px-4 py-4 rounded-2xl transition-all outline-none font-bold text-gray-800 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12">
            <label className="text-sm font-black text-gray-400 tracking-widest block mb-6 ml-1">Project Visuals</label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-[#087C7C]/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 group-hover:text-[#087C7C] transition-all">
                  <Plus size={24} />
                </div>
                <span className="text-xs font-bold text-gray-400 mt-2">Add Photo</span>
                <input 
                  type="file" 
                  multiple
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {saving && uploadProgress > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-2 mt-6 overflow-hidden">
                <div 
                  className="bg-[#087C7C] h-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#087C7C] text-white font-black py-6 rounded-3xl shadow-2xl shadow-[#087C7C]/40 hover:bg-[#066666] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center text-xl tracking-widest"
          >
            {saving ? 'Updating Project...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProject;
