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
import AdminLayout from '@/components/admin-layout-panel/AdminLayout';
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
      <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8 px-4 md:px-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900 tracking-tight truncate">Category Master</h1>
          <p className="text-gray-400 mt-1 md:mt-2 font-medium tracking-tight text-[10px] md:text-xs flex items-center gap-2">
             <Layers size={14} className="text-primary shrink-0" /> <span className="truncate">Manage classifications</span>
          </p>
        </div>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setNewCategory({ name: '', slug: '', description: '', status: 'active', order: 0, icon: 'Building2' });
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto h-11 md:h-14 px-6 md:px-8 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
           <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 px-4 md:px-0 pb-12">
         {/* Categories List */}
         <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl md:rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <div className="p-4 md:p-8 border-b border-gray-50 bg-white">
                  <div className="relative group w-full">
                     <Search size={18} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                     <input 
                       type="text" 
                       placeholder="Search categories..." 
                       className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-[10px] md:text-xs"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </div>

               <div className="p-2 md:p-4 space-y-2 md:space-y-3">
                  {loading ? (
                    <div className="py-12 md:py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
                  ) : filteredCategories.length > 0 ? filteredCategories.map((cat) => (
                    <div key={cat.id} className="group flex items-center gap-3 md:gap-6 p-3 md:p-6 rounded-xl md:rounded-[2rem] hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                       <div className="hidden md:flex w-10 h-10 text-gray-300 group-hover:text-primary cursor-move items-center justify-center">
                          <GripVertical size={24} />
                       </div>
                       <div className="w-10 h-10 md:w-14 md:h-14 bg-gray-50 rounded-lg md:rounded-2xl flex items-center justify-center text-primary font-bold text-sm md:text-xl shadow-sm border border-gray-50">
                          {cat.name?.charAt(0)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-[10px] md:text-sm tracking-tight">{cat.name}</h4>
                          <p className="text-[9px] md:text-xs font-semibold text-gray-400 tracking-tight mt-0.5 md:mt-1">Order: {cat.order}</p>
                       </div>
                       <div className="flex items-center gap-1.5 md:gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingCategory(cat);
                              setNewCategory({ ...cat });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 md:p-3 bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 rounded-lg md:rounded-xl shadow-sm transition-all"
                          >
                             <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 md:p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 rounded-lg md:rounded-xl shadow-sm transition-all"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                  )) : (
                    <div className="py-12 md:py-20 text-center text-gray-400 font-bold text-[10px] md:text-xs tracking-tight uppercase">No categories found</div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar: Quick Stats & Help */}
         <div className="space-y-6 md:space-y-10">
            <div className="bg-gray-900 rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl shadow-gray-400/20">
               <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 tracking-tight">Classification Info</h3>
               <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                     <span className="text-[10px] md:text-xs font-semibold tracking-tight text-gray-400 uppercase">Total Categories</span>
                     <span className="text-xs md:text-sm font-bold">{categories.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                     <span className="text-[10px] md:text-xs font-semibold tracking-tight text-gray-400 uppercase">Master Amenities</span>
                     <span className="text-xs md:text-sm font-bold">24 Items</span>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 p-6 md:p-10 shadow-xl shadow-gray-200/50">
               <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight flex items-center gap-3">
                  <Activity size={20} className="text-primary" /> Usage Guide
               </h3>
               <p className="text-[10px] md:text-sm font-medium text-gray-400 leading-relaxed">
                  Categories directly affect the search experience. Use meaningful names and reorder them based on popular demand.
               </p>
               <button className="w-full mt-6 md:mt-8 py-3 md:py-4 bg-gray-50 text-gray-900 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs tracking-tight hover:bg-gray-100 transition-all border border-gray-100 uppercase">
                  Documentation
               </button>
            </div>
         </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-xl rounded-2xl md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="p-6 md:p-10 border-b border-gray-50 flex justify-between items-center">
                 <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 md:p-3 hover:bg-gray-50 rounded-xl md:rounded-2xl transition-all text-gray-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-4 md:space-y-6 custom-scrollbar">
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-tight ml-1">Category Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-gray-800 text-sm md:text-base"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-tight ml-1">Slug (Auto-generated)</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-gray-400 text-sm md:text-base"
                      value={newCategory.slug}
                      readOnly
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-tight ml-1">Sort Order</label>
                       <input 
                         type="number" 
                         className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-gray-800 text-sm md:text-base"
                         value={newCategory.order}
                         onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status</label>
                       <div className="relative group">
                          <select 
                             className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-2 border-gray-50 rounded-xl md:rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-semibold text-xs tracking-tight text-gray-500 appearance-none pr-10 md:pr-12"
                             value={newCategory.status}
                             onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                          >
                             <option value="active">Active</option>
                             <option value="inactive">Inactive</option>
                          </select>
                          <ChevronDown className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary" size={18} />
                       </div>
                    </div>
                 </div>
                 <div className="pt-4 md:pt-6 sticky bottom-0 bg-white">
                    <button type="submit" className="w-full py-4 md:py-5 bg-primary text-white rounded-xl md:rounded-2xl font-bold text-sm tracking-tight shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
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
