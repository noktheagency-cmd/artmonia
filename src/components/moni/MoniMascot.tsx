"use client";

/* Supplied animated WebP assets retain their original motion and identity. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useId, useState } from "react";
import styles from "./MoniGuide.module.css";

export default function MoniMascot({ state = "idle" }: { state?: "idle" | "peek" | "hello" | "think" | "laugh" }) {
  const filter = `moni-key-${useId().replace(/:/g, "")}`;
  const [still, setStill] = useState(true);
  const [failed, setFailed] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    setFinished(false);
    if (state === "think" || state === "idle") return;
    const timer = setTimeout(() => setFinished(true), 3000);
    return () => clearTimeout(timer);
  }, [state]);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(motion.matches || document.hidden);
    update();
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => { motion.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); };
  }, []);
  const pose = still || failed || finished ? "idle" : state;
  return <span className={styles.mascot}>
    <svg width="0" height="0" aria-hidden="true" className={styles.filter}>
      <defs><filter id={filter} colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  5 -5 0 0 1" result="key" />
        <feComponentTransfer in="key" result="mask"><feFuncA type="discrete" tableValues="0 0 1 1" /></feComponentTransfer>
        <feComposite in="SourceGraphic" in2="mask" operator="in" />
      </filter></defs>
    </svg>
    <img src={`/assets/moni/${pose}.${pose === "idle" ? "png" : "webp"}`} alt="Moni — Artmonianın sənət köməkçisi" width="160" height="160" style={{ filter: `url(#${filter})` }} onError={() => setFailed(true)} />
  </span>;
}
