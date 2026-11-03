"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CinematicVideo from "@/components/CinematicVideo";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { homePageCopy } from "@/data/site-copy";
import { videoExperience } from "@/data/videoExperience";
import styles from "./HomeHero.module.css";

const desktopHoverQuery = "(min-width: 761px) and (hover: hover) and (pointer: fine)";

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
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroAsset = videoExperience.hero;
  const copy = useSiteContentValue("home_page_copy", homePageCopy).hero;

  useEffect(() => () => {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse") return;
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

      <div
        className={cardsOpen ? `${styles.cards} ${styles.cardsOpen}` : styles.cards}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && window.matchMedia(desktopHoverQuery).matches) {
            if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
            setCardsOpen(true);
          }
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && window.matchMedia(desktopHoverQuery).matches) {
            if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
            hoverCloseTimer.current = setTimeout(() => setCardsOpen(false), 120);
          }
        }}
        onBlur={(event) => {
          if (window.matchMedia(desktopHoverQuery).matches && !event.currentTarget.contains(event.relatedTarget)) setCardsOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setCardsOpen(false);
        }}
      >
        <div className={styles.statueReveal}>
          <Image
            className={styles.statue}
            src="/assets/artmonia-statue-transparent.png"
            alt=""
            width={1000}
            height={755}
            sizes="(max-width: 760px) 260px, 540px"
            priority
          />
          <button
            className={styles.mobileStatueClose}
            type="button"
            aria-label="Heykəli bağla"
            tabIndex={cardsOpen ? 0 : -1}
            disabled={!cardsOpen}
            onClick={() => {
              if (!window.matchMedia("(max-width: 760px)").matches) return;
              setCardsOpen(false);
            }}
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
          onClick={(event) => {
            setCardsOpen((open) => !open);
          }}
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
