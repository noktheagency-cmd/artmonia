import editorial from "./seo-editorial.json";
import { emptySeo, normalizeSeoPath, type PageSeo } from "./page-seo";
import { absoluteUrl } from "./seo";

const topics: [string, string][] = [
  ["portret", "portret rəsm"], ["qabiliyyət", "qabiliyyət imtahanına hazırlıq"],
  ["rəng", "rəngkarlıq"], ["qara qələm", "qara qələm"], ["yağlı boya", "yağlı boya"],
  ["kompozisiya", "kompozisiya"], ["işıq", "işıq və kölgə"], ["eskiz", "eskiz"],
  ["uşaq", "uşaqlar üçün rəsm"], ["sərgi", "rəsm sərgisi"], ["gips", "gips fiqur rəsmi"],
  ["qızıl nisbət", "qızıl nisbət"], ["süni intellekt", "süni intellekt və sənət"]
];

/** Shared by the public metadata renderer and admin, so displayed defaults match HTML. */
export function seoDefaults(title: string, description: string, path: string, image = "/assets/studio-room.webp"): PageSeo {
  const entry = (editorial as Record<string, { sourceTitle: string; title: string; description: string }>)[normalizeSeoPath(path)];
  // A renamed article must not retain an unrelated old editorial title.
  const copy = entry?.sourceTitle === title ? entry : undefined;
  const resolvedTitle = copy?.title || title.trim();
  const resolvedDescription = copy?.description || description.replace(/\s+/g, " ").trim();
  const text = `${resolvedTitle} ${resolvedDescription}`.toLocaleLowerCase("az");
  const keywords = [...new Set([...topics.filter(([term]) => text.includes(term)).map(([, word]) => word), path.startsWith("/programlar/") ? "rəsm kursları" : path.startsWith("/blog/") ? "rəsm haqqında məqalələr" : "Artmonia Academy", "Artmonia Academy"])].slice(0, 6).join(", ");
  return { ...emptySeo, title: resolvedTitle, description: resolvedDescription, keywords, canonical: absoluteUrl(path), shareTitle: resolvedTitle, shareDescription: resolvedDescription, image };
}
