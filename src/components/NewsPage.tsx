import Link from "next/link";
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

  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <main className={styles.page} id="top">
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <span className={styles.eyebrow}>Artmonia gündəliyi</span>
            <h1>Yeniliklər</h1>
            <p>
              Studiyadan xəbərlər, yeni proqramlar və sənətin içindən gələn
              görüşlər — hamısı bir yaradıcı gündəlikdə.
            </p>
          </div>

          <div className={styles.introArtwork} aria-hidden="true">
            <span className={styles.sketchCircle} />
            <span className={styles.brushMark} />
            <span className={styles.artLetter}>A</span>
          </div>
        </header>

        <section className={styles.archive} id="yenilikler-arxivi" aria-label="Artmonia yenilikləri">
          <div className={styles.archiveHeading}>
            <p>Seçilmiş xəbərlər</p>
            <span>{String(items.length).padStart(2, "0")} qeyd</span>
          </div>

          <div className={styles.grid}>
            {visibleItems.map((item, index) => {
              const image = item.image || fallbackImages[(startIndex + index) % fallbackImages.length];
              const number = String(startIndex + index + 1).padStart(2, "0");

              return (
                <article
                  className={`${styles.card} ${index === 0 ? styles.featuredCard : ""}`}
                  id={item.id}
                  key={item.id}
                >
                  <div className={styles.imageWrap}>
                    {/* Admin images can come from different providers, so a native image is intentional. */}
                    <img src={image} alt="" loading={index === 0 ? "eager" : "lazy"} />
                    <span className={styles.cardNumber}>{number}</span>
                  </div>

                  <div className={styles.cardContent}>
                    <div className={styles.meta}>
                      <time dateTime={item.date}>{formatDate(item.date)}</time>
                      <span>{item.category}</span>
                    </div>
                    <h2>{item.title}</h2>
                    <p className={styles.excerpt}>{item.excerpt}</p>

                    <details className={styles.details}>
                      <summary>
                        Xəbəri oxu
                        <Arrow />
                      </summary>
                      <div className={styles.body}>
                        {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                      </div>
                    </details>
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
      <footer className={styles.footer}>© 2026 Artmonia Academy</footer>
    </SiteContentProvider>
  );
}
