"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { academyPageCopy, globalCopy } from "@/data/site-copy";
import styles from "./AcademyPage.module.css";
import { interiorMedia } from "@/data/interior-media";

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
  const media = useSiteContentValue("interior_media", interiorMedia);
  const reelId = media.reelUrl?.match(/^https:\/\/(?:www\.)?instagram\.com\/reel\/([\w-]+)\/?(?:[?#].*)?$/)?.[1];
  const railRef = useRef<HTMLDivElement>(null);
  const scrollGallery = (direction: number) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: direction * rail.clientWidth * 0.8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <main className={styles.page}>
      <section className={styles.interior} id="interyer" aria-labelledby="academy-title">
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.galleryShell}>
          <div className={styles.interiorFeature}>
            {reelId && <div className={styles.videoCrop}>
              <div className={styles.videoStage}>
                <iframe
                  src={`https://www.instagram.com/reel/${reelId}/embed/`}
                  title="Artmonia interyer videosu — Instagram"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>}
          <header className={styles.galleryHeading}>
            <h1 id="academy-title">{copy.pageTitle} · {copy.interiorTitle}</h1>
            <p className={styles.sectionLead}>{copy.interiorLead}</p>
            <p className={styles.galleryIntro}>{copy.interiorText}</p>
          </header>
          </div>
          <div className={styles.galleryControls} aria-label="İnteryer qalereyasını idarə et">
            <button type="button" onClick={() => scrollGallery(-1)} aria-label="Əvvəlki şəkil"><span className={styles.previousArrow}><ArrowIcon /></span></button>
            <button type="button" onClick={() => scrollGallery(1)} aria-label="Növbəti şəkil"><ArrowIcon /></button>
          </div>
          <div className={styles.galleryRail} ref={railRef} tabIndex={0} role="region" aria-label="İnteryer şəkilləri — üfüqi sürüşdürün">
            {media.images.filter(Boolean).map((image, index) => (
              <figure className={styles.galleryCard} key={`${image}-${index}`}>
                <div className={styles.galleryImage}>
                  <Image src={image} alt={`${copy.interiorTitle} — ${index + 1}`} fill priority={index === 0} sizes="(max-width: 480px) 80vw, (max-width: 760px) 50vw, 25vw" />
                </div>
              </figure>
            ))}
          </div>
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
