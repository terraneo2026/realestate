"use client";

import { notFound, usePathname } from "next/navigation";
import { Navbar, Footer, PageHero } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
  image: string;
  slug: string;
}

export default function BlogDetailClient({ post, locale }: { post: BlogPost, locale: string }) {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full bg-white">
        <PageHero 
          title={post.title} 
          description={`${post.author} | ${post.date}`}
          backgroundImage={post.image}
        />
        
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
          <Link 
            href={`/${locale}/blog`}
            className="inline-flex items-center text-primary font-bold mb-8 hover:underline group"
          >
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-6 mb-10 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-primary" />
              <span>By {post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-primary" />
              <span className="capitalize">{post.category}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line font-normal">
            {post.content}
          </div>

          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Share this article</h3>
            <div className="flex gap-4">
              <Button variant="outline" size="sm">Twitter</Button>
              <Button variant="outline" size="sm">Facebook</Button>
              <Button variant="outline" size="sm">LinkedIn</Button>
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
          <section className="bg-primary text-white py-12 md:py-16 lg:py-20 rounded-[3rem] max-w-7xl mx-auto overflow-hidden relative shadow-2xl">
            <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
                Read the full article and stay updated
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Button variant="white" size="lg" className="px-10 font-black tracking-widest">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
