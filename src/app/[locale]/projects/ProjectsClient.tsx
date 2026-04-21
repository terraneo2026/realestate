"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar, Footer, PageHero } from "@/components/layout";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui";
import { MapPin, Building2, Sparkles, CreditCard, Headset, TrendingUp } from "lucide-react";
import { firestore } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Project {
  id: string | number;
  name: string;
  location: string;
  image: string;
  description: string;
  price: string;
  units: number;
  completionDate: string;
  slug: string;
}

export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const querySnapshot = await getDocs(collection(firestore, "projects"));
        const list: Project[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Project));
        
        setProjects(list);
      } catch (error) {
        console.error("Error fetching projects from Firestore:", error);
        setError(null);
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
          backgroundImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
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
                  href={`/${locale}/projects/${project.slug}`}
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
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors tracking-tight">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-6">
                      <MapPin size={18} className="text-primary" />
                      <span className="text-sm font-bold tracking-wide">{project.location}</span>
                    </div>
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
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
                  icon: Sparkles
                },
                {
                  title: "Flexible Payment",
                  description: "Easy and flexible payment plans to suit your budget",
                  icon: CreditCard
                },
                {
                  title: "Expert Support",
                  description: "Dedicated team to guide you through the entire process",
                  icon: Headset
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
