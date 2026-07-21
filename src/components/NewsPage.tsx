import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import type { NewsItem } from "@/data/site";
import type { SiteContentMap } from "@/lib/site-content";

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function NewsArrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function NewsPage({ content, items }: { content: SiteContentMap; items: NewsItem[] }) {
  return (
    <SiteContentProvider content={content}>
      <SiteHeader />
      <main className="news-page" id="top">
        <header className="news-intro">
          <div>
            <span className="news-eyebrow">Artmonia gündəliyi</span>
            <h1>Yeniliklər və elanlar</h1>
          </div>
          <div className="news-intro-copy">
            <p>Studiyadan xəbərlər, yeni qruplar və görüşlər.</p>
            <Link href="/">Ana səhifəyə qayıt <span aria-hidden="true">↗</span></Link>
          </div>
          <span className="news-intro-stroke" aria-hidden="true" />
        </header>

        <section className="news-list" aria-label="Artmonia yenilikləri">
          {items.map((item, index) => (
            <article className="news-entry" id={item.id} key={item.id}>
              <div className="news-entry-index">
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <time dateTime={item.date}>{formatDate(item.date)}</time>
                <span>{item.category}</span>
              </div>
              <div className="news-entry-content">
                <h2>{item.title}</h2>
                <p className="news-entry-excerpt">{item.excerpt}</p>
                <div className="news-entry-body">
                  {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              <Link className="news-entry-link" href={`/yenilikler#${item.id}`} aria-label={`${item.title} xəbərinə keç`}>
                <NewsArrow />
              </Link>
            </article>
          ))}
        </section>
      </main>
      <footer className="collection-footer news-footer">© 2026 Artmonia Academy</footer>
    </SiteContentProvider>
  );
}
