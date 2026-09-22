import type { MetadataRoute } from "next";
import { getPublishedContent } from "@/lib/site-content";
import { publishedBlog } from "@/lib/blog";
import { isNewsItem } from "@/lib/news";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getPublishedContent();
  const paths = ["/", "/akademiya", "/neticeler", "/telebe-isleri", "/mukafatlar", "/yenilikler", "/blog", "/muraciet"];
  const news = Array.isArray(content.news_items) ? content.news_items.filter(isNewsItem) : [];
  paths.push(...news.map((item) => `/yenilikler/${encodeURIComponent(item.id)}`));
  for (let page = 2; page <= Math.ceil(news.length / 6); page++) paths.push(`/yenilikler?page=${page}`);
  paths.push(...publishedBlog(content.blog_posts).map((post) => `/blog/${encodeURIComponent(post.id)}`));
  if (Array.isArray(content.courses)) {
    for (const course of content.courses) {
      if (course && typeof course === "object" && !Array.isArray(course) && typeof course.title === "string" && course.title.trim()) {
        paths.push(`/programlar/${encodeURIComponent(course.title.toLowerCase().replace(/\s+/g, "-"))}`);
      }
    }
  }
  // Do not invent modification dates: publication dates are not update timestamps.
  return [...new Set(paths)].map((path) => ({ url: absoluteUrl(path) }));
}
