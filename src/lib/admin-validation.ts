import type { SiteSectionRecord } from "./admin-content";
import { youtubeId } from "./youtube";

export function validateSection(section: SiteSectionRecord): string | undefined {
  if (!Array.isArray(section.content)) return;
  const titles = new Set<string>();
  for (const [index, value] of section.content.entries()) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    if (value.published === false) continue;
    const title = String(value.title ?? "").trim();
    if (["news_items", "courses", "home_results", "awards"].includes(section.key) && !title) return `${index + 1}-ci kartın adı boşdur.`;
    if (section.key === "news_items" && (!String(value.excerpt ?? "").trim() || !String(value.category ?? "").trim() || !/^\d{4}-\d{2}-\d{2}$/.test(String(value.date)))) return `${index + 1}-ci xəbər: qısa mətn, kateqoriya və tarix tələb olunur.`;
    if (section.key === "courses") {
      const key = title.toLocaleLowerCase("az").replace(/[^\p{L}\p{N}]+/gu, "-");
      if (titles.has(key)) return "Proqram adları təkrarlanmamalıdır — hər proqramın ayrıca keçidi var.";
      titles.add(key);
    }
    if (section.key === "success_stories" && value.video && !youtubeId(String(value.video))) return `${index + 1}-ci hekayədə düzgün YouTube linki daxil edin və ya linki boş saxlayın.`;
  }
}
