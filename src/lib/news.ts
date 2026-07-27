import type { NewsItem } from "@/data/site";

export const newsFallbackImages = [
  "/assets/studio-room.webp",
  "/assets/article-composition.webp",
  "/assets/article-portrait-technique.webp",
  "/assets/module-color.webp",
  "/assets/studio-brushes.webp",
  "/assets/article-color-harmony-crisp.webp"
];

export function isNewsItem(value: unknown): value is NewsItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Partial<NewsItem>;
  const imagesAreValid = item.images === undefined
    || (Array.isArray(item.images) && item.images.every((image) => typeof image === "string"));

  return Boolean(
    item.id
    && item.date
    && item.category
    && item.title
    && item.excerpt
    && imagesAreValid
    && Array.isArray(item.body)
    && item.body.every((paragraph) => typeof paragraph === "string")
  );
}

export function mergeNewsItems(primary: NewsItem[], fallback: NewsItem[], limit?: number) {
  const merged = [...primary];
  const usedIds = new Set(merged.map((item) => item.id));

  for (const item of fallback) {
    if (!usedIds.has(item.id)) merged.push(item);
    usedIds.add(item.id);
    if (limit && merged.length >= limit) break;
  }

  return limit ? merged.slice(0, limit) : merged;
}

export function getNewsImages(item: NewsItem, fallbackIndex = 0) {
  const candidates = [
    ...(item.images ?? []),
    ...(item.image ? [item.image] : [])
  ].filter(Boolean);
  const uniqueImages = Array.from(new Set(candidates));

  return uniqueImages.length
    ? uniqueImages
    : [newsFallbackImages[fallbackIndex % newsFallbackImages.length]];
}

export function formatNewsDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}
