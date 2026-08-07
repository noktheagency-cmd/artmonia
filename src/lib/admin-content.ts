import {
  contact,
  courses,
  galleryImages,
  newsItems,
  packages,
  painPoints,
  transformations
} from "@/data/site";
import { awards, successStories } from "@/data/collections";
import {
  academyPageCopy,
  applicationPageCopy,
  collectionsPageCopy,
  globalCopy,
  homePageCopy,
  newsPageCopy
} from "@/data/site-copy";

const visibleContact = {
  phone: contact.phone,
  email: contact.email,
  address: contact.address
};

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
  ["global_copy", "Ortaq menyu mətnləri", "Bütün səhifələrdə görünən menyu, müraciət düyməsi və müəllif hüququ mətni", "settings", globalCopy],
  ["home_page_copy", "Ana səhifə mətnləri", "Hero, bölmə başlıqları, düymələr, müəllimlər və footer mətnləri", "website", homePageCopy],
  ["pain_points", "Ana səhifə · Problem kartları", "Problem bölməsində görünən dörd qısa mətn", "website", painPoints],
  ["transformations", "Ana səhifə · Nəticə kartları", "Transformasiya bölməsində görünən başlıq və açıqlamalar", "website", transformations],
  ["courses", "Ana səhifə · Proqramlar", "Ekranda görünən kurs kartları, müddət, mətn və şəkillər", "website", courses],
  ["packages", "Ana səhifə · Qiymətlər", "Ekranda görünən paket, qiymət və üstünlük mətnləri", "website", packages],
  ["contact", "Ana səhifə · Əlaqə", "Footer-də görünən telefon, e-poçt və ünvan", "settings", visibleContact],
  ["gallery_images", "Ana səhifə · Bölmə şəkilləri", "Problem və transformasiya sahəsində görünən şəkillər", "content", galleryImages],
  ["academy_page_copy", "Akademiya səhifəsi mətnləri", "İnteryer, haqqımızda, yanaşma və footer mətnləri", "academy", academyPageCopy],
  ["application_page_copy", "Müraciət səhifəsi mətnləri", "Addımlar, proqram seçimləri, forma və nəticə mesajları", "academy", applicationPageCopy],
  ["news_page_copy", "Yeniliklər səhifəsi mətnləri", "Səhifə başlığı, arxiv və xəbər keçidi mətnləri", "content", newsPageCopy],
  ["news_items", "Yeniliklər", "Ana səhifə lentində və yeniliklər səhifəsində görünən xəbərlər", "content", newsItems],
  ["collections_page_copy", "Nəticə və mükafat səhifəsi mətnləri", "Nəticələr, müqayisələr, mükafat kateqoriyaları və boş vəziyyət mətnləri", "content", collectionsPageCopy],
  ["success_stories", "Uğur hekayələri", "Nəticələr səhifəsində görünən tələbə adı, mətn, şəkil və video məlumatı", "content", successStories],
  ["awards", "Mükafatlar", "Mükafatlar səhifəsində görünən nailiyyətlər", "content", awards]
] as const;

export const managedSectionKeys = new Set<string>(definitions.map(([key]) => key));

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
