"use client";

import { Play, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import styles from "./ResultsShowcase.module.css";
import homeStyles from "./HomeResultsSection.module.css";
import { useResultAos } from "./useResultAos";
import { useSiteContentValue } from "./SiteContentContext";
import { successStories, type SuccessStoryEntry } from "@/data/collections";
import { collectionsPageCopy } from "@/data/site-copy";
import { youtubeId } from "@/lib/youtube";
import { canOptimizeImage } from "@/lib/image-optimization";
import { useAnimationVisibility } from "./useAnimationVisibility";

const coverSizes = "(max-width: 420px) 82vw, (max-width: 700px) 320px, (max-width: 1180px) 25vw, 265px";

export default function ResultsShowcase() {
  const dynamicStories = useSiteContentValue<SuccessStoryEntry[]>("success_stories", successStories);
  const copy = useSiteContentValue("collections_page_copy", collectionsPageCopy).results;
  const stories = Array.isArray(dynamicStories) ? dynamicStories : [];
  const animationRef = useAnimationVisibility<HTMLDivElement>();
  const copies = stories.length > 1 ? [0, 1] : [0];
  const [active, setActive] = useState<string | null>(null);

  const sectionRef = useResultAos<HTMLDivElement>(stories.map((story, index) => story.id || String(index)).join("|"));

  return (
    <div ref={sectionRef} className="results-showcase">
      <section id="ugur-hekayeleri" className={`results-scene results-story-scene ${styles.anchorScene}`} aria-labelledby="success-stories-title">
        <header className={`results-scene-heading ${homeStyles.aosTarget}`} data-aos="fade-up">
          <div><span className="results-scene-kicker">{copy.storiesKicker}</span><h2 id="success-stories-title">{copy.storiesTitle}</h2></div>
          <p>{copy.storiesText}</p>
        </header>
        <div ref={animationRef} className={styles.storyGallery} role="region" tabIndex={0} aria-roledescription="carousel" aria-label="Uğur hekayələri videoları">
          <div className={styles.storyTrack} data-playing={active !== null} data-single={stories.length < 2} style={{ animationDuration: `${Math.max(30, stories.length * 10)}s` }}>
            {copies.map((instance) => (
              <div className={styles.storyGroup} key={instance}>
                {stories.map((story, index) => {
                  const id = youtubeId(story.video);
                  const cover = story.poster?.trim() || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
                  const loading = instance === 0 && index < 4 ? "eager" : "lazy";
                  const coverAlt = story.alt || story.name;
                  const key = `${instance}-${story.id || index}`;
                  return (
                    <article className={styles.videoCard} key={key}>
                      <div className={styles.videoFrame} data-open={active === key}>
                        {id && active === key ? (
                          <iframe
                            key={id}
                            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
                            title={`${story.name} — YouTube videosu`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        ) : (
                          <button className={styles.videoCover} type="button" disabled={!id} tabIndex={instance === 1 ? -1 : undefined} onClick={() => setActive(key)} aria-label={id ? `${story.name} — videonu oynat` : `${story.name} — video əlavə edilməyib`}>
                            {cover && (canOptimizeImage(cover) ? (
                              <Image src={cover} alt={coverAlt} fill sizes={coverSizes} loading={loading} fetchPriority="low" />
                            ) : (
                              // External covers may use hosts outside the Next.js image allowlist.
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={cover} alt={coverAlt} loading={loading} fetchPriority="low" decoding="async" />
                            ))}
                            {id ? <span className={styles.youtubePlay} aria-hidden="true"><Play /></span> : <span className={styles.pending}>Video tezliklə</span>}
                          </button>
                        )}
                      </div>
                      <div className={styles.activeCaption}><strong>{story.name}</strong>{active === key && <button type="button" className={styles.closeVideo} onClick={() => setActive(null)} aria-label={`${story.name} — videonu bağla`}><X size={18} /> Bağla</button>}</div>
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
