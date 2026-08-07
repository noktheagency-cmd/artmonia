"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { academyPageCopy, globalCopy } from "@/data/site-copy";
import styles from "./AcademyPage.module.css";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function AcademyPage() {
  const copy = useSiteContentValue("academy_page_copy", academyPageCopy);
  const global = useSiteContentValue("global_copy", globalCopy);

  return (
    <main className={styles.page}>
      <section className={styles.interior} id="interyer" aria-labelledby="academy-title">
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.interiorShell}>
          <header className={styles.titleBlock}>
            <h1 id="academy-title">{copy.pageTitle}</h1>
            <span className={styles.titleStroke} aria-hidden="true" />
          </header>

          <div className={styles.interiorCopy}>
            <h2>{copy.interiorTitle}</h2>
            <p className={styles.sectionLead}>{copy.interiorLead}</p>
            <p className={styles.bodyCopy}>{copy.interiorText}</p>
          </div>

          <figure className={styles.roomFigure}>
            <Image
              src="/assets/studio-room.webp"
              alt="Artmonia Academy-nin gün işıqlı, molbertli studiya interyeri"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 58vw"
            />
            <figcaption>{copy.roomCaption}</figcaption>
          </figure>

          <figure className={styles.brushFigure}>
            <Image
              src="/assets/studio-brushes.webp"
              alt="Artmonia studiyasındakı rəngli peşəkar fırçalar"
              fill
              sizes="(max-width: 760px) 88vw, 32vw"
            />
          </figure>

          <div className={styles.studioDetails} aria-label="Studiyanın imkanları">
            {copy.studioDetails.map((item) => (
              <div key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.interiorNarrative}>
            <h3>{copy.narrativeTitle}</h3>
            <div>
              {copy.narrativeParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

          <svg className={styles.gestureLine} aria-hidden="true" viewBox="0 0 320 90" preserveAspectRatio="none">
            <path d="M3 66C77 18 118 79 177 42C225 12 259 25 317 57" />
          </svg>
        </div>
      </section>

      <section className={styles.about} id="haqqimizda" aria-labelledby="about-title">
        <div className={styles.aboutShell}>
          <div className={styles.aboutCopy}>
            <h2 id="about-title">{copy.aboutTitle}</h2>
            <p className={styles.aboutLead}>{copy.aboutLead}</p>
            <p className={styles.aboutStatement}>{copy.aboutStatement}</p>
            <div className={styles.aboutText}>
              {copy.aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>

            <div className={styles.principles}>
              <h3>{copy.principlesTitle}</h3>
              {copy.principles.map((item) => (
                <div key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>

            <Link className={styles.aboutCta} href="/muraciet">
              {copy.applicationCta} <ArrowIcon />
            </Link>
          </div>

          <figure className={styles.aboutFigure}>
            <Image
              src="/assets/about-art-system.webp"
              alt="Artmonia Academy-də klassik heykəl üzərində akademik rəsm çəkən tələbə"
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
            />
          </figure>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>{global.copyright}</span>
        <div>
          <Link href="/akademiya#interyer">{copy.footerLinks[0]}</Link>
          <Link href="/akademiya#haqqimizda">{copy.footerLinks[1]}</Link>
          <Link href="/">{copy.footerLinks[2]}</Link>
        </div>
      </footer>
    </main>
  );
}
