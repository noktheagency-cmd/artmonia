import { defaultContent, defaultSections, managedSectionKeys, type JsonValue, type SiteSectionRecord } from "./admin-content";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { courses } from "@/data/site";

export type SiteContentMap = Record<string, JsonValue>;

const removedHomeCopyKeys = new Set(["journey", "pricing"]);

function sanitizeSectionContent(key: string, content: JsonValue): JsonValue {
  if (key === "courses" && Array.isArray(content)) {
    return content.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const fallback = courses.find((course) => course.title === item.title) ?? courses[index];
      return fallback ? { ...fallback, ...item } : item;
    }) as JsonValue;
  }

  if (!content || typeof content !== "object" || Array.isArray(content)) return content;

  if (key === "home_page_copy") {
    return Object.fromEntries(
      Object.entries(content).filter(([contentKey]) => !removedHomeCopyKeys.has(contentKey))
    ) as JsonValue;
  }

  if (key === "global_copy" && Array.isArray(content.navigation)) {
    const navigation = content.navigation.map((item, index) => {
      if (index !== 0 || !item || typeof item !== "object" || Array.isArray(item) || !Array.isArray(item.children)) return item;
      return { ...item, children: item.children.slice(0, 1) };
    });
    return { ...content, navigation };
  }

  return content;
}

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
    if (!managedSectionKeys.has(row.key)) return;
    if (row.is_published) publishedContent[row.key] = sanitizeSectionContent(row.key, row.content as JsonValue);
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
      const sanitizedSection = { ...section, content: sanitizeSectionContent(section.key, section.content) };
      if (section.key !== "contact" || !sanitizedSection.content || typeof sanitizedSection.content !== "object" || Array.isArray(sanitizedSection.content)) return sanitizedSection;
      const fallback = defaultContent.contact as { phone: JsonValue; email: JsonValue; address: JsonValue };
      return {
        ...sanitizedSection,
        content: {
          phone: sanitizedSection.content.phone ?? fallback.phone,
          email: sanitizedSection.content.email ?? fallback.email,
          address: sanitizedSection.content.address ?? fallback.address
        }
      };
    });
  const storedKeys = new Set(storedSections.map((section) => section.key));
  return [
    ...storedSections,
    ...defaultSections.filter((section) => !storedKeys.has(section.key))
  ].sort((a, b) => a.sort_order - b.sort_order);
}
