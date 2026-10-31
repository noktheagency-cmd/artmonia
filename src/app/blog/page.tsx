import { managedMetadata } from "@/lib/managed-metadata";

import SiteHeader from "@/components/SiteHeader";
import BlogSection from "@/components/BlogSection";
import { SiteContentProvider } from "@/components/SiteContentContext";
import { getPublishedContent } from "@/lib/site-content";

export async function generateMetadata() { return managedMetadata("Blog | Artmonia Academy", "Rəsm, rəng və yaradıcılıq haqqında yazılar.", "/blog"); }
export default async function BlogPage() {
  const content = await getPublishedContent();
  return <SiteContentProvider content={content}><SiteHeader /><main><BlogSection archive /></main></SiteContentProvider>;
}
