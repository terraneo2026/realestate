"use client";

import { useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  otherUserName: string;
  otherUserRole: string;
}

export default function AgentMessagesPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const fetchChats = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const q = query(
            collection(firestore, "chats"),
            where("participants", "array-contains", user.uid),
            orderBy("lastMessageTime", "desc")
          );
          const querySnapshot = await getDocs(q);
          const chatsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Chat[];
          setChats(chatsData);
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      }
      setLoading(false);
    };
    fetchChats();
  }, []);

  return (
    <DashboardLayout userRole="agent">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Messages</h1>
        <p className="text-gray-600 mt-2 font-medium">Coordinate with potential tenants and finalize deals</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold tracking-widest text-xs">Loading conversations...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="py-20 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6 text-3xl">
              💬
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Chats</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
              Your conversations with potential tenants will appear here. Stay responsive to close more deals!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {chats.map((chat) => (
              <Link 
                key={chat.id} 
                href={`/${locale}/agent/messages/${chat.id}`}
                className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-all group"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xl font-bold flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  {chat.otherUserName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">
                      {chat.otherUserName || "User"}
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-[9px] font-black text-gray-400 rounded">
                        {chat.otherUserRole || "Tenant"}
                      </span>
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 tracking-widest flex-shrink-0">
                      {new Date(chat.lastMessageTime).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate font-medium">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
