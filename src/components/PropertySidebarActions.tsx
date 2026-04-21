"use client";

import { useState } from "react";
import { Button } from "./ui";
import AuthModal from "./AuthModal";

interface PropertySidebarActionsProps {
  propertyId: string;
}

export default function PropertySidebarActions({ propertyId }: PropertySidebarActionsProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const handleRequestTour = () => {
    // In a real app, we'd check auth state here
    // For now, let's open auth modal or show success
    setAuthModalOpen(true);
  };

  const handleSaveProperty = () => {
    setIsSaved(!isSaved);
    // Add logic to save to user's favorites in Firestore if logged in
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Interested?</h3>
        <p className="text-sm text-gray-500 mb-6">Schedule a visit or save this property for later.</p>
        
        <Button 
          variant="primary" 
          className="w-full py-4 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          onClick={handleRequestTour}
        >
          {inquirySent ? "Tour Requested! ✓" : "Request a Tour"}
        </Button>
        
        <Button 
          variant="outline" 
          className={`w-full py-4 text-lg font-bold transition-all active:scale-95 border-2 ${
            isSaved ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" : "border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
          }`}
          onClick={handleSaveProperty}
        >
          <span className="mr-2">{isSaved ? "❤️" : "🤍"}</span>
          {isSaved ? "Saved to Favorites" : "Save Property"}
        </Button>

        <p className="text-[10px] text-gray-400 text-center font-bold  tracking-widest pt-4">
          Free service • No credit card required
        </p>
      </div>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
}
