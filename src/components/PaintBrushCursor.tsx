"use client";

import { useEffect, useRef } from "react";
import styles from "./PaintBrushCursor.module.css";

const paintColors = ["#9275d3", "#b6a1df", "#dfa577", "#efbc77"] as const;

export default function PaintBrushCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const brushHeadRef = useRef<SVGGElement>(null);
  const paintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const paintLayer = paintRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!cursor || !paintLayer || !finePointer.matches || reducedMotion.matches || window.location.pathname.startsWith("/admin")) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;
    let lastPaintX = 0;
    let lastPaintY = 0;
    let hasPainted = false;
    let previousX = 0;

    root.classList.add("paint-cursor-enabled");

    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      x = event.clientX;
      y = event.clientY;

      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          const tilt = Math.max(-9, Math.min(9, (x - previousX) * 0.18));
          cursor.style.transform = `translate3d(${x - 1}px, ${y - 3}px, 0) rotate(${tilt}deg)`;
          cursor.classList.add(styles.visible);
          previousX = x;
          frame = 0;
        });
      }

      const tipX = x;
      const tipY = y;
      const movementX = tipX - lastPaintX;
      const movementY = tipY - lastPaintY;
      const distance = Math.hypot(movementX, movementY);
      if (!hasPainted || distance >= 15) {
        const angle = hasPainted ? Math.atan2(movementY, movementX) * (180 / Math.PI) : 0;
        addBrushStroke(tipX, tipY, angle);

        lastPaintX = tipX;
        lastPaintY = tipY;
        hasPainted = true;
      }
    };

    const addStain = (stainX: number, stainY: number) => {
      if (paintLayer.childElementCount >= 28) return;
      const color = paintColors[Math.floor(Math.random() * paintColors.length)] ?? paintColors[0];
      const mark = document.createElement("span");
      mark.className = styles.stain;
      const width = 8 + Math.random() * 9;
      const height = 6 + Math.random() * 7;
      const driftX = (Math.random() - 0.5) * 16;
      const driftY = 5 + Math.random() * 11;
      mark.style.left = `${stainX - width / 2 + (Math.random() - 0.5) * 7}px`;
      mark.style.top = `${stainY - height / 2 + (Math.random() - 0.5) * 5}px`;
      mark.style.width = `${width}px`;
      mark.style.height = `${height}px`;
      mark.append(makeAmoeba(color));
      mark.style.setProperty("--stain-x", `${driftX}px`);
      mark.style.setProperty("--stain-mid-x", `${driftX * 0.55}px`);
      mark.style.setProperty("--stain-y", `${driftY}px`);
      mark.style.setProperty("--stain-mid-y", `${driftY * 0.4}px`);
      paintLayer.append(mark);
      window.setTimeout(() => mark.remove(), 950);
    };

    const addBrushStroke = (strokeX: number, strokeY: number, angle: number) => {
      if (paintLayer.childElementCount >= 28) return;
      const stroke = document.createElement("span");
      stroke.className = styles.brushStroke;
      const width = 27 + Math.random() * 18;
      const height = 4 + Math.random() * 3;
      stroke.style.left = `${strokeX - width / 2}px`;
      stroke.style.top = `${strokeY - height / 2}px`;
      stroke.style.width = `${width}px`;
      stroke.style.height = `${height}px`;
      stroke.style.setProperty("--stroke-angle", `${angle}deg`);
      paintLayer.append(stroke);
      window.setTimeout(() => stroke.remove(), 720);
    };

    const makeAmoeba = (color: string) => {
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");

      const count = 9;
      const points = Array.from({ length: count }, (_, index) => {
        const angle = -Math.PI / 2 + (index / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
        const radius = 29 + Math.random() * 20;
        return { x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius };
      });
      const midpoints = points.map((point, index) => {
        const next = points[(index + 1) % count];
        return { x: (point.x + next.x) / 2, y: (point.y + next.y) / 2 };
      });
      let pathData = `M ${midpoints[count - 1].x} ${midpoints[count - 1].y}`;
      for (let index = 0; index < count; index += 1) {
        pathData += ` Q ${points[index].x} ${points[index].y} ${midpoints[index].x} ${midpoints[index].y}`;
      }
      pathData += " Z";

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathData);
      path.setAttribute("fill", color);
      svg.append(path);
      return svg;
    };

    const makeCircleStain = (centerX: number, centerY: number) => {
      if (paintLayer.childElementCount >= 18) return;
      const ring = document.createElement("span");
      ring.className = styles.circleStain;
      ring.setAttribute("aria-hidden", "true");
      for (let i = 0; i < 8; i += 1) {
        const stain = document.createElement("span");
        const angle = i * 45 + (Math.random() - 0.5) * 10;
        const radius = 12 + Math.random() * 8;
        const color = paintColors[Math.floor(Math.random() * paintColors.length)] ?? paintColors[0];
        stain.className = styles.circleBlob;
        stain.style.width = `${7 + Math.random() * 6}px`;
        stain.style.height = `${5 + Math.random() * 5}px`;
        stain.append(makeAmoeba(color));
        stain.style.setProperty("--orbit-angle", `${angle}deg`);
        stain.style.setProperty("--orbit-radius", `${radius}px`);
        stain.style.setProperty("--blob-delay", `${i * 24}ms`);
        ring.append(stain);
      }
      ring.style.left = `${centerX - 28}px`;
      ring.style.top = `${centerY - 28}px`;
      paintLayer.append(ring);
      window.setTimeout(() => ring.remove(), 1050);
    };

    const splatterOnClick = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (event.target instanceof Element && event.target.closest(".site-header .desktop-nav")) return;
      const tipX = event.clientX;
      const tipY = event.clientY;
      const brushHead = brushHeadRef.current;
      if (brushHead) {
        brushHead.getAnimations().forEach((animation) => animation.cancel());
        brushHead.animate(
          [
            { transform: "scale(.94) rotate(0deg)" },
            { transform: "scale(.94) rotate(-9deg)", offset: 0.32 },
            { transform: "scale(.94) rotate(8deg)", offset: 0.68 },
            { transform: "scale(.94) rotate(0deg)" },
          ],
          { duration: 250, easing: "ease-in-out", iterations: 1 },
        );
      }
      addStain(tipX, tipY);
      makeCircleStain(tipX, tipY);
    };

    const hideCursor = (event: PointerEvent) => {
      if (!event.relatedTarget) cursor.classList.remove(styles.visible);
    };
    const showCursor = (event: PointerEvent) => {
      if (event.pointerType === "mouse") cursor.classList.add(styles.visible);
    };

    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", splatterOnClick, { passive: true });
    window.addEventListener("pointerout", hideCursor, { passive: true });
    window.addEventListener("pointerover", showCursor, { passive: true });

    return () => {
      root.classList.remove("paint-cursor-enabled");
      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener("pointerdown", splatterOnClick);
      window.removeEventListener("pointerout", hideCursor);
      window.removeEventListener("pointerover", showCursor);
      if (frame) window.cancelAnimationFrame(frame);
      paintLayer.replaceChildren();
    };
  }, []);

  return (
    <>
      <div ref={paintRef} className={styles.paintLayer} aria-hidden="true" />
      <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
        <svg viewBox="0 0 64 64" role="presentation">
          <defs>
            <linearGradient id="brush-handle" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#111116" />
              <stop offset=".58" stopColor="#25242b" />
              <stop offset="1" stopColor="#3a3841" />
            </linearGradient>
            <linearGradient id="brush-ferrule" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#a99cbd" />
              <stop offset=".5" stopColor="#eee9f5" />
              <stop offset="1" stopColor="#bdb0d4" />
            </linearGradient>
            <linearGradient id="brush-bristles" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#493273" />
              <stop offset=".56" stopColor="#7150aa" />
              <stop offset="1" stopColor="#9a7bce" />
            </linearGradient>
          </defs>
          <g transform="translate(2 0)">
            <path d="M27.8 28.7 58.8-3c2.1-1.9 5.7-1.9 7.2.1 1.6 2.1.5 5-1.6 7.1L34.5 35.8Z" fill="url(#brush-handle)" stroke="#0c0b10" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M31.5 29.1 59.5-.8c1.1-1.1 2.4-1.8 3.7-1.8-.5 1.8-1.8 3.2-3.2 4.7L33.6 31.3Z" fill="#aaa7b2" opacity=".55" />
          </g>
          <g transform="translate(2 0)">
            <path d="M27.8 28.7Q28.1 28.4 28.5 28.9L34 34.4Q34.8 35.2 34.3 36.1L28.7 46.7Q28.1 47.5 27.3 46.8L18.6 39Q17.8 38.3 18.5 37.5Z" fill="url(#brush-ferrule)" stroke="#0c0259" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="m28.1 31 4.8 4.5-3.9 7.1-7-6Z" fill="#fff" opacity=".48" />
          </g>
          <g ref={brushHeadRef} className={styles.brushHead}>
            <g transform="translate(-1.5 -1.5)">
              <path d="M17.5 37.8c-3.6 2.3-4.7 7.6-6.7 13.2-2.1 5.9-5.6 9.9-8.8 11.7-1.3.8-.6 2.2 1.6 2.3 11 .3 23.8-5.7 29.4-14.6 3-4.8 1.5-8.9-4.6-12.1L25.1 36c-2.5-1.1-5.2.2-7.6 1.8Z" fill="url(#brush-bristles)" stroke="#0c0259" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M3.4 63.2c6.1-2.5 11.8-7 16.5-13.4" fill="none" stroke="#c7b3e9" strokeWidth="1.05" strokeLinecap="round" opacity=".86" />
              <path d="M8 64c6.1-3.1 12-7.7 16.8-13.9M14.5 61.9c5.1-3.2 9.9-7.5 13.5-12.3" fill="none" stroke="#b198dd" strokeWidth=".8" strokeLinecap="round" opacity=".72" />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
}
