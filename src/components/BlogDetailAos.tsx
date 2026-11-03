"use client";

import type { ReactNode } from "react";
import { useResultAos } from "@/components/useResultAos";

export default function BlogDetailAos({ children, refreshKey }: { children: ReactNode; refreshKey: string }) {
  const rootRef = useResultAos<HTMLDivElement>(refreshKey);
  return <div ref={rootRef}>{children}</div>;
}
