import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import StudentResultCard from "@/components/StudentResultCard";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { collectionPageContent, type CollectionEntry } from "@/data/collections";
import { getPublishedContent } from "@/lib/site-content";

type CollectionPageProps = {
  type: "results" | "awards";
};

export default async function CollectionPage({ type }: CollectionPageProps) {
  const siteContent = await getPublishedContent();
  const content = collectionPageContent[type];
  const items = (siteContent[content.sectionKey] as unknown as CollectionEntry[] | undefined) ?? [];

  return (
    <SiteContentProvider content={siteContent}>
      <SiteHeader />
      <main className={`collection-page collection-page--${type}`}>
        <section className="collection-intro" aria-labelledby="collection-title">
          <div className="collection-intro-title">
            <h1 id="collection-title">{content.title}</h1>
            <span aria-hidden="true" />
          </div>
          <div className="collection-intro-copy">
            <p>{content.description}</p>
            <Link className="collection-back collection-back--intro" href="/">
              <span aria-hidden="true">←</span> Ana səhifəyə qayıt
            </Link>
          </div>
        </section>

        <section className="collection-content" aria-label={`${content.title} siyahısı`}>
          {items.length ? (
            <div className="student-results-grid">
              {items.map((result, index) => (
                <StudentResultCard key={result.id} {...result} index={index} type={type} />
              ))}
            </div>
          ) : (
            <div className="collection-empty">
              <span className="collection-empty-mark" aria-hidden="true" />
              <h2>{content.emptyTitle}</h2>
              <p>{content.emptyText}</p>
            </div>
          )}
        </section>
      </main>
      <footer className="collection-footer">© 2026 Artmonia Academy</footer>
    </SiteContentProvider>
  );
}
