"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui";
import AuthModal from "./AuthModal";

interface AgentCardProps {
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  image?: string;
}

export default function AgentCard({ name, title, phone, email, image }: AgentCardProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const handleContactAgent = () => {
    // In a real app, we'd check auth state or send an actual message
    setAuthModalOpen(true);
    setInquirySent(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-6 mb-8">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/10 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black shadow-inner">
              {name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-gray-900 truncate leading-tight mb-1">{name}</h3>
            {title && <p className="text-sm text-gray-400 font-black  tracking-widest truncate">{title}</p>}
          </div>
        </div>

        <div className="space-y-5 mb-8 pt-6 border-t border-gray-100">
          {phone && (
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <span className="text-xl">📞</span>
              </div>
              <a href={`tel:${phone}`} className="text-gray-700 hover:text-primary font-bold transition-colors text-sm">
                {phone}
              </a>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                <span className="text-xl">✉️</span>
              </div>
              <a href={`mailto:${email}`} className="text-gray-700 hover:text-primary font-bold transition-colors text-sm truncate">
                {email}
              </a>
            </div>
          )}
        </div>

        <Button 
          variant="primary" 
          className="w-full py-4 text-lg font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
          onClick={handleContactAgent}
        >
          {inquirySent ? "Message Sent! ✓" : "Contact Agent"}
        </Button>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
