import LoginClient from "./LoginClient";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LoginClient locale={locale} />;
}
