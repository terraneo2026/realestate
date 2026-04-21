import TenantDashboardClient from "./TenantDashboardClient";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default function TenantDashboardPage() {
  return <TenantDashboardClient />;
}
