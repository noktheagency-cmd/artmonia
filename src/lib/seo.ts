import type { Metadata } from "next";

export const SITE_URL = "https://artmoniya.com";
export const SITE_NAME = "Artmonia Academy";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

export function pageMetadata(title: string, description: string, path: string, image = "/assets/studio-room.webp", article = false): Metadata {
  const images = [{ url: absoluteUrl(image), alt: title }];
  return {
    title, description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), siteName: SITE_NAME, locale: "az_AZ", type: article ? "article" : "website", images },
    twitter: { card: "summary_large_image", title, description, images: images.map((item) => item.url) },
  };
}

// Admin text is untrusted, including inside a JSON script element.
export const serializeSchema = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export function breadcrumb(name: string, path: string, parent?: { name: string; path: string }) {
  const entries = [{ name: "Ana səhifə", path: "/" }, ...(parent ? [parent] : []), { name, path }];
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: entries.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
