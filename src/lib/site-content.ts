import { defaultContent, defaultSections, managedSectionKeys, type JsonValue, type SiteSectionRecord } from "./admin-content";
import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import { courses } from "@/data/site";
import { publicTestimonials } from "./section-editing";
import { withProgramDetail } from "./program-content";
import { transformationDefaults } from "./transformation-content";
import { publishedBlog } from "./blog";

export type SiteContentMap = Record<string, JsonValue>;

const removedHomeCopyKeys = new Set(["journey", "pricing"]);

function sanitizeSectionContent(key: string, content: JsonValue, rows: { key: string; content: unknown }[] = []): JsonValue {
  if (key === "transformations") {
    if (Array.isArray(content)) {
      const home = rows.find((row) => row.key === "home_page_copy")?.content as JsonValue;
      const problem = home && typeof home === "object" && !Array.isArray(home) ? home.problem : null;
      const copy = problem && typeof problem === "object" && !Array.isArray(problem) ? problem : {};
      const gallery = rows.find((row) => row.key === "gallery_images")?.content as JsonValue;
      const photo = Array.isArray(gallery) ? gallery[1] : null;
      const image = photo && typeof photo === "object" && !Array.isArray(photo) ? photo : {};
      return { ...transformationDefaults,
        label: copy.transformationLabel ?? transformationDefaults.label,
        title: copy.transformationTitle ?? transformationDefaults.title,
        image: image.src ?? transformationDefaults.image,
        alt: image.alt ?? transformationDefaults.alt,
        items: content.map((item) => item && typeof item === "object" && !Array.isArray(item) ? { image: "", ...item } : item)
      };
    }
    if (content && typeof content === "object") return { ...transformationDefaults, ...content };
  }
  if (key === "courses" && Array.isArray(content)) {
    return content.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;
      const fallback = courses.find((course) => course.title === item.title) ?? courses[index];
      return withProgramDetail({ ...(fallback ?? { title: "", color: "#eee2ff", duration: "", price: "", text: "", details: "", image: "" }), ...item } as Parameters<typeof withProgramDetail>[0]);
    }) as JsonValue;
  }

  if (!content || typeof content !== "object" || Array.isArray(content)) return content;

  if (key === "home_page_copy") {
    const problem = content.problem;
    if (problem && typeof problem === "object" && !Array.isArray(problem)) {
      content = { ...content, problem: { image: "/assets/problem-center-girl.webp", ...problem } };
    }
    return Object.fromEntries(
      Object.entries(content).filter(([contentKey]) => !removedHomeCopyKeys.has(contentKey))
    ) as JsonValue;
  }

  if (key === "collections_page_copy" && content.results && typeof content.results === "object" && !Array.isArray(content.results)) {
    const results = { ...(content.results as Record<string, JsonValue>) };
    ["comparisonKicker", "comparisonTitle", "beforeLabel", "afterLabel", "studentWorkLabel", "mentorNoteLabel", "periodLabel", "comparisons"].forEach((field) => delete results[field]);
    return { ...content, results } as JsonValue;
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
    if (row.is_published) publishedContent[row.key] = row.key === "student_testimonials" ? publicTestimonials(row.content as JsonValue) : sanitizeSectionContent(row.key, row.content as JsonValue, data);
    else delete publishedContent[row.key];
  });
  // Draft article bodies must not be serialized into public client providers.
  if (publishedContent.blog_posts) publishedContent.blog_posts = publishedBlog(publishedContent.blog_posts);
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
      const definition = defaultSections.find((item) => item.key === section.key);
      const sanitizedSection = { ...section, label: definition?.label ?? section.label, description: definition?.description ?? section.description, content: sanitizeSectionContent(section.key, section.content, data) };
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
