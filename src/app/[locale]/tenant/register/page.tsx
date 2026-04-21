import { redirect } from "next/navigation";

export default async function TenantRegisterPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  redirect(`/${locale}/register?role=tenant`);
}
