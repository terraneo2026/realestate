'use client';

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, onSnapshot, doc, getDoc, updateDoc } from "firebase/firestore";
import DashboardLayout from "@/components/DashboardLayout";
import { MessageSquare, Send, User, Clock, Check, CheckCheck, Loader2, ChevronRight, MapPin, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <DashboardLayout userRole="tenant">
        <div className="h-[600px] bg-white rounded-[3rem] shadow-xl border border-gray-100 flex animate-pulse">
           <div className="w-80 border-r border-gray-100 p-6 space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl" />)}
           </div>
           <div className="flex-1 p-10 flex flex-col justify-end gap-4">
              <div className="h-12 bg-gray-50 rounded-2xl w-2/3 self-start" />
              <div className="h-12 bg-gray-50 rounded-2xl w-2/3 self-end" />
              <div className="h-16 bg-gray-50 rounded-2xl w-full mt-8" />
           </div>
        </div>
      </DashboardLayout>
    }>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const propertyIdParam = searchParams?.get('propertyId');

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch conversations (unique senders/receivers)
    // Note: To avoid composite index requirement for initial setup, we filter in JS
    const q = query(
      collection(firestore, "messages"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by createdAt desc in JS
      msgs.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB - dateA;
      });
      
      // Group by other participant
      const groups: { [key: string]: any } = {};
      msgs.forEach((m: any) => {
        const otherId = m.participants.find((p: string) => p !== user.uid);
        if (!groups[otherId] || new Date(m.createdAt?.toDate()) > new Date(groups[otherId].lastMessageAt?.toDate())) {
          groups[otherId] = {
            id: otherId,
            lastMessage: m.text,
            lastMessageAt: m.createdAt,
            unreadCount: m.receiverId === user.uid && m.status === 'unread' ? 1 : 0,
            otherName: m.senderId === user.uid ? m.receiverName : m.senderName,
            otherImage: m.senderId === user.uid ? m.receiverImage : m.senderImage,
            propertyId: m.propertyId,
            propertyTitle: m.propertyTitle
          };
        } else if (m.receiverId === user.uid && m.status === 'unread') {
          groups[otherId].unreadCount++;
        }
      });

      setConversations(Object.values(groups));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(firestore, "messages"),
      where("participants", "array-contains-any", [user.uid, selectedConversation.id]),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const msgs = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((m: any) => 
          m.participants.includes(user.uid) && m.participants.includes(selectedConversation.id)
        );
      setMessages(msgs);
      
      // Mark as read
      msgs.forEach(async (m: any) => {
        if (m.receiverId === user.uid && m.status === 'unread') {
          await updateDoc(doc(firestore, "messages", m.id), { status: 'read' });
        }
      });
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const user = auth.currentUser;
    if (!user) return;

    setSending(true);
    try {
      await addDoc(collection(firestore, "messages"), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || "User",
        receiverId: selectedConversation.id,
        receiverName: selectedConversation.otherName,
        participants: [user.uid, selectedConversation.id],
        status: 'unread',
        createdAt: serverTimestamp(),
        propertyId: selectedConversation.propertyId || "",
        propertyTitle: selectedConversation.propertyTitle || ""
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="tenant">
        <div className="h-[600px] bg-white rounded-[3rem] shadow-xl border border-gray-100 flex animate-pulse">
           <div className="w-80 border-r border-gray-100 p-6 space-y-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl" />)}
           </div>
           <div className="flex-1 p-10 flex flex-col justify-end gap-4">
              <div className="h-12 bg-gray-50 rounded-2xl w-2/3 self-start" />
              <div className="h-12 bg-gray-50 rounded-2xl w-2/3 self-end" />
              <div className="h-16 bg-gray-50 rounded-2xl w-full mt-8" />
           </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tenant">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Messages</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Chat with property owners and agents</p>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex overflow-hidden h-[700px]">
        {/* Conversations Sidebar */}
        <div className="w-full md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/30">
          <div className="p-6">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                />
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {conversations.length > 0 ? conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full p-6 flex items-center gap-4 transition-all border-b border-gray-100/50 hover:bg-white",
                  selectedConversation?.id === conv.id ? "bg-white border-l-4 border-l-primary" : "bg-transparent"
                )}
              >
                <div className="relative">
                   <div className="w-14 h-14 rounded-2xl bg-gray-200 overflow-hidden shadow-sm">
                      <img src={conv.otherImage || `https://ui-avatars.com/api/?name=${conv.otherName}&background=random`} alt="" />
                   </div>
                   {conv.unreadCount > 0 && (
                     <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {conv.unreadCount}
                     </span>
                   )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-gray-900 truncate text-sm">{conv.otherName}</h4>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">{conv.lastMessageAt?.toDate() ? new Date(conv.lastMessageAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-400 truncate">{conv.lastMessage}</p>
                </div>
              </button>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-center px-10">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-200 mb-4 shadow-sm">
                    <MessageSquare size={32} />
                 </div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                    <img src={selectedConversation.otherImage || `https://ui-avatars.com/api/?name=${selectedConversation.otherName}&background=random`} alt="" />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 tracking-tight">{selectedConversation.otherName}</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Now</p>
                    </div>
                  </div>
                </div>
                {selectedConversation.propertyTitle && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                     <MapPin size={14} className="text-primary" />
                     <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate max-w-[150px]">{selectedConversation.propertyTitle}</span>
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-gray-50/20">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col max-w-[70%] group",
                      m.senderId === auth.currentUser?.uid ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-3xl text-sm font-medium shadow-sm relative",
                      m.senderId === auth.currentUser?.uid 
                        ? "bg-primary text-white rounded-br-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    )}>
                      {m.text}
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-1">
                       <span className="text-[9px] font-bold text-gray-400 uppercase">
                         {m.createdAt?.toDate() ? new Date(m.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                       </span>
                       {m.senderId === auth.currentUser?.uid && (
                         m.status === 'read' ? <CheckCheck size={12} className="text-blue-500" /> : <Check size={12} className="text-gray-300" />
                       )}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Message Input */}
              <div className="p-8 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="relative flex items-center gap-4">
                  <div className="flex-1 relative">
                     <input
                       type="text"
                       placeholder="Type your message here..."
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       className="w-full pl-6 pr-16 py-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all"
                     />
                     <button
                       type="submit"
                       disabled={!newMessage.trim() || sending}
                       className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
                     >
                       {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                     </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 bg-gray-50/30">
               <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-gray-100 mb-8 border border-gray-100">
                  <MessageSquare size={64} />
               </div>
               <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Your Conversations</h2>
               <p className="text-gray-500 font-medium max-w-xs leading-relaxed">Select a contact from the sidebar to start messaging or viewing details.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
