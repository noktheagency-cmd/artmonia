"use client";

import { useSiteContentValue } from "./SiteContentContext";
import styles from "./HomeFaq.module.css";

export default function HomeFaq() {
  const content = useSiteContentValue("home_faq", { title: "", questions: [] as { q: string; a: string }[] });
  const questions = content.questions.filter((item) => item.q.trim() && item.a.trim());
  if (!questions.length) return null;

  return (
    <section id="faq" className={styles.section} aria-labelledby="home-faq-title">
      <h2 id="home-faq-title" className={styles.title}>{!content.title || ["Ən çox verilən suallar", "Tez-tez verilən suallar"].includes(content.title.trim()) ? "FAQ" : content.title}</h2>
      <div className={styles.list}>
        {questions.map((item, index) => (
          <details className={styles.item} key={`${index}-${item.q}`}>
            <summary className={styles.question}>
              <span>{item.q}</span>
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
