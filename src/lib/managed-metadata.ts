import "server-only";
import { seoDefaults } from "./seo-defaults";
import { cache } from "react";
import { pageMetadata } from "./seo";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { normalizeSeoPath, validateSeo, type PageSeo } from "./page-seo";

const loadOverrides = cache(async (): Promise<Record<string, PageSeo>> => {
  if (!isSupabaseConfigured()) return {};
  try {
    const db = await createClient();
    const { data, error } = await db.from("site_public_content").select("content").eq("key", "page_metadata").eq("is_published", true).maybeSingle();
    if (error || !data?.content || typeof data.content !== "object" || Array.isArray(data.content)) return {};
    return data.content as unknown as Record<string, PageSeo>;
  } catch { return {}; }
});

export async function managedMetadata(title: string, description: string, path: string, image?: string, article = false) {
  const defaults = seoDefaults(title, description, path, image);
  const raw = (await loadOverrides())[normalizeSeoPath(path)];
  const custom = raw && !validateSeo(raw) ? raw : undefined;
  const result = pageMetadata(custom?.title || defaults.title, custom?.description || defaults.description, path, custom?.image || image, article);
  const canonical = custom?.canonical || result.alternates?.canonical;
  result.alternates = { canonical };
  result.keywords = (custom?.keywords || defaults.keywords).split(",").map(word => word.trim()).filter(Boolean);
  if (custom?.indexing && custom.indexing !== "default") result.robots = { index: custom.indexing === "index", follow: true };
  const shareTitle = custom?.shareTitle || custom?.title || defaults.title;
  const shareDescription = custom?.shareDescription || custom?.description || defaults.description;
  result.openGraph = { ...result.openGraph, title: shareTitle, description: shareDescription, url: canonical as string };
  result.twitter = { ...result.twitter, title: shareTitle, description: shareDescription };
  return result;
}
