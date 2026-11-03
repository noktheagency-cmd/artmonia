"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import styles from "./ResultsShowcase.module.css";
import homeStyles from "./HomeResultsSection.module.css";
import { useResultAos } from "./useResultAos";
import { useSiteContentValue } from "./SiteContentContext";
import { successStories, type SuccessStoryEntry } from "@/data/collections";
import { collectionsPageCopy } from "@/data/site-copy";
import { youtubeId } from "@/lib/youtube";
import { useAnimationVisibility } from "./useAnimationVisibility";

export default function ResultsShowcase() {
  const dynamicStories = useSiteContentValue<SuccessStoryEntry[]>("success_stories", successStories);
  const copy = useSiteContentValue("collections_page_copy", collectionsPageCopy).results;
  const stories = Array.isArray(dynamicStories) ? dynamicStories : [];
  const copies = stories.length > 1 ? [0, 1] : [0];
  const [active, setActive] = useState<string | null>(null);
  const animationRef = useAnimationVisibility<HTMLDivElement>();
  const sectionRef = useResultAos<HTMLDivElement>(stories.map((story, index) => story.id || String(index)).join("|"));

  return (
    <div ref={sectionRef} className="results-showcase">
      <section id="ugur-hekayeleri" className={`results-scene results-story-scene ${styles.anchorScene}`} aria-labelledby="success-stories-title">
        <header className={`results-scene-heading ${homeStyles.aosTarget}`} data-aos="fade-up">
          <div><span className="results-scene-kicker">{copy.storiesKicker}</span><h2 id="success-stories-title">{copy.storiesTitle}</h2></div>
          <p>{copy.storiesText}</p>
        </header>
        <div ref={animationRef} className={styles.storyGallery} role="region" tabIndex={0} aria-roledescription="carousel" aria-label="Uğur hekayələri videoları">
          <div className={styles.storyTrack} data-playing={active !== null} data-single={stories.length < 2} style={{ animationDuration: `${Math.max(24, stories.length * 8)}s` }}>
            {copies.map((copy) => (
              <div className={styles.storyGroup} key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {stories.map((story, index) => {
                  const id = youtubeId(story.video);
                  const cover = story.poster?.trim() || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
                  const key = story.id || String(index);
                  return (
                    <article className={`${styles.videoCard} ${copy === 0 ? homeStyles.aosTarget : ""}`} data-aos={copy === 0 ? "fade-up" : undefined} key={`${copy}-${key}`}>
                      <div className={styles.videoFrame}>
                        {id && active === key && copy === 0 ? (
                          <iframe
                            key={id}
                            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
                            title={`${story.name} — YouTube videosu`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        ) : (
                          <button className={styles.videoCover} type="button" disabled={!id || copy === 1} tabIndex={copy === 1 ? -1 : undefined} onClick={() => setActive(key)} aria-label={id ? `${story.name} — videonu oynat` : `${story.name} — video əlavə edilməyib`}>
                            {cover && <img src={cover} alt={copy === 0 ? story.alt || story.name : ""} loading="lazy" />}
                            {id ? <span className={styles.youtubePlay} aria-hidden="true"><Play /></span> : <span className={styles.pending}>Video tezliklə</span>}
                            <strong className={styles.coverName}>{story.name}</strong>
                          </button>
                        )}
                      </div>
                      {id && active === key && copy === 0 && <div className={styles.activeCaption}><strong>{story.name}</strong><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">YouTube-da aç ↗</a></div>}
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
