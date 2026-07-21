"use client";

import Image from "next/image";
import { Clock3, Menu, MoveHorizontal, Pause, Play, Quote, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "@/components/ResultsShowcase.module.css";

type Story = {
  id: string;
  name: string;
  program: string;
  duration: string;
  poster: string;
  alt: string;
  quote: string;
  note: string;
};

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

const stories: Story[] = [
  {
    id: "aylin",
    name: "Aylin Məmmədli",
    program: "Akademik rəsm",
    duration: "00:42",
    poster: "/assets/about-art-system.webp",
    alt: "Molbert qarşısında portret üzərində çalışan tələbə",
    quote: "İlk dəfə başladığım işi yarımçıq saxlamadım. Hər həftə aldığım rəy növbəti addımı aydınlaşdırdı.",
    note: "Portret proqramı · həftəlik fərdi mentor rəyi"
  },
  {
    id: "nargiz",
    name: "Nərgiz Əliyeva",
    program: "Rəng və boyama",
    duration: "01:08",
    poster: "/assets/footer-cta-portrait.webp",
    alt: "Emalatxanada rəngli əsər üzərində çalışan tələbə",
    quote: "Rəngdən qorxurdum. İndi palitranı düşünərək qurur, hər tonu nə üçün seçdiyimi bilirəm.",
    note: "Rəng proqramı · kompozisiya və palitra işi"
  },
  {
    id: "murad",
    name: "Murad Həsənli",
    program: "Final layihə",
    duration: "00:55",
    poster: "/assets/module-final-project.webp",
    alt: "Molbertdə tamamlanmış rəngli final əsəri",
    quote: "Eskizdən final işinə qədər hər mərhələnin öz qaydası olduğunu öyrəndim. Nəticə artıq təsadüfi deyil.",
    note: "Final layihə · konseptdən təqdimata qədər"
  }
];

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
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [storyMenuOpen, setStoryMenuOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(stories[0].id);
  const [comparisonPositions, setComparisonPositions] = useState({ portrait: 52, color: 48 });
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedStory = stories.find((story) => story.id === selectedStoryId) ?? stories[0];

  useEffect(() => {
    if (!storyMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStoryMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [storyMenuOpen]);

  const selectStory = (storyId: string) => {
    setSelectedStoryId(storyId);
    setStoryPlaying(true);
    setStoryMenuOpen(false);
  };

  const showcase = (
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
              key={selectedStory.poster}
              className="success-story-poster"
              src={selectedStory.poster}
              alt={selectedStory.alt}
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
            <button className={styles.storyMoreButton} type="button" onClick={() => setStoryMenuOpen(true)}>
              Daha çox <Menu aria-hidden="true" />
            </button>
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
      {storyMenuOpen
        ? createPortal(
            <div className={styles.storyModalBackdrop} onMouseDown={() => setStoryMenuOpen(false)}>
              <section
                className={styles.storyModal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="story-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <header className={styles.storyModalHeader}>
                  <div>
                    <span>Video arxiv</span>
                    <h3 id="story-modal-title">Uğur hekayəsini seç</h3>
                  </div>
                  <button
                    ref={closeButtonRef}
                    className={styles.storyModalClose}
                    type="button"
                    aria-label="Pəncərəni bağla"
                    onClick={() => setStoryMenuOpen(false)}
                  >
                    <X aria-hidden="true" />
                  </button>
                </header>

                <div className={styles.storyList}>
                  {stories.map((story) => (
                    <button
                      className={`${styles.storyListItem}${story.id === selectedStoryId ? ` ${styles.isSelected}` : ""}`}
                      type="button"
                      key={story.id}
                      aria-current={story.id === selectedStoryId ? "true" : undefined}
                      onClick={() => selectStory(story.id)}
                    >
                      <span className={styles.storyListThumb}>
                        <Image src={story.poster} alt="" fill sizes="96px" loading="eager" />
                      </span>
                      <span className={styles.storyListCopy}>
                        <strong>{story.name}</strong>
                        <span>{story.program}</span>
                      </span>
                      <span className={styles.storyListDuration}>{story.duration}</span>
                      <span className={styles.storyListPlay} aria-hidden="true"><Play /></span>
                    </button>
                  ))}
                </div>
              </section>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
