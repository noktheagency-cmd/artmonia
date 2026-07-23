import type { Metadata } from "next";
import NewsPage from "@/components/NewsPage";
import { newsItems, type NewsItem } from "@/data/site";
import { getPublishedContent } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Yeniliklər | Artmonia Academy",
  description: "Artmonia Academy-dən xəbərlər, yeni qruplar, elanlar və studiya görüşləri."
};

function isNewsItem(value: unknown): value is NewsItem {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as Partial<NewsItem>;
  return Boolean(
    item.id && item.date && item.category && item.title && item.excerpt &&
    Array.isArray(item.body) && item.body.every((paragraph) => typeof paragraph === "string")
  );
}

export default async function UpdatesPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const content = await getPublishedContent();
  const params = await searchParams;
  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) ? parsedPage : 1;
  const dynamicItems = content.news_items;
  const items = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : newsItems;

  return <NewsPage content={content} items={items.length ? items : newsItems} requestedPage={requestedPage} />;
}
