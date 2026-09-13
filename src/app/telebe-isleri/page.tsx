import type { Metadata } from "next";
import HomeStudentWorks from "@/components/HomeStudentWorks";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Tələbə işləri | Artmonia Academy" };

export default async function StudentWorksPage() {
  const content = await getPublishedContent();
  return <SiteContentProvider content={content}><SiteHeader /><main><HomeStudentWorks archive /></main></SiteContentProvider>;
}
