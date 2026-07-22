import {
  comparison,
  contact,
  courses,
  curriculum,
  faq,
  formFields,
  galleryImages,
  heroPaperSettings,
  heroStats,
  navItems,
  newsItems,
  packages,
  painPoints,
  privacy,
  resources,
  studioCards,
  studioFeatures,
  teachers,
  testimonials,
  transformations
} from "@/data/site";
import { awards, studentResults } from "@/data/collections";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type SiteSectionRecord = {
  id?: string;
  key: string;
  label: string;
  description: string;
  category: "website" | "academy" | "content" | "settings";
  content: JsonValue;
  is_published: boolean;
  sort_order: number;
  updated_at?: string;
};

const definitions = [
  ["hero_paper_settings", "Hero kagiz animasiyasi", "Hero yirtilan kagizinin 3 qati, rengleri ve oval effekti", "website", heroPaperSettings],
  ["nav_items", "Naviqasiya", "Sayt menyusu və keçidlər", "website", navItems],
  ["hero_stats", "Başlanğıc statistikası", "Ana təqdimatdakı qısa göstəricilər", "website", heroStats],
  ["pain_points", "Problem mətni", "Ziyarətçinin əsas ehtiyacları", "website", painPoints],
  ["transformations", "Dəyişiklik nəticələri", "Proqramın yaratdığı nəticələr", "website", transformations],
  ["courses", "Kurslar", "Kurs kartları, müddət və şəkillər", "academy", courses],
  ["studio_features", "Studiya üstünlükləri", "Studiya xüsusiyyətləri siyahısı", "academy", studioFeatures],
  ["studio_cards", "Studiya kartları", "Studiya haqqında məzmun", "academy", studioCards],
  ["curriculum", "Tədris proqramı", "Həftələr, mövzular və materiallar", "academy", curriculum],
  ["packages", "Paketlər", "Qiymət və paket üstünlükləri", "academy", packages],
  ["comparison", "Paket müqayisəsi", "Müqayisə cədvəlinin sətirləri", "academy", comparison],
  ["teachers", "Müəllimlər", "Müəllim profilləri", "academy", teachers],
  ["news_items", "Yeniliklər", "Hero xəbər lenti və yeniliklər səhifəsi", "content", newsItems],
  ["resources", "Məqalələr", "Məqalə və resurs məzmunu", "content", resources],
  ["testimonials", "Rəylər", "Tələbə rəyləri", "content", testimonials],
  ["faq", "Tez-tez verilən suallar", "Sual-cavab bölməsi", "content", faq],
  ["contact", "Əlaqə məlumatları", "Telefon, e-poçt, ünvan və sosial şəbəkələr", "settings", contact],
  ["form_fields", "Qeydiyyat formu", "Form sahələri və seçimlər", "settings", formFields],
  ["privacy", "Məxfilik", "Məxfilik siyasəti məzmunu", "settings", privacy],
  ["gallery_images", "Sayt şəkilləri", "Əsas vizual və qalereya şəkilləri", "content", galleryImages],
  ["student_results", "Nəticələr", "Tələbə işləri və inkişaf nəticələri", "content", studentResults],
  ["awards", "Mükafatlar", "Akademiyanın nailiyyətləri və mükafatları", "content", awards]
] as const;

export const defaultSections: SiteSectionRecord[] = definitions.map(
  ([key, label, description, category, content], index) => ({
    key,
    label,
    description,
    category,
    content: content as JsonValue,
    is_published: true,
    sort_order: index * 10
  })
);

export const defaultContent = Object.fromEntries(defaultSections.map((section) => [section.key, section.content]));
