"use client";

import Image from "next/image";
import Link from "next/link";
import { useResultAos } from "@/components/useResultAos";
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
  const interiorImages = media.images.filter(Boolean);
  const aosKey = [copy.pageTitle, copy.interiorTitle, copy.aboutTitle, copy.aboutParagraphs.length, copy.principles.length, interiorImages.length].join("|");
  const pageRef = useResultAos<HTMLElement>(aosKey);

  return (
    <main className={styles.page} ref={pageRef}>
      <section className={styles.interior} id="interyer" aria-labelledby="academy-title">
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.galleryShell}>
          <div className={styles.interiorFeature}>
            {reelId && <div className={`${styles.videoCrop} ${styles.aosTarget}`} data-aos="fade-right">
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
          <header className={`${styles.galleryHeading} ${styles.aosTarget}`} data-aos="fade-up">
            <h1 id="academy-title">{copy.pageTitle} · {copy.interiorTitle}</h1>
            <p className={styles.sectionLead}>{copy.interiorLead}</p>
            <p className={styles.galleryIntro}>{copy.interiorText}</p>
          </header>
          </div>
          <div className={`${styles.galleryRail} ${styles.aosTarget}`} data-aos="fade-up" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="İnteryer qalereyası">
            <div className={styles.galleryTrack}>
              {[0, 1].map((groupIndex) => (
                <div className={styles.galleryGroup} key={groupIndex} aria-hidden={groupIndex === 1}>
                  {interiorImages.map((image, index) => (
                    <figure className={styles.galleryCard} key={`${groupIndex}-${image}-${index}`}>
                      <div className={styles.galleryImage}>
                        <Image src={image} alt={groupIndex === 0 ? `${copy.interiorTitle} — ${index + 1}` : ""} fill priority={groupIndex === 0 && index === 0} sizes="(max-width: 480px) 80vw, (max-width: 760px) 50vw, 25vw" />
                      </div>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.about} id="haqqimizda" aria-labelledby="about-title">
        <div className={styles.aboutShell}>
          <div className={`${styles.aboutCopy} ${styles.aosTarget}`} data-aos="fade-right">
            <p className={styles.aboutEyebrow}>ARTMONIA ACADEMY</p>
            <h2 id="about-title">{copy.aboutTitle}</h2>
            <p className={styles.aboutLead}>{copy.aboutLead}</p>
            <Link className={styles.aboutCta} href="/muraciet">
              {copy.applicationCta} <ArrowIcon />
            </Link>
          </div>

          <figure className={`${styles.aboutFigure} ${styles.aosTarget}`} data-aos="fade-left">
            <Image
              src="/assets/about-art-system.webp"
              alt="Artmonia Academy-də klassik heykəl üzərində akademik rəsm çəkən tələbə"
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
            />
          </figure>

          <div className={`${styles.aboutDetailsContent} ${styles.aosTarget}`} data-aos="fade-up">
            <div className={styles.aboutEditorial}>
              <p className={styles.aboutStatement}>{copy.aboutStatement}</p>
              <div className={styles.aboutText}>
                {copy.aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
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
          </div>
        </div>
      </section>

      <footer className={`${styles.footer} ${styles.aosTarget}`} data-aos="fade-up">
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
