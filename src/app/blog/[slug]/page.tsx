/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { pageMetadata, absoluteUrl, breadcrumb, SITE_URL } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
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
  return post ? pageMetadata(`${post.title} | Artmonia Blog`, post.excerpt, `/blog/${encodeURIComponent(post.id)}`, post.image || undefined, true) : { title: "Yazı tapılmadı", robots: { index: false } };
}
export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const content = await getPublishedContent();
  const post = publishedBlog(content.blog_posts).find((entry) => entry.id === slug);
  if (!post) notFound();
  return <SiteContentProvider content={content}><SiteHeader /><main className={`${styles.section} ${styles.archive} ${styles.article}`}><article>
    <StructuredData data={[
      { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, image: post.image ? absoluteUrl(post.image) : undefined, datePublished: /^\d{4}-\d{2}-\d{2}$/.test(post.date) ? post.date : undefined, inLanguage: "az", mainEntityOfPage: absoluteUrl(`/blog/${encodeURIComponent(post.id)}`), author: post.author ? { "@type": "Person", name: post.author } : undefined, publisher: { "@type": "EducationalOrganization", "@id": `${SITE_URL}/#organization`, name: "Artmonia Academy", url: SITE_URL } },
      breadcrumb(post.title, `/blog/${encodeURIComponent(post.id)}`, { name: "Blog", path: "/blog" })
    ]} />
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
