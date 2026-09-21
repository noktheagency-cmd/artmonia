/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";
import { publishedBlog } from "@/lib/blog";
import { formatNewsDate } from "@/lib/news";
import styles from "@/components/BlogSection.module.css";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPublishedContent();
  const post = publishedBlog(content.blog_posts).find((entry) => entry.id === slug);
  return post ? { title: `${post.title} | Artmonia Blog`, description: post.excerpt } : { title: "Yazı tapılmadı" };
}
export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const content = await getPublishedContent();
  const post = publishedBlog(content.blog_posts).find((entry) => entry.id === slug);
  if (!post) notFound();
  return <SiteContentProvider content={content}><SiteHeader /><main className={`${styles.section} ${styles.archive} ${styles.article}`}><article>
    <Link className={styles.button} href="/blog"><ArrowLeft size={18} /> Bütün yazılar</Link>
    <div className={`${styles.detailLayout} ${!post.image ? styles.textOnly : ""}`}>
    {post.image ? <div className={styles.coverPanel}><img className={styles.cover} src={post.image} alt={post.imageAlt || post.title} /></div> : null}
    <div className={styles.detailCopy}>
    <div className={styles.meta}><span>{post.category}</span><time dateTime={post.date}>{formatNewsDate(post.date)}</time>{post.author ? <span>{post.author}</span> : null}</div>
    <h1>{post.title}</h1><p className={styles.lead}>{post.excerpt}</p>
    <div className={styles.body}>{post.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    </div></div>
  </article></main></SiteContentProvider>;
}
