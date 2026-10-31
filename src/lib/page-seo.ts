export type PageSeo = {
  title: string; description: string; keywords: string; canonical: string;
  shareTitle: string; shareDescription: string; image: string;
  indexing: "default" | "index" | "noindex";
};
export const emptySeo: PageSeo = { title: "", description: "", keywords: "", canonical: "", shareTitle: "", shareDescription: "", image: "", indexing: "default" };
export type SeoPage = { path: string; title: string; description: string; image: string; defaults?: PageSeo };
export function normalizeSeoPath(path: string) {
  return decodeURIComponent(path.split("?")[0]).replace(/\/$/, "") || "/";
}
export function validateSeo(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Metadata düzgün deyil.";
  const v = value as Record<string, unknown>;
  for (const key of Object.keys(emptySeo)) {
    if (typeof v[key] !== "string" || (v[key] as string).length > (key === "image" || key === "canonical" ? 2048 : 1000)) return "Sahələr düzgün deyil və ya mətn çox uzundur.";
  }
  if (!["default", "index", "noindex"].includes(v.indexing as string)) return "İndeksləmə seçimi düzgün deyil.";
  for (const key of ["canonical", "image"]) {
    const input = (v[key] as string).trim();
    if (!input) continue;
    if (key === "image" && /^\/(?!\/)[^\\\s]*$/.test(input)) continue;
    try { const url = new URL(input); if (url.protocol !== "https:" || url.username || url.password || url.hash) return "Ünvan etibarlı HTTPS linki olmalıdır."; }
    catch { return "Ünvan etibarlı HTTPS linki olmalıdır."; }
  }
}
export function cleanSeo(value: PageSeo): PageSeo {
  return Object.fromEntries(Object.keys(emptySeo).map(key => [key, value[key as keyof PageSeo].trim()])) as PageSeo;
}
