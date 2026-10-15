import type { Metadata } from "next";
import ArtmoniaSite from "@/components/ArtmoniaSite";
import MoniDemoAssistant from "@/components/moni/MoniDemoAssistant";
import { getPublishedContent } from "@/lib/site-content";
import { getApprovedMobilePrivacyPolicy } from "@/lib/mobile-privacy-policy";
import { toMoniCatalog } from "@/lib/moni-demo";

export const metadata: Metadata = {
  title: "Moni ilə sənət yolun | Artmonia Demo",
  description: "Artmonianın Moni maskotu ilə interaktiv sənət yolu prototipi.",
  robots: { index: false, follow: false }
};

export default async function MoniDemoPage() {
  const [content, policy] = await Promise.all([getPublishedContent(), getApprovedMobilePrivacyPolicy()]);
  return (
    <>
      <ArtmoniaSite content={content} privacyPolicyPublished={Boolean(policy)} />
      <MoniDemoAssistant catalog={toMoniCatalog(content.courses)} />
    </>
  );
}
