"use client";

/* News images can be managed from different providers in the admin panel. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { newsItems } from "@/data/site";
import { homePageCopy } from "@/data/site-copy";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { getNewsImages, isNewsItem } from "@/lib/news";
import { canOptimizeImage } from "@/lib/image-optimization";
import { useResultAos } from "./useResultAos";
import styles from "./HomeNewsSection.module.css";

const NEWS_SCROLL_SPEED = 55; // Pixels per second.

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function HomeNewsSection() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const dynamicItems = useSiteContentValue("news_items", newsItems);
  const copy = useSiteContentValue("home_page_copy", homePageCopy).news;
  const items = useMemo(() => {
    const publishedItems = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : [];
    // Legacy entries have no creation timestamp and retain their existing newest-first order.
    const createdTime = (item: (typeof publishedItems)[number]) => {
      const time = item.createdAt ? Date.parse(item.createdAt) : 0;
      return Number.isFinite(time) ? time : 0;
    };
    return publishedItems.sort((a, b) => createdTime(b) - createdTime(a));
  }, [dynamicItems]);
  const canRotate = items.length > 1;
  const cycleItems = canRotate ? Array.from({ length: Math.ceil(5 / items.length) }, () => items).flat() : items;
  const loopItems = canRotate ? [...cycleItems, ...cycleItems] : cycleItems;
  const sectionRef = useResultAos<HTMLElement>(items.map((item) => item.id).join("|"));

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !canRotate || paused) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let touching = false;
    let visible = !("IntersectionObserver" in window);
    const touchStart = () => { touching = true; };
    const touchEnd = () => { touching = false; };
    rail.addEventListener("touchstart", touchStart, { passive: true });
    rail.addEventListener("touchend", touchEnd, { passive: true });
    rail.addEventListener("touchcancel", touchEnd, { passive: true });

    const first = rail.children[0];
    const repeat = rail.children[cycleItems.length];
    let cycle = 0;
    const measureCycle = () => {
      cycle = repeat.getBoundingClientRect().left - first.getBoundingClientRect().left;
    };
    measureCycle();
    const resizeObserver = new ResizeObserver(measureCycle);
    resizeObserver.observe(rail);

    let frame = 0;
    let previousTime: number | undefined;
    let position = rail.scrollLeft;
    let lastScrollLeft = position;
    const tick = (time: number) => {
      if (cycle <= 0 || !visible || reduced.matches || document.hidden || touching || rail.contains(document.activeElement)) {
        previousTime = undefined;
      } else {
        const scrollLeft = rail.scrollLeft;
        if (scrollLeft !== lastScrollLeft) position = scrollLeft;
        const elapsed = Math.min(time - (previousTime ?? time), 50);
        position = (position + NEWS_SCROLL_SPEED * elapsed / 1000) % cycle;
        rail.scrollLeft = position;
        lastScrollLeft = rail.scrollLeft;
        previousTime = time;
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const visibilityObserver = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }) : null;
    visibilityObserver?.observe(rail);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
      rail.removeEventListener("touchstart", touchStart);
      rail.removeEventListener("touchend", touchEnd);
      rail.removeEventListener("touchcancel", touchEnd);
    };
  }, [canRotate, cycleItems.length, paused]);

  return (
    <section ref={sectionRef} className={`${styles.section} scroll-section`} id="academy" aria-labelledby="home-news-title">
      <div className={`${styles.heading} ${styles.aosTarget}`} data-aos="fade-up">
        <div>
          <h2 id="home-news-title">{copy.title}</h2>
        </div>
        {canRotate && (
          <button type="button" className={styles.rotationControl} onClick={() => setPaused(!paused)}>
            {paused ? "Davam et" : "Dayandır"}
          </button>
        )}
      </div>

      <div className={styles.rail} ref={railRef} aria-label="Son yeniliklər">
        {loopItems.map((item, index) => {
          const image = getNewsImages(item, index % items.length)[0];
          const isResultPoster = image.includes("/assets/news-clean/");

          return (
            <Link
              className={styles.card}
              data-variant={(index % cycleItems.length) % 4}
              href={`/yenilikler/${encodeURIComponent(item.id)}`}
              aria-label={`${item.title} xəbərini ətraflı oxu`}
              key={`${item.id}-${index}`}
              aria-hidden={index >= items.length ? true : undefined}
              tabIndex={index >= items.length ? -1 : undefined}
            >
              <span className={styles.imageFrame}>
                <span className={styles.image}>
                  {canOptimizeImage(image) ? (
                    <Image
                      className={`${styles.imageMain} ${isResultPoster ? styles.resultPoster : ""}`}
                      src={image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 760px) 82vw, 24vw"
                      quality={80}
                      loading="lazy"
                    />
                  ) : (
                    <img
                      className={`${styles.imageMain} ${isResultPoster ? styles.resultPoster : ""}`}
                      src={image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </span>
                <span className={styles.caption}>
                  <small>{item.category || "Atelye qeydləri"}</small>
                  <strong>{item.title}</strong>
                  <i aria-hidden="true" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className={`${styles.archiveAction} ${styles.aosTarget}`} data-aos="fade-up">
        <Link href="/yenilikler">Bütün yenilikləri aç <Arrow /></Link>
      </div>
    </section>
  );
}
