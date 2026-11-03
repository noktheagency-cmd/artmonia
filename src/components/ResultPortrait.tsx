/* Uploaded portraits retain their natural proportions inside a 3:4 crop. */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import type { CollectionEntry } from "@/data/collections";
import { canOptimizeImage } from "@/lib/image-optimization";
import styles from "./HomeResultsSection.module.css";

export default function ResultPortrait({ student }: { student: CollectionEntry }) {
  if (student.image) return (
    <div className={styles.portrait}>
      {canOptimizeImage(student.image) ? (
        <Image className={styles.uploadedPortrait} src={student.image} alt={student.title} fill sizes="(max-width: 760px) 68vw, 18vw" quality={85} loading="lazy" />
      ) : (
        <img className={styles.uploadedPortrait} src={student.image} alt={student.title} loading="lazy" decoding="async" />
      )}
    </div>
  );
  const index = student.demoPortrait;
  return <div className={`${styles.portrait} ${typeof index === "number" ? styles.demoPortrait : ""}`} role="img" aria-label={student.title} style={typeof index === "number" ? { backgroundPosition: `${(index % 5) * 25}% ${index < 5 ? 0 : 100}%` } : undefined} />;
}
