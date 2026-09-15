import {
  contact,
  courses,
  galleryImages,
  newsItems,
  painPoints,
  transformations
} from "@/data/site";
import { awards, successStories } from "@/data/collections";
import { homeResults } from "@/data/home-results";
import { interiorMedia } from "@/data/interior-media";
import { testimonials } from "@/data/testimonials";
import { homeFaq } from "@/data/home-faq";
import { studentWorks } from "@/data/student-works";
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
  ["student_works", "Ana səhifə · Tələbə işləri", "Nəticələrin altındakı qalereya. Nümunə şəkilləri real işlərlə əvəz edin. Kateqoriya adları filtrləri avtomatik yaradır; ad, proqram, şəkil və rəy dəyişdirilə bilər.", "website", studentWorks],
  ["student_testimonials", "Tələbə rəyləri", "FAQ-ın altında hərəkətli rəy kartları: ad-soyad və ya Anonim, maksimum 250 simvolluq rəy", "website", testimonials],
  ["global_copy", "Ortaq menyu mətnləri", "Bütün səhifələrdə görünən menyu, müraciət düyməsi və müəllif hüququ mətni", "settings", globalCopy],
  ["home_page_copy", "Ana səhifə mətnləri", "Hero, bölmə başlıqları, düymələr, müəllimlər və footer mətnləri", "website", homePageCopy],
  ["pain_points", "Ana səhifə · Problem kartları", "Problem bölməsində görünən dörd qısa mətn", "website", painPoints],
  ["transformations", "Ana səhifə · Nəticə kartları", "Transformasiya bölməsində görünən başlıq və açıqlamalar", "website", transformations],
  ["courses", "Ana səhifə · Proqramlar", "3 sütunlu proqram kartları: başlıq, müddət, fon rəngi, şəkil, qısa mətn, pəncərənin ətraflı mətni və qiymət. Kartları əlavə edin, silin və sıralayın.", "website", courses],
  ["contact", "Ana səhifə · Əlaqə", "Footer-də görünən telefon, e-poçt və ünvan", "settings", visibleContact],
  ["home_faq", "Ana səhifə · Suallar və cavablar", "Əlaqədən əvvəlki FAQ: başlığı, sualları və cavabları dəyişin, əlavə edin və sıralayın", "website", homeFaq],
  ["gallery_images", "Ana səhifə · Bölmə şəkilləri", "Problem və transformasiya sahəsində görünən şəkillər", "content", galleryImages],
  ["academy_page_copy", "Akademiya səhifəsi mətnləri", "İnteryer, haqqımızda, yanaşma və footer mətnləri", "academy", academyPageCopy],
  ["interior_media", "İnteryer · Video və şəkillər", "Instagram reels solda, mətnlər sağda. Şəkillər desktopda 4-lü, 4:3 oval kəsimdə göstərilir. Reel dəyişəndə kəsimi saytda yoxlayın.", "academy", interiorMedia],
  ["application_page_copy", "Müraciət səhifəsi mətnləri", "Addımlar, proqram seçimləri, forma və nəticə mesajları", "academy", applicationPageCopy],
  ["news_page_copy", "Yeniliklər səhifəsi mətnləri", "Səhifə başlığı, arxiv və xəbər keçidi mətnləri", "content", newsPageCopy],
  ["news_items", "Yeniliklər", "Ana səhifə lentində və yeniliklər səhifəsində görünən xəbərlər", "content", newsItems],
  ["home_results", "Ana səhifə · Nəticələr lenti", "Yeniliklərin altındakı tələbə fotoları, ad-soyad və nəticə cümlələri", "content", homeResults],
  ["collections_page_copy", "Nəticə və mükafat səhifəsi mətnləri", "Nəticələr və mükafat kateqoriyaları üçün mətnlər", "content", collectionsPageCopy],
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
