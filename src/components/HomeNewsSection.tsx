"use client";

/* News images can be managed from different providers in the admin panel. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { newsItems } from "@/data/site";
import { homePageCopy } from "@/data/site-copy";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { getNewsImages, isNewsItem } from "@/lib/news";
import { canOptimizeImage } from "@/lib/image-optimization";
import { useResultAos } from "./useResultAos";
import styles from "./HomeNewsSection.module.css";

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
  const cycleItems = items.length ? Array.from({ length: Math.ceil(5 / items.length) }, () => items).flat() : [];
  const loopItems = [...cycleItems, ...cycleItems];
  const sectionRef = useResultAos<HTMLElement>(items.map((item) => item.id).join("|"));

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 760px)");
    let touching = false;
    let visible = false;
    const touchStart = () => { touching = true; };
    const touchEnd = () => { touching = false; };
    rail.addEventListener("touchstart", touchStart, { passive: true });
    rail.addEventListener("touchend", touchEnd, { passive: true });
    rail.addEventListener("touchcancel", touchEnd, { passive: true });
    const interval = window.setInterval(() => {
      if (!visible || !mobile.matches || reduced.matches || document.hidden || touching || rail.contains(document.activeElement)) return;
      const first = rail.children[0] as HTMLElement;
      const second = rail.children[1] as HTMLElement;
      const repeat = rail.children[cycleItems.length] as HTMLElement;
      if (!first || !second || !repeat) return;
      const step = second.offsetLeft - first.offsetLeft;
      const cycle = repeat.offsetLeft - first.offsetLeft;
      if (rail.scrollLeft >= cycle - 2) rail.scrollLeft -= cycle;
      rail.scrollTo({ left: (Math.round(rail.scrollLeft / step) + 1) * step, behavior: "smooth" });
    }, 3000);
    let frame = 0;
    let previous = 0;
    let position = rail.scrollLeft;
    let cycle = 0;
    const measureCycle = () => {
      const currentRail = railRef.current;
      if (!currentRail) return;
      const first = currentRail.children[0] as HTMLElement | undefined;
      const repeat = currentRail.children[cycleItems.length] as HTMLElement | undefined;
      cycle = first && repeat ? repeat.offsetLeft - first.offsetLeft : 0;
      position = currentRail.scrollLeft;
    };
    function tick(now: number) {
      frame = 0;
      if (!visible || document.hidden || reduced.matches || mobile.matches) return;
      const currentRail = railRef.current;
      if (!currentRail) return;
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      if (cycle > 0) {
        if (Math.abs(currentRail.scrollLeft - position) > 2) position = currentRail.scrollLeft;
        position = (position + elapsed * 0.025) % cycle;
        currentRail.scrollLeft = position;
      } else { position = currentRail.scrollLeft; }
      frame = requestAnimationFrame(tick);
    }
    const startFrame = () => {
      if (visible && !document.hidden && !reduced.matches && !mobile.matches && !frame) {
        measureCycle();
        if (cycle <= 0) return;
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const onResize = () => {
      measureCycle();
      startFrame();
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        startFrame();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
    }, { rootMargin: "120px 0px" });
    const onDocumentVisibility = () => {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        startFrame();
      }
    };
    const onMotionModeChange = () => startFrame();
    visibilityObserver.observe(rail);
    document.addEventListener("visibilitychange", onDocumentVisibility);
    window.addEventListener("resize", onResize);
    reduced.addEventListener("change", onMotionModeChange);
    mobile.addEventListener("change", onMotionModeChange);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onDocumentVisibility);
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", onMotionModeChange);
      mobile.removeEventListener("change", onMotionModeChange);
      rail.removeEventListener("touchstart", touchStart);
      rail.removeEventListener("touchend", touchEnd);
      rail.removeEventListener("touchcancel", touchEnd);
    };
  }, [items, cycleItems.length]);

  return (
    <section ref={sectionRef} className={`${styles.section} scroll-section`} id="academy" aria-labelledby="home-news-title">
      <div className={`${styles.heading} ${styles.aosTarget}`} data-aos="fade-up">
        <div>
          <h2 id="home-news-title">{copy.title}</h2>
        </div>
      </div>

      <div className={styles.rail} ref={railRef} aria-label="Son yeniliklər">
        {loopItems.map((item, index) => {
          const image = getNewsImages(item, index)[0];
          const isResultPoster = image.includes("/assets/news-clean/");

          return (
            <Link
              className={`${styles.card} ${styles.aosTarget}`}
              data-aos="fade-up"
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
