import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import BlogSection from "@/components/BlogSection";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Blog | Artmonia Academy", description: "Rəsm, rəng və yaradıcılıq haqqında yazılar." };
export default async function BlogPage() {
  const content = await getPublishedContent();
  return <SiteContentProvider content={content}><SiteHeader /><main><BlogSection archive /></main></SiteContentProvider>;
}
