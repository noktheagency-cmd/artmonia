"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CinematicVideo from "@/components/CinematicVideo";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { homePageCopy } from "@/data/site-copy";
import { videoExperience } from "@/data/videoExperience";
import styles from "./HomeHero.module.css";

function DownArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M6 14 14 6" />
      <path d="M7 6h7v7" />
    </svg>
  );
}

export default function HomeHero() {
  const [cardsOpen, setCardsOpen] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroAsset = videoExperience.hero;
  const copy = useSiteContentValue("home_page_copy", homePageCopy).hero;

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let animationFrame = 0;

    const updateScroll = () => {
      animationFrame = 0;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      hero.style.setProperty("--hero-scroll", progress.toFixed(4));
      hero.style.setProperty("--hero-scroll-shift", `${(progress * 24).toFixed(2)}px`);
      hero.style.setProperty("--hero-scroll-scale", (1.02 + progress * 0.045).toFixed(4));
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateScroll);
    };

    updateScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--hero-pointer-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--hero-pointer-y", `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--hero-shift-x", `${(((x - 50) / 50) * -7).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--hero-shift-y", `${(((y - 50) / 50) * -5).toFixed(2)}px`);
  }

  return (
    <section
      ref={heroRef}
      className={cardsOpen ? `${styles.hero} ${styles.heroActive}` : styles.hero}
      aria-labelledby="home-hero-title"
      onPointerMove={handlePointerMove}
    >
      <div className={styles.background} aria-hidden="true">
        <CinematicVideo
          className={styles.heroFilm}
          eager
          playbackRate={cardsOpen ? 1.16 : 1}
          poster={heroAsset.poster}
          mobilePoster={heroAsset.mobilePoster}
          src={heroAsset.src}
        />
        <span className={styles.pointerAura} />
      </div>

      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowSpark} aria-hidden="true">✦</span>
          <span className={styles.eyebrowWords}>
            {copy.eyebrow.split(/\s+/).map((word, index) => <span key={`${word}-${index}`}>{word}</span>)}
          </span>
        </p>
        <h1 id="home-hero-title">{copy.title}</h1>
      </div>

      <div className={cardsOpen ? `${styles.cards} ${styles.cardsOpen}` : styles.cards}>
        <div className={styles.statueReveal} aria-hidden="true">
          <Image
            className={styles.statue}
            src="/assets/artmonia-statue-transparent.png"
            alt=""
            width={1000}
            height={755}
            sizes="(max-width: 760px) 260px, 540px"
            priority
          />
        </div>

        <article className={`${styles.card} ${styles.cardLeft}`}>
          <p className={styles.cardLabel}>{copy.leftLabel}</p>
          <h2>{copy.leftTitle.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}{index < copy.leftTitle.split("\n").length - 1 ? <br /> : null}</span>)}</h2>
          <span className={styles.cardRule} aria-hidden="true" />
          <p className={styles.cardText}>{copy.leftText}</p>
        </article>

        <button
          className={styles.cardAction}
          type="button"
          aria-label={cardsOpen ? "Kartları bağla" : "Kartları aç"}
          aria-expanded={cardsOpen}
          onClick={() => setCardsOpen((open) => !open)}
        >
        </button>

        <Link
          className={styles.revealCta}
          href="/muraciet"
          tabIndex={cardsOpen ? 0 : -1}
        >
          <span>{copy.cta}</span>
          <ArrowUpRightIcon />
        </Link>

        <article className={`${styles.card} ${styles.cardRight}`}>
          <p className={styles.cardLabel}>{copy.rightLabel}</p>
          <h2>{copy.rightTitle.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}{index < copy.rightTitle.split("\n").length - 1 ? <br /> : null}</span>)}</h2>
          <span className={styles.cardRule} aria-hidden="true" />
          <p className={styles.cardText}>{copy.rightText}</p>
        </article>
      </div>

      <a className={styles.scrollCue} href="#academy" aria-label="Növbəti bölməyə keç">
        <DownArrowIcon />
      </a>
    </section>
  );
}
