import AgentDashboardClient from "./AgentDashboardClient";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default function AgentDashboardPage() {
  return <AgentDashboardClient />;
}
