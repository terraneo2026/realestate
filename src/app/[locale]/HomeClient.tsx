"use client";

import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { HeroSection, FeaturedPropertiesSection, CategoriesSection, CTASection, SearchFilter } from '@/components/sections';

export default function HomeClient() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <SearchFilter />
      <main className="flex-1 w-full">
        <HeroSection />
        <div className="pt-12">
          <FeaturedPropertiesSection />
        </div>
        <CategoriesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
