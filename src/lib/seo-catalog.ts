import "server-only";
import { seoDefaults } from "./seo-defaults";
import staticPages from "./seo-pages.json";
import { getPublishedContent } from "./site-content";
import { isNewsItem, getNewsImages } from "./news";
import { publishedBlog } from "./blog";
import { programSlug } from "./certificates";
import { withProgramDetail, type Program } from "./program-content";
import { normalizeSeoPath, type SeoPage } from "./page-seo";

export async function seoCatalog(): Promise<SeoPage[]> {
  const content = await getPublishedContent();
  const pages: SeoPage[] = [...staticPages];
  for (const course of (Array.isArray(content.courses) ? content.courses as Program[] : [])) {
    pages.push({ path: `/programlar/${encodeURIComponent(programSlug(course.title))}`, title: `${course.title} | Artmonia Academy`, description: course.text, image: withProgramDetail(course).detail.image || "/assets/studio-room.webp" });
  }
  for (const item of (Array.isArray(content.news_items) ? content.news_items.filter(isNewsItem) : [])) {
    pages.push({ path: `/yenilikler/${encodeURIComponent(item.id)}`, title: `${item.title} | Artmonia Academy`, description: item.excerpt, image: getNewsImages(item)[0] || "/assets/studio-room.webp" });
  }
  for (const post of publishedBlog(content.blog_posts)) pages.push({ path: `/blog/${encodeURIComponent(post.id)}`, title: `${post.title} | Artmonia Blog`, description: post.excerpt, image: post.image || "/assets/studio-room.webp" });
  return [...new Map(pages.map(page => [normalizeSeoPath(page.path), { ...page, path: normalizeSeoPath(page.path), defaults: seoDefaults(page.title, page.description, page.path, page.image) }])).values()];
}
