import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db } from '@/admin/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Loader2, List, X } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [adding, setAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const snap = await getDocs(collection(db, 'categories'));
      const categoriesList = snap.docs.map(doc => {
        const data = doc.data();
        return { 
          id: doc.id, 
          ...data,
          category: data.category || data.name || 'Unnamed Category'
        };
      });
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAdding(true);
    try {
      await addDoc(collection(db, 'categories'), {
        category: newCategory,
        createdAt: serverTimestamp(),
      });
      setNewCategory('');
      setShowAddModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Add failed:", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Categories</h2>
          <p className="text-gray-500 mt-1 font-semibold text-xs tracking-tight">Manage property types and classifications</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-block px-4 py-2 bg-white border border-gray-100 shadow-sm text-[#087C7C] rounded-xl text-xs font-bold tracking-tight mr-2">
            {categories.length} categories
          </span>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#087C7C] text-white px-6 py-3 rounded-xl font-bold tracking-tight text-[11px] flex items-center shadow-lg shadow-[#087C7C]/20 hover:bg-[#066666] transition-all"
          >
            <Plus size={16} className="mr-2" />
            Add category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#087C7C]/10 rounded-xl flex items-center justify-center text-[#087C7C]">
              <List size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 tracking-wider">
              Existing Categories
            </h3>
          </div>
        </div>
        
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#087C7C]" size={40} />
              <p className="text-gray-400 font-bold tracking-tight text-xs">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-20 text-center">
              <List className="mx-auto text-gray-100 mb-4" size={48} />
              <p className="text-gray-400 font-bold tracking-tight text-xs">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-50">
              {categories.map((cat) => (
                <div key={cat.id} className="p-6 flex items-center justify-between hover:bg-gray-50/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-bold text-[#087C7C] text-xs group-hover:bg-white transition-all">
                      {cat.category?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-700 text-base tracking-tight">{cat.category}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Add new category</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 tracking-tight ml-1 block">Category name</label>
                <input
                  type="text"
                  placeholder="e.g. Luxury Villa"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#087C7C] outline-none transition-all font-medium text-gray-800 text-sm"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="w-full bg-[#087C7C] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#087C7C]/20 hover:bg-[#066666] transition-all disabled:opacity-50 flex items-center justify-center tracking-tight text-xs"
              >
                {adding ? <Loader2 className="animate-spin mr-2" size={18} /> : <Plus size={18} className="mr-2" />}
                {adding ? 'Adding...' : 'Create category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CategoriesPage;
