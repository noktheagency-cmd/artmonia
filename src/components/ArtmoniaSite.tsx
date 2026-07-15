"use client";

/* Static art assets need exact CSS-driven cropping and reveal effects. */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  comparison,
  contact,
  courses,
  curriculum,
  formFields,
  galleryImages,
  heroStats,
  navItems,
  packages,
  painPoints,
  studioCards,
  studioFeatures,
  testimonials,
  transformations
} from "@/data/site";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="icon">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="menu-svg">
      <path className={open ? "line line-one open" : "line line-one"} d="M4 7h16" />
      <path className={open ? "line line-two open" : "line line-two"} d="M4 12h16" />
      <path className={open ? "line line-three open" : "line line-three"} d="M4 17h16" />
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

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Artmonia ana səhifə">
        <img className="brand-logo brand-logo-light" src="/assets/artmonia-logo.webp" alt="Artmonia" />
      </a>
      <nav className="desktop-nav" aria-label="Əsas naviqasiya">
        {navItems.map((item) =>
          item.href === "#program" ? (
            <div className="nav-program-menu" key={item.href}>
              <a className="nav-program-trigger" href={item.href} aria-haspopup="true">
                {item.label}
                <span aria-hidden="true">⌄</span>
              </a>
              <div className="nav-program-dropdown">
                <a href="#pricing">Dərs paketləri</a>
                <a href="#calculator">Qiymət</a>
              </div>
            </div>
          ) : (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          )
        )}
      </nav>
      <div className="header-actions">
        <a className="nav-cta" href="#lead">
          Qeydiyyat <ArrowIcon />
        </a>
      </div>
      <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label="Menyunu aç">
        <MenuIcon open={open} />
      </button>
      <div className={open ? "mobile-nav open" : "mobile-nav"}>
        {navItems.map((item) =>
          item.href === "#program" ? (
            <div className="mobile-program-group" key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
              <div className="mobile-program-links">
                <a href="#pricing" onClick={() => setOpen(false)}>Dərs paketləri</a>
                <a href="#calculator" onClick={() => setOpen(false)}>Qiymət</a>
              </div>
            </div>
          ) : (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          )
        )}
        <a href="#lead" onClick={() => setOpen(false)}>
          Qeydiyyat
        </a>
      </div>
    </header>
  );
}

