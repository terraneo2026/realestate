import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { SearchFilter } from '@/components/sections/SearchFilter';
import { 
  HeroSection, 
  FeaturedPropertiesSection, 
  CategoriesSection, 
  LatestProjectsSection,
  CTASection,
  StatsSection,
  WhyChooseUsSection 
} from '@/components/sections';

export default function HomePage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        
        <div className="pt-8 md:pt-12 lg:pt-16">
          <StatsSection />
        </div>

        <div className="pt-8 md:pt-12 lg:pt-16">
          <FeaturedPropertiesSection />
        </div>

        <div className="pt-8 md:pt-12 lg:pt-16">
          <LatestProjectsSection />
        </div>

        <WhyChooseUsSection />
        
        <CategoriesSection />
        
        <div className="pb-16 md:pb-24">
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}