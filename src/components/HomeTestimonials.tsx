"use client";

import { useSiteContentValue } from "./SiteContentContext";
import { TESTIMONIAL_LIMIT, TESTIMONIAL_NAME_LIMIT, TESTIMONIAL_TEXT_LIMIT, type Testimonial } from "@/data/testimonials";
import styles from "./HomeTestimonials.module.css";

export default function HomeTestimonials() {
  const content = useSiteContentValue<Testimonial[]>("student_testimonials", []);
  const reviews = (Array.isArray(content) ? content : []).filter((item) => item && typeof item.text === "string" && item.text.trim()).slice(0, TESTIMONIAL_LIMIT);
  if (!reviews.length) return null;
  return <section className={styles.section} aria-labelledby="testimonials-title">
    <header className={styles.header}>
      <h2 id="testimonials-title">Tələbə rəyləri</h2>
    </header>
    <div className={styles.viewport} tabIndex={0} aria-label="Tələbə rəylərini sürüşdürün">
      <div className={styles.track}>
        <ul className={styles.group}>
          {reviews.map((review, index) => <li className={styles.card} key={`${review.id}-${index}`}>
            <h3>{review.anonymous || !review.name?.trim() ? "Anonim" : review.name.trim().slice(0, TESTIMONIAL_NAME_LIMIT)}</h3>
            <p>{review.text.trim().slice(0, TESTIMONIAL_TEXT_LIMIT)}</p>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}
