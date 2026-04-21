'use client';

import { Container } from '@/components/layout';
import { Building2, Users, Award, MapPin } from 'lucide-react';

const STATS = [
  { label: 'Properties for Rent', value: '1,200+', icon: Building2 },
  { label: 'Happy Tenants', value: '4,500+', icon: Users },
  { label: 'Awards Won', value: '12+', icon: Award },
  { label: 'Locations Covered', value: '25+', icon: MapPin },
];

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-[#087C7C]/5">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-[#087C7C] transition-transform group-hover:scale-110">
                <stat.icon size={28} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 leading-none">{stat.value}</h3>
              <p className="text-[10px] md:text-xs font-black text-gray-400 tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
