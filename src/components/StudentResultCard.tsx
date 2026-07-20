/* Uploaded images can use a dynamic Supabase Storage hostname. */
/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import type { CollectionEntry } from "@/data/collections";

type StudentResultCardProps = CollectionEntry & {
  index: number;
  type: "results" | "awards";
};

export default function StudentResultCard({ title, subtitle, image, description, date, index, type }: StudentResultCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`student-result-card student-result-card--${type}`}
      style={{ "--gallery-index": index } as CSSProperties}
    >
      <div className="student-result-media">
        {image ? <img src={image} alt={title} /> : <div className="student-result-placeholder" aria-hidden="true" />}
        <span className="student-result-number" aria-hidden="true">{number}</span>
      </div>
      <div className="student-result-copy">
        {subtitle ? <span className="student-result-category">{subtitle}</span> : null}
        <h2>{title}</h2>
        {date ? <time dateTime={date}>{date}</time> : null}
        <i aria-hidden="true" />
        {description ? <p>{description}</p> : null}
      </div>
      <span className="student-result-brush" aria-hidden="true" />
    </article>
  );
}
