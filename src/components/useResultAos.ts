"use client";

import { useEffect, useRef } from "react";

export function useResultAos<T extends HTMLElement>(refreshKey: string) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-aos]"));
    const revealImmediately = () => targets.forEach((target) => {
      target.setAttribute("data-aos-ready", "");
      target.setAttribute("data-aos-visible", "");
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      revealImmediately();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-aos-visible", "");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    targets.forEach((target) => {
      if (target.hasAttribute("data-aos-visible")) return;
      target.setAttribute("data-aos-ready", "");
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [refreshKey]);

  return ref;
}
