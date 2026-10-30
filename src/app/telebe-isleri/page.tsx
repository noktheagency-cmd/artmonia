import { managedMetadata } from "@/lib/managed-metadata";

import HomeStudentWorks from "@/components/HomeStudentWorks";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export async function generateMetadata() { return managedMetadata("Tələbə işləri | Artmonia Academy", "Artmonia Academy tələbələrinin rəsm, portret və rəngkarlıq işləri ilə tanış olun.", "/telebe-isleri"); }

export default async function StudentWorksPage() {
  const content = await getPublishedContent();
  return <SiteContentProvider content={content}><SiteHeader /><main><HomeStudentWorks archive /></main></SiteContentProvider>;
}
