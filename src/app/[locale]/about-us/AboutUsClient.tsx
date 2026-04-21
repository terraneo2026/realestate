"use client";

import Link from "next/link";
import { 
  Users, 
  Home, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Heart, 
  CheckCircle2, 
  Building2, 
  Search,
  Key,
  Handshake,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Navbar, Footer, PageHero } from "@/components/layout";

export default function AboutUsClient() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <PageHero 
          title="About Relocate" 
          description="Transforming Real Estate, One Property at a Time"
          backgroundImage="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
        />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-tight">Our Story</h2>
            <p className="text-gray-700 text-base leading-relaxed mb-4 font-normal">
              Relocate was founded with a simple yet powerful vision: to revolutionize the real estate industry through technology and innovation. We believe that buying, selling, or renting a property should be transparent, efficient, and accessible to everyone.
            </p>
            <p className="text-gray-700 text-base leading-relaxed mb-4 font-normal">
              Starting from humble beginnings, we've grown to become one of the most trusted real estate platforms in India. Our commitment to excellence and customer satisfaction has made us the preferred choice for thousands of property seekers, sellers, and investors.
            </p>
            <p className="text-gray-700 text-base leading-relaxed font-normal">
              Today, we continue to innovate and improve our services, leveraging cutting-edge technology to provide the best real estate experience possible.
            </p>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="relative overflow-hidden bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">🎯</span>
                Our Mission
              </h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                To empower individuals and families by providing a seamless, transparent, and trustworthy platform for all their real estate needs. We strive to simplify the property buying, selling, and renting process while maintaining the highest standards of integrity and professionalism.
              </p>
            </div>
            <div className="relative overflow-hidden bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <h3 className="text-2xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">👁️</span>
                Our Vision
              </h3>
              <p className="text-gray-600 text-base leading-relaxed font-medium">
                To become the leading real estate platform globally, known for innovation, transparency, and customer-centricity. We envision a world where technology makes real estate accessible, fair, and rewarding for everyone involved in the transaction.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Our Core Values</h2>
              <div className="w-20 h-1.5 bg-primary mx-auto rounded-full opacity-20"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  icon: <UserCheck size={32} strokeWidth={1.5} />,
                  title: "Customer First",
                  description: "Your needs are our priority. We listen, understand, and deliver tailored solutions."
                },
                {
                  icon: <ShieldCheck size={32} strokeWidth={1.5} />,
                  title: "Integrity",
                  description: "Transparency and honesty are the foundation of every relationship we build."
                },
                {
                  icon: <TrendingUp size={32} strokeWidth={1.5} />,
                  title: "Innovation",
                  description: "We leverage the latest technology to make property searching smarter and faster."
                },
                {
                  icon: <Handshake size={32} strokeWidth={1.5} />,
                  title: "Excellence",
                  description: "We strive for perfection in every listing and every interaction we handle."
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="relative flex flex-col items-center text-center p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden"
                >
                  <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Highlights */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-tight">Why Choose Relocate?</h2>
            <div className="space-y-4">
              {[
                "10,000+ verified properties across multiple cities",
                "Expert agents with years of industry experience",
                "Advanced search filters and property comparison tools",
                "Secure payment gateway with fraud protection",
                "24/7 customer support in multiple languages",
                "Free property valuation and market analysis",
                "Legal documentation assistance",
                "Virtual property tours and 360° views"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mt-1 text-xs font-bold">
                    ✓
                  </div>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed font-normal">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section - Full width or constrained by Container, outside of max-w-4xl */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <section className="bg-primary text-white py-12 md:py-16 lg:py-20 rounded-[3rem] max-w-7xl mx-auto overflow-hidden relative shadow-2xl shadow-primary/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
                Ready to Find Your Perfect Property?
              </h2>
              <p className="text-white/80 font-bold text-xs md:text-sm tracking-[0.2em] mb-10 leading-relaxed">
                Join thousands of satisfied tenants and owners on India's most trusted rental platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/en/properties" className="w-full sm:w-auto">
                  <Button variant="white" size="lg" className="w-full h-14 px-10 text-base font-black tracking-widest shadow-xl shadow-black/10 hover:scale-105 transition-transform active:scale-95">
                    Browse Properties
                  </Button>
                </Link>
                <Link href="/en/contact" className="w-full sm:w-auto">
                  <Button variant="white-outline" size="lg" className="w-full h-14 px-10 text-base font-black tracking-widest backdrop-blur-sm border-2 hover:bg-white/10 hover:scale-105 transition-transform active:scale-95">
                    Contact Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
