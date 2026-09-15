import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";
import { courses } from "@/data/site";
import styles from "./page.module.css";

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
  return <SiteContentProvider content={content}><SiteHeader /><main className={styles.page}>
    <Link className={styles.back} href="/#program">← Proqramlara qayıt</Link>
    <section className={styles.hero} style={{ "--accent": course.color } as CSSProperties}>
      <div className={styles.media}><img src={course.image} alt={course.title} /></div>
      <div className={styles.copy}><span className={styles.duration}>{course.duration}</span><h1>{course.title}</h1><p className={styles.lead}>{course.text}</p><a className={styles.cta} href="/muraciet">Müraciət et <span>↗</span></a></div>
    </section>
    <section className={styles.details}><h2>Proqram haqqında</h2><p>{course.details || course.text}</p><div><strong>Müddət</strong><span>{course.duration}</span></div><div><strong>Qiymət</strong><span>{course.price?.trim() || "Əlaqə saxlayın"}</span></div></section>
  </main></SiteContentProvider>;
}
