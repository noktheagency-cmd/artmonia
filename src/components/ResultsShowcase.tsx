"use client";

import Image from "next/image";
import { Clock3, MoveHorizontal, Pause, Play, Quote } from "lucide-react";
import { useState, type CSSProperties } from "react";

const comparisonStyle = (position: number) =>
  ({ "--comparison-position": `${position}%` }) as CSSProperties;

export default function ResultsShowcase() {
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [comparisonPosition, setComparisonPosition] = useState(52);

  return (
    <div className="results-showcase">
      <section className="results-scene results-story-scene" aria-labelledby="success-stories-title">
        <header className="results-scene-heading">
          <div>
            <span className="results-scene-kicker">Video gündəlik</span>
            <h2 id="success-stories-title">Uğur hekayələri</h2>
          </div>
          <p>Tələbənin ilk xəttindən öz üslubunu tapdığı ana qədər keçdiyi yolu bir hekayədə izlə.</p>
        </header>

        <article className="success-story-card">
          <div className={`success-story-media${storyPlaying ? " is-playing" : ""}`}>
            <Image
              className="success-story-poster"
              src="/assets/about-art-system.webp"
              alt="Molbert qarşısında portret üzərində çalışan tələbə"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 70vw"
            />
            <div className="success-story-shade" aria-hidden="true" />
            <button
              className="story-play-button"
              type="button"
              aria-label={storyPlaying ? "Video hekayəsini dayandır" : "Video hekayəsini oynat"}
              aria-pressed={storyPlaying}
              onClick={() => setStoryPlaying((value) => !value)}
            >
              {storyPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
            </button>

            <div className="story-video-meta">
              <span className="story-video-tag">Uğur hekayəsi</span>
              <div className="story-video-controls" aria-hidden="true">
                <span>00:00</span>
                <i><b /></i>
                <span>00:42</span>
              </div>
            </div>
          </div>

          <div className="success-story-copy">
            <Quote className="success-story-quote-icon" aria-hidden="true" />
            <blockquote>
              İlk dəfə başladığım işi yarımçıq saxlamadım. Hər həftə aldığım rəy növbəti addımı aydınlaşdırdı.
            </blockquote>
            <div className="success-story-person">
              <strong>Akademik rəsm tələbəsi</strong>
              <span>6 həftəlik inkişaf gündəliyi</span>
            </div>
            <div className="success-story-footnote">
              <Clock3 aria-hidden="true" />
              <span>Portret proqramı · həftəlik fərdi mentor rəyi</span>
            </div>
          </div>
        </article>
      </section>

      <section className="results-scene results-comparison-scene" aria-labelledby="student-results-title">
        <header className="results-scene-heading results-scene-heading--reverse">
          <div>
            <span className="results-scene-kicker">İnkişaf müqayisəsi</span>
            <h2 id="student-results-title">Tələbə nəticələri</h2>
          </div>
          <p>Başlanğıc işi ilə proqram sonundakı nəticə eyni səhnədə aydın şəkildə görünür.</p>
        </header>

        <article className="before-after-card">
          <div className="before-after-stage" style={comparisonStyle(comparisonPosition)}>
            <div className="comparison-image comparison-image--before">
              <Image
                src="/assets/module-proportion.webp"
                alt="Əvvəl: ilkin anatomiya və proporsiya eskizləri"
                fill
                sizes="(max-width: 820px) 100vw, 72vw"
              />
            </div>
            <div className="comparison-image comparison-image--after">
              <Image
                src="/assets/article-portrait-technique.webp"
                alt="Sonra: tamamlanmış qrafit portret işi"
                fill
                sizes="(max-width: 820px) 100vw, 72vw"
              />
            </div>

            <span className="comparison-label comparison-label--before">Əvvəl</span>
            <span className="comparison-label comparison-label--after">Sonra</span>
            <div className="comparison-divider" aria-hidden="true">
              <span><MoveHorizontal /></span>
            </div>
            <input
              className="comparison-range"
              type="range"
              min="12"
              max="88"
              value={comparisonPosition}
              onChange={(event) => setComparisonPosition(Number(event.target.value))}
              aria-label="Əvvəl və sonra şəkillərinin müqayisə xətti"
            />
          </div>

          <div className="before-after-details">
            <div className="before-after-title">
              <span>Tələbə işi</span>
              <h3>Xətdən ifadəyə</h3>
            </div>
            <div className="before-after-note">
              <span>Mentor qeydi</span>
              <p>Proporsiya, ton keçidləri və detal nəzarətində aydın inkişaf görünür.</p>
            </div>
            <div className="before-after-period">
              <Clock3 aria-hidden="true" />
              <div>
                <span>İnkişaf müddəti</span>
                <strong>6 həftə</strong>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
