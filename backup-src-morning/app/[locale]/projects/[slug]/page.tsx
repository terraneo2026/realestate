import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Sunrise Heights",
    location: "Chennai",
    image: "https://images.unsplash.com/photo-1570129477992-45a003cdd626?w=1200&h=800&fit=crop",
    description: "Premium residential complex with modern amenities and green spaces",
    price: "₹45 Lakhs",
    units: 250,
    completionDate: "Q3 2026",
    slug: "sunrise-heights",
  },
  {
    id: 2,
    name: "Marina Bay Tower",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
    description: "Luxury commercial and residential development in prime location",
    price: "₹65 Lakhs",
    units: 180,
    completionDate: "Q2 2026",
    slug: "marina-bay-tower",
  },
];

async function fetchProject(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return MOCK_PROJECTS.find(p => p.slug === slug) || null;

    const res = await fetch(`${apiUrl}get-project-details?slug=${slug}`, { cache: "no-store" });
    if (!res.ok) return MOCK_PROJECTS.find(p => p.slug === slug) || null;
    const data = await res.json();
    return data?.data || MOCK_PROJECTS.find(p => p.slug === slug) || null;
  } catch (err) {
    console.error("Failed fetching project", err);
    return MOCK_PROJECTS.find(p => p.slug === slug) || null;
  }
}

export default async function ProjectDetail({ params }: ProjectPageProps) {
  const { slug } = params;
  if (!slug) notFound();

  const project = await fetchProject(slug);
  if (!project) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 min-h-screen bg-white">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <img src={project.image} alt={project.name} className="w-full h-96 object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">📍 {project.location}</p>
          <p className="mt-4 text-gray-700">{project.description}</p>

          <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-3">Project Details</h3>
            <ul className="text-gray-700 space-y-2">
              <li><strong>Units:</strong> {project.units}</li>
              <li><strong>Starting Price:</strong> {project.price}</li>
              <li><strong>Expected Completion:</strong> {project.completionDate}</li>
            </ul>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Enquire About This Project</h3>
            <button className="w-full bg-primaryBg text-white py-3 rounded-lg font-semibold">Request Brochure</button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <p className="text-gray-600">{project.location}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
