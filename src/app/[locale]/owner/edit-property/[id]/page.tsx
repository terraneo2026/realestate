import PropertyForm from "@/components/PropertyForm/PropertyForm";
import DashboardLayout from "@/components/DashboardLayout";

export default async function OwnerEditPropertyPage({ 
  params 
}: { 
  params: Promise<{ locale: string, id: string }> 
}) {
  const { locale, id } = await params;
  
  return (
    <DashboardLayout userRole="owner">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase">Edit Listing</h1>
        <p className="text-gray-500 mt-2 font-bold tracking-tight uppercase text-[10px]">Update your property details and configuration</p>
      </div>
      <PropertyForm propertyId={id} />
    </DashboardLayout>
  );
}
