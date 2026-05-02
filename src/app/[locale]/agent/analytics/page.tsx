import AgentAnalyticsClient from "./AgentAnalyticsClient";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function AgentAnalyticsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <AgentAnalyticsClient />;
}
