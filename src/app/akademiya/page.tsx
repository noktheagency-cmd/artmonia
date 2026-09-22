import { pageMetadata } from "@/lib/seo";
import AcademyPage from "@/components/AcademyPage";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export const metadata = pageMetadata("Akademiya | Artmonia Academy", "Artmonia Academy-nin interyeri, tədris yanaşması və sənət sistemi ilə tanış olun.", "/akademiya");

export default async function AcademyRoute() {
  const content = await getPublishedContent();

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <AcademyPage />
    </SiteContentProvider>
  );
}