function NavAtelierAnimation() {
  const stageRef = useRef<HTMLElement | null>(null);

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
      }, 620);
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

        <div className="torn-paper">
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

        <div className="intro-actions">
          <a className="button primary" href="#lead">Ön qeydiyyat</a>
          <a className="button ghost" href="#program">Necə öyrədirik?</a>
        </div>

        <div className="statue-burst">
          <div className="statue-halo" />
          <div className="real-statue-wrap">
            <img className="real-statue" src="/assets/artmonia-real-statue-hands.webp" alt="" aria-hidden="true" />
            <i className="real-eye-glow real-eye-left" />
            <i className="real-eye-glow real-eye-right" />
          </div>
        </div>

        <div className="statue-metrics">
          <span><strong>60+</strong>Tələbə işi</span>
          <span><strong>8+</strong>Proqram</span>
          <span><strong>1:1</strong>Mentor rəyi</span>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="hero section-shell scroll-section" id="top">
      <div className="hero-copy">
        <div className="monogram-row">
          <span />
          <b>Artmonia Academy</b>
        </div>
        <h1>Fırçanı tut, sənətkar ol.</h1>
        <p>
          Sistem. Rəy. Nəticə - peşəkar mentorlarla 6 həftəlik akademik rəsm proqramı. Klassik rəsm intizamı,
          müasir tədris ritmi və ölçülən inkişaf bir yerdə.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#lead">
            Ön qeydiyyat <ArrowIcon />
          </a>
          <a className="button ghost" href="#program">
            Necə öyrədirik?
          </a>
        </div>
      </div>
      <div className="hero-stage">
        <div className="hero-frame" data-tilt>
          <img src={galleryImages[0].src} alt={galleryImages[0].alt} />
          <div className="floating-card card-a">
            <span>01</span>
            Proporsiya
          </div>
          <div className="floating-card card-b">
            <span>06</span>
            Final layihə
          </div>
        </div>
        <div className="hero-stat-strip">
          {heroStats.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutArtmonia() {
  return (
    <section className="about-system scroll-section" id="academy">
      <div className="about-system-shell">
        <Reveal className="about-system-visual" variant="from-left">
          <div className="about-photo-wrap">
            <img
              className="about-photo"
              src="/assets/about-art-system.webp"
              alt="Artmonia Academy-də klassik heykəl üzərində akademik rəsm məşqi edən tələbə"
            />
            <img className="about-brush-wave" src="/assets/brand-brush-wave.png" alt="" aria-hidden="true" />
            <img className="about-splatter" src="/assets/brand-paint-splatter.png" alt="" aria-hidden="true" />
            <div className="about-image-note" aria-hidden="true">
              <span>Sistem</span>
              <i />
              <span>Rəhbərlik</span>
              <i />
              <span>Nəticə</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="about-system-copy" variant="from-right">
          <p className="small-label">Haqqımızda</p>
          <h2>
            <em>Artmonia</em> — sənət sistemi.
          </h2>
          <p className="about-system-lead">
            Biz inanırıq ki, hər kəs rəsm çəkə bilər — düzgün sistem və doğru rəhbərlik olduqda. Artmonia Academy
            peşəkar rəssamlar tərəfindən yaradılmış strukturlaşdırılmış proqramdır.
          </p>

          <div className="about-principles" aria-label="Artmonia tədris prinsipləri">
            <div>
              <span>Sistem</span>
              <p>Hər mərhələ bir-birini tamamlayan aydın planla qurulur.</p>
            </div>
            <div>
              <span>Rəhbərlik</span>
              <p>Mentor rəyi hər xətti daha dəqiq qərara çevirir.</p>
            </div>
            <div>
              <span>Praktika</span>
              <p>Ardıcıl məşq görünən və ölçülən nəticə yaradır.</p>
            </div>
          </div>

          <svg className="about-line-art" aria-hidden="true" viewBox="0 0 520 92" preserveAspectRatio="none">
            <path d="M4 67C91 12 151 82 234 43C315 5 394 20 516 63" />
          </svg>
        </Reveal>
      </div>
    </section>
  );
}

function ProblemTransformation() {
  return (
    <section className="split-band scroll-section" id="problem">
      <Reveal className="problem-showcase" variant="boom">
        <div className="problem-orbit" aria-label="Artmonia problemlər karuseli">
          <div className="orbit-aura" />
          <div className="thinking-figure" aria-hidden="true">
            <img className="question-avatar real-girl-avatar" src="/assets/problem-center-girl.webp" alt="" />
            <div className="problem-shadow" />
          </div>
          <div className="orbit-wheel">
            {painPoints.map((point, index) => (
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
          <img src={galleryImages[1].src} alt={galleryImages[1].alt} />
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
            {transformations.map((item, index) => (
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
  return (
    <section className="section-shell scroll-section" id="program">
      <Reveal className="section-heading wide" variant="from-right">
        <p>Proqramlar</p>
        <h2>Peşəkar kurslar,<br />müasir nəticə.</h2>
      </Reveal>
      <div className="courses-grid">
        {courses.map((course, index) => (
          <Reveal
            key={course.title}
            className={`course-card ${index % 2 === 0 ? "media-left" : "media-right"}`}
            variant={index % 2 === 0 ? "from-left" : "from-right"}
            style={{ "--step": index } as React.CSSProperties}
          >
            <div className="course-media">
              <img src={course.image} alt={`${course.title} proqramı üçün nümunə sənət işi`} loading="lazy" />
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

function Studio() {
  return (
    <section className="studio-section scroll-section">
      <div className="studio-grid">
        <Reveal className="studio-copy" variant="from-left">
          <p className="small-label">Məkanımız</p>
          <h2>Burada sənətə aşiq olacaqsan.</h2>
          <p>
            Professional molbertlər, keyfiyyətli materiallar, xoş musiqi və ilham verən atmosfer - Artmonia-da hər
            detal sənin yaradıcılığın üçün düşünülüb.
          </p>
          <div className="feature-line">
            {studioFeatures.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </Reveal>
        <Reveal className="studio-collage" variant="from-right">
          <img className="collage-main" src="/assets/studio-room.webp" alt="İşıqlı rəsm studiyası və molbert" loading="lazy" decoding="async" />
          <img className="collage-side" src="/assets/studio-brushes.webp" alt="Rəngli rəsm fırçaları" loading="lazy" decoding="async" />
        </Reveal>
      </div>
      <div className="studio-cards">
        {studioCards.map((card) => (
          <Reveal key={card.title} className="studio-card" variant="flip">
            <span>Artmonia</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </Reveal>
        ))}
      </div>
      <p className="quote-line scroll-block">&ldquo;Artmonia-ya girən hər kəs burada qalmaq istəyir&rdquo;</p>
    </section>
  );
}

function Results() {
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
        {testimonials.map((item) => (
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

const moduleArtworks = [
  "/assets/module-proportion.webp",
  "/assets/module-light-shadow.webp",
  "/assets/module-color.webp",
  "/assets/module-composition.webp",
  "/assets/module-portrait.webp",
  "/assets/module-final-project.webp"
];

function Curriculum() {
  return (
    <section className="curriculum-section scroll-section">
      <Reveal className="section-heading wide" variant="from-top">
        <p>Kurikulum</p>
        <h2>
          <span>6 modul. 6 həftə.</span>
          <span>Hər həftə dərs + tapşırıq + fərdi feedback.</span>
        </h2>
      </Reveal>
      <div className="timeline module-grid">
        {curriculum.map((item, index) => (
          <article
            key={item.title}
            className="module-card scroll-block"
            data-scroll-order={index}
          >
            <div className="module-card-media"><img src={moduleArtworks[index]} alt="" loading="lazy" decoding="async" /></div>
            <div className="module-card-content">
              <small>{item.week}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <p className="module-topics">{item.topics.slice(0, 3).join(" · ")}</p>
            </div>
          </article>
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
      <Reveal className="quiz-card" variant="from-left">
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
      <Pricing />
    </section>
  );
}

function Pricing() {
  const [activePackage, setActivePackage] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePackage((current) => (current + 1) % packages.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
    <Reveal className="pricing-wrap" id="pricing" variant="from-right">
      <div className="section-heading compact">
        <p>Paketlər</p>
        <h2>Sənə uyğun paketi seç.</h2>
      </div>
      <div className="packages" aria-live="polite">
        {packages.map((pack, index) => (
          <article
            key={pack.title}
            className={`${pack.highlight ? "package featured" : "package"} ${activePackage === index ? "is-active" : ""}`}
            aria-hidden={activePackage !== index}
          >
            {pack.highlight ? <span className="package-badge">{pack.highlight}</span> : null}
            <h3>{pack.title}</h3>
            <p>{pack.text}</p>
            <strong>{pack.price}</strong>
            <ul>
              {pack.features.slice(0, 5).map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <a href="#lead">{pack.cta}</a>
          </article>
        ))}
        <div className="package-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="package-tabs" aria-label="Paket seçimi">
        {packages.map((pack, index) => (
          <button
            key={pack.title}
            type="button"
            className={activePackage === index ? "active" : ""}
            onClick={() => setActivePackage(index)}
          >
            {pack.title}
          </button>
        ))}
      </div>
      <div className="comparison">
        <div className="comparison-head">
          <span>Xüsusiyyət</span>
          <span>Mini</span>
          <span>Standart</span>
          <span>Premium</span>
        </div>
        {comparison.map((row) => (
          <div className="comparison-row" key={row[0]}>
            {row.map((cell, cellIndex) => (
              <span key={`${row[0]}-${cellIndex}`}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </Reveal>
    <PriceCalculator />
    </>
  );
}

const calculatorLevels = [
  { id: "beginner", label: "Başlanğıc" },
  { id: "intermediate", label: "Orta" },
  { id: "advanced", label: "İrəliləmiş" }
] as const;

const calculatorDurations = [
  { months: 1, label: "1 ay", discount: 0 },
  { months: 3, label: "3 ay", discount: 0.1 },
  { months: 6, label: "6 ay", discount: 0.2 }
] as const;

const calculatorFormats = [
  { id: "group", label: "Qrup dərsi" },
  { id: "private", label: "Fərdi dərs" }
] as const;

const calculatorPrices = {
  beginner: { group: 99, private: 178 },
  intermediate: { group: 129, private: 232 },
  advanced: { group: 158, private: 285 }
} as const;

function PriceCalculator() {
  const [level, setLevel] = useState<keyof typeof calculatorPrices>("beginner");
  const [months, setMonths] = useState<1 | 3 | 6>(1);
  const [format, setFormat] = useState<"group" | "private">("group");
  const selectedDuration = calculatorDurations.find((item) => item.months === months)!;
  const monthly = calculatorPrices[level][format];
  const total = Math.round(monthly * months * (1 - selectedDuration.discount));
  const saving = monthly * months - total;

  return (
    <Reveal className="price-calculator" id="calculator" variant="boom">
      <div className="price-calculator-copy">
        <p className="small-label">Qiymət kalkulyatoru</p>
        <h2>Sənə uyğun <em>qiyməti hesabla</em></h2>
        <p>Seçimlərini dəyiş, sənə uyğun proqramın aylıq və ümumi qiymətini dərhal gör.</p>
      </div>
      <div className="price-calculator-controls">
        <fieldset>
          <legend>Səviyyə</legend>
          <div className="choice-row">
            {calculatorLevels.map((item) => <button key={item.id} type="button" className={level === item.id ? "selected" : ""} onClick={() => setLevel(item.id)} aria-pressed={level === item.id}>{item.label}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend>Müddət</legend>
          <div className="choice-row duration-row">
            {calculatorDurations.map((item) => <button key={item.months} type="button" className={months === item.months ? "selected" : ""} onClick={() => setMonths(item.months)} aria-pressed={months === item.months}>{item.label}{item.discount ? <small>-{item.discount * 100}%</small> : null}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend>Format</legend>
          <div className="choice-row format-row">
            {calculatorFormats.map((item) => <button key={item.id} type="button" className={format === item.id ? "selected" : ""} onClick={() => setFormat(item.id)} aria-pressed={format === item.id}>{item.label}</button>)}
          </div>
        </fieldset>
      </div>
      <div className="price-calculator-result" aria-live="polite">
        <div><span>Aylıq</span><strong>{monthly} <small>AZN</small></strong></div>
        <div><span>{months} aylıq cəmi</span><strong>{total} <small>AZN</small></strong>{selectedDuration.discount ? <em>{saving} AZN qənaət!</em> : null}</div>
        <a href="#lead">Bu paketlə qeydiyyat <ArrowIcon /></a>
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

function RegistrationLead() {
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className="registration-section scroll-section" id="lead">
      <Reveal className="lead-panel" variant="boom">
        <p className="small-label">Ön qeydiyyat</p>
        <h2>Yerini ayır.</h2>
        <img
          className="registration-artwork"
          src="/assets/registration-artwork.png"
          alt="Portret üzərində çalışan rəssam"
          loading="lazy"
          decoding="async"
        />
        <form onSubmit={onSubmit}>
          {formFields.map((field) => (
            <label key={field.name}>
              <span>{field.label}</span>
              {field.type === "select" ? (
                <select name={field.name}>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input type={field.type} name={field.name} placeholder={field.placeholder} required={field.name !== "email"} />
              )}
            </label>
          ))}
          <label className="full">
            <span>Məqsədin nədir?</span>
            <textarea name="goal" placeholder="Hobim üçün / Peşəkar olmaq istəyirəm..." />
          </label>
          <button className="button primary" type="submit">
            Qeydiyyatdan keç <ArrowIcon />
          </button>
          {sent ? <p className="form-success">Müraciət qeydə alındı. Backend qoşulanda real göndərim aktiv olacaq.</p> : null}
        </form>
      </Reveal>
    </section>
  );
}

function AuditPrivacyFooter() {
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
          <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <p className="footer-location">{contact.address}</p>
        </address>
      </div>
      <div className="footer-bottom scroll-block" data-scroll-order="2">
        <span>© 2026 Artmonia Academy.</span>
        <span className="footer-quote">&ldquo;İstək varsa, yol da var.&rdquo; - Leonardo da Vinçi</span>
      </div>
    </footer>
  );
}

export default function ArtmoniaSite() {
  useTiltTargets();
  usePageScrollReveals();

  return (
    <>
      <BrushField />
      <Header />
      <NavAtelierAnimation />
      <main>
        <AboutArtmonia />
        <ProblemTransformation />
        <Programs />
        <Studio />
        <Curriculum />
        <DiagnosticQuiz />
        <TeachersAtelier />
        <RegistrationLead />
      </main>
      <AuditPrivacyFooter />
    </>
  );
}
