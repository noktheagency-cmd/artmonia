"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { newsItems, type NewsItem } from "@/data/site";
import { useSiteContentValue } from "@/components/SiteContentContext";

const monthLabels = ["YAN", "FEV", "MAR", "APR", "MAY", "İYN", "İYL", "AVQ", "SEN", "OKT", "NOY", "DEK"];

function shortDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return `${String(date.getDate()).padStart(2, "0")} ${monthLabels[date.getMonth()]}`;
}

function RailArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function HeroNewsRail() {
  const dynamicItems = useSiteContentValue<NewsItem[]>("news_items", newsItems);
  const items = useMemo(
    () => dynamicItems.filter((item) => item?.id && item?.title).slice(0, 8),
    [dynamicItems]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length < 2 || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  useEffect(() => {
    if (activeIndex >= items.length) setActiveIndex(0);
  }, [activeIndex, items.length]);

  if (!items.length) return null;

  const activeItem = items[activeIndex];

  return (
    <aside
      className="hero-news-rail"
      aria-label="Son yeniliklər"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="hero-news-items" key={activeIndex} aria-live="polite">
        <Link className="hero-news-item" href={`/yenilikler#${activeItem.id}`}>
          <span className="hero-news-meta">
            <b>{activeItem.category || "Yenilik"}</b>
            <time dateTime={activeItem.date}>{shortDate(activeItem.date)}</time>
          </span>
          <strong>{activeItem.title}</strong>
          <span className="hero-news-arrow"><RailArrow /></span>
        </Link>
      </div>
      <span className={`hero-news-progress ${paused ? "is-paused" : ""}`} key={`progress-${activeIndex}`} aria-hidden="true"><i /></span>
    </aside>
  );
}
