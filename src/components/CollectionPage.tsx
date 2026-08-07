import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ResultsShowcase from "@/components/ResultsShowcase";
import StudentResultCard from "@/components/StudentResultCard";
import { SiteContentProvider } from "@/components/SiteContentContext";
import type { CollectionEntry } from "@/data/collections";
import { collectionsPageCopy, globalCopy, type CollectionsPageCopy, type GlobalCopy } from "@/data/site-copy";
import { getPublishedContent } from "@/lib/site-content";

type CollectionPageProps = {
  type: "results" | "awards";
};

export default async function CollectionPage({ type }: CollectionPageProps) {
  const siteContent = await getPublishedContent();
  const copy = (siteContent.collections_page_copy as unknown as CollectionsPageCopy | undefined) ?? collectionsPageCopy;
  const global = (siteContent.global_copy as unknown as GlobalCopy | undefined) ?? globalCopy;
  const pageCopy = copy[type];
  const items = (siteContent[type === "results" ? "student_results" : "awards"] as unknown as CollectionEntry[] | undefined) ?? [];
  const cashAwards = items.filter((item) => item.category === "cash");
  const travelAwards = items.filter((item) => item.category === "travel");

  return (
    <SiteContentProvider content={siteContent}>
      <SiteHeader />
      <main className={`collection-page collection-page--${type}`}>
        <section className="collection-intro" aria-labelledby="collection-title">
          <div className="collection-intro-title">
            <h1 id="collection-title">{pageCopy.title}</h1>
            <span aria-hidden="true" />
          </div>
          <div className="collection-intro-copy">
            <p>{pageCopy.description}</p>
            <Link className="collection-back collection-back--intro" href="/">
              <span aria-hidden="true">←</span> {copy.backHome}
            </Link>
          </div>
        </section>

        <section className="collection-content" aria-label={`${pageCopy.title} siyahısı`}>
          {type === "results" ? (
            <ResultsShowcase />
          ) : (
            <div className="awards-categories">
              <section className="awards-category awards-category--cash" id="pul-mukafatlari" aria-labelledby="cash-awards-title">
                <header className="awards-category-heading">
                  <p>{copy.awards.categoryLabel}</p>
                  <h2 id="cash-awards-title">{copy.awards.cashTitle}</h2>
                  <span>{copy.awards.cashText}</span>
                </header>
                {cashAwards.length ? (
                  <div className="student-results-grid">
                    {cashAwards.map((result, index) => (
                      <StudentResultCard key={result.id} {...result} index={index} type={type} />
                    ))}
                  </div>
                ) : (
                  <div className="awards-category-empty">
                    <strong>{copy.awards.cashEmptyTitle}</strong>
                    <span>{copy.awards.cashEmptyText}</span>
                  </div>
                )}
              </section>

              <section className="awards-category awards-category--travel" id="seyahet-mukafatlari" aria-labelledby="travel-awards-title">
                <header className="awards-category-heading">
                  <p>{copy.awards.categoryLabel}</p>
                  <h2 id="travel-awards-title">{copy.awards.travelTitle}</h2>
                  <span>{copy.awards.travelText}</span>
                </header>
                {travelAwards.length ? (
                  <div className="student-results-grid">
                    {travelAwards.map((result, index) => (
                      <StudentResultCard key={result.id} {...result} index={index} type={type} />
                    ))}
                  </div>
                ) : (
                  <div className="awards-category-empty">
                    <strong>{copy.awards.travelEmptyTitle}</strong>
                    <span>{copy.awards.travelEmptyText}</span>
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>
      <footer className="collection-footer">{global.copyright}</footer>
    </SiteContentProvider>
  );
}
