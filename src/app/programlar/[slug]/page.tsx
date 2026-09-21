import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Brush, GraduationCap, Images, Palette, ChevronDown } from "lucide-react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";
import { contact, courses } from "@/data/site";
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
  const savedContact = content.contact;
  const phone = savedContact && typeof savedContact === "object" && !Array.isArray(savedContact)
    && typeof savedContact.phone === "string" ? savedContact.phone : contact.phone;
  const digits = phone.replace(/\D/g, "") || contact.phone.replace(/\D/g, "");
  const message = `Salam! “${course.title}” proqramı haqqında əlavə məlumat almaq istəyirəm.`;
  const whatsappUrl = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  const topics = (course.details || course.text)
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const audienceIcons = [Brush, GraduationCap, Images, Palette];
  const audience = [
    "Rəsmə sistemli və sıfırdan başlamaq istəyənlər",
    "Qabiliyyət imtahanına hazırlaşanlar",
    "Portfolyosunu inkişaf etdirmək istəyənlər",
    "Öz yaradıcı üslubunu formalaşdıranlar",
  ];
  return <SiteContentProvider content={content}><SiteHeader /><main className={styles.page}>
    <section className={styles.hero} style={{ "--accent": course.color } as CSSProperties}>
      <Link className={styles.back} href="/#program">← Proqramlara qayıt</Link>
      <div className={styles.copy}><span className={styles.eyebrow}>{course.duration}</span><h1>{course.title}</h1><p className={styles.lead}>{course.text}</p><a className={styles.cta} href={whatsappUrl} target="_blank" rel="noopener noreferrer">Müraciət et <span>↗</span></a></div>
      <div className={styles.media}><img src={course.image} alt={course.title} /></div>
    </section>
    <section className={styles.audience}><div className={styles.sectionHeading}><span>Artmonia Academy</span><h2>Kimlər üçündür?</h2></div><div className={styles.audienceGrid}>{audience.map((item, index) => { const Icon = audienceIcons[index]; return <article className={styles.audienceCard} key={item}><Icon aria-hidden="true" strokeWidth={1.3} /><p>{item}</p></article>; })}</div></section>
    <section className={styles.learning}><div className={styles.sectionHeading}><span>Proqramın məzmunu</span><h2>Hansı biliklərə <em>hakim olacaqsan?</em></h2><div className={styles.artMark} aria-hidden="true"><Palette strokeWidth={.7} /></div></div><div className={styles.syllabus}><details open><summary><strong>Proqram haqqında</strong><ChevronDown className={styles.chevron} aria-hidden="true" /></summary><div className={styles.topicList}>{topics.map((topic, index) => <p key={`${topic}-${index}`}>{topic}.</p>)}</div></details></div></section>
    <section className={styles.details}><div className={styles.enrollCopy}><span className={styles.eyebrow}>Sənin növbəti addımın</span><h2>Başlamağa <em>hazırsan?</em></h2><p>{course.text}</p></div><div className={styles.enrollPanel}><dl className={styles.facts}><div><dt>Müddət</dt><dd>{course.duration}</dd></div><div><dt>Qiymət</dt><dd>{course.price?.trim() || "Əlaqə saxlayın"}</dd></div></dl><a className={styles.secondaryCta} href={whatsappUrl} target="_blank" rel="noopener noreferrer">Konsultasiya üçün yazıl <ArrowUpRight aria-hidden="true" /></a></div></section>
  </main></SiteContentProvider>;
}
