"use client";

import Link from "next/link";
import homeStyles from "./HomeResultsSection.module.css";
import { useResultAos } from "./useResultAos";

export default function CollectionIntro({ title, description, backHome, animate }: { title: string; description: string; backHome: string; animate: boolean }) {
  const sectionRef = useResultAos<HTMLElement>(`${title}:${description}:${backHome}`);
  const animationClass = animate ? homeStyles.aosTarget : "";

  return (
    <section ref={sectionRef} className="collection-intro" aria-labelledby="collection-title">
      <div className={`collection-intro-title ${animationClass}`} data-aos={animate ? "fade-up" : undefined}>
        <h1 id="collection-title">{title}</h1>
        <span aria-hidden="true" />
      </div>
      <div className={`collection-intro-copy ${animationClass}`} data-aos={animate ? "fade-up" : undefined}>
        <p>{description}</p>
        <Link className="collection-back collection-back--intro" href="/">
          <span aria-hidden="true">←</span> {backHome}
        </Link>
      </div>
    </section>
  );
}
