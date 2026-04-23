import LoginClient from "../../login/LoginClient";

export default async function TenantLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LoginClient locale={locale} role="tenant" />;
}
