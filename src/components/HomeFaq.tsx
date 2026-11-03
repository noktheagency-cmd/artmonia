"use client";

import { useId, useState } from "react";
import { useSiteContentValue } from "./SiteContentContext";
import styles from "./HomeFaq.module.css";

export default function HomeFaq() {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const content = useSiteContentValue("home_faq", { title: "", questions: [] as { q: string; a: string }[] });
  const questions = content.questions.filter((item) => item.q.trim() && item.a.trim());
  if (!questions.length) return null;

  return (
    <section id="faq" className={styles.section} aria-labelledby="home-faq-title">
      <h2 id="home-faq-title" className={styles.title}>{!content.title || ["Ən çox verilən suallar", "Tez-tez verilən suallar"].includes(content.title.trim()) ? "FAQ" : content.title}</h2>
      <div className={styles.list}>
        {questions.map((item, index) => (
          <article className={`${styles.item} ${openIndex === index ? styles.open : ""}`} key={`${index}-${item.q}`}>
            <button
              className={styles.question}
              type="button"
              aria-expanded={openIndex === index}
              aria-controls={`${id}-answer-${index}`}
              onClick={() => setOpenIndex((current) => current === index ? null : index)}
            >
              <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.q}</span>
              <svg className={styles.palette} viewBox="0 0 48 48" aria-hidden="true">
                <path className={styles.paletteBody} d="M23.8 4.5C13 4.5 4.5 12.1 4.5 21.7c0 9.1 7.1 16.1 16.8 16.1h3.2c2.5 0 4.2-2.2 3.5-4.5-.6-2 .9-3.8 3-3.8h3.1c5.5 0 9.4-3.6 9.4-8.6 0-9.3-8.9-16.4-19.7-16.4Z" />
                <circle className={styles.paintDot} cx="14" cy="19" r="2.4" />
                <circle className={styles.paintDot} cx="21" cy="13" r="2.4" />
                <circle className={styles.paintDot} cx="29" cy="14" r="2.4" />
                <circle className={styles.paintDot} cx="35" cy="20" r="2.4" />
                <circle className={styles.thumbHole} cx="14" cy="29" r="3.2" />
              </svg>
            </button>
            <div id={`${id}-answer-${index}`} className={styles.answerPanel} aria-hidden={openIndex !== index}>
              <div className={styles.answerInner}><p className={styles.answer}>{item.a}</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
