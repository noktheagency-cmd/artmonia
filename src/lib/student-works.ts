import type { JsonValue } from "./admin-content";

export function newestWorks<T extends { createdAt?: string }>(items: T[]): T[] {
  return items.map((item, index) => ({ item, index }))
    .sort((a, b) => (Date.parse(b.item.createdAt ?? "") || 0) - (Date.parse(a.item.createdAt ?? "") || 0) || b.index - a.index)
    .map(({ item }) => item);
}

export function validateStudentWorks(content: JsonValue): string | null {
  if (!content || typeof content !== "object" || Array.isArray(content) || !Array.isArray(content.items)) return "İş siyahısı düzgün deyil.";
  for (const [index, item] of content.items.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return `${index + 1}-ci iş düzgün deyil.`;
    for (const [key, label] of [["name", "Ad"], ["image", "Şəkil"], ["category", "Kateqoriya"]]) {
      if (typeof item[key] !== "string" || !item[key].trim()) return `${index + 1}-ci iş: ${label} mütləqdir.`;
    }
  }
  return null;
}
