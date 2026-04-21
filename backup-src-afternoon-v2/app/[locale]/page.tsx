import { HeroSection, FeaturedPropertiesSection, CategoriesSection, CTASection } from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="pt-24">
        <FeaturedPropertiesSection />
      </div>
      <CategoriesSection />
      <CTASection />
    </>
  );
}