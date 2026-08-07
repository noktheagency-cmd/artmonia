"use client";

/* News images can be managed from different providers in the admin panel. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import type { NewsItem } from "@/data/site";
import type { SiteContentMap } from "@/lib/site-content";
import { globalCopy, newsPageCopy, type GlobalCopy, type NewsPageCopy } from "@/data/site-copy";
import { formatNewsDate, getNewsImages } from "@/lib/news";
import styles from "./NewsPage.module.css";

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 10;

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={direction === "left" ? styles.arrowLeft : undefined}>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function pageWindow(currentPage: number, totalPages: number) {
  let start = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
  start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function pageHref(page: number) {
  return page === 1 ? "/yenilikler#yenilikler-arxivi" : `/yenilikler?page=${page}#yenilikler-arxivi`;
}

export default function NewsPage({
  content,
  items,
  requestedPage
}: {
  content: SiteContentMap;
  items: NewsItem[];
  requestedPage: number;
}) {
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pagination = pageWindow(currentPage, totalPages);
  const copy = (content.news_page_copy as unknown as NewsPageCopy | undefined) ?? newsPageCopy;
  const global = (content.global_copy as unknown as GlobalCopy | undefined) ?? globalCopy;

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <main className={styles.page} id="top">
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <h1>{copy.title}</h1>
            <span className={styles.titleStroke} aria-hidden="true" />
            <p>{copy.intro}</p>
          </div>

          <div className={styles.introArtwork} aria-hidden="true">
            <span className={styles.sketchCircle} />
            <img src="/assets/about-art-system.webp" alt="" />
            <span className={styles.brushMark} />
          </div>
        </header>

        <section className={styles.archive} id="yenilikler-arxivi" aria-label="Artmonia yenilikləri">
          <div className={styles.archiveHeading}>
            <p>{copy.archiveLabel}</p>
            <span>{String(items.length).padStart(2, "0")} {copy.countSuffix}</span>
          </div>

          <div className={styles.grid}>
            {visibleItems.map((item, index) => {
              const image = getNewsImages(item, startIndex + index)[0];

              return (
                <Link
                  className={styles.card}
                  id={item.id}
                  href={`/yenilikler/${encodeURIComponent(item.id)}`}
                  aria-label={`${item.title} xəbərini ətraflı oxu`}
                  key={item.id}
                >
                  <div className={styles.imageWrap}>
                    {/* Admin images can come from different providers, so a native image is intentional. */}
                    <img src={image} alt={item.title} loading={index < 3 ? "eager" : "lazy"} />
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.meta}>
                      <time dateTime={item.date}>{formatNewsDate(item.date)}</time>
                      <span>{item.category}</span>
                    </div>
                    <h2>{item.title}</h2>
                    <span className={styles.cardStroke} aria-hidden="true" />
                    <p className={styles.excerpt}>{item.excerpt}</p>

                    <span className={styles.readButton}>
                      {copy.readMore}
                      <Arrow />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <nav className={styles.pagination} aria-label="Xəbər səhifələri">
            {currentPage > 1 ? (
              <Link className={styles.paginationArrow} href={pageHref(currentPage - 1)} aria-label="Əvvəlki səhifə">
                <Arrow direction="left" />
              </Link>
            ) : (
              <span className={`${styles.paginationArrow} ${styles.disabled}`} aria-hidden="true">
                <Arrow direction="left" />
              </span>
            )}

            <div className={styles.pageNumbers}>
              {pagination.map((page) => (
                <Link
                  className={page === currentPage ? styles.activePage : undefined}
                  href={pageHref(page)}
                  aria-current={page === currentPage ? "page" : undefined}
                  key={page}
                >
                  {page}
                </Link>
              ))}
            </div>

            {currentPage < totalPages ? (
              <Link className={styles.paginationArrow} href={pageHref(currentPage + 1)} aria-label="Növbəti səhifə">
                <Arrow />
              </Link>
            ) : (
              <span className={`${styles.paginationArrow} ${styles.disabled}`} aria-hidden="true">
                <Arrow />
              </span>
            )}
          </nav>
        </section>
      </main>

      <footer className={styles.footer}>{global.copyright}</footer>
    </SiteContentProvider>
  );
}
