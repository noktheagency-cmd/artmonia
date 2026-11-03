"use client";

import { useState } from "react";
import type { CollectionEntry } from "@/data/collections";
import ResultPortrait from "./ResultPortrait";
import ResultCategories, { resultCategory } from "./ResultCategories";
import homeStyles from "./HomeResultsSection.module.css";
import styles from "./ResultsGrid.module.css";
import { useResultAos } from "./useResultAos";

export default function ResultsGrid({ results }: { results: CollectionEntry[] }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [category, setCategory] = useState<string | null>(null);
  const activeCategory = category && results.some((item) => resultCategory(item) === category) ? category : null;
  const filtered = activeCategory ? results.filter((item) => resultCategory(item) === activeCategory) : results;
  const sectionRef = useResultAos<HTMLDivElement>(`${activeCategory ?? "all"}:${visibleCount}:${filtered.length}`);
  if (!results.length) return null;

  return (
    <div ref={sectionRef} className={styles.section} id="telebe-neticeleri">
      <ResultCategories className={homeStyles.aosTarget} dataAos items={results} selected={activeCategory} onSelect={(value) => { setCategory(value); setVisibleCount(12); }} />
      <ul className={styles.grid} id="results-card-list">
        {filtered.slice(0, visibleCount).map((student, index) => (
          <li className={`${homeStyles.card} ${styles.card} ${homeStyles.aosTarget}`} data-aos="fade-up" key={student.id}>
            <div className={homeStyles.cardMeta} aria-hidden="true"><span>ARTMONIA · TƏLƏBƏ İŞİ</span><span>{String(index + 1).padStart(2, "0")}</span></div>
            <ResultPortrait student={student} />
            <div className={homeStyles.caption}>
              <span className={homeStyles.category}>{resultCategory(student)}</span>
              <h3 title={student.title}>{student.title}</h3>
              <p title={student.subtitle}>{student.subtitle}</p>
              <i className={homeStyles.brushStroke} aria-hidden="true" />
            </div>
          </li>
        ))}
      </ul>
      {visibleCount < filtered.length ? (
        <button className={`${styles.more} ${homeStyles.aosTarget}`} data-aos="fade-up" type="button" aria-controls="results-card-list"
          onClick={() => setVisibleCount((count) => count + 12)}>
          Daha çox <span aria-hidden="true">↓</span>
        </button>
      ) : null}
    </div>
  );
}
