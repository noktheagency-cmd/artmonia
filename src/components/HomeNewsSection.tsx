"use client";

/* News images can be managed from different providers in the admin panel. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useRef } from "react";
import { newsItems } from "@/data/site";
import { homePageCopy } from "@/data/site-copy";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { formatNewsDate, getNewsImages, isNewsItem, mergeNewsItems } from "@/lib/news";
import styles from "./HomeNewsSection.module.css";

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      className={direction === "left" ? styles.arrowLeft : undefined}
      viewBox="0 0 24 24"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function HomeNewsSection() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const dynamicItems = useSiteContentValue("news_items", newsItems);
  const copy = useSiteContentValue("home_page_copy", homePageCopy).news;
  const items = useMemo(() => {
    const publishedItems = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : [];
    return mergeNewsItems(publishedItems, newsItems, 10);
  }, [dynamicItems]);

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.78, behavior: "smooth" });
  }

  return (
    <section className={`${styles.section} scroll-section`} id="academy" aria-labelledby="home-news-title">
      <div className={styles.heading}>
        <div>
          <h2 id="home-news-title">{copy.title}</h2>
          <span aria-hidden="true" />
          <p>{copy.subtitle}</p>
        </div>

        <div className={styles.headingActions}>
          <Link href="/yenilikler">{copy.allLink}</Link>
          <span>{String(items.length).padStart(2, "0")} {copy.countSuffix}</span>
          <div className={styles.scrollButtons} aria-label="Xəbər relsini idarə et">
            <button type="button" onClick={() => scrollRail(-1)} aria-label="Əvvəlki xəbərlər">
              <Arrow direction="left" />
            </button>
            <button type="button" onClick={() => scrollRail(1)} aria-label="Növbəti xəbərlər">
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.rail} ref={railRef} aria-label="Son yeniliklər">
        {items.map((item, index) => {
          const image = getNewsImages(item, index)[0];

          return (
            <Link
              className={styles.card}
              href={`/yenilikler/${encodeURIComponent(item.id)}`}
              aria-label={`${item.title} xəbərini ətraflı oxu`}
              key={item.id}
            >
              <span className={styles.image}>
                <img src={image} alt="" loading={index < 4 ? "eager" : "lazy"} decoding="async" />
              </span>
              <span className={styles.content}>
                <span className={styles.meta}>
                  <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                  <b>{item.category}</b>
                </span>
                <strong>{item.title}</strong>
                <i aria-hidden="true" />
                <span className={styles.excerpt}>{item.excerpt}</span>
                <span className={styles.readMore}>
                  {copy.readMore}
                  <Arrow />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
