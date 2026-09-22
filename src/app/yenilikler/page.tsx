import { pageMetadata } from "@/lib/seo";
import NewsPage from "@/components/NewsPage";
import { getPublishedContent } from "@/lib/site-content";
import { isNewsItem } from "@/lib/news";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const content = await getPublishedContent();
  const items = Array.isArray(content.news_items) ? content.news_items.filter(isNewsItem) : [];
  const requested = Number.parseInt(params.page ?? "1", 10);
  const page = Math.min(Math.max(Number.isFinite(requested) ? requested : 1, 1), Math.max(1, Math.ceil(items.length / 6)));
  return pageMetadata(`Yeniliklər${page > 1 ? ` — səhifə ${page}` : ""} | Artmonia Academy`, "Artmonia Academy-dən xəbərlər, yeni qruplar, elanlar və studiya görüşləri.", page > 1 ? `/yenilikler?page=${page}` : "/yenilikler");
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
  const publishedItems = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : [];

  return <NewsPage content={content} items={publishedItems} requestedPage={requestedPage} />;
}
