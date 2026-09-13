"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Palette, UserRound } from "lucide-react";
import { useSiteContentValue } from "./SiteContentContext";
import { studentWorks } from "@/data/student-works";
import { newestWorks } from "@/lib/student-works";
import styles from "./HomeStudentWorks.module.css";

export default function HomeStudentWorks({ archive = false }: { archive?: boolean }) {
  const content = useSiteContentValue<typeof studentWorks>("student_works", { ...studentWorks, items: [] });
  const sortedItems = newestWorks(content.items.filter((item) => item.image && item.name));
  const items = archive ? sortedItems : sortedItems.slice(0, 10);
  const categories = Array.from(new Set(items.map((item) => item.category.trim()).filter(Boolean)));
  const [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(1);
  const rail = useRef<HTMLDivElement>(null);
  const category = selected && categories.includes(selected) ? selected : null;
  const filtered = category ? items.filter((item) => item.category.trim() === category) : items;
  const pages = Math.max(1, Math.ceil(filtered.length / 20));
  const currentPage = Math.min(page, pages);
  const visible = archive ? filtered.slice((currentPage - 1) * 20, currentPage * 20) : filtered;
  const icons = [Pencil, Palette, UserRound];
  function choose(value: string | null) {
    setPage(1);
    setSelected(value);
    rail.current?.scrollTo({ left: 0, behavior: "instant" });
    setProgress(0);
  }
  function scroll(direction: number) {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * .8, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  if (!items.length && !archive) return null;
  return (
    <section id="student-works" className={`${styles.section} ${archive ? styles.archive : ""}`} aria-labelledby="student-works-title">
      {archive && <Link className={styles.back} href="/#student-works">← Ana səhifəyə qayıt</Link>}
      <header className={styles.header}>
        <div><p className={styles.label}>{content.label}</p>{archive ? <h1 id="student-works-title">{content.title}</h1> : <h2 id="student-works-title">{content.title}</h2>}</div>
        <p className={styles.intro}>{content.description}</p>
      </header>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="İşlərin kateqoriyası">
          <button type="button" aria-pressed={!category} onClick={() => choose(null)}>Hamısı</button>
          {categories.map((name, index) => { const Icon = icons[index % icons.length]; return <button type="button" key={name} aria-pressed={category === name} onClick={() => choose(name)}><Icon aria-hidden="true" />{name}</button>; })}
        </div>
        {!archive && <div className={styles.controls}><button type="button" aria-label="Əvvəlki işlər" disabled={progress === 0} onClick={() => scroll(-1)}><ArrowLeft /></button><button type="button" aria-label="Növbəti işlər" onClick={() => scroll(1)}><ArrowRight /></button></div>}
      </div>
      <div ref={rail} className={archive ? styles.archiveGrid : styles.rail} tabIndex={0} role="region" aria-label="Tələbə işləri qalereyası" onScroll={(event) => { const e = event.currentTarget; const max = e.scrollWidth - e.clientWidth; setProgress(max > 0 ? e.scrollLeft / max : 0); }}>
        {visible.map((item) => <article className={styles.card} key={item.id}><img src={item.image} alt={`${item.name} — ${item.program}`} loading="lazy" /><div className={styles.copy}><h3>{item.name}</h3><p>{item.program}</p>{item.quote && <blockquote>{item.quote}</blockquote>}</div></article>)}
      </div>
      {!archive && <div className={styles.progress} aria-hidden="true"><span style={{ transform: `translateX(${progress * 300}%)` }} /></div>}
      {(category || archive) && <p className={styles.status} role="status">{filtered.length} iş{category ? ` · ${category}` : ""}</p>}
      {archive ? <nav className={styles.pagination} aria-label="Qalereya səhifələri"><button disabled={currentPage === 1} onClick={() => { setPage(currentPage - 1); document.getElementById("student-works")?.scrollIntoView(); }}>Əvvəlki</button><span>{currentPage} / {pages}</span><button disabled={currentPage === pages} onClick={() => { setPage(currentPage + 1); document.getElementById("student-works")?.scrollIntoView(); }}>Növbəti</button></nav> : <footer className={styles.footer}><span>Sənət<br />hər kəs üçündür!</span><Link href="/telebe-isleri">{content.allLink}<ArrowRight aria-hidden="true" /></Link></footer>}
    </section>
  );
}
