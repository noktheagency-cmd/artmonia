"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import type { CollectionEntry } from "@/data/collections";
import { useSiteContentValue } from "./SiteContentContext";
import ResultPortrait from "./ResultPortrait";
import ResultCategories, { resultCategory } from "./ResultCategories";
import styles from "./HomeResultsSection.module.css";

export default function HomeResultsSection() {
  const [paused, setPaused] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const content = useSiteContentValue<CollectionEntry[]>("home_results", []);
  const allStudents = Array.isArray(content) ? content.filter((student) => student && typeof student.title === "string") : [];
  const activeCategory = category && allStudents.some((item) => resultCategory(item) === category) ? category : null;
  const students = activeCategory ? allStudents.filter((item) => resultCategory(item) === activeCategory) : allStudents;
  // Fill each loop even when only one or two results remain. Never restore deleted seed records.
  const loopStudents = students.length ? Array.from({ length: Math.max(1, Math.ceil(6 / students.length)) }, () => students).flat() : [];
  if (!students.length) return null;

  return (
    <section className={styles.section} id="results" aria-labelledby="home-results-title">
      <div className={styles.heading}>
        <div>
          <h2 id="home-results-title">Nəticələr</h2>
        </div>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Lenti davam etdir" : "Lenti dayandır"}
          aria-pressed={paused}
        >
          {paused ? <Play size={18} aria-hidden="true" /> : <Pause size={18} aria-hidden="true" />}
        </button>
      </div>
      <ResultCategories items={allStudents} selected={activeCategory} onSelect={setCategory} />
      <div key={activeCategory} className={styles.viewport} tabIndex={0} aria-label={`${students.length} tələbə nəticəsi`}>
        <div className={styles.track} data-paused={paused}>
          {[0, 1].map((copy) => (
            <ul className={styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {loopStudents.map((student, index) => (
                <li className={styles.card} key={`${student.id}-${index}`} aria-hidden={index >= students.length ? true : undefined}>
                  <ResultPortrait student={student} />
                  <div className={styles.caption}>
                    <h3>{student.title}</h3>
                    <p>{student.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
