import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetailPage from "@/components/NewsDetailPage";
import { getPublishedContent } from "@/lib/site-content";
import { isNewsItem } from "@/lib/news";

async function getNewsCollection() {
  const content = await getPublishedContent();
  const dynamicItems = content.news_items;
  const items = Array.isArray(dynamicItems) ? dynamicItems.filter(isNewsItem) : [];

  return {
    content,
    items
  };
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { items } = await getNewsCollection();
  const item = items.find((candidate) => candidate.id === decodeURIComponent(id));

  if (!item) return { title: "Xəbər tapılmadı | Artmonia Academy" };

  return {
    title: `${item.title} | Artmonia Academy`,
    description: item.excerpt,
    openGraph: {
      title: item.title,
      description: item.excerpt,
      images: item.images?.length ? item.images : item.image ? [item.image] : undefined
    }
  };
}

export default async function NewsDetailRoute({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { content, items } = await getNewsCollection();
  const decodedId = decodeURIComponent(id);
  const itemIndex = items.findIndex((candidate) => candidate.id === decodedId);

  if (itemIndex < 0) notFound();

  return (
    <NewsDetailPage
      content={content}
      item={items[itemIndex]}
      itemIndex={itemIndex}
      nextItem={items[itemIndex + 1] ?? items[0]}
    />
  );
}
