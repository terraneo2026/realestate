'use client';

import { Container } from '@/components/layout';
import { ShieldCheck, Zap, Heart, Search } from 'lucide-react';

const FEATURES = [
  {
    title: 'Safe & Secure',
    description: 'We prioritize your security with verified agents and secure KYC processes for all users.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast Process',
    description: 'Find, visit, and lease your perfect property in record time with our optimized workflow.',
    icon: Zap,
  },
  {
    title: 'Customer First',
    description: 'Our support team is always ready to help you throughout your rental journey.',
    icon: Heart,
  },
  {
    title: 'Easy Search',
    description: 'Powerful filters and intuitive UI to help you find exactly what you need.',
    icon: Search,
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50/50">
      <Container>
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Why Choose <span className="text-primary">Relocate?</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed tracking-widest opacity-80">
            Redefining real estate with trust, speed, and simplicity.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <div 
              key={index} 
              className="relative flex flex-col items-center text-center p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group overflow-hidden"
            >
              <div className="relative w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <feature.icon size={28} strokeWidth={2} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-500 text-xs leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
