import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db } from '@/admin/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Edit2, Trash2, Plus, Search, Filter, Layout, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectSnap = await getDocs(collection(db, 'projects'));
      setProjects(projectSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    (p.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (p.location || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Projects</h2>
          <p className="text-gray-400 font-semibold text-xs tracking-tight mt-1">Manage your architectural developments and projects</p>
        </div>
        <Link 
          href="/admin/projects/add" 
          className="bg-[#087C7C] text-white px-6 py-3 rounded-xl font-bold tracking-tight text-[11px] flex items-center shadow-lg shadow-[#087C7C]/20 hover:bg-[#066666] transition-all"
        >
          <Plus size={18} className="mr-2" />
          Add new project
        </Link>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search projects by name or location..." 
            className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#087C7C] outline-none transition-all font-medium text-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-3.5 bg-gray-50 text-gray-500 rounded-xl border border-gray-100 hover:bg-white hover:text-[#087C7C] transition-all flex items-center justify-center gap-2 font-bold text-xs">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-[#087C7C]/20 border-t-[#087C7C] rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold tracking-tight text-xs">Loading projects...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-xs font-bold tracking-tight">
                  <th className="px-8 py-5">Project details</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">Pricing & units</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                          {project.image ? (
                            <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                              <Layout size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm tracking-tight line-clamp-1">{project.name}</h4>
                          <p className="text-gray-400 text-xs font-bold tracking-tight flex items-center mt-1">
                            <Layout size={10} className="mr-1" />
                            Residential project
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-1.5 text-gray-600 text-xs font-bold tracking-tight">
                        <MapPin size={14} className="text-[#087C7C]" />
                        {project.location}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1.5">
                        <p className="text-[#087C7C] font-bold text-sm tracking-tight">{project.price}</p>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold tracking-tight">
                          {project.units} units total
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                        <Link 
                          href={`/admin/projects/${project.id}`}
                          className="p-2 bg-white border border-gray-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          className="p-2 bg-white border border-gray-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProjects.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-8 py-32 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <Layout size={40} />
                      </div>
                      <p className="text-gray-400 font-bold tracking-tight text-sm">No projects found</p>
                      <p className="text-gray-300 text-xs mt-2 font-semibold">Try adding your first project.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
