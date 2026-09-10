import type { NewsItem } from "@/data/site";

export const newsFallbackImages = [
  "/assets/studio-room.webp",
  "/assets/article-composition.webp",
  "/assets/article-portrait-technique.webp",
  "/assets/module-color.webp",
  "/assets/studio-brushes.webp",
  "/assets/article-color-harmony-crisp.webp"
];

const newsImageOverrides: Record<string, string> = {
  "d4dc5bbb-8b14-4da0-814e-250eeb97f7b2.jpeg": "/assets/news-clean/student-results-1-clean.webp",
  "dc57ba2a-c022-454b-a2a3-87049a34f509.jpeg": "/assets/news-clean/student-results-2-clean.webp",
  "f9951863-b7bb-4ac6-9ce0-f13d443c30ea.jpeg": "/assets/news-clean/student-results-3-clean.webp"
};

function resolveNewsImage(image: string) {
  const override = Object.entries(newsImageOverrides)
    .find(([sourceName]) => image.includes(sourceName));

  return override?.[1] ?? image;
}

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

export function getNewsImages(item: NewsItem, fallbackIndex = 0) {
  const candidates = [
    ...(item.images ?? []),
    ...(item.image ? [item.image] : [])
  ].filter(Boolean).map(resolveNewsImage);
  const uniqueImages = Array.from(new Set(candidates));

  return uniqueImages.length
    ? uniqueImages
    : [newsFallbackImages[fallbackIndex % newsFallbackImages.length]];
}

export function formatNewsDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const [, year, month, day] = match;
  const monthNames = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avqust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr"
  ];
  const monthName = monthNames[Number(month) - 1];

  return monthName ? `${day} ${monthName} ${year}` : value;
}
