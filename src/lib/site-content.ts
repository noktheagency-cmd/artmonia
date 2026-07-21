import { defaultContent, defaultSections, type JsonValue, type SiteSectionRecord } from "./admin-content";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export type SiteContentMap = Record<string, JsonValue>;

export async function getPublishedContent(): Promise<SiteContentMap> {
  if (!isSupabaseConfigured()) return defaultContent;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_sections")
    .select("key, content")
    .eq("is_published", true)
    .order("sort_order");

  if (error || !data?.length) return defaultContent;
  return {
    ...defaultContent,
    ...Object.fromEntries(data.map((row) => [row.key, row.content as JsonValue]))
  };
}

export async function getAdminSections(): Promise<SiteSectionRecord[]> {
  if (!isSupabaseConfigured()) return defaultSections;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_sections").select("*").order("sort_order");
  if (error || !data?.length) return defaultSections;
  const storedSections = data as SiteSectionRecord[];
  const storedKeys = new Set(storedSections.map((section) => section.key));
  return [
    ...storedSections,
    ...defaultSections.filter((section) => !storedKeys.has(section.key))
  ].sort((a, b) => a.sort_order - b.sort_order);
}
