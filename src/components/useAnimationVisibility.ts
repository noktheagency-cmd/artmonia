"use client";

import { useEffect, useRef } from "react";

/** Keep long-running CSS motion idle until its region is near the viewport. */
export function useAnimationVisibility<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      node.setAttribute("data-animation-visible", "");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => node.toggleAttribute("data-animation-visible", entry.isIntersecting),
      { rootMargin: "180px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}
