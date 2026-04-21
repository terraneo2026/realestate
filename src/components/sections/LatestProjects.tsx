'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Section, Container } from '@/components/layout';
import { Button } from '@/components/ui';
import { firestore } from '@/lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { MapPin, ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  price: string;
  units: number;
  slug: string;
}

export function LatestProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(firestore, 'projects'), limit(4));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Project[];
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching latest projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading || projects.length === 0) return null;

  return (
    <Section bg="gray">
      <div className="mb-10 md:mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">
            Latest Projects
          </h2>
          <p className="text-gray-500 font-bold text-xs tracking-widest">
            Discover our newest architectural marvels and premium developments
          </p>
        </div>
        <Link href={`/${locale}/projects`}>
          <Button variant="outline" className="group">
            View All Projects 
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/${locale}/projects/${project.slug}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest shadow-lg">
                {project.units} Units
              </div>
            </div>
 
            <div className="p-6">
              <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
                {project.name}
              </h3>
              
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <MapPin size={14} className="text-primary" />
                <span className="text-xs font-bold tracking-wide">{project.location}</span>
              </div>
 
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-400 font-black tracking-[0.2em] mb-0.5">Starting From</p>
                  <p className="text-lg font-black text-primary">{project.price}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
