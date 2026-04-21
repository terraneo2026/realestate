import PropertyForm from "@/components/PropertyForm/PropertyForm";
import DashboardLayout from "@/components/DashboardLayout";

export default async function OwnerAddPropertyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  return (
    <DashboardLayout userRole="owner">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">List Property</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Reach thousands of verified tenants instantly</p>
      </div>
      <PropertyForm />
    </DashboardLayout>
  );
}
