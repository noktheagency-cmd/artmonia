"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./PaintBrushCursor.module.css";

const paintColors = ["#9275d3", "#b6a1df", "#dfa577", "#efbc77"] as const;

export default function PaintBrushCursor() {
  const isAdmin = usePathname().startsWith("/admin");
  const paintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paintLayer = paintRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!paintLayer || !finePointer.matches || reducedMotion.matches || isAdmin) return;

    const root = document.documentElement;
    root.classList.add("paint-cursor-enabled");

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
      addStain(tipX, tipY);
      makeCircleStain(tipX, tipY);
    };

    window.addEventListener("pointerdown", splatterOnClick, { passive: true });

    return () => {
      root.classList.remove("paint-cursor-enabled");
      window.removeEventListener("pointerdown", splatterOnClick);
      paintLayer.replaceChildren();
    };
  }, [isAdmin]);

  return <div ref={paintRef} className={styles.paintLayer} aria-hidden="true" />;
}
