import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ResultsShowcase from "@/components/ResultsShowcase";
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
  const cashAwards = items.filter((item) => item.category === "cash");
  const travelAwards = items.filter((item) => item.category === "travel");

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
          {type === "results" ? (
            <ResultsShowcase />
          ) : (
            <div className="awards-categories">
              <section className="awards-category awards-category--cash" id="pul-mukafatlari" aria-labelledby="cash-awards-title">
                <header className="awards-category-heading">
                  <p>Mükafat kateqoriyası</p>
                  <h2 id="cash-awards-title">Pul mükafatları</h2>
                  <span>Yaradıcılığın nəticəyə və real dəyərə çevrildiyi nailiyyətlər.</span>
                </header>
                {cashAwards.length ? (
                  <div className="student-results-grid">
                    {cashAwards.map((result, index) => (
                      <StudentResultCard key={result.id} {...result} index={index} type={type} />
                    ))}
                  </div>
                ) : (
                  <div className="awards-category-empty">
                    <strong>Yeni pul mükafatları burada paylaşılacaq.</strong>
                    <span>Seçilmiş layihələr, müsabiqələr və qaliblər haqqında məlumatlar tezliklə əlavə ediləcək.</span>
                  </div>
                )}
              </section>

              <section className="awards-category awards-category--travel" id="seyahet-mukafatlari" aria-labelledby="travel-awards-title">
                <header className="awards-category-heading">
                  <p>Mükafat kateqoriyası</p>
                  <h2 id="travel-awards-title">Səyahət mükafatları</h2>
                  <span>Sənət sərgiləri, yaradıcılıq proqramları və yeni təcrübələrə açılan yol.</span>
                </header>
                {travelAwards.length ? (
                  <div className="student-results-grid">
                    {travelAwards.map((result, index) => (
                      <StudentResultCard key={result.id} {...result} index={index} type={type} />
                    ))}
                  </div>
                ) : (
                  <div className="awards-category-empty">
                    <strong>Yeni səyahət mükafatları burada paylaşılacaq.</strong>
                    <span>İştirak şərtləri, istiqamətlər və qaliblərin hekayələri tezliklə əlavə ediləcək.</span>
                  </div>
                )}
              </section>
            </div>
          )}
        </section>
      </main>
      <footer className="collection-footer">© 2026 Artmonia Academy</footer>
    </SiteContentProvider>
  );
}
