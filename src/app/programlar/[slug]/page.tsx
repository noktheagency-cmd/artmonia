import type { Metadata } from "next";
import { pageMetadata, breadcrumb, absoluteUrl, SITE_URL } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";
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

import { withProgramDetail, type Program } from "@/lib/program-content";

type Course = Program;
const slugFor = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

async function findCourse(slug: string): Promise<Course | undefined> {
  const content = await getPublishedContent();
  const list = Array.isArray(content.courses) ? content.courses as Course[] : courses;
  const found = list.find((course) => slugFor(course.title) === decodeURIComponent(slug));
  return found ? withProgramDetail(found) : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const course = await findCourse((await params).slug);
  return course ? pageMetadata(`${course.title} | Artmonia Academy`, course.text, `/programlar/${encodeURIComponent(slugFor(course.title))}`, course.detail.image || undefined) : { title: "Proqram tapılmadı | Artmonia Academy", robots: { index: false } };
}

export default async function ProgramDetail({ params }: { params: Promise<{ slug: string }> }) {
  const content = await getPublishedContent();
  const dynamic = Array.isArray(content.courses) ? content.courses as Course[] : courses;
  const { slug } = await params;
  const storedCourse = dynamic.find((item) => slugFor(item.title) === decodeURIComponent(slug));
  if (!storedCourse) notFound();
  const course = withProgramDetail(storedCourse);
  const detail = course.detail;
  const savedContact = content.contact;
  const phone = savedContact && typeof savedContact === "object" && !Array.isArray(savedContact)
    && typeof savedContact.phone === "string" ? savedContact.phone : contact.phone;
  const digits = phone.replace(/\D/g, "") || contact.phone.replace(/\D/g, "");
  const message = `Salam! “${course.title}” proqramı haqqında əlavə məlumat almaq istəyirəm.`;
  const whatsappUrl = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  const audienceIcons = [Brush, GraduationCap, Images, Palette];
  return <SiteContentProvider content={content}><SiteHeader /><main className={styles.page}>
    <StructuredData data={[
      { "@context": "https://schema.org", "@type": "Course", name: course.title, description: course.text, url: absoluteUrl(`/programlar/${encodeURIComponent(slugFor(course.title))}`), inLanguage: "az", provider: { "@type": "EducationalOrganization", "@id": `${SITE_URL}/#organization`, name: "Artmonia Academy", url: SITE_URL } },
      breadcrumb(course.title, `/programlar/${encodeURIComponent(slugFor(course.title))}`)
    ]} />
    <section className={styles.hero} style={{ "--accent": course.color } as CSSProperties}>
      <Link className={styles.back} href="/#program">← {detail.backLabel}</Link>
      <div className={styles.copy}><span className={styles.eyebrow}>{course.duration}</span><h1>{course.title}</h1><p className={styles.lead}>{course.text}</p><a className={styles.cta} href={whatsappUrl} target="_blank" rel="noopener noreferrer">{detail.cta} <span>↗</span></a></div>
      {detail.image && <div className={styles.media}><img src={detail.image} alt={course.title} /></div>}
    </section>
    <section className={styles.audience}><div className={styles.sectionHeading}><span>{detail.audienceLabel}</span><h2>{detail.audienceTitle}</h2></div><div className={styles.audienceGrid}>{detail.audience.map((item, index) => { const Icon = audienceIcons[index % audienceIcons.length]; return <article className={styles.audienceCard} key={index}>{item.image ? <img className={styles.contentImage} src={item.image} alt="" /> : <Icon aria-hidden="true" strokeWidth={1.3} />}<p>{item.text}</p></article>; })}</div></section>
    <section className={styles.learning}><div className={styles.sectionHeading}><span>{detail.learningLabel}</span><h2>{detail.learningTitle}</h2><div className={styles.artMark} aria-hidden="true"><Palette strokeWidth={.7} /></div></div><div className={styles.syllabus}>{detail.syllabus.map((item, index) => <details key={index} open><summary><strong>{item.title}</strong><ChevronDown className={styles.chevron} aria-hidden="true" /></summary><div className={styles.topicList}>{item.image && <img className={styles.contentImage} src={item.image} alt="" />}<p style={{ whiteSpace: "pre-line" }}>{item.text}</p></div></details>)}</div></section>
    <section className={styles.details}><div className={styles.enrollCopy}><span className={styles.eyebrow}>{detail.enrollLabel}</span><h2>{detail.enrollTitle}</h2><p>{detail.enrollText}</p>{detail.enrollImage && <img className={styles.contentImage} src={detail.enrollImage} alt="" />}</div><div className={styles.enrollPanel}><dl className={styles.facts}><div><dt>{detail.durationLabel}</dt><dd>{course.duration}</dd></div><div><dt>{detail.priceLabel}</dt><dd>{course.price?.trim() || detail.priceFallback}</dd></div></dl><a className={styles.secondaryCta} href={whatsappUrl} target="_blank" rel="noopener noreferrer">{detail.enrollCta} <ArrowUpRight aria-hidden="true" /></a></div></section>
  </main></SiteContentProvider>;
}
