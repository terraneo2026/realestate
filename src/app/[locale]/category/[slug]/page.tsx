import { notFound } from "next/navigation";
import PropertyList from "@/components/PropertyList";
import { Navbar, Footer, PageHero } from "@/components/layout";
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function generateStaticParams() {
  try {
    const querySnapshot = await getDocs(collection(firestore, "categories"));
    return querySnapshot.docs.map((doc) => ({
      locale: 'en',
      slug: (doc.data().category || doc.data().name || "").toLowerCase().replace(/\s+/g, "-") || doc.id,
    }));
  } catch (error) {
    console.error("Error generating static params for categories:", error);
    return [];
  }
}

interface CategoryDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <PageHero 
          title={slug.replace(/-/g, " ")} 
          description={`Browse all properties in the ${slug.replace(/-/g, " ")} category`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
          <PropertyList categorySlug={slug} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
