import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { onlinePrivacyPolicy as policy } from "@/lib/online-privacy-policy";
import { pageMetadata } from "@/lib/seo";
import styles from "./privacy.module.css";

export const metadata: Metadata = pageMetadata(
  "Məxfilik siyasəti | Artmonia Academy",
  "Artmonia onlayn kurslarında hesab, tədris məlumatları, saxlanma, məxfilik və hesabın silinməsi qaydaları.",
  "/mexfilik",
);

export default function PrivacyPage() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.page}>
        <article className={styles.article} aria-labelledby="privacy-title">
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Məxfilik və məlumatlarınız</p>
            <h1 id="privacy-title">Məxfilik siyasəti</h1>
            <p className={styles.description}>{policy.introduction}</p>
            <p className={styles.updated}>Son yenilənmə: <time dateTime={policy.updatedAt}>{policy.updatedLabel}</time></p>
          </header>
          <nav className={styles.contents} aria-label="Məxfilik siyasətinin bölmələri">
            <p>Bu səhifədə</p>
            <ol>
              {policy.sections.map((section) => (
                <li key={section.id}><a href={"#" + section.id}>{section.title.replace(/^\d+\. /, "")}</a></li>
              ))}
            </ol>
          </nav>
          <div className={styles.sections}>
            {policy.sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

              </section>
            ))}
          </div>
          <aside className={styles.contact} aria-label="Məxfilik üzrə əlaqə">
            <h2>Məlumatlarınızla bağlı sualınız var?</h2>
            <p><a href="mailto:info@artmoniya.com">info@artmoniya.com</a></p>
            <p><a href="mailto:artmoniaacademy@gmail.com">artmoniaacademy@gmail.com</a></p>
          </aside>
        </article>
      </main>
      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Artmonia Academy</span>
        <Link href="/">Ana səhifə</Link>
        <span>Yaradıcı yolun buradan başlayır.</span>
      </footer>
    </div>
  );
}
