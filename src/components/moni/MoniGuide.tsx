"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { moniDefaults } from "@/data/moni";
import { useSiteContentValue } from "@/components/SiteContentContext";
import MoniMascot from "./MoniMascot";
import styles from "./MoniGuide.module.css";

const MoniPanel = dynamic(() => import("./MoniPanel"), { ssr: false });

export default function MoniGuide() {
  const copy = useSiteContentValue("moni_settings", moniDefaults);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [intro, setIntro] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 30 });
  const sentinel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!copy.enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const target = sentinel.current;
    if (!target) return;
    let revealed = false;
    let cancelled = false;
    const image = new Image();
    image.src = "/assets/moni/idle.png";
    const ready = image.decode().catch(() => undefined);
    const reveal = () => {
      if (revealed || window.scrollY < 80 || target.getBoundingClientRect().top > window.innerHeight) return;
      revealed = true;
      void ready.then(() => {
      if (cancelled) return;
      const logo = document.querySelector(".brand")?.getBoundingClientRect();
      if (logo) setOrigin({ x: logo.left + logo.width / 2 - 72, y: logo.bottom - 65 });
      setVisible(true);
      setIntro(true);
      timer = setTimeout(() => setIntro(false), 3400);
      });
      observer.disconnect();
      window.removeEventListener("scroll", reveal);
    };
    const observer = new IntersectionObserver(reveal, { threshold: 0 });
    observer.observe(target);
    window.addEventListener("scroll", reveal, { passive: true });
    reveal();
    return () => { cancelled = true; observer.disconnect(); window.removeEventListener("scroll", reveal); clearTimeout(timer); };
  }, [copy.enabled]);
  function dismiss() {
    setVisible(false);
  }
  if (!copy.enabled) return null;
  return <>
    <div ref={sentinel} className={styles.sentinel} aria-hidden="true" />
    {intro && <div className={styles.entrance} onAnimationEnd={() => setIntro(false)} style={{ "--moni-x": `${origin.x}px`, "--moni-y": `${origin.y}px` } as React.CSSProperties}><MoniMascot state="idle" /></div>}
    {visible && !open && !intro && <aside className={styles.invite} aria-label="Moni ilə tanış ol">
      <button className={styles.close} onClick={dismiss} aria-label="Monini bağla"><X size={18} /></button>
      <MoniMascot state="hello" />
      <div><p>{copy.welcome}</p><button ref={trigger} className={styles.primary} onClick={() => setOpen(true)}>{copy.startLabel}</button><small>Artmonianın AI köməkçisi</small></div>
    </aside>}
    {!visible && <button ref={trigger} className={styles.launcher} onClick={() => { setVisible(true); setOpen(true); }} aria-label="Moni ilə sənət yolunu tap">Moni <span>ilə başla</span></button>}
    {open && <MoniPanel copy={copy} onClose={() => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }} />}
  </>;
}
