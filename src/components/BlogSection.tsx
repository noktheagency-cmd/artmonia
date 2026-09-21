"use client";
/* Admin-uploaded media may use external storage URLs. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useState } from "react";
import { useSiteContentValue } from "./SiteContentContext";
import { publishedBlog } from "@/lib/blog";
import styles from "./BlogSection.module.css";

export default function BlogSection({ archive = false }: { archive?: boolean }) {
  const content = useSiteContentValue("blog_posts", []);
  const posts = publishedBlog(content);
  const [visible, setVisible] = useState(12);
  const [paused, setPaused] = useState(false);
  const latest = posts.slice(0, 8);
  const loop = latest.length ? Array.from({ length: Math.ceil(4 / latest.length) }, () => latest).flat() : [];
  if (!posts.length && !archive) return null;
  const Heading = archive ? "h1" : "h2";
  return <section className={`${styles.section} ${archive ? styles.archive : ""}`} id="blog" aria-labelledby="blog-title">
    <header className={styles.heading}><div><Heading id="blog-title">Blog</Heading></div><div className={styles.actions}><Link className={styles.button} href={archive ? "/" : "/blog"}>{archive ? "Ana səhifə" : "Bütün yazılar"}<ArrowRight size={20} /></Link>{!archive ? <button className={`${styles.button} ${styles.pause}`} type="button" aria-label={paused ? "Blog lentini davam etdir" : "Blog lentini dayandır"} aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={18} /> : <Pause size={18} />}</button> : null}</div></header>
    {!posts.length ? <p>Yeni yazılar tezliklə burada olacaq.</p> : <div className={archive ? undefined : styles.viewport}>
      <div className={archive ? styles.grid : styles.track} data-paused={paused}>
      {(archive ? [posts.slice(0, visible)] : [loop, loop]).map((group, copy) => <div className={archive ? styles.archiveGroup : styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
      {group.map((post, index) => <article className={styles.card} key={`${post.id}-${index}`} aria-hidden={!archive && index >= latest.length ? true : undefined}>
        <Link tabIndex={copy === 1 || (!archive && index >= latest.length) ? -1 : undefined} className={styles.cardLink} href={`/blog/${encodeURIComponent(post.id)}`}>
          {post.image ? <img className={styles.image} src={post.image} alt={post.imageAlt || post.title} loading="lazy" /> : <div className={styles.noImage}>Artmonia</div>}
          <div className={styles.copy}><span className={styles.category}>{post.category}</span><h2 className={styles.title}>{post.title}</h2><p>{post.excerpt}</p><span className={styles.read}>Oxumağa davam et <ArrowRight size={18} aria-hidden="true" /></span></div>
        </Link>
      </article>)}
      </div>)}
      </div>
    </div>}
    {archive && visible < posts.length ? <button className={styles.button} type="button" onClick={() => setVisible((n) => n + 12)}>Daha çox <ArrowRight size={18} /></button> : null}
  </section>;
}
