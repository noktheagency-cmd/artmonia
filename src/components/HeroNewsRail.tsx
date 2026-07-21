"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

function PauseIcon({ paused }: { paused: boolean }) {
  return paused ? (
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m8 5 11 7-11 7V5Z" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14" /></svg>
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

  const visible = [items[activeIndex], items[(activeIndex + 1) % items.length]].filter(Boolean);

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
      <span className="hero-news-brush" aria-hidden="true" />
      <div className="hero-news-items" key={activeIndex}>
        {visible.map((item, index) => (
          <Link
            key={`${item.id}-${index}`}
            className={`hero-news-item ${index === 1 ? "hero-news-item--secondary" : ""}`}
            href={`/yenilikler#${item.id}`}
          >
            <span className="hero-news-meta">
              {index === 0 ? <b>Yenilik</b> : null}
              <time dateTime={item.date}>{shortDate(item.date)}</time>
            </span>
            <strong>{item.title}</strong>
            <span className="hero-news-arrow"><RailArrow /></span>
          </Link>
        ))}
      </div>
      <div className="hero-news-control">
        <span className="hero-news-count">{String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <span className={`hero-news-progress ${paused ? "is-paused" : ""}`} key={`progress-${activeIndex}`} aria-hidden="true"><i /></span>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Xəbər lentini davam etdir" : "Xəbər lentini dayandır"}>
          <PauseIcon paused={paused} />
        </button>
      </div>
    </aside>
  );
}
