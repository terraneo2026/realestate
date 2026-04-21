import React, { useEffect, useState } from 'react';
import AdminLayout from '@/admin/components/AdminLayout';
import { db } from '@/admin/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Users, ShieldCheck, ShieldAlert, Download, Trash2, Mail, Phone, Building2, Search, Filter, Loader2 } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, agent, owner, tenant
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVerify = async (userId, currentStatus) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isVerified: !currentStatus
      });
      fetchUsers();
    } catch (error) {
      alert("Verification update failed: " + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        fetchUsers();
      } catch (error) {
        alert("Delete failed: " + error.message);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">User management</h2>
          <p className="text-gray-400 font-semibold text-xs tracking-tight mt-1">Manage all registered users and verify agents</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search users..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:border-[#087C7C] transition-all w-full sm:w-64 font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select 
              className="pl-10 pr-8 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:border-[#087C7C] appearance-none font-medium text-sm cursor-pointer"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="agent">Agents</option>
              <option value="owner">Owners</option>
              <option value="tenant">Tenants</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-[#087C7C]" size={40} />
            <p className="text-gray-400 font-bold tracking-tight text-xs">Fetching users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-20 text-center">
            <Users className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold tracking-tight text-xs">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-xs font-bold tracking-tight">
                  <th className="px-6 py-4">User info</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">KYC documents</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#087C7C] font-bold text-sm shadow-inner group-hover:bg-[#087C7C] group-hover:text-white transition-all">
                          {(user.fullName || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 tracking-tight text-sm">{user.fullName || 'No name'}</p>
                          <div className="flex items-center text-xs text-gray-400 font-semibold mt-0.5">
                            <Mail size={10} className="mr-1" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold tracking-tight border ${
                        user.role === 'agent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        user.role === 'owner' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-gray-50 text-gray-600 border-gray-100'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <div className="flex items-center text-green-600 font-bold text-xs tracking-tight">
                          <ShieldCheck size={14} className="mr-1" /> Verified
                        </div>
                      ) : (
                        <div className="flex items-center text-red-400 font-bold text-xs tracking-tight">
                          <ShieldAlert size={14} className="mr-1" /> Unverified
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role === 'agent' && user.kycDocument ? (
                        <a 
                          href={user.kycDocument} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#087C7C]/10 text-[#087C7C] rounded-lg hover:bg-[#087C7C] hover:text-white transition-all text-xs font-bold tracking-tight"
                        >
                          <Download size={12} /> KYC
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs font-bold tracking-tight">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {user.role === 'agent' && (
                          <button 
                            onClick={() => handleToggleVerify(user.id, user.isVerified)}
                            className={`p-1.5 rounded-lg transition-all ${
                              user.isVerified 
                                ? 'text-red-500 hover:bg-red-50' 
                                : 'text-green-500 hover:bg-green-50'
                            }`}
                            title={user.isVerified ? "Revoke" : "Verify"}
                          >
                            {user.isVerified ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
