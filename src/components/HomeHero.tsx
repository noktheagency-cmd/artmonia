"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./HomeHero.module.css";

function SplitArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 18">
      <path d="m10 3-6 6 6 6" />
      <path d="m18 3 6 6-6 6" />
    </svg>
  );
}

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

  return (
    <section className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.heading}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowSpark} aria-hidden="true">✦</span>
          <span className={styles.eyebrowWords}>
            <span>Xəyal</span>
            <span>etdiyin</span>
            <span>hər</span>
            <span>şey</span>
            <span>gerçəkdir</span>
          </span>
        </p>
        <h1 id="home-hero-title">Artmonia Academy</h1>
      </div>

      <div className={cardsOpen ? `${styles.cards} ${styles.cardsOpen}` : styles.cards}>
        <div className={styles.statueReveal} aria-hidden="true">
          <Image
            className={styles.statue}
            src="/assets/artmonia-statue-transparent.png"
            alt=""
            width={1000}
            height={755}
            sizes="(max-width: 760px) 190px, 540px"
          />
        </div>

        <article className={`${styles.card} ${styles.cardLeft}`}>
          <p className={styles.cardLabel}>Artmonia Academy</p>
          <h2>Fırçanı tut,<br />sənətkar ol.</h2>
          <span className={styles.cardRule} aria-hidden="true" />
          <p className={styles.cardText}>
            Sistem. Rəy. Nəticə — peşəkar mentorlarla 6 həftəlik akademik rəsm proqramı.
          </p>
        </article>

        <button
          className={styles.cardAction}
          type="button"
          aria-label={cardsOpen ? "Kartları bağla" : "Kartları aç"}
          aria-expanded={cardsOpen}
          onClick={() => setCardsOpen((open) => !open)}
        >
          <SplitArrowIcon />
        </button>

        <Link
          className={styles.revealCta}
          href="/muraciet"
          tabIndex={cardsOpen ? 0 : -1}
        >
          <span>Ödənişsiz konsultasiyaya qoşul</span>
          <ArrowUpRightIcon />
        </Link>

        <article className={`${styles.card} ${styles.cardRight}`}>
          <p className={styles.cardLabel}>Akademik ritm</p>
          <h2>Klassik rəsm<br />intizamı,<br />müasir tədris.</h2>
          <span className={styles.cardRule} aria-hidden="true" />
          <p className={styles.cardText}>
            Texnika, müşahidə və yaradıcılıq birləşir, sənət formalaşır.
          </p>
        </article>
      </div>

      <a className={styles.scrollCue} href="#academy" aria-label="Növbəti bölməyə keç">
        <DownArrowIcon />
      </a>
    </section>
  );
}
