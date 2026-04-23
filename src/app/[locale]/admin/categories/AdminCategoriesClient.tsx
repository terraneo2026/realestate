'use client';

import React, { useEffect, useState } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, onSnapshot } from 'firebase/firestore';
import { 
  List, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight, 
  GripVertical, 
  CheckCircle2, 
  XCircle,
  FolderTree,
  Activity,
  Tag,
  Loader2,
  Check,
  X,
  MoreVertical,
  Layers
} from 'lucide-react';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminCategoriesClient() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    status: 'active',
    order: 0,
    icon: 'Building2'
  });

  useEffect(() => {
    const q = query(collection(firestore, 'categories'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setCategories(snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...categoryData } = newCategory as any;
      if (editingCategory) {
        await updateDoc(doc(firestore, 'categories', editingCategory.id), categoryData);
        toast.success("Category updated successfully");
      } else {
        await addDoc(collection(firestore, 'categories'), {
          ...categoryData,
          createdAt: new Date()
        });
        toast.success("New category added");
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setNewCategory({ name: '', slug: '', description: '', status: 'active', order: 0, icon: 'Building2' });
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Operation failed");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure? This will affect property filters.")) return;
    try {
      await deleteDoc(doc(firestore, 'categories', id));
      toast.success("Category removed");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Category Master</h1>
          <p className="text-gray-400 mt-2 font-medium tracking-tight text-xs flex items-center gap-2">
             <Layers size={14} className="text-primary" /> Manage property types, amenities, and classifications
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setNewCategory({ name: '', slug: '', description: '', status: 'active', order: 0, icon: 'Building2' });
            setIsModalOpen(true);
          }}
          className="h-14 px-8 bg-primary text-white rounded-2xl font-bold text-xs tracking-tight flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
           <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Categories List */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-white">
                  <div className="relative group">
                     <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                     <input 
                       type="text" 
                       placeholder="Search categories..." 
                       className="w-full pl-16 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-xs"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>

               <div className="p-4 space-y-3">
                  {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                  ) : filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                    <div key={cat.id} className="group flex items-center gap-6 p-6 rounded-[2rem] hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                       <div className="w-10 h-10 text-gray-300 group-hover:text-primary cursor-move">
                          <GripVertical size={24} />
                       </div>
                       <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary font-bold text-xl shadow-sm border border-gray-50">
                          {cat.name?.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm tracking-tight">{cat.name}</h4>
                          <p className="text-xs font-semibold text-gray-400 tracking-tight mt-1">Slug: {cat.slug} • Order: {cat.order}</p>
                       </div>
                       <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingCategory(cat);
                              setNewCategory({ ...cat });
                              setIsModalOpen(true);
                            }}
                            className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-xl shadow-sm transition-all"
                          >
                             <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-xl shadow-sm transition-all"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center text-gray-400 font-bold text-xs tracking-tight">No categories found</div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar: Quick Stats & Help */}
         <div className="space-y-10">
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-400/20">
               <h3 className="text-xl font-bold mb-6 tracking-tight">Classification Info</h3>
               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-xs font-semibold tracking-tight text-gray-400">Total Categories</span>
                     <span className="text-sm font-bold">{categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                     <span className="text-xs font-semibold tracking-tight text-gray-400">Master Amenities</span>
                     <span className="text-sm font-bold">24 Items</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-xl shadow-gray-200/50">
               <h3 className="text-xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                  <Activity size={20} className="text-primary" /> Usage Guide
               </h3>
               <p className="text-sm font-medium text-gray-400 leading-relaxed">
                  Categories directly affect the search experience. Use meaningful names and reorder them based on popular demand.
               </p>
               <button className="w-full mt-8 py-4 bg-gray-50 text-gray-900 rounded-2xl font-bold text-xs tracking-tight hover:bg-gray-100 transition-all border border-gray-100">
                  Documentation
               </button>
            </div>
         </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveCategory} className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 tracking-tight ml-1">Category Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-gray-800"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-400 tracking-tight ml-1">Slug (Auto-generated)</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-gray-400"
                      value={newCategory.slug}
                      readOnly
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-400 tracking-tight ml-1">Sort Order</label>
                       <input 
                         type="number" 
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-gray-800"
                         value={newCategory.order}
                         onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-semibold text-gray-400 tracking-tight ml-1">Status</label>
                       <select 
                         className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-xs tracking-tight text-gray-500"
                         value={newCategory.status}
                         onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                       >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                       </select>
                    </div>
                 </div>
                 <div className="pt-6">
                    <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-sm tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                       {editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
}
