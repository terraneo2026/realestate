import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import PropertyDetailClient from "./PropertyDetailClient";

export const dynamic = 'force-dynamic';

export default async function PropertyDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  return <PropertyDetailClient slug={slug} locale={locale} />;
}
