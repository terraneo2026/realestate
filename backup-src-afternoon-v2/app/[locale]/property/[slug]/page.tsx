import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyInfo from "@/components/PropertyInfo";
import AmenitiesList from "@/components/AmenitiesList";
import AgentCard from "@/components/AgentCard";

interface PropertyDetailPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

async function fetchPropertyData(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}get-property-details?slug=${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch property:", error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  const data = await fetchPropertyData(slug);

  if (!data || !data.data) {
    notFound();
  }

  const property = data.data;
  const images = property.images || [property.title_image];
  const amenities = property.amenities || [];
  const agent = property.agent || {
    name: "Agent Name",
    title: "Real Estate Agent",
    phone: "+1-234-567-8900",
    email: "agent@example.com",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 bg-white min-h-screen">
      {/* Gallery */}
      <div className="mb-12 md:mb-16">
        <PropertyGallery images={images} title={property.title} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info and Amenities */}
        <div className="lg:col-span-2 space-y-6">
          <PropertyInfo
            title={property.title}
            price={`$${property.price}`}
            location={property.city}
            type={property.property_type === "rent" ? "rent" : "sell"}
            bedrooms={property.parameters?.find((p: any) => p.name === "Bedroom")?.value}
            bathrooms={property.parameters?.find((p: any) => p.name === "Bathroom")?.value}
            area={property.parameters?.find((p: any) => p.name === "Area")?.value}
            description={property.description}
          />

          {amenities.length > 0 && (
            <AmenitiesList amenities={amenities} />
          )}
        </div>

        {/* Right Column - Agent Card and CTA */}
        <div className="space-y-6">
          <AgentCard
            name={agent.name}
            title={agent.title}
            phone={agent.phone}
            email={agent.email}
            image={agent.image}
          />

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interested?</h3>
            <button className="w-full primaryBg text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all mb-3">
              Request Tour
            </button>
            <button className="w-full border-2 border-primary primaryColor py-3 rounded-lg font-semibold hover:primaryBgLight transition-all">
              Save Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}