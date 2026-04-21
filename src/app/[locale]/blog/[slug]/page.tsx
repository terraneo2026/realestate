import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";

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

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Top 10 Tips for First-Time Home Buyers",
    content: `
      Buying your first home is one of the most significant milestones in life. However, the process can be overwhelming without the right guidance. Here are our top 10 tips to ensure a smooth journey:
      
      1. Get Your Finances in Order: Before you start looking, know your budget and credit score.
      2. Save for a Down Payment: Aim for at least 20% to avoid private mortgage insurance.
      3. Get Pre-Approved: A pre-approval letter makes you a serious buyer in the eyes of sellers.
      4. List Your Must-Haves: Distinguish between what you need and what you want.
      5. Research Neighborhoods: Look into safety, schools, and future development plans.
      6. Don't Skip the Home Inspection: Always know what you're buying.
      7. Consider Future Resale Value: Think about how easy it will be to sell the home later.
      8. Work with a Professional Agent: Their expertise is invaluable.
      9. Be Prepared for Closing Costs: These can add up to 2-5% of the purchase price.
      10. Stay Within Your Budget: Don't let emotions drive you into a debt you can't manage.
    `,
    category: "buying",
    date: "April 5, 2026",
    author: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=800&fit=crop",
    slug: "first-time-home-buyers"
  },
  {
    id: 2,
    title: "Understanding Real Estate Market Trends",
    content: `
      The real estate market is constantly evolving. Understanding these trends is crucial for both buyers and investors. 
      
      Currently, we are seeing a shift towards sustainable and energy-efficient homes. Buyers are increasingly looking for properties with solar panels, smart home technology, and high-quality insulation. 
      
      Another major trend is the rise of suburban living. With the increase in remote work, many families are moving away from city centers in search of more space and lower costs.
    `,
    category: "investment",
    date: "April 3, 2026",
    author: "Michael Chen",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    slug: "market-trends"
  },
  {
    id: 3,
    title: "How to Stage Your Home for Lease",
    content: `
      First impressions are everything when it comes to leasing your property. Professional staging can help potential tenants visualize themselves living in the space.
      
      Start by decluttering and depersonalizing. Remove excess furniture and personal items like family photos. A clean, neutral palette is more appealing to a wider range of people.
      
      Don't forget curb appeal. The exterior of your home is the first thing people see. Simple tasks like mowing the lawn and adding a few potted plants can make a huge difference.
    `,
    category: "selling",
    date: "April 1, 2026",
    author: "Emily Watson",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop",
    slug: "home-staging"
  }
];

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    locale: 'en',
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;

  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} locale={locale} />;
}
