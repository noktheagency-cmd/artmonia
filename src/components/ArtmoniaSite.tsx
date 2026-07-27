"use client";

/* Static art assets need exact CSS-driven cropping and reveal effects. */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  contact,
  courses,
  galleryImages,
  heroPaperSettings,
  packages,
  painPoints,
  testimonials,
  transformations
} from "@/data/site";
import SiteHeader from "@/components/SiteHeader";
import HomeNewsSection from "@/components/HomeNewsSection";
import { SiteContentProvider, useSiteContentValue } from "@/components/SiteContentContext";
import type { SiteContentMap } from "@/lib/site-content";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Reveal({
  children,
  className = "",
  id,
  onPointerMove,
  style,
  variant = "from-bottom"
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  variant?: "from-left" | "from-right" | "from-bottom" | "from-top" | "boom" | "flip";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -4% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} className={`reveal ${variant} ${className}`} style={style} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}

function BrushField() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPos({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      className="brush-field"
      style={
        {
          "--mx": `${pos.x}%`,
          "--my": `${pos.y}%`
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="brush-orbit orbit-one" />
      <div className="brush-orbit orbit-two" />
      <div className="ink-line ink-a" />
      <div className="ink-line ink-b" />
    </div>
  );
}

function useTiltTargets() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const cleanups = targets.map((target) => {
      const onMove = (event: PointerEvent) => {
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        target.style.setProperty("--tilt-x", `${x * 8}deg`);
        target.style.setProperty("--tilt-y", `${y * -8}deg`);
      };
      const onLeave = () => {
        target.style.setProperty("--tilt-x", "0deg");
        target.style.setProperty("--tilt-y", "0deg");
      };
      target.addEventListener("pointermove", onMove);
      target.addEventListener("pointerleave", onLeave);
      return () => {
        target.removeEventListener("pointermove", onMove);
        target.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);
}

function NavAtelierAnimation() {
  const stageRef = useRef<HTMLElement | null>(null);
  const dynamicPaperSettings = useSiteContentValue("hero_paper_settings", heroPaperSettings);
  const paperComponents = Array.isArray(dynamicPaperSettings.components) ? dynamicPaperSettings.components : heroPaperSettings.components;
  const paperColor = (id: "left" | "center" | "right") =>
    paperComponents.find((component) => component.id === id)?.color
    ?? heroPaperSettings.components.find((component) => component.id === id)?.color
    ?? "#fffdf8";
  const paperRadius = typeof dynamicPaperSettings.ovalRadius === "number"
    ? Math.min(Math.max(dynamicPaperSettings.ovalRadius, 8), 58)
    : heroPaperSettings.ovalRadius;
  const paperStyle = {
    "--paper-left-color": paperColor("left"),
    "--paper-center-color": paperColor("center"),
    "--paper-right-color": paperColor("right"),
    "--paper-oval-radius": `${paperRadius}px`
  } as React.CSSProperties;

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let closeTimer: number | undefined;

    const wakeStage = () => {
      if (closeTimer) window.clearTimeout(closeTimer);
      stage.classList.add("is-awake");
    };

    const sleepStage = () => {
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(() => {
        stage.classList.remove("is-awake");
      }, 120);
    };

    const handlePointerEnter = () => {
      wakeStage();
    };

    const handlePointerMove = (event: PointerEvent | MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
      const threshold = Math.min(rect.width, rect.height) * 0.34;
      if (distance < threshold) wakeStage();
      wakeStage();
      stage.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
      stage.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
    };

    const handleWindowMove = (event: MouseEvent) => {
      const trigger = stage.querySelector(".torn-paper");
      const rect = (trigger ?? stage).getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside) {
        wakeStage();
        const stageRect = stage.getBoundingClientRect();
        stage.style.setProperty("--cursor-x", `${event.clientX - stageRect.left}px`);
        stage.style.setProperty("--cursor-y", `${event.clientY - stageRect.top}px`);
      } else {
        sleepStage();
      }
    };

    const handlePointerLeave = () => {
      sleepStage();
    };

    stage.addEventListener("mouseenter", handlePointerEnter);
    stage.addEventListener("mouseover", handlePointerEnter);
    stage.addEventListener("pointerenter", handlePointerEnter);
    stage.addEventListener("mousemove", handlePointerMove);
    stage.addEventListener("pointermove", handlePointerMove);
    stage.addEventListener("pointerleave", handlePointerLeave);
    stage.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("mousemove", handleWindowMove);
    window.addEventListener("mouseout", handlePointerLeave);
    return () => {
      stage.removeEventListener("mouseenter", handlePointerEnter);
      stage.removeEventListener("mouseover", handlePointerEnter);
      stage.removeEventListener("pointerenter", handlePointerEnter);
      stage.removeEventListener("mousemove", handlePointerMove);
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      stage.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("mousemove", handleWindowMove);
      window.removeEventListener("mouseout", handlePointerLeave);
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, []);

  return (
    <section ref={stageRef} className="nav-atelier statue-reveal" aria-label="Artmonia Academy sculpture reveal animation">
      <div className="statue-atmosphere" />
      <div className="statue-stage">
        <div className="statue-copy">
          <span>Artmonia Academy</span>
          <strong>Akademik rəsm • Portfolio • Dizayn hazırlığı</strong>
        </div>

        <div className="torn-paper" style={paperStyle}>
          <div className="paper-component paper-center-layer" aria-hidden="true" />
          <div className="paper-half paper-left">
            <div className="paper-info intro-paper-copy">
              <span>Artmonia Academy</span>
              <strong>Fırçanı tut, sənətkar ol.</strong>
              <p>
                Sistem. Rəy. Nəticə - peşəkar mentorlarla 6 həftəlik akademik rəsm proqramı.
              </p>
            </div>
            <i className="rip rip-left" />
          </div>
          <div className="paper-half paper-right">
            <div className="paper-info intro-paper-copy">
              <span>Akademik ritm</span>
              <strong>Klassik rəsm intizamı, müasir tədris.</strong>
            </div>
            <i className="rip rip-right" />
          </div>
        </div>

        <div className="statue-burst">
          <div className="statue-halo" />
          <div className="real-statue-wrap">
            <img className="real-statue" src="/assets/artmonia-real-statue-hands.webp" alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className="hero-reveal-cta">
        <p>Təsəvvür etdiyin hər şey gerçəkdir.</p>
        <Link className="hero-reveal-cta-button" href="/muraciet" aria-label="Müraciət səhifəsinə keç">
          <span>Müraciət et</span>
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

function ProblemTransformation() {
  const dynamicPainPoints = useSiteContentValue("pain_points", painPoints);
  const dynamicTransformations = useSiteContentValue("transformations", transformations);
  const dynamicGalleryImages = useSiteContentValue("gallery_images", galleryImages);
  return (
    <section className="split-band scroll-section" id="problem">
      <Reveal className="problem-showcase" variant="boom">
        <div className="problem-orbit" aria-label="Artmonia problemlər karuseli">
          <div className="orbit-aura" />
          <div className="thinking-figure" aria-hidden="true">
            <img className="question-avatar real-girl-avatar" src="/assets/problem-center-girl.webp" alt="" loading="lazy" decoding="async" />
            <div className="problem-shadow" />
          </div>
          <div className="orbit-wheel">
            {dynamicPainPoints.map((point, index) => (
              <article key={point} className={`orbit-thought thought-${index + 1}`}>
                <div className="thought-bubble">
                  <p>{point}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="problem-question">
          <p className="small-label">Problem</p>
          <h2>Tanış gəlir?</h2>
          <p>
            Artmonia-da hər xətt planla çəkilir, mentor rəyi ilə düzəlir və ardıcıl praktika ilə nəticəyə çevrilir.
          </p>
        </div>
      </Reveal>
      <Reveal className="atelier-panel" variant="boom">
        <div className="sketch-result-board scroll-sketch" aria-label="Artmonia rəsm materialları">
          <img src={dynamicGalleryImages[1].src} alt={dynamicGalleryImages[1].alt} loading="lazy" decoding="async" />
          <div className="board-wash" />
          <div className="sketch-stage">
            <span className="sketch-label">Sketch To Result</span>
            <svg className="sketch-lines" viewBox="0 0 520 440" aria-hidden="true">
              <path className="ghost-sketch" d="M126 320 C150 220 190 146 260 126 C340 104 388 172 382 250 C374 344 284 382 204 344 C166 326 144 302 126 320Z" />
              <path className="ghost-sketch" d="M182 246 C234 214 298 214 348 246" />
              <path className="ghost-sketch" d="M210 174 C226 194 250 204 280 198 C310 192 326 174 342 154" />
              <path className="ghost-sketch" d="M176 336 C214 286 294 286 350 334" />
              <path className="sketch-path path-one" d="M126 320 C150 220 190 146 260 126 C340 104 388 172 382 250 C374 344 284 382 204 344 C166 326 144 302 126 320Z" />
              <path className="sketch-path path-two" d="M182 246 C234 214 298 214 348 246" />
              <path className="sketch-path path-three" d="M210 174 C226 194 250 204 280 198 C310 192 326 174 342 154" />
              <path className="sketch-path path-four" d="M176 336 C214 286 294 286 350 334" />
              <path className="sketch-path path-five" d="M96 374 C182 404 316 406 430 366" />
            </svg>
            <div className="stage-chip chip-system">Sistem xətti</div>
            <div className="stage-chip chip-feedback">Feedback işarəsi</div>
            <div className="stage-chip chip-mentor">Mentor qeydi</div>
            <div className="portfolio-stamp">Portfolio</div>
          </div>
        </div>
        <div className="transformation-copy">
          <p className="small-label">Transformasiya</p>
          <h2>Proqram sənə nə verir?</h2>
          <div className="transformation-grid">
            {dynamicTransformations.map((item, index) => (
              <article
                key={item.title}
                className={`stage-card stage-card-${index + 1} scroll-block`}
                data-scroll-order={index}
                style={{ "--step": index } as React.CSSProperties}
              >
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Programs() {
  const dynamicCourses = useSiteContentValue("courses", courses);
  return (
    <section className="section-shell scroll-section" id="program">
      <Reveal className="section-heading wide" variant="from-right">
        <p>Proqramlar</p>
        <h2>Peşəkar kurslar,<br />müasir nəticə.</h2>
      </Reveal>
      <div className="courses-grid">
        {dynamicCourses.map((course, index) => (
          <Reveal
            key={course.title}
            className={`course-card ${index % 2 === 0 ? "media-left" : "media-right"}`}
            variant={index % 2 === 0 ? "from-left" : "from-right"}
            style={{ "--step": index } as React.CSSProperties}
          >
            <div className="course-media">
              <img src={course.image} alt={`${course.title} proqramı üçün nümunə sənət işi`} loading="lazy" decoding="async" />
              <span>{course.duration}</span>
            </div>
            <div className="course-copy">
              <span className="course-label">Artmonia proqramı</span>
              <h3>{course.title}</h3>
              <p>{course.text}</p>
              <a href="#lead">
                Proqramı seç <ArrowIcon />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="pricing-check-icon">
      <path d="m4 10.5 3.5 3.5L16 6" />
    </svg>
  );
}

function Results() {
  const dynamicTestimonials = useSiteContentValue("testimonials", testimonials);
  return (
    <section className="section-shell results scroll-section" id="results">
      <Reveal className="section-heading" variant="from-left">
        <p>Nəticələr</p>
        <h2>Tələbə nəticələri görünən inkişaf kimi təqdim olunur.</h2>
      </Reveal>
      <div className="result-board">
        <Reveal className="before-after" variant="boom">
          <div>
            <span>Əvvəl</span>
            <div className="sketch-card sketch-before" />
          </div>
          <div>
            <span>Sonra</span>
            <div className="sketch-card sketch-after" />
          </div>
        </Reveal>
        <Reveal className="result-copy" variant="from-right">
          <h3>Fatimə</h3>
          <p>
            Köhnə saytda &ldquo;təbriklər&rdquo; kimi qısa data vardı. Yeni təqdimatda bu hissə real əvvəl/sonra hekayəsi üçün
            genişləndirilib: səviyyə, müddət, mentor qeydi və portfolyo nəticəsi.
          </p>
          <a href="#lead" className="text-link">
            Nəticəni planla <ArrowIcon />
          </a>
        </Reveal>
      </div>
      <div className="testimonial-rail">
        {dynamicTestimonials.map((item) => (
          <blockquote key={item.name}>
            &ldquo;{item.quote}&rdquo;
            <cite>
              {item.name} <span>{item.role}</span>
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

const quizProblems = [
  { id: "no-system", label: "Sistemsizəm" },
  { id: "no-colors", label: "Rəngləri bilmirəm" },
  { id: "no-goal", label: "Məqsədim yoxdur" },
  { id: "no-basics", label: "Əsasları bilmirəm" },
] as const;

const quizGenres = [
  { id: "portrait", label: "Portret" },
  { id: "landscape", label: "Mənzərə" },
  { id: "abstract", label: "Abstrakt" },
  { id: "still-life", label: "Natürmort" },
] as const;

const quizResults = {
  "no-system": {
    portrait: {
      module: "Modul 05: Portret & Fiqur",
      package: "Standart",
      reason: "Sistemli portret təlimi üçün tam proqram lazımdır.",
    },
    landscape: {
      module: "Modul 04: Kompozisiya",
      package: "Standart",
      reason: "Mənzərə üçün güclü kompozisiya əsası lazımdır.",
    },
    abstract: {
      module: "Modul 03: Rəng Nəzəriyyəsi",
      package: "Standart",
      reason: "Abstrakt sənət üçün rəng harmoniyası vacibdir.",
    },
    "still-life": {
      module: "Modul 01: Əsaslar & Proporsiya",
      package: "Standart",
      reason: "Natürmort üçün proporsiya əsasları mühümdür.",
    },
  },
  "no-colors": {
    portrait: {
      module: "Modul 03: Rəng Nəzəriyyəsi",
      package: "Standart",
      reason: "Portretdə canlı ton üçün rəng bilgisi şərtdir.",
    },
    landscape: {
      module: "Modul 03: Rəng Nəzəriyyəsi",
      package: "Standart",
      reason: "Mənzərədə atmosfer rənglərlə yaradılır.",
    },
    abstract: {
      module: "Modul 03: Rəng Nəzəriyyəsi",
      package: "Premium",
      reason: "Abstrakt rənglərdə dərinlik üçün fərdi mentorluq uyğundur.",
    },
    "still-life": {
      module: "Modul 03: Rəng Nəzəriyyəsi",
      package: "Standart",
      reason: "Natürmortda işıq-rəng əlaqəsi kritikdir.",
    },
  },
  "no-goal": {
    portrait: {
      module: "Modul 05: Portret & Fiqur",
      package: "Premium",
      reason: "Məqsəd qurmaq üçün fərdi mentorluq lazımdır.",
    },
    landscape: {
      module: "Modul 04: Kompozisiya",
      package: "Premium",
      reason: "Karyera məsləhəti ilə istiqamətini tapırsan.",
    },
    abstract: {
      module: "Modul 06: Final Layihə",
      package: "Premium",
      reason: "Final layihə ilə öz üslubunu kəşf edirsən.",
    },
    "still-life": {
      module: "Modul 01: Əsaslar & Proporsiya",
      package: "Standart",
      reason: "Əsaslardan başlayıb məqsədini formalaşdırırsan.",
    },
  },
  "no-basics": {
    portrait: {
      module: "Modul 01: Əsaslar & Proporsiya",
      package: "Standart",
      reason: "Portret çəkməzdən əvvəl əsaslar şərtdir.",
    },
    landscape: {
      module: "Modul 01: Əsaslar & Proporsiya",
      package: "Mini",
      reason: "Əsas formalar mənzərənin təməlidir.",
    },
    abstract: {
      module: "Modul 01: Əsaslar & Proporsiya",
      package: "Mini",
      reason: "Abstrakt işlər də əsas biliklər tələb edir.",
    },
    "still-life": {
      module: "Modul 02: İşıq və Kölgə",
      package: "Standart",
      reason: "Natürmort üçün işıq-kölgə əsasdır.",
    },
  },
} as const;

type QuizProblem = (typeof quizProblems)[number]["id"];
type QuizGenre = (typeof quizGenres)[number]["id"];

function QuizProblemArt({ problem }: { problem: QuizProblem }) {
  const icon = {
    "no-system": (
      <>
        <path d="M7 6.5h10M7 12h10M7 17.5h6" />
        <circle cx="4" cy="6.5" r="1" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="4" cy="17.5" r="1" />
      </>
    ),
    "no-colors": (
      <>
        <path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.15a1.85 1.85 0 0 0 1.85-1.85c0-.6-.28-1.16-.76-1.52a1.85 1.85 0 0 1 1.09-3.34H17a3.5 3.5 0 0 0 3.5-3.5A6.8 6.8 0 0 0 12 3.5Z" />
        <circle cx="7.9" cy="10" r=".8" />
        <circle cx="11.6" cy="7.7" r=".8" />
        <circle cx="16" cy="10.2" r=".8" />
      </>
    ),
    "no-goal": (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="m15.5 8.5 4-4M16.2 4.5h3.3v3.3" />
      </>
    ),
    "no-basics": (
      <>
        <path d="m6.2 17.8 1.1-4.1L16.9 4l3.1 3.1-9.7 9.6-4.1 1.1Z" />
        <path d="m14.8 6.1 3.1 3.1M5 20h14" />
      </>
    ),
  }[problem];

  return (
    <svg className={`quiz-problem-art ${problem}`} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {icon}
    </svg>
  );
}

function usePageScrollReveals() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".scroll-section, .scroll-block"));
    if (!targets.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-scroll-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-scroll-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.04, rootMargin: "0px 0px -3% 0px" }
    );

    targets.forEach((target) => {
      const order = Number(target.dataset.scrollOrder ?? 0);
      const delay = Math.min(Math.max(order, 0), 5) * 85;
      target.style.setProperty("--scroll-delay", `${delay}ms`);
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, []);
}

function QuizGenreIcon({ genre }: { genre: QuizGenre }) {
  const icon = {
    portrait: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.5 20c.8-3.7 3.1-5.5 6.5-5.5s5.7 1.8 6.5 5.5" />
      </>
    ),
    landscape: (
      <>
        <circle cx="17.2" cy="6.8" r="1.8" />
        <path d="m3.8 19 5.4-6 3.2 3.5 2.5-2.8L20.2 19H3.8Z" />
      </>
    ),
    abstract: (
      <>
        <path d="M5 8.4c1.3-3.3 5.7-4.8 8.6-2.6 2.1 1.5 5.4 1.2 5.4 4.2 0 2.8-3 3-4.4 4.8-1.6 2.1-.1 4.4-3 4.4-3.2 0-2.8-3.3-4.6-4.9C5.6 13 4 11.7 5 8.4Z" />
        <path d="m8 10 7.8 4" />
      </>
    ),
    "still-life": (
      <>
        <path d="M8.2 7.2h7.6M9.2 7.2l.8 3.1v5.5c0 1.3.9 2.2 2 2.2s2-.9 2-2.2v-5.5l.8-3.1" />
        <path d="M5 19h14" />
      </>
    ),
  }[genre];

  return (
    <svg className={`quiz-genre-icon ${genre}`} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {icon}
    </svg>
  );
}

function DiagnosticQuiz() {
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState<QuizProblem | null>(null);
  const [genre, setGenre] = useState<QuizGenre | null>(null);
  const result = useMemo(() => (problem && genre ? quizResults[problem][genre] : null), [problem, genre]);

  const resetQuiz = () => {
    setStep(0);
    setProblem(null);
    setGenre(null);
  };

  return (
    <section className="quiz-pricing scroll-section" id="diagnostic">
      <div className="diagnostic-duo">
        <Reveal className="quiz-card diagnostic-compact" variant="from-left">
          <div className="quiz-card-head">
            <p className="small-label">Diaqnostika</p>
            <h2>Sənə uyğun yolu tap.</h2>
            <p>2 sadə suala cavab ver, biz sənin üçün ən uyğun modulu və paketi təklif edək.</p>
          </div>
          <div className="quiz-progress" aria-label={`Addım ${Math.min(step, 2)} / 2`}>
            {[1, 2].map((item) => (
              <span key={item} className={step >= item ? "active" : ""}>
                {item}
              </span>
            ))}
            <strong>{step === 0 ? "Başla" : step === 3 ? "Nəticə" : `Addım ${step}/2`}</strong>
          </div>
          <div className="quiz-window">
            {step === 0 ? (
              <div className="quiz-pane quiz-intro">
                <span className="quiz-orb">✦</span>
                <h3>Hansı proqram sənə uyğundur?</h3>
                <button type="button" className="quiz-primary" onClick={() => setStep(1)}>
                  Testi başla
                </button>
              </div>
            ) : null}
            {step === 1 ? (
              <div className="quiz-pane">
                <h3>Əsas problemin nədir?</h3>
                <p>Sənə ən çox uyğun olan variantı seç.</p>
                <div className="quiz-options problem-options">
                  {quizProblems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${problem === item.id ? "active " : ""}quiz-problem-option ${item.id}`}
                      onClick={() => {
                        setProblem(item.id);
                        setStep(2);
                      }}
                    >
                      <QuizProblemArt problem={item.id} />
                      <strong>{item.label}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {step === 2 ? (
              <div className="quiz-pane">
                <h3>Öyrənmək istədiyin janr?</h3>
                <p>Ən çox maraqlandığın sahəni seç.</p>
                <div className="quiz-options">
                  {quizGenres.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={genre === item.id ? "active" : ""}
                      onClick={() => {
                        setGenre(item.id);
                        setStep(3);
                      }}
                    >
                      <QuizGenreIcon genre={item.id} />
                      <strong>{item.label}</strong>
                    </button>
                  ))}
                </div>
                <button type="button" className="quiz-back" onClick={() => setStep(1)}>
                  ← Geri qayıt
                </button>
              </div>
            ) : null}
            {step === 3 && result ? (
              <div className="quiz-pane quiz-result">
                <span>Sənin üçün tövsiyə</span>
                <strong>{result.module}</strong>
                <p>{result.reason}</p>
                <em>Uyğun paket: {result.package}</em>
                <div className="quiz-actions">
                  <a href="#pricing">Paketləri gör</a>
                  <button type="button" onClick={resetQuiz}>
                    Yenidən
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </Reveal>
        <Reveal className="diagnostic-art-panel" variant="from-right">
          <Image
            src="/assets/artmonia-success-path.webp"
            alt="Fırça ilə çəkilən işıqlı yolda irəliləyən insan"
            fill
            sizes="(max-width: 900px) calc(100vw - 28px), 540px"
            quality={78}
            loading="lazy"
          />
          <div className="diagnostic-art-copy">
            <span>Artmonia istiqaməti</span>
            <p>Artmonia ilə uğura gedən yolda daim irəli addımla.</p>
          </div>
        </Reveal>
      </div>
      <Pricing />
    </section>
  );
}

function Pricing() {
  const dynamicPackages = useSiteContentValue("packages", packages);

  return (
    <Reveal className="pricing-wrap pricing-unified" id="pricing" variant="from-bottom">
      <div className="pricing-unified-heading">
        <h2>Dərs paketləri və qiymətlər</h2>
        <p>Öyrənmə ritminə uyğun planı seç.</p>
      </div>
      <div className="pricing-saas-grid">
        {dynamicPackages.map((pack, index) => {
          const [amount, currency = "AZN"] = pack.price.split(" ");
          const isFeatured = index === 1;

          return (
            <article
              key={pack.title}
              className={isFeatured ? "pricing-plan pricing-plan--featured" : "pricing-plan"}
              aria-label={`${pack.title} paketi`}
            >
              <div className="pricing-plan-topline" aria-hidden="true" />
              {pack.highlight ? <span className="pricing-plan-label">{pack.highlight}</span> : null}
              <div className="pricing-plan-heading">
                <h3>{pack.title}</h3>
                <div className="pricing-plan-price">
                  <strong>{amount}</strong>
                  <span>{currency}</span>
                </div>
                <p>{pack.text}</p>
              </div>
              <ul>
                {pack.features.slice(0, 5).map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href="#lead">
                {pack.cta}
                <ArrowIcon />
              </a>
            </article>
          );
        })}
      </div>
    </Reveal>
  );
}

const teacherPortraits = [
  { name: "Vaqif Əsrər", role: "Peşəkar akademik müəllim", line: "Akademik təməl və beynəlxalq baxış.", image: "/assets/teacher-vaqif.webp", tone: "ochre" },
  { name: "Əsmər Ramazanova", role: "Akademik müəllim", line: "Qara qələm, forma və intizam.", image: "/assets/teacher-esmer.webp", tone: "ink" },
  { name: "Əminə Cəmaləddinova", role: "Həvəskar rəsm müəllimi", line: "Art terapiya ilə yaradıcı yol.", image: "/assets/teacher-emine.webp", tone: "meadow" }
];

function TeachersAtelier() {
  return (
    <section className="teacher-atelier scroll-section" id="teachers">
      <Reveal className="teacher-atelier-heading" variant="from-left">
        <p className="small-label">Müəllim heyəti</p>
        <h2>İlhamı <em>istiqamətə</em> çevirən insanlar.</h2>
        <p>Hər müəllim öz texnikası, müşahidəsi və fərqli tədris ritmi ilə sənə yol göstərir.</p>
      </Reveal>
      <div className="teacher-poster-stage">
        {teacherPortraits.map((teacher, index) => (
          <Reveal key={teacher.name} className={`teacher-poster teacher-poster-${teacher.tone}`} variant={index === 1 ? "boom" : index === 0 ? "from-left" : "from-right"}>
            <div className="teacher-poster-image"><img src={teacher.image} alt={teacher.name} loading="lazy" decoding="async" /></div>
            <div className="teacher-poster-caption"><span>{teacher.role}</span><strong>{teacher.name}</strong><p>{teacher.line}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AuditPrivacyFooter() {
  const dynamicContact = useSiteContentValue("contact", contact);
  return (
    <footer className="site-footer scroll-section" id="contact">
      <div className="footer-top scroll-block">
        <div>
          <h2>Gözləmə. Başla.</h2>
          <p>Növbəti qrup tezliklə başlayır. Yerini indi ayır və rəsm səyahətinə başla.</p>
          <a href="#lead" className="button inverse">
            Akademiyaya qoşul <ArrowIcon />
          </a>
        </div>
        <img className="footer-top-portrait" src="/assets/footer-cta-portrait.webp" alt="Rəngli Artmonia portreti" loading="lazy" decoding="async" />
      </div>
      <div className="footer-contact-map scroll-block" data-scroll-order="1">
        <div className="footer-map-frame">
          <iframe
            title="Artmonia Academy xəritədə"
            src="https://www.google.com/maps?q=Nizami%20Cinema%20Center%2C%20Baku&z=16&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <address className="footer-contact">
          <p className="footer-label">Əlaqə</p>
          <a href={`tel:${dynamicContact.phone.replace(/\s/g, "")}`}>{dynamicContact.phone}</a>
          <a href={`mailto:${dynamicContact.email}`}>{dynamicContact.email}</a>
          <p className="footer-location">{dynamicContact.address}</p>
        </address>
      </div>
      <div className="footer-bottom scroll-block" data-scroll-order="2">
        <span>© 2026 Artmonia Academy.</span>
        <span className="footer-quote">&ldquo;İstək varsa, yol da var.&rdquo; - Leonardo da Vinçi</span>
      </div>
    </footer>
  );
}

function ArtmoniaSiteInner() {
  useTiltTargets();
  usePageScrollReveals();

  return (
    <>
      <BrushField />
      <SiteHeader />
      <NavAtelierAnimation />
      <main>
        <HomeNewsSection />
        <ProblemTransformation />
        <Programs />
        <DiagnosticQuiz />
        <TeachersAtelier />
      </main>
      <AuditPrivacyFooter />
    </>
  );
}

export default function ArtmoniaSite({ content }: { content: SiteContentMap }) {
  return (
    <SiteContentProvider content={content}>
      <ArtmoniaSiteInner />
    </SiteContentProvider>
  );
}
