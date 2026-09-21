"use client";

import { useState } from "react";
import type { CollectionEntry } from "@/data/collections";
import ResultPortrait from "./ResultPortrait";
import ResultCategories, { resultCategory } from "./ResultCategories";
import homeStyles from "./HomeResultsSection.module.css";
import styles from "./ResultsGrid.module.css";

export default function ResultsGrid({ results }: { results: CollectionEntry[] }) {
  const [visibleCount, setVisibleCount] = useState(12);
  const [category, setCategory] = useState<string | null>(null);
  const activeCategory = category && results.some((item) => resultCategory(item) === category) ? category : null;
  const filtered = activeCategory ? results.filter((item) => resultCategory(item) === activeCategory) : results;
  if (!results.length) return null;

  return (
    <div className={styles.section} id="telebe-neticeleri">
      <ResultCategories items={results} selected={activeCategory} onSelect={(value) => { setCategory(value); setVisibleCount(12); }} />
      <ul className={styles.grid} id="results-card-list">
        {filtered.slice(0, visibleCount).map((student) => (
          <li className={`${homeStyles.card} ${styles.card}`} key={student.id}>
            <ResultPortrait student={student} />
            <div className={homeStyles.caption}>
              <h3 title={student.title}>{student.title}</h3>
              <p title={student.subtitle}>{student.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
      {visibleCount < filtered.length ? (
        <button className={styles.more} type="button" aria-controls="results-card-list"
          onClick={() => setVisibleCount((count) => count + 12)}>
          Daha çox <span aria-hidden="true">↓</span>
        </button>
      ) : null}
    </div>
  );
}
