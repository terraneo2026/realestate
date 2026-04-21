import { redirect } from "next/navigation";

export default async function OwnerRegisterPage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  redirect(`/${locale}/register?role=owner`);
}
