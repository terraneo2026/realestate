"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}

export default function BlogClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const pathname = usePathname();
  const locale = pathname ? (pathname.split('/')[1] || 'en') : 'en';

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Top 10 Tips for First-Time Home Buyers",
      excerpt: "Discover essential tips and tricks to make your first home buying experience smooth and successful.",
      category: "buying",
      date: "April 5, 2026",
      author: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop",
      slug: "first-time-home-buyers"
    },
    {
      id: 2,
      title: "Understanding Real Estate Market Trends",
      excerpt: "Learn how to analyze market trends and make data-driven decisions in real estate investments.",
      category: "investment",
      date: "April 3, 2026",
      author: "Michael Chen",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      slug: "market-trends"
    },
    {
      id: 3,
      title: "How to Stage Your Home for Lease",
      excerpt: "Expert guidance on preparing your property to attract buyers and maximize your selling price.",
      category: "selling",
      date: "April 1, 2026",
      author: "Emily Watson",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
      slug: "home-staging"
    },
    {
      id: 4,
      title: "Rental Property Management Best Practices",
      excerpt: "Complete guide to managing rental properties efficiently and maximizing your rental income.",
      category: "renting",
      date: "March 28, 2026",
      author: "David Smith",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
      slug: "rental-management"
    },
    {
      id: 5,
      title: "Investment Properties in Emerging Markets",
      excerpt: "Explore opportunities in up-and-coming neighborhoods and emerging real estate markets.",
      category: "investment",
      date: "March 25, 2026",
      author: "Lisa Anderson",
      image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&h=400&fit=crop",
      slug: "emerging-markets"
    },
    {
      id: 6,
      title: "Negotiation Strategies for Property Deals",
      excerpt: "Master the art of negotiation and secure the best possible deal for your property transaction.",
      category: "buying",
      date: "March 22, 2026",
      author: "Robert Brown",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
      slug: "negotiation-tips"
    }
  ];

  const categories = ["all", "buying", "selling", "renting", "investment"];

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primaryBg to-teal-600 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Relocate Blog</h1>
            <p className="text-lg opacity-90">Expert Insights and Tips on Real Estate, Investment & Property Management</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="mb-12 sticky top-[112px] z-30 bg-white/90 backdrop-blur-md py-6 border-b border-gray-100 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filter by Category</h2>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 capitalize border-2 shadow-sm ${
                      selectedCategory === category
                        ? "bg-primary text-white border-primary scale-105 shadow-primary/20"
                        : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {category === "all" ? "All Posts" : category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map(post => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition"
                >
                  {/* Image */}
                  <div className="overflow-hidden h-48 bg-gray-200">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-teal-100 text-primaryBg text-xs font-semibold rounded-full capitalize">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primaryBg transition line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs font-medium text-gray-600">By {post.author}</span>
                      <span className="text-primaryBg font-bold group-hover:translate-x-2 transition">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No posts found in this category.</p>
              </div>
            )}

            {/* CTA Section */}
            <section className="bg-primary text-white py-16 md:py-20 rounded-[3rem] mx-4 md:mx-8 mb-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
              
              <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight">
                  Ready to find your perfect property?
                </h2>
                <p className="text-white/80 font-bold text-xs tracking-widest mb-10 leading-relaxed">
                  Join thousands of satisfied tenants and owners on India's most trusted rental platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href={`/${locale}/properties`}>
                    <Button variant="white" size="lg" className="w-full sm:w-auto shadow-xl shadow-black/10">
                      Browse Properties
                    </Button>
                  </Link>
                  <Link href={`/${locale}/contact`}>
                    <Button variant="white-outline" size="lg" className="w-full sm:w-auto backdrop-blur-sm">
                      Contact Our Team
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Newsletter Signup */}
            <section className="bg-gray-50 py-16 md:py-20 rounded-[3rem] mx-4 md:mx-8 mb-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Stay Updated with Real Estate Insights</h2>
                <p className="text-lg text-gray-600 mb-6">Subscribe to our newsletter and get expert tips delivered to your inbox every week.</p>
                
                <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for subscribing!");
                }}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none border border-gray-200"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition whitespace-nowrap shadow-lg shadow-primary/20"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
