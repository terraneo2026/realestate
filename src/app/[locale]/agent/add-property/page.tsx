import PropertyForm from "@/components/PropertyForm/PropertyForm";
import DashboardLayout from "@/components/DashboardLayout";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function AgentAddListingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <DashboardLayout userRole="agent">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">List Property</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Reach thousands of verified tenants instantly</p>
      </div>
      <PropertyForm />
    </DashboardLayout>
  );
}
