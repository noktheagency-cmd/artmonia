import type { JsonValue } from "./admin-content";
import { TESTIMONIAL_LIMIT, TESTIMONIAL_NAME_LIMIT, TESTIMONIAL_TEXT_LIMIT } from "../data/testimonials";

// Preserve shape for consumers without leaking hidden values or restoring seeds.
export function blankSection(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankSection(child)]));
  if (typeof value === "boolean") return false;
  if (typeof value === "number") return 0;
  return "";
}

// Retain an explicit empty published record: removing the row restores seed data.
export function emptySectionContent(content: JsonValue): JsonValue | undefined {
  if (Array.isArray(content)) return [];
  if (content && typeof content === "object" && Array.isArray(content.items)) {
    return { ...content, items: [] };
  }
  return undefined;
}

export function validateTestimonials(content: JsonValue): string | undefined {
  if (!Array.isArray(content)) return "Rəylər siyahı şəklində olmalıdır.";
  if (content.length > TESTIMONIAL_LIMIT) return `Maksimum ${TESTIMONIAL_LIMIT} rəy əlavə etmək olar.`;
  for (const [index, item] of content.entries()) {
    if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.text !== "string" || typeof item.name !== "string" || typeof item.anonymous !== "boolean") return `Rəy ${index + 1}: məlumat formatı düzgün deyil.`;
    if (item.text.length > TESTIMONIAL_TEXT_LIMIT) return `Rəy ${index + 1}: maksimum ${TESTIMONIAL_TEXT_LIMIT} simvol olmalıdır.`;
    if (!item.anonymous && item.name.length > TESTIMONIAL_NAME_LIMIT) return `Rəy ${index + 1}: ad maksimum ${TESTIMONIAL_NAME_LIMIT} simvol olmalıdır.`;
  }
}

export function publicTestimonials(content: JsonValue): JsonValue {
  if (!Array.isArray(content)) return [];
  return content.filter((item) => item && typeof item === "object" && !Array.isArray(item) && typeof item.text === "string" && item.text.trim()).slice(0, TESTIMONIAL_LIMIT).map((item) => {
    const review = item as Record<string, JsonValue>;
    return {
      id: typeof review.id === "string" ? review.id : "",
      anonymous: review.anonymous === true,
      name: review.anonymous === true ? "" : String(review.name ?? "").slice(0, TESTIMONIAL_NAME_LIMIT),
      text: String(review.text).trim().slice(0, TESTIMONIAL_TEXT_LIMIT)
    };
  });
}
