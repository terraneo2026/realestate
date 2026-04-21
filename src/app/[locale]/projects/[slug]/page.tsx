import { notFound } from "next/navigation";
import { Navbar, Footer, PageHero } from "@/components/layout";
import { Button } from "@/components/ui";
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  let project: any = null;

  try {
    const q = query(
      collection(firestore, 'projects'),
      where('slug', '==', slug),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      project = {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      // Try to find by document ID if no slug match
      const docRef = doc(firestore, "projects", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        project = { id: docSnap.id, ...docSnap.data() };
      }
    }
  } catch (error) {
    console.error("Error fetching project from Firestore:", error);
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <PageHero 
          title={project.name} 
          description={`${project.location} | Premium Project`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 min-h-screen bg-white">
          <div className="bg-gray-900 rounded-[2rem] shadow-xl overflow-hidden mb-8 border border-gray-100 aspect-video flex items-center justify-center">
            <img src={project.image} alt={project.name} className="max-w-full max-h-full object-contain" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span className="text-xl">📍</span> {project.location}
              </p>
              <p className="mt-4 text-gray-700 leading-relaxed font-normal">{project.description}</p>

              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Project Details</h3>
                <ul className="text-gray-700 space-y-3">
                  <li className="flex justify-between border-b pb-2"><span className="font-semibold">Units:</span> {project.units}</li>
                  <li className="flex justify-between border-b pb-2"><span className="font-semibold">Starting Budget:</span> {project.price}</li>
                  <li className="flex justify-between pb-2"><span className="font-semibold">Expected Completion:</span> {project.completionDate}</li>
                </ul>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Enquire About This Project</h3>
                <Button variant="primary" className="w-full py-3 shadow-lg">
                  Request Brochure
                </Button>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Location</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-xl">📍</span> {project.location}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
