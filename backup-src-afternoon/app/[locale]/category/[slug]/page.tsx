import { notFound } from "next/navigation";
import PropertyList from "@/components/PropertyList";

interface CategoryDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 capitalize">
        {slug.replace(/-/g, " ")}
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-10 md:mb-12">
        Browse all properties in the {slug.replace(/-/g, " ")} category
      </p>

      <PropertyList />
    </div>
  );
}
