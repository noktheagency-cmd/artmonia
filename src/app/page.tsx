import ArtmoniaSite from "@/components/ArtmoniaSite";
import { getPublishedContent } from "@/lib/site-content";
import { pageMetadata, SITE_URL } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
import { getApprovedMobilePrivacyPolicy } from "@/lib/mobile-privacy-policy";

export const metadata = pageMetadata("Artmonia Academy | Rəsm və sənət kursları", "Akademik rəsm, rəngkarlıq, kompozisiya və portfolyo hazırlığı. Artmonia Academy proqramları, tələbə işləri və müraciət imkanları ilə tanış olun.", "/");

export default async function Home() {
  const content = await getPublishedContent();
  const privacyPolicyPublished = Boolean(await getApprovedMobilePrivacyPolicy());
  const contact = content.contact;
  const info = contact && typeof contact === "object" && !Array.isArray(contact) ? contact : {};
  return <><StructuredData data={{ "@context": "https://schema.org", "@graph": [
    { "@type": "EducationalOrganization", "@id": `${SITE_URL}/#organization`, name: "Artmonia Academy", url: SITE_URL, logo: `${SITE_URL}/assets/artmonia-logo.webp`, telephone: info.phone, email: info.email, address: info.address },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Artmonia Academy", inLanguage: "az", publisher: { "@id": `${SITE_URL}/#organization` } }
  ] }} /><ArtmoniaSite content={content} privacyPolicyPublished={privacyPolicyPublished} /></>;
}
