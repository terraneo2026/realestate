import OwnerAnalyticsClient from "./OwnerAnalyticsClient";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function OwnerAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <OwnerAnalyticsClient />;
}
