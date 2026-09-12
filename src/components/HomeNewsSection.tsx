"use client";

/* News images can be managed from different providers in the admin panel. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { newsItems } from "@/data/site";
import { homePageCopy } from "@/data/site-copy";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { getNewsImages, isNewsItem } from "@/lib/news";
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
  const interacting = useRef(false);
  const [paused, setPaused] = useState(false);
  const dynamicItems = useSiteContentValue("news_items", newsItems);
  const copy = useSiteContentValue("home_page_copy", homePageCopy).news;
  const items = useMemo(() => {
    const publishedItems = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : [];
    return publishedItems.slice(0, 10);
  }, [dynamicItems]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let direction = 1;
    let position = rail.scrollLeft;
    function tick(now: number) {
      if (!rail) return;
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      const max = rail.scrollWidth - rail.clientWidth;
      if (!reduced.matches && !interacting.current && !document.hidden && max > 0) {
        position += direction * elapsed * 0.025;
        if (position >= max) { position = max; direction = -1; }
        if (position <= 0) { position = 0; direction = 1; }
        rail.scrollLeft = position;
      } else { position = rail.scrollLeft; }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [items, paused]);

  function scrollRail(direction: -1 | 1) {
    setPaused(true);
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.78, behavior: "smooth" });
  }

  return (
    <section className={`${styles.section} scroll-section`} id="academy" aria-labelledby="home-news-title">
      <div className={styles.heading}>
        <div>
          <h2 id="home-news-title">{copy.title}</h2>
        </div>

        <div className={styles.headingActions}>
          <div className={styles.scrollButtons} aria-label="Xəbər relsini idarə et">
            <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Xəbər lentini davam etdir" : "Xəbər lentini dayandır"} aria-pressed={paused}>{paused ? "▶" : "Ⅱ"}</button>
            <button type="button" onClick={() => scrollRail(-1)} aria-label="Əvvəlki xəbərlər">
              <Arrow direction="left" />
            </button>
            <button type="button" onClick={() => scrollRail(1)} aria-label="Növbəti xəbərlər">
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.rail} ref={railRef} aria-label="Son yeniliklər"
        onPointerEnter={() => { interacting.current = true; }}
        onPointerLeave={() => { interacting.current = false; }}
        onFocusCapture={() => { interacting.current = true; }}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false; }}
        onTouchStart={() => setPaused(true)} onWheel={() => setPaused(true)}>
        {items.map((item, index) => {
          const image = getNewsImages(item, index)[0];
          const isResultPoster = image.includes("/assets/news-clean/");

          return (
            <Link
              className={styles.card}
              href={`/yenilikler/${encodeURIComponent(item.id)}`}
              aria-label={`${item.title} xəbərini ətraflı oxu`}
              key={item.id}
            >
              <span className={styles.image}>
                <img
                  className={`${styles.imageMain} ${isResultPoster ? styles.resultPoster : ""}`}
                  src={image}
                  alt=""
                  loading={index < 4 ? "eager" : "lazy"}
                  decoding="async"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
