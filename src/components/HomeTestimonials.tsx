"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useSiteContentValue } from "./SiteContentContext";
import { TESTIMONIAL_LIMIT, TESTIMONIAL_NAME_LIMIT, TESTIMONIAL_TEXT_LIMIT, type Testimonial } from "@/data/testimonials";
import styles from "./HomeTestimonials.module.css";

export default function HomeTestimonials() {
  const content = useSiteContentValue<Testimonial[]>("student_testimonials", []);
  const [paused, setPaused] = useState(false);
  const reviews = (Array.isArray(content) ? content : []).filter((item) => item && typeof item.text === "string" && item.text.trim()).slice(0, TESTIMONIAL_LIMIT);
  if (!reviews.length) return null;
  const loop = Array.from({ length: Math.ceil(5 / reviews.length) }, () => reviews).flat();
  return <section className={styles.section} aria-labelledby="testimonials-title">
    <header className={styles.header}>
      <h2 id="testimonials-title">Tələbə rəyləri</h2>
      <button type="button" aria-label={paused ? "Rəy lentini davam etdir" : "Rəy lentini dayandır"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={18} /> : <Pause size={18} />}</button>
    </header>
    <div className={styles.viewport}>
      <div className={styles.track} data-paused={paused} style={{ animationDuration: `${loop.length * 9}s` }}>
        {[0, 1].map((copy) => <ul className={styles.group} key={copy} aria-hidden={copy === 1 || undefined}>
          {loop.map((review, index) => <li className={styles.card} key={`${review.id}-${index}`} aria-hidden={index >= reviews.length || undefined}>
            <h3>{review.anonymous || !review.name?.trim() ? "Anonim" : review.name.trim().slice(0, TESTIMONIAL_NAME_LIMIT)}</h3>
            <p>{review.text.trim().slice(0, TESTIMONIAL_TEXT_LIMIT)}</p>
          </li>)}
        </ul>)}
      </div>
    </div>
  </section>;
}
