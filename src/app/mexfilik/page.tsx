import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { pageMetadata } from "@/lib/seo";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  ...pageMetadata(
    "Məxfilik siyasəti | Artmonia Academy",
    "Artmonia Academy-nin məxfilik siyasəti və məlumatların emalı ilə bağlı əlaqə məlumatları.",
    "/mexfilik",
  ),
  // The supplied reference contains draft copy, not a final privacy policy.
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function PrivacyPage() {
  return (
    <div className={styles.shell}>
      <SiteHeader />
      <main className={styles.page}>
        <article className={styles.article} aria-labelledby="privacy-title">
          <header className={styles.intro}>
            <p className={styles.eyebrow}>Hüquqi məlumat</p>
            <h1 id="privacy-title">Məxfilik siyasəti</h1>
            <p className={styles.description}>
              Bu səhifənin yekun hüquqi mətni təsdiqləndikdən sonra əlavə olunacaq.
              Aşağıdakı bölmələr məzmun strukturunu göstərir.
            </p>
          </header>
          <div className={styles.sections}>
            <section aria-labelledby="privacy-data">
              <h2 id="privacy-data">Hansı məlumatlar işlənir</h2>
              <p>
                Hesab, satınalma və kurs progressi ilə bağlı məlumatların
                toplanması və istifadəsi burada izah ediləcək.
              </p>
            </section>
            <section aria-labelledby="privacy-payment">
              <h2 id="privacy-payment">Ödəniş və təhlükəsizlik</h2>
              <p>
                Ödəniş məlumatlarının emalı, saxlanması və təhlükəsizlik
                tədbirləri təsvir ediləcək.
              </p>
            </section>
            <section aria-labelledby="privacy-contact">
              <h2 id="privacy-contact">Əlaqə</h2>
              <p>
                Suallar üçün: <a href="mailto:info@artmoniya.com">info@artmoniya.com</a>
              </p>
            </section>
          </div>
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
