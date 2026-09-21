"use client";
/* Admin-uploaded media may use external storage URLs. */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSiteContentValue } from "./SiteContentContext";
import { publishedBlog } from "@/lib/blog";
import styles from "./BlogSection.module.css";

export default function BlogSection({ archive = false }: { archive?: boolean }) {
  const content = useSiteContentValue("blog_posts", []);
  const posts = publishedBlog(content);
  const [visible, setVisible] = useState(12);
  if (!posts.length && !archive) return null;
  const Heading = archive ? "h1" : "h2";
  return <section className={`${styles.section} ${archive ? styles.archive : ""}`} id="blog" aria-labelledby="blog-title">
    <header className={styles.heading}><div><Heading id="blog-title">Blog</Heading><p>Sənətə başqa baxış.</p></div><Link className={styles.button} href={archive ? "/" : "/blog"}>{archive ? "Ana səhifə" : "Bütün yazılar"}<ArrowRight size={20} /></Link></header>
    {!posts.length ? <p>Yeni yazılar tezliklə burada olacaq.</p> : <div className={archive ? styles.grid : styles.rail}>
      {posts.slice(0, archive ? visible : 8).map((post) => <article className={styles.card} key={post.id}>
        <Link className={styles.cardLink} href={`/blog/${encodeURIComponent(post.id)}`}>
          {post.image ? <img className={styles.image} src={post.image} alt={post.imageAlt || post.title} loading="lazy" /> : <div className={styles.noImage}>Artmonia</div>}
          <div className={styles.copy}><span className={styles.category}>{post.category}</span><h2 className={styles.title}>{post.title}</h2><p>{post.excerpt}</p><span className={styles.read}>Oxumağa davam et <ArrowRight size={18} aria-hidden="true" /></span></div>
        </Link>
      </article>)}
    </div>}
    {archive && visible < posts.length ? <button className={styles.button} type="button" onClick={() => setVisible((n) => n + 12)}>Daha çox <ArrowRight size={18} /></button> : null}
  </section>;
}
