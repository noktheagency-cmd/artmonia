"use client";

import { useEffect, useRef } from "react";
import CinematicVideo from "@/components/CinematicVideo";
import { videoExperience } from "@/data/videoExperience";
import styles from "./CinematicJourney.module.css";

const journeySteps = [
  { index: "01", word: "Xəyal" },
  { index: "02", word: "Sistem" },
  { index: "03", word: "Nəticə" }
];

export default function CinematicJourney() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let animationFrame = 0;

    const updateProgress = () => {
      animationFrame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      section.style.setProperty("--film-progress", progress.toFixed(4));
      const isDarkStage =
        rect.top < window.innerHeight * 0.42 &&
        rect.bottom > window.innerHeight * 0.58;
      document.documentElement.classList.toggle("cinematic-journey-active", isDarkStage);
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      document.documentElement.classList.remove("cinematic-journey-active");
    };
  }, []);

  const asset = videoExperience.journey;

  return (
    <section
      id="cinematic-journey"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="cinematic-journey-title"
    >
      <div className={styles.sticky}>
        <CinematicVideo
          className={styles.media}
          poster={asset.poster}
          src={asset.src}
        />
        <div className={styles.inkMask} aria-hidden="true" />
        <div className={styles.content}>
          <h2 id="cinematic-journey-title" className={styles.srOnly}>
            Xəyal, sistem və nəticə
          </h2>
          <div className={styles.steps}>
            {journeySteps.map((step, index) => (
              <div
                className={styles.step}
                key={step.index}
                style={{ "--step-index": index } as React.CSSProperties}
              >
                <span>{step.index}</span>
                <strong>{step.word}</strong>
              </div>
            ))}
          </div>
          <p className={styles.statement}>
            Hər xətt planla çəkilir. Mentor rəyi ilə düzəlir. Nəticəyə çevrilir.
          </p>
          <div className={styles.progress} aria-hidden="true">
            <span />
          </div>
        </div>
      </div>
    </section>
  );
}
