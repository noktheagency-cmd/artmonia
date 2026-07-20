"use client";

import { createContext, useContext } from "react";
import type { SiteContentMap } from "@/lib/site-content";

const SiteContentContext = createContext<SiteContentMap>({});

export function SiteContentProvider({ content, children }: { content: SiteContentMap; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContentValue<T>(key: string, fallback: T): T {
  const content = useContext(SiteContentContext);
  return (content[key] as unknown as T | undefined) ?? fallback;
}
