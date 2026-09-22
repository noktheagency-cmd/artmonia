import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsDetailPage from "@/components/NewsDetailPage";
import { getPublishedContent } from "@/lib/site-content";
import { isNewsItem, getNewsImages } from "@/lib/news";
import { pageMetadata, breadcrumb, absoluteUrl, SITE_URL } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";

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

  return pageMetadata(`${item.title} | Artmonia Academy`, item.excerpt, `/yenilikler/${encodeURIComponent(item.id)}`, getNewsImages(item)[0], true);
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

  const item = items[itemIndex];
  const path = `/yenilikler/${encodeURIComponent(item.id)}`;
  return (<>
    <StructuredData data={[
      { "@context": "https://schema.org", "@type": "Article", headline: item.title, description: item.excerpt, image: getNewsImages(item, itemIndex).map(absoluteUrl), inLanguage: "az", mainEntityOfPage: absoluteUrl(path), datePublished: /^\d{4}-\d{2}-\d{2}$/.test(item.date) ? item.date : undefined, publisher: { "@type": "EducationalOrganization", "@id": `${SITE_URL}/#organization`, name: "Artmonia Academy", url: SITE_URL } },
      breadcrumb(item.title, path, { name: "Yeniliklər", path: "/yenilikler" })
    ]} />
    <NewsDetailPage
      content={content}
      item={items[itemIndex]}
      itemIndex={itemIndex}
      nextItem={items[itemIndex + 1] ?? items[0]}
    /></>
  );
}
