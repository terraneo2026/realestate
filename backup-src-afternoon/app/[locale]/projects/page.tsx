"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Loader from "@/components/Loader";

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
    image: "https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=600&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1460932960985-90a2e59df800?w=600&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1502672527689-408aa28e3a19?w=600&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1535576661393-b8e8a40ae803?w=600&h=400&fit=crop",
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiUrl) {
          console.warn("API URL not configured, using mock data");
          setProjects(MOCK_PROJECTS);
          return;
        }

        const response = await fetch(`${apiUrl}get-projects`, {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(data.data && data.data.length > 0 ? data.data : MOCK_PROJECTS);
        } else {
          console.warn("API returned status:", response.status, "using mock data");
          setProjects(MOCK_PROJECTS);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(null);
        // Use mock data as fallback
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primaryBg to-teal-600 text-white py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Real Estate Projects</h1>
          <p className="text-lg opacity-90">Discover premium residential and commercial projects</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        {/* Location Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Filter by Location</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {locations.map(location => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer capitalize ${
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
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-64 bg-gray-200">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-primaryBg text-white px-4 py-2 rounded-full text-sm font-bold">
                    {project.units} Units
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primaryBg transition">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <span className="text-lg">📍</span>
                    <span>{project.location}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="border-t pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Starting from</p>
                      <p className="text-2xl font-bold text-primaryBg">{project.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Completion</p>
                      <p className="text-sm font-semibold text-gray-800">{project.completionDate}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No projects found in {selectedLocation}</p>
            <button
              onClick={() => setSelectedLocation("all")}
              className="mt-4 text-primaryBg font-bold hover:underline cursor-pointer"
            >
              View all projects
            </button>
          </div>
        )}
      </div>

      {/* Featured Section */}
      <div className="bg-gray-50 py-16 md:py-20 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Projects</h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Prime Locations",
                description: "Located in the most sought-after and developing neighborhoods"
              },
              {
                title: "Quality Construction",
                description: "Built with premium materials and highest quality standards"
              },
              {
                title: "Modern Amenities",
                description: "State-of-the-art facilities and world-class amenities"
              },
              {
                title: "Flexible Payment",
                description: "Easy and flexible payment plans to suit your budget"
              },
              {
                title: "Expert Support",
                description: "Dedicated team to guide you through the entire process"
              },
              {
                title: "Investment Returns",
                description: "Strong appreciation potential and rental income opportunities"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primaryBg text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
