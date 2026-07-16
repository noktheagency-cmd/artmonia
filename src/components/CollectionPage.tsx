import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import StudentResultCard from "@/components/StudentResultCard";
import { studentResults } from "@/data/studentResults";

type CollectionPageProps = {
  type: "results" | "awards";
};

const pageContent = {
  results: {
    title: "Nəticələr",
    description: "Tələbələrimizin inkişafını və tamamlanmış işlərini burada paylaşacağıq.",
    emptyTitle: "Nəticələr hazırlanır",
    emptyText: "Tələbə işləri əlavə edildikcə ad, vizual və qısa açıqlama ilə burada görünəcək."
  },
  awards: {
    title: "Mükafatlar",
    description: "Artmonia icmasının nailiyyətləri və mükafatları üçün ayrılmış məkan.",
    emptyTitle: "Mükafatlar tezliklə burada",
    emptyText: "Yeni nailiyyətlər olduqca bu səhifə yenilənəcək."
  }
} as const;

export default function CollectionPage({ type }: CollectionPageProps) {
  const content = pageContent[type];
  const hasResults = type === "results" && studentResults.length > 0;

  return (
    <>
      <SiteHeader />
      <main className="collection-page">
        <section className="collection-intro" aria-labelledby="collection-title">
          <h1 id="collection-title">{content.title}</h1>
          <p>{content.description}</p>
        </section>

        <section className="collection-content" aria-label={`${content.title} siyahısı`}>
          {hasResults ? (
            <div className="student-results-grid">
              {studentResults.map((result) => (
                <StudentResultCard key={result.id} {...result} />
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

        <Link className="collection-back" href="/">
          <span aria-hidden="true">←</span> Ana səhifəyə qayıt
        </Link>
      </main>
      <footer className="collection-footer">© 2026 Artmonia Academy</footer>
    </>
  );
}
