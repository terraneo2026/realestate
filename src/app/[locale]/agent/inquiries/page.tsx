"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { usePathname } from "next/navigation";

interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  propertyName: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
}

export default function AgentInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const fetchInquiries = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // In a real app, inquiries would be linked to properties owned by this agent
          const q = query(
            collection(firestore, "inquiries"),
            where("agentId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          const inquiriesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Inquiry[];
          setInquiries(inquiriesData);
        } catch (error) {
          console.error("Error fetching inquiries:", error);
        }
      }
      setLoading(false);
    };
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Inquiry["status"]) => {
    try {
      await updateDoc(doc(firestore, "inquiries", id), { status: newStatus });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <DashboardLayout userRole="agent">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Customer Leads</h1>
        <p className="text-gray-600 mt-2 font-medium">Manage and respond to property inquiries from potential tenants</p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold tracking-widest text-xs">Loading leads...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6 text-3xl">
              👥
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Leads Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
              When users inquire about your listings, they will appear here as fresh leads.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                        inq.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        inq.status === 'contacted' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="text-xs text-gray-400 font-bold tracking-widest">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{inq.customerName}</h3>
                    <p className="text-sm text-primary font-bold mb-4 flex items-center gap-2">
                      🏠 {inq.propertyName}
                    </p>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-gray-600 text-sm leading-relaxed">
                      "{inq.message}"
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <a 
                      href={`mailto:${inq.customerEmail}`}
                      className="w-full py-3 bg-primary text-white rounded-xl font-bold text-center hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      ✉️ Reply via Email
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => handleStatusChange(inq.id, "contacted")}
                        className="py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-xs border border-gray-100 hover:bg-gray-100 transition-all"
                      >
                        Mark Contacted
                      </button>
                      <button 
                        onClick={() => handleStatusChange(inq.id, "closed")}
                        className="py-2 bg-green-50 text-green-600 rounded-xl font-bold text-xs border border-green-100 hover:bg-green-100 transition-all"
                      >
                        Mark Closed
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
