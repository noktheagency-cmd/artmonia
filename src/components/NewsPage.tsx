"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import type { NewsItem } from "@/data/site";
import type { SiteContentMap } from "@/lib/site-content";
import styles from "./NewsPage.module.css";

const ITEMS_PER_PAGE = 6;
const MAX_VISIBLE_PAGES = 10;

const fallbackImages = [
  "/assets/studio-room.webp",
  "/assets/article-composition.webp",
  "/assets/article-portrait-technique.webp",
  "/assets/module-color.webp",
  "/assets/studio-brushes.webp",
  "/assets/article-color-harmony-crisp.webp"
];

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={direction === "left" ? styles.arrowLeft : undefined}>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6 6 18" />
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
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pagination = pageWindow(currentPage, totalPages);

  useEffect(() => {
    if (!selectedItem) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedItem(null);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedItem]);

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <main className={styles.page} id="top">
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <h1>Yeniliklər</h1>
            <span className={styles.titleStroke} aria-hidden="true" />
            <p>
              Artmonia-da yaradıcılıq daim hərəkətdədir. Sərgilər, kurslar,
              ustad dərsləri və tələbələrimizin uğurları haqqında ən son xəbərlər.
            </p>
          </div>

          <div className={styles.introArtwork} aria-hidden="true">
            <span className={styles.sketchCircle} />
            <img src="/assets/about-art-system.webp" alt="" />
            <span className={styles.brushMark} />
          </div>
        </header>

        <section className={styles.archive} id="yenilikler-arxivi" aria-label="Artmonia yenilikləri">
          <div className={styles.archiveHeading}>
            <p>Son xəbərlər</p>
            <span>{String(items.length).padStart(2, "0")} qeyd</span>
          </div>

          <div className={styles.grid}>
            {visibleItems.map((item, index) => {
              const image = item.image || fallbackImages[(startIndex + index) % fallbackImages.length];

              return (
                <article className={styles.card} id={item.id} key={item.id}>
                  <div className={styles.imageWrap}>
                    {/* Admin images can come from different providers, so a native image is intentional. */}
                    <img src={image} alt={item.title} loading={index < 3 ? "eager" : "lazy"} />
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.meta}>
                      <time dateTime={item.date}>{formatDate(item.date)}</time>
                      <span>{item.category}</span>
                    </div>
                    <h2>{item.title}</h2>
                    <span className={styles.cardStroke} aria-hidden="true" />
                    <p className={styles.excerpt}>{item.excerpt}</p>

                    <button className={styles.readButton} type="button" onClick={() => setSelectedItem(item)}>
                      Ətraflı oxu
                      <Arrow />
                    </button>
                  </div>
                </article>
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

      {selectedItem ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelectedItem(null)}>
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className={styles.modalClose} type="button" onClick={() => setSelectedItem(null)} aria-label="Pəncərəni bağla">
              <CloseIcon />
            </button>

            <div className={styles.modalImage}>
              <img
                src={selectedItem.image || fallbackImages[items.indexOf(selectedItem) % fallbackImages.length]}
                alt={selectedItem.title}
              />
            </div>
            <div className={styles.modalContent}>
              <div className={styles.meta}>
                <time dateTime={selectedItem.date}>{formatDate(selectedItem.date)}</time>
                <span>{selectedItem.category}</span>
              </div>
              <h2 id="news-modal-title">{selectedItem.title}</h2>
              <p className={styles.modalExcerpt}>{selectedItem.excerpt}</p>
              <div className={styles.modalBody}>
                {selectedItem.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
          </section>
        </div>
      ) : null}

      <footer className={styles.footer}>© 2026 Artmonia Academy</footer>
    </SiteContentProvider>
  );
}
