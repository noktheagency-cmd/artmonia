import { defaultContent, defaultSections, managedSectionKeys, type JsonValue, type SiteSectionRecord } from "./admin-content";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";

export type SiteContentMap = Record<string, JsonValue>;

export async function getPublishedContent(): Promise<SiteContentMap> {
  if (!isSupabaseConfigured()) return defaultContent;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_sections")
    .select("key, content, is_published")
    .order("sort_order");

  if (error || !data?.length) return defaultContent;
  const publishedContent: SiteContentMap = { ...defaultContent };
  data.forEach((row) => {
    if (row.is_published) publishedContent[row.key] = row.content as JsonValue;
    else delete publishedContent[row.key];
  });
  return publishedContent;
}

export async function getAdminSections(): Promise<SiteSectionRecord[]> {
  if (!isSupabaseConfigured()) return defaultSections;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_sections").select("*").order("sort_order");
  if (error || !data?.length) return defaultSections;
  const storedSections = (data as SiteSectionRecord[])
    .filter((section) => managedSectionKeys.has(section.key))
    .map((section) => {
      if (section.key !== "contact" || !section.content || typeof section.content !== "object" || Array.isArray(section.content)) return section;
      const fallback = defaultContent.contact as { phone: JsonValue; email: JsonValue; address: JsonValue };
      return {
        ...section,
        content: {
          phone: section.content.phone ?? fallback.phone,
          email: section.content.email ?? fallback.email,
          address: section.content.address ?? fallback.address
        }
      };
    });
  const storedKeys = new Set(storedSections.map((section) => section.key));
  return [
    ...storedSections,
    ...defaultSections.filter((section) => !storedKeys.has(section.key))
  ].sort((a, b) => a.sort_order - b.sort_order);
}
