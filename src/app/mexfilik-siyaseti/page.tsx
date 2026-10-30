import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getApprovedMobilePrivacyPolicy } from "@/lib/mobile-privacy-policy";
import { managedMetadata } from "@/lib/managed-metadata";
import styles from "./policy.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const published = Boolean(await getApprovedMobilePrivacyPolicy());
  const metadata = await managedMetadata("Artmonia Mobile | Məxfilik siyasəti", "Artmonia Mobile tətbiqinin məxfilik siyasəti.", "/mexfilik-siyaseti");
  return published ? metadata : { ...metadata, robots: { index: false, follow: false }, alternates: undefined };
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
