import type { Metadata } from "next";
import NewsPage from "@/components/NewsPage";
import { newsItems } from "@/data/site";
import { getPublishedContent } from "@/lib/site-content";
import { isNewsItem, mergeNewsItems } from "@/lib/news";

export const metadata: Metadata = {
  title: "Yeniliklər | Artmonia Academy",
  description: "Artmonia Academy-dən xəbərlər, yeni qruplar, elanlar və studiya görüşləri."
};

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
  const publishedItems = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : [];
  const items = mergeNewsItems(publishedItems, newsItems);

  return <NewsPage content={content} items={items} requestedPage={requestedPage} />;
}
