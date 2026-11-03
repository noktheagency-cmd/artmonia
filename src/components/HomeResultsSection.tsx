"use client";

import { useState } from "react";
import Link from "next/link";
import type { CollectionEntry } from "@/data/collections";
import { useSiteContentValue } from "./SiteContentContext";
import ResultPortrait from "./ResultPortrait";
import ResultCategories, { resultCategory } from "./ResultCategories";
import { useResultAos } from "./useResultAos";
import { useAnimationVisibility } from "./useAnimationVisibility";
import styles from "./HomeResultsSection.module.css";

export default function HomeResultsSection() {
  const [category, setCategory] = useState<string | null>(null);
  const content = useSiteContentValue<CollectionEntry[]>("home_results", []);
  const allStudents = Array.isArray(content) ? content.filter((student) => student && typeof student.title === "string") : [];
  const activeCategory = category && allStudents.some((item) => resultCategory(item) === category) ? category : null;
  const filteredStudents = activeCategory ? allStudents.filter((item) => resultCategory(item) === activeCategory) : allStudents;
  const students = filteredStudents.slice(0, 12);
  const sectionRef = useResultAos<HTMLElement>(`${activeCategory ?? "all"}:${students.length}`);
  const animationRef = useAnimationVisibility<HTMLDivElement>();
  // Fill each loop even when only one or two results remain. Never restore deleted seed records.
  const loopStudents = students.length ? Array.from({ length: Math.max(1, Math.ceil(6 / students.length)) }, () => students).flat() : [];
  if (!students.length) return null;

  return (
    <section ref={sectionRef} className={styles.section} id="results" aria-labelledby="home-results-title">
      <div className={`${styles.heading} ${styles.aosTarget}`} data-aos="fade-up">
        <div>
          <h2 id="home-results-title">Nəticələr</h2>
        </div>
      </div>
      <ResultCategories className={styles.aosTarget} dataAos items={allStudents} selected={activeCategory} onSelect={setCategory} />
      <div ref={animationRef} key={activeCategory} className={`${styles.viewport} ${styles.aosTarget}`} data-aos="fade-up" tabIndex={0} aria-label={`${filteredStudents.length} tələbə nəticəsi`}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <ul className={styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {loopStudents.map((student, index) => (
                <li className={`${styles.card} ${styles.aosTarget}`} data-aos="fade-up" key={`${student.id}-${index}`} aria-hidden={index >= students.length ? true : undefined}>
                  <div className={styles.cardMeta} aria-hidden="true"><span>ARTMONIA · TƏLƏBƏ İŞİ</span><span>{String((index % students.length) + 1).padStart(2, "0")}</span></div>
                  <ResultPortrait student={student} />
                  <div className={styles.caption}>
                    <span className={styles.category}>{resultCategory(student)}</span>
                    <h3>{student.title}</h3>
                    <p>{student.subtitle}</p>
                    <i className={styles.brushStroke} aria-hidden="true" />
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <Link className={styles.allResultsLink} href="/neticeler">Bütün nəticələrə bax <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
