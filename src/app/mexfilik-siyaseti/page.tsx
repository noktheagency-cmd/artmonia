import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getApprovedMobilePrivacyPolicy } from "@/lib/mobile-privacy-policy";
import styles from "./policy.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const published = Boolean(await getApprovedMobilePrivacyPolicy());
  return {
    title: "Artmonia Mobile | Məxfilik siyasəti",
    description: "Artmonia Mobile tətbiqinin məxfilik siyasəti.",
    robots: { index: published, follow: published },
    alternates: published ? { canonical: "/mexfilik-siyaseti" } : undefined,
  };
}

export default async function MobilePrivacyPolicyPage() {
  const policy = await getApprovedMobilePrivacyPolicy();
  if (!policy) notFound();

  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <Markdown>{policy}</Markdown>
      </article>
    </main>
  );
}
