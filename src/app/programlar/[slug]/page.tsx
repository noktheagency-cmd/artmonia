import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";
import { courses } from "@/data/site";
import styles from "./page.module.css";

/* Course visuals are intentionally rendered with the native image element so
 * admin-uploaded URLs (including Supabase storage URLs) work without a fixed
 * Next image domain allow-list. */
/* eslint-disable @next/next/no-img-element */

type Course = (typeof courses)[number];
const slugFor = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

async function findCourse(slug: string): Promise<Course | undefined> {
  const content = await getPublishedContent();
  const list = Array.isArray(content.courses) ? content.courses as Course[] : courses;
  return list.find((course) => slugFor(course.title) === decodeURIComponent(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = await findCourse((await params).slug);
  return course ? { title: `${course.title} | Artmonia Academy`, description: course.details || course.text } : { title: "Proqram tapılmadı | Artmonia Academy" };
}

export default async function ProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getPublishedContent();
  const dynamic = Array.isArray(content.courses) ? content.courses as Course[] : courses;
  const { slug } = await params;
  const course = dynamic.find((item) => slugFor(item.title) === decodeURIComponent(slug));
  if (!course) notFound();
  const topics = (course.details || course.text)
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
  const audience = [
    "Rəsmə sistemli və sıfırdan başlamaq istəyənlər",
    "Qabiliyyət imtahanına hazırlaşanlar",
    "Portfolyosunu inkişaf etdirmək istəyənlər",
    "Öz yaradıcı üslubunu formalaşdıranlar",
  ];
  return <SiteContentProvider content={content}><SiteHeader /><main className={styles.page}>
    <Link className={styles.back} href="/#program">← Proqramlara qayıt</Link>
    <section className={styles.hero} style={{ "--accent": course.color } as CSSProperties}>
      <div className={styles.copy}><span className={styles.eyebrow}>{course.duration}</span><h1>{course.title}</h1><p className={styles.lead}>{course.text}</p><Link className={styles.cta} href="/muraciet">Müraciət et <span>↗</span></Link></div>
      <div className={styles.media}><img src={course.image} alt={course.title} /></div>
    </section>
    <section className={styles.audience}><div className={styles.sectionHeading}><span>Artmonia Academy</span><h2>Kimlər üçündür?</h2></div><div className={styles.audienceGrid}>{audience.map((item) => <article className={styles.audienceCard} key={item}>{item}</article>)}</div></section>
    <section className={styles.learning}><div className={styles.sectionHeading}><span>Proqramın məzmunu</span><h2>Hansı biliklərə hakim olacaqsan?</h2></div><div className={styles.syllabus}><details open><summary><span>01</span><strong>Proqram haqqında</strong><span className={styles.chevron}>⌄</span></summary><div className={styles.topicList}>{topics.map((topic, index) => <p key={`${topic}-${index}`}>{topic}.</p>)}</div></details></div></section>
    <section className={styles.details}><h2>Başlamağa hazırsan?</h2><p>{course.details || course.text}</p><div><strong>Müddət</strong><span>{course.duration}</span></div><div><strong>Qiymət</strong><span>{course.price?.trim() || "Əlaqə saxlayın"}</span></div><Link className={styles.secondaryCta} href="/muraciet">Konsultasiya üçün yazıl</Link></section>
  </main></SiteContentProvider>;
}
