import { pageMetadata } from "@/lib/seo";
import ApplicationWizard from "@/components/ApplicationWizard";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export const metadata = pageMetadata("Müraciət et | Artmonia Academy", "Artmonia Academy proqramını seçin və ilkin konsultasiya üçün müraciət edin.", "/muraciet");

export default async function ApplicationPage() {
  const content = await getPublishedContent();

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <ApplicationWizard />
    </SiteContentProvider>
  );
}
