import type { Metadata } from "next";
import ApplicationWizard from "@/components/ApplicationWizard";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Müraciət et | Artmonia Academy",
  description: "Artmonia Academy proqramını seçin və ilkin konsultasiya üçün müraciət edin."
};

export default async function ApplicationPage() {
  const content = await getPublishedContent();

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <ApplicationWizard />
    </SiteContentProvider>
  );
}
