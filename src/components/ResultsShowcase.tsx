"use client";

import Image from "next/image";
import { Clock3, MoveHorizontal, Pause, Play, Quote, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "@/components/ResultsShowcase.module.css";
import { useSiteContentValue } from "@/components/SiteContentContext";
import { successStories, type SuccessStoryEntry } from "@/data/collections";

type ResultComparison = {
  id: "portrait" | "color";
  title: string;
  before: string;
  beforeAlt: string;
  after: string;
  afterAlt: string;
  note: string;
  period: string;
};

const resultComparisons: ResultComparison[] = [
  {
    id: "portrait",
    title: "Xətdən ifadəyə",
    before: "/assets/module-proportion.webp",
    beforeAlt: "Əvvəl: ilkin anatomiya və proporsiya eskizləri",
    after: "/assets/article-portrait-technique.webp",
    afterAlt: "Sonra: tamamlanmış qrafit portret işi",
    note: "Proporsiya, ton keçidləri və detal nəzarətində aydın inkişaf görünür.",
    period: "6 həftə"
  },
  {
    id: "color",
    title: "Tondan rəngə",
    before: "/assets/module-light-shadow.webp",
    beforeAlt: "Əvvəl: işıq və kölgə məşqi",
    after: "/assets/module-final-project.webp",
    afterAlt: "Sonra: rəng və kompozisiya ilə tamamlanmış final işi",
    note: "İşıq məntiqi qorunaraq rəng, faktura və kompozisiya vahid nəticəyə çevrilib.",
    period: "8 həftə"
  }
];

const comparisonStyle = (position: number) =>
  ({ "--comparison-position": `${position}%` }) as CSSProperties;

export default function ResultsShowcase() {
  const dynamicStories = useSiteContentValue<SuccessStoryEntry[]>("success_stories", successStories);
  const stories = Array.isArray(dynamicStories) && dynamicStories.length ? dynamicStories : successStories;
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(successStories[0].id);
  const [comparisonPositions, setComparisonPositions] = useState({ portrait: 52, color: 48 });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const selectedStory = stories.find((story) => story.id === selectedStoryId) ?? stories[0];

  useEffect(() => {
    if (!storyModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStoryModalOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [storyModalOpen]);

  const openStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setStoryPlaying(false);
    setStoryModalOpen(true);
  };

  const toggleStoryPlayback = () => {
    const video = videoRef.current;
    if (!video) {
      setStoryPlaying((value) => !value);
      return;
    }

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const showcase = (
    <div className="results-showcase">
      <section id="ugur-hekayeleri" className={`results-scene results-story-scene ${styles.anchorScene}`} aria-labelledby="success-stories-title">
        <header className="results-scene-heading">
          <div>
            <span className="results-scene-kicker">Video gündəlik</span>
            <h2 id="success-stories-title">Uğur hekayələri</h2>
          </div>
          <p>Tələbənin ilk xəttindən öz üslubunu tapdığı ana qədər keçdiyi yolu bir hekayədə izlə.</p>
        </header>

        <div className={styles.storyGallery}>
          {stories.map((story) => (
            <button
              className={styles.storyPreviewCard}
              type="button"
              key={story.id}
              aria-haspopup="dialog"
              aria-label={`${story.name} — uğur hekayəsini aç`}
              onClick={() => openStory(story.id)}
            >
              <span className={styles.storyPreviewImage}>
                <Image
                  src={story.poster}
                  alt={story.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 980px) 50vw, 33vw"
                />
                <span className={styles.storyPreviewPlay} aria-hidden="true"><Play /></span>
              </span>
              <span className={styles.storyPreviewCopy}>
                <strong>{story.name}</strong>
                <span>{story.summary || story.quote}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="telebe-neticeleri" className={`results-scene results-comparison-scene ${styles.anchorScene}`} aria-labelledby="student-results-title">
        <header className="results-scene-heading">
          <div>
            <span className="results-scene-kicker">İnkişaf müqayisəsi</span>
            <h2 id="student-results-title">Tələbə nəticələri</h2>
          </div>
        </header>

        <div className={styles.studentResultsPair}>
          {resultComparisons.map((result) => {
            const comparisonPosition = comparisonPositions[result.id];
            return (
              <article className={`before-after-card ${styles.compactResultCard}`} key={result.id}>
                <div
                  className={`before-after-stage ${styles.compactStage}`}
                  style={comparisonStyle(comparisonPosition)}
                >
                  <div className="comparison-image comparison-image--before">
                    <Image
                      src={result.before}
                      alt={result.beforeAlt}
                      fill
                      sizes="(max-width: 800px) 100vw, 44vw"
                    />
                  </div>
                  <div className="comparison-image comparison-image--after">
                    <Image
                      src={result.after}
                      alt={result.afterAlt}
                      fill
                      sizes="(max-width: 800px) 100vw, 44vw"
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
                    onChange={(event) => {
                      const position = Number(event.target.value);
                      setComparisonPositions((current) => ({ ...current, [result.id]: position }));
                    }}
                    aria-label={`${result.title}: əvvəl və sonra şəkillərinin müqayisə xətti`}
                  />
                </div>

                <div className={`before-after-details ${styles.compactDetails}`}>
                  <div className="before-after-title">
                    <span>Tələbə işi</span>
                    <h3>{result.title}</h3>
                  </div>
                  <div className="before-after-note">
                    <span>Mentor qeydi</span>
                    <p>{result.note}</p>
                  </div>
                  <div className="before-after-period">
                    <Clock3 aria-hidden="true" />
                    <div>
                      <span>İnkişaf müddəti</span>
                      <strong>{result.period}</strong>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );

  return (
    <>
      {showcase}
      {storyModalOpen
        ? createPortal(
            <div className={styles.storyModalBackdrop} onMouseDown={() => setStoryModalOpen(false)}>
              <section
                className={styles.storyPlayerModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="story-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <h3 id="story-modal-title" className={styles.visuallyHidden}>{selectedStory.name} uğur hekayəsi</h3>
                <button
                  ref={closeButtonRef}
                  className={styles.storyPlayerClose}
                  type="button"
                  aria-label="Video pəncərəsini bağla"
                  onClick={() => setStoryModalOpen(false)}
                >
                  <X aria-hidden="true" />
                </button>

                <article className={`success-story-card ${styles.storyModalPlayerCard}`}>
                  <div className={`success-story-media${storyPlaying ? " is-playing" : ""}`}>
                    {selectedStory.video ? (
                      <video
                        key={selectedStory.video}
                        ref={videoRef}
                        className="success-story-poster"
                        src={selectedStory.video}
                        poster={selectedStory.poster}
                        playsInline
                        preload="metadata"
                        onPlay={() => setStoryPlaying(true)}
                        onPause={() => setStoryPlaying(false)}
                        onEnded={() => setStoryPlaying(false)}
                      />
                    ) : (
                      <Image
                        key={selectedStory.poster}
                        className="success-story-poster"
                        src={selectedStory.poster}
                        alt={selectedStory.alt}
                        fill
                        priority
                        sizes="(max-width: 820px) 100vw, 70vw"
                      />
                    )}
                    <div className="success-story-shade" aria-hidden="true" />
                    <button
                      className="story-play-button"
                      type="button"
                      aria-label={storyPlaying ? "Video hekayəsini dayandır" : "Video hekayəsini oynat"}
                      aria-pressed={storyPlaying}
                      onClick={toggleStoryPlayback}
                    >
                      {storyPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                    </button>

                    <div className="story-video-meta">
                      <span className="story-video-tag">{selectedStory.name}</span>
                      <div className="story-video-controls" aria-hidden="true">
                        <span>00:00</span>
                        <i><b /></i>
                        <span>{selectedStory.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="success-story-copy">
                    <Quote className="success-story-quote-icon" aria-hidden="true" />
                    <blockquote>{selectedStory.quote}</blockquote>
                    <div className="success-story-person">
                      <strong>{selectedStory.name}</strong>
                      <span>{selectedStory.program}</span>
                    </div>
                    <div className="success-story-footnote">
                      <Clock3 aria-hidden="true" />
                      <span>{selectedStory.note}</span>
                    </div>
                  </div>
                </article>
              </section>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
