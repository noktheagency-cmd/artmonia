"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import styles from "./ResultsShowcase.module.css";
import { useSiteContentValue } from "./SiteContentContext";
import { successStories, type SuccessStoryEntry } from "@/data/collections";
import { collectionsPageCopy } from "@/data/site-copy";
import { youtubeId } from "@/lib/youtube";

export default function ResultsShowcase() {
  const dynamicStories = useSiteContentValue<SuccessStoryEntry[]>("success_stories", successStories);
  const copy = useSiteContentValue("collections_page_copy", collectionsPageCopy).results;
  const stories = Array.isArray(dynamicStories) ? dynamicStories : [];
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="results-showcase">
      <section id="ugur-hekayeleri" className={`results-scene results-story-scene ${styles.anchorScene}`} aria-labelledby="success-stories-title">
        <header className="results-scene-heading">
          <div><span className="results-scene-kicker">{copy.storiesKicker}</span><h2 id="success-stories-title">{copy.storiesTitle}</h2></div>
          <p>{copy.storiesText}</p>
        </header>
        <div className={styles.storyGallery}>
          {stories.map((story, index) => {
            const id = youtubeId(story.video);
            const key = story.id || String(index);
            return (
              <article className={styles.videoCard} key={key}>
                <div className={styles.videoFrame}>
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
                    <button className={styles.videoCover} type="button" disabled={!id} onClick={() => setActive(key)} aria-label={id ? `${story.name} — videonu oynat` : `${story.name} — video əlavə edilməyib`}>
                      {(id || story.poster) && <img src={id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : story.poster} alt={story.alt || story.name} loading="lazy" />}
                      {id ? <span className={styles.youtubePlay} aria-hidden="true"><Play /></span> : <span className={styles.pending}>Video tezliklə</span>}
                      <strong className={styles.coverName}>{story.name}</strong>
                    </button>
                  )}
                </div>
                {id && active === key && <div className={styles.activeCaption}><strong>{story.name}</strong><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">YouTube-da aç ↗</a></div>}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
