import OwnerDashboardClient from "./OwnerDashboardClient";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default function OwnerDashboardPage() {
  return <OwnerDashboardClient />;
}
