"use client";

import React, { useEffect, useState, useRef } from "react";
import { auth, firestore } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Search, 
  Send, 
  User, 
  MessageSquare, 
  Loader2, 
  Building2, 
  MoreVertical,
  Phone,
  Info,
  ChevronLeft,
  Check,
  CheckCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function OwnerMessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push(`/${locale}/login`);
        return;
      }

      // Fetch conversations (grouping messages in JS for flexibility)
      const q = query(
        collection(firestore, "messages"),
        where("participants", "array-contains", user.uid)
      );

      const unsubscribeMsgs = onSnapshot(q, (snap) => {
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
          if (!groups[otherId] || (m.createdAt && (!groups[otherId].lastMessageAt || m.createdAt.toDate() > groups[otherId].lastMessageAt.toDate()))) {
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

        const convList = Object.values(groups);
        setConversations(convList);
        
        // Auto-select if userId in params
        const targetUserId = searchParams?.get('userId');
        if (targetUserId && !selectedConversation) {
          const found = convList.find(c => c.id === targetUserId);
          if (found) setSelectedConversation(found);
        }

        setLoading(false);
      });

      return () => unsubscribeMsgs();
    });

    return () => unsubscribeAuth();
  }, [locale, router, searchParams]);

  useEffect(() => {
    if (!selectedConversation) return;

    const user = auth.currentUser;
    if (!user) return;

    // Real-time listener for current conversation
    const q = query(
      collection(firestore, "messages"),
      where("participants", "array-contains", user.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const allMsgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = allMsgs.filter((m: any) => 
        m.participants.includes(selectedConversation.id)
      );
      setMessages(filtered);
      
      // Mark as read logic would go here
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      await addDoc(collection(firestore, "messages"), {
        senderId: user.uid,
        senderName: user.displayName || "Owner",
        senderImage: user.photoURL || "",
        receiverId: selectedConversation.id,
        receiverName: selectedConversation.otherName,
        receiverImage: selectedConversation.otherImage || "",
        text: newMessage.trim(),
        createdAt: serverTimestamp(),
        participants: [user.uid, selectedConversation.id],
        status: 'unread',
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
      <DashboardLayout userRole="owner">
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="owner">
      <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar: Conversations List */}
          <div className={cn(
            "w-full lg:w-96 border-r border-gray-50 flex flex-col transition-all",
            selectedConversation ? "hidden lg:flex" : "flex"
          )}>
            <div className="p-8 border-b border-gray-50">
               <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Messages</h2>
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search chats..." 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-xs"
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {conversations.length > 0 ? conversations.map((conv) => (
                 <button
                   key={conv.id}
                   onClick={() => setSelectedConversation(conv)}
                   className={cn(
                     "w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group",
                     selectedConversation?.id === conv.id ? "bg-primary text-white shadow-xl shadow-primary/20" : "hover:bg-gray-50"
                   )}
                 >
                    <div className="relative shrink-0">
                       <div className={cn(
                         "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm transition-colors",
                         selectedConversation?.id === conv.id ? "bg-white/20" : "bg-gray-100 text-gray-400"
                       )}>
                          {conv.otherName?.charAt(0).toUpperCase() || 'U'}
                       </div>
                       {conv.unreadCount > 0 && (
                         <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                            {conv.unreadCount}
                         </div>
                       )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                       <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-black truncate text-sm">{conv.otherName}</h4>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest",
                            selectedConversation?.id === conv.id ? "text-white/60" : "text-gray-300"
                          )}>
                             {conv.lastMessageAt ? new Date(conv.lastMessageAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                       </div>
                       <p className={cn(
                         "text-[10px] font-bold truncate tracking-tight",
                         selectedConversation?.id === conv.id ? "text-white/80" : "text-gray-400"
                       )}>
                          {conv.lastMessage}
                       </p>
                    </div>
                 </button>
               )) : (
                 <div className="py-20 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No conversations yet</p>
                 </div>
               )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={cn(
            "flex-1 flex flex-col bg-gray-50/30 transition-all",
            !selectedConversation ? "hidden lg:flex" : "flex"
          )}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <button onClick={() => setSelectedConversation(null)} className="lg:hidden p-2 hover:bg-gray-50 rounded-xl">
                         <ChevronLeft size={20} />
                      </button>
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-lg">
                         {selectedConversation.otherName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                         <h3 className="font-black text-gray-900 tracking-tight">{selectedConversation.otherName}</h3>
                         <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Online</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                         <Phone size={18} />
                      </button>
                      <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                         <Info size={18} />
                      </button>
                      <button className="p-3 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors">
                         <MoreVertical size={18} />
                      </button>
                   </div>
                </div>

                {/* Property Context Bar */}
                {selectedConversation.propertyTitle && (
                  <div className="px-6 py-3 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Building2 size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Inquiry for: {selectedConversation.propertyTitle}</span>
                     </div>
                     <Link href={`/${locale}/property/${selectedConversation.propertySlug}`} className="text-[9px] font-black text-primary underline uppercase tracking-widest">View Property</Link>
                  </div>
                )}

                {/* Messages Container */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-6"
                >
                   {messages.map((m) => {
                     const isMe = m.senderId === auth.currentUser?.uid;
                     return (
                       <div key={m.id} className={cn(
                         "flex w-full",
                         isMe ? "justify-end" : "justify-start"
                       )}>
                          <div className={cn(
                            "max-w-[70%] space-y-1",
                            isMe ? "items-end" : "items-start"
                          )}>
                             <div className={cn(
                               "px-6 py-4 rounded-[2rem] text-sm font-medium shadow-sm",
                               isMe ? "bg-primary text-white rounded-tr-none" : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                             )}>
                                {m.text}
                             </div>
                             <div className={cn(
                               "flex items-center gap-2 px-2 text-[8px] font-black uppercase tracking-widest",
                               isMe ? "text-gray-400" : "text-gray-300"
                             )}>
                                <span>{m.createdAt ? new Date(m.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                {isMe && (
                                  m.status === 'read' ? <CheckCheck size={10} className="text-blue-500" /> : <Check size={10} />
                                )}
                             </div>
                          </div>
                       </div>
                     );
                   })}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100">
                   <div className="relative flex items-center gap-4">
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="flex-1 bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 outline-none focus:border-primary focus:bg-white transition-all font-bold text-sm"
                      />
                      <button 
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="h-14 w-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                      >
                        {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      </button>
                   </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
                    <MessageSquare size={48} />
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight uppercase">Your Inbox</h3>
                 <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                   Select a conversation from the sidebar to start chatting with potential tenants and agents.
                 </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
