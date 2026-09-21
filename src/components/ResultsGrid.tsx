"use client";

import { useState } from "react";
import type { CollectionEntry } from "@/data/collections";
import ResultPortrait from "./ResultPortrait";
import homeStyles from "./HomeResultsSection.module.css";
import styles from "./ResultsGrid.module.css";

export default function ResultsGrid({ results }: { results: CollectionEntry[] }) {
  const [visibleCount, setVisibleCount] = useState(12);
  if (!results.length) return null;

  return (
    <div className={styles.section} id="telebe-neticeleri">
      <ul className={styles.grid} id="results-card-list">
        {results.slice(0, visibleCount).map((student) => (
          <li className={`${homeStyles.card} ${styles.card}`} key={student.id}>
            <ResultPortrait student={student} />
            <div className={homeStyles.caption}>
              <h3 title={student.title}>{student.title}</h3>
              <p title={student.subtitle}>{student.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.status} role="status">
        {Math.min(visibleCount, results.length)} / {results.length} nəticə göstərilir
      </p>
      {visibleCount < results.length ? (
        <button className={styles.more} type="button" aria-controls="results-card-list"
          onClick={() => setVisibleCount((count) => count + 12)}>
          Daha çox <span aria-hidden="true">↓</span>
        </button>
      ) : null}
    </div>
  );
}
