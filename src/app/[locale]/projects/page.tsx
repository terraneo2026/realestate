"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar, Footer, PageHero } from "@/components/layout";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui";
import { MapPin, Building2, Zap, CreditCard, Users, TrendingUp } from "lucide-react";
import { firestore } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Project {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  price: string;
  units: number;
  completionDate: string;
  slug: string;
}

// Mock data for fallback when API is unavailable
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Sunrise Heights",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop",
    description: "Premium residential complex with modern amenities and green spaces",
    price: "₹45 Lakhs",
    units: 250,
    completionDate: "Q3 2026",
    slug: "sunrise-heights"
  },
  {
    id: 2,
    name: "Marina Bay Tower",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    description: "Luxury commercial and residential development in prime location",
    price: "₹65 Lakhs",
    units: 180,
    completionDate: "Q2 2026",
    slug: "marina-bay-tower"
  },
  {
    id: 3,
    name: "Tech Park Plaza",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    description: "Modern IT park with office spaces and retail outlets",
    price: "₹38 Lakhs",
    units: 120,
    completionDate: "Q4 2026",
    slug: "tech-park-plaza"
  },
  {
    id: 4,
    name: "Royal Gardens",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=400&fit=crop",
    description: "Gated residential community with world-class facilities",
    price: "₹52 Lakhs",
    units: 200,
    completionDate: "Q1 2027",
    slug: "royal-gardens"
  },
  {
    id: 5,
    name: "Central Plaza",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=600&h=400&fit=crop",
    description: "Mixed-use development with commercial and residential spaces",
    price: "₹55 Lakhs",
    units: 160,
    completionDate: "Q3 2026",
    slug: "central-plaza"
  },
  {
    id: 6,
    name: "Green Valley Homes",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    description: "Eco-friendly residential project with sustainable living features",
    price: "₹42 Lakhs",
    units: 90,
    completionDate: "Q2 2027",
    slug: "green-valley-homes"
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const querySnapshot = await getDocs(collection(firestore, 'projects'));
        const projectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Project[];
        
        setProjects(projectsData.length > 0 ? projectsData : MOCK_PROJECTS);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const locations = ["all", "Chennai", "Mumbai", "Bangalore", "Delhi", "Hyderabad"];
  const filteredProjects =
    selectedLocation === "all"
      ? projects
      : projects.filter(p => p.location === selectedLocation);

  if (loading) return <Loader />;

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        {/* Header */}
        <PageHero 
          title="Real Estate Projects" 
          description="Discover premium residential and commercial projects"
        />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          {/* Location Filter */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">Filter by Location</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {locations.map(location => (
                <button
                  key={location}
                  onClick={() => setSelectedLocation(location)}
                  className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer capitalize text-sm ${
                    selectedLocation === location
                      ? "bg-primaryBg text-white"
                      : "bg-white text-gray-800 border-2 border-gray-300 hover:border-primaryBg"
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map(project => (
                <Link
                  key={project.id}
                  href={`/${typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'en' : 'en'}/projects/${project.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-64 bg-gray-200">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full text-xs font-bold tracking-wider">
                      {project.units} Units
                    </div>
                  </div>
 
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition leading-tight">
                      {project.name}
                    </h3>
 
                    <div className="flex items-center gap-2 text-gray-600 mb-3 text-sm font-normal">
                      <span className="text-base">📍</span>
                      <span>{project.location}</span>
                    </div>
 
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed font-normal">
                      {project.description}
                    </p>
 
                    <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest mb-1">Starting from</p>
                        <p className="text-xl font-semibold text-primary">{project.price}</p>
                      </div>
                      <Button variant="primary" size="sm" className="py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg active:scale-95">
                        Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600 font-normal leading-relaxed">No projects found in {selectedLocation}</p>
              <Button
                variant="ghost"
                onClick={() => setSelectedLocation("all")}
                className="mt-4 text-primary font-bold hover:underline cursor-pointer text-base"
              >
                View all projects
              </Button>
            </div>
          )}
        </div>

        {/* Featured Section */}
        <div className="bg-gray-50 py-16 md:py-20 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-12 text-center leading-tight">Why Choose Our Projects</h2>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  title: "Prime Locations",
                  description: "Located in the most sought-after and developing neighborhoods",
                  icon: MapPin
                },
                {
                  title: "Quality Construction",
                  description: "Built with premium materials and highest quality standards",
                  icon: Building2
                },
                {
                  title: "Modern Amenities",
                  description: "State-of-the-art facilities and world-class amenities",
                  icon: Zap
                },
                {
                  title: "Flexible Payment",
                  description: "Easy and flexible payment plans to suit your budget",
                  icon: CreditCard
                },
                {
                  title: "Expert Support",
                  description: "Dedicated team to guide you through the entire process",
                  icon: Users
                },
                {
                  title: "Investment Returns",
                  description: "Strong appreciation potential and rental income opportunities",
                  icon: TrendingUp
                }
              ].map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-white text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-2">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-normal">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
