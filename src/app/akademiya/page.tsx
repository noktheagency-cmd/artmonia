import type { Metadata } from "next";
import AcademyPage from "@/components/AcademyPage";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Akademiya | Artmonia Academy",
  description: "Artmonia Academy-nin interyeri, tədris yanaşması və sənət sistemi ilə tanış olun."
};

export default async function AcademyRoute() {
  const content = await getPublishedContent();

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <AcademyPage />
    </SiteContentProvider>
  );
}
