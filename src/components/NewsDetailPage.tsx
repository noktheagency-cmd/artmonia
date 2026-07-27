/* News images can be managed from different providers in the admin panel. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import type { NewsItem } from "@/data/site";
import type { SiteContentMap } from "@/lib/site-content";
import { formatNewsDate, getNewsImages } from "@/lib/news";
import styles from "./NewsDetailPage.module.css";

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className={direction === "left" ? styles.arrowLeft : undefined} viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function NewsDetailPage({
  content,
  item,
  itemIndex,
  nextItem
}: {
  content: SiteContentMap;
  item: NewsItem;
  itemIndex: number;
  nextItem?: NewsItem;
}) {
  const images = getNewsImages(item, itemIndex);

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <main className={styles.page}>
        <article className={styles.article}>
          <Link className={styles.backLink} href="/yenilikler">
            <Arrow direction="left" />
            Yeniliklərə qayıt
          </Link>

          <header className={styles.header}>
            <div className={styles.meta}>
              <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
              <span>{item.category}</span>
            </div>
            <h1>{item.title}</h1>
            <p>{item.excerpt}</p>
          </header>

          <div className={`${styles.gallery} ${images.length === 1 ? styles.singleImage : ""}`} aria-label={`${item.title} foto qalereyası`}>
            {images.map((image, index) => (
              <figure className={index === 0 ? styles.primaryImage : undefined} key={`${image}-${index}`}>
                <img src={image} alt={`${item.title} — şəkil ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} />
              </figure>
            ))}
          </div>

          <div className={styles.body}>
            {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <footer className={styles.articleFooter}>
            <Link href="/yenilikler">
              Bütün yeniliklər
              <Arrow />
            </Link>
            {nextItem ? (
              <Link className={styles.nextStory} href={`/yenilikler/${encodeURIComponent(nextItem.id)}`}>
                <span>Növbəti xəbər</span>
                <strong>{nextItem.title}</strong>
                <Arrow />
              </Link>
            ) : null}
          </footer>
        </article>
      </main>
      <footer className={styles.siteFooter}>© 2026 Artmonia Academy</footer>
    </SiteContentProvider>
  );
}
