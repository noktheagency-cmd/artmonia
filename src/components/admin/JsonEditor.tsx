"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { defaultContent, type JsonValue } from "@/lib/admin-content";
import MediaField, { type MediaLibraryItem } from "./MediaField";
import { successStories } from "@/data/collections";
import TestimonialsEditor from "./TestimonialsEditor";
import { useState } from "react";
import { newestWorks } from "@/lib/student-works";
import { studentWorks } from "@/data/student-works";
import { youtubeId } from "@/lib/youtube";

const fieldLabels: Record<string, string> = {
  courses: "Proqram",
  detail: "Detail səhifəsi",
  audience: "Kimlər üçündür — kartlar",
  audienceLabel: "Auditoriya bölməsinin üst etiketi",
  audienceTitle: "Auditoriya bölməsinin başlığı",
  learningLabel: "Tədris bölməsinin üst etiketi",
  learningTitle: "Tədris bölməsinin başlığı",
  syllabus: "Tədris bölməsi",
  enrollLabel: "Müraciət bölməsinin üst etiketi",
  enrollTitle: "Müraciət bölməsinin başlığı",
  enrollText: "Müraciət bölməsinin açıqlaması",
  enrollImage: "Müraciət bölməsinin şəkli",
  enrollCta: "Konsultasiya düyməsinin mətni",
  durationLabel: "Müddət etiketi",
  priceLabel: "Qiymət etiketi",
  priceFallback: "Qiymət boş olanda görünən mətn",
  backLabel: "Geri keçidin mətni",
  items: "İş kartı",
  success_stories: "Uğur hekayəsi",
  a: "Cavab",
  aboutLead: "Haqqımızda giriş mətni",
  aboutParagraphs: "Haqqımızda paraqrafları",
  aboutStatement: "Haqqımızda əsas fikir",
  aboutTitle: "Haqqımızda başlığı",
  addressLabel: "Ünvan etiketi",
  alt: "Şəkil açıqlaması",
  allLink: "Hamısına keçid mətni",
  allNews: "Bütün yeniliklər mətni",
  alternateEmail: "Əlavə e-poçt",
  applicationCta: "Müraciət düyməsi",
  archiveLabel: "Arxiv başlığı",
  backButton: "Geri düyməsi",
  backHome: "Ana səhifəyə qayıt mətni",
  backToNews: "Yeniliklərə qayıt mətni",
  body: "Əsas mətn",
  category: "Kateqoriya",
  categoryLabel: "Kateqoriya etiketi",
  cardLabel: "Kart etiketi",
  cashEmptyText: "Pul mükafatı boş vəziyyət açıqlaması",
  cashEmptyTitle: "Pul mükafatı boş vəziyyət başlığı",
  cashText: "Pul mükafatları açıqlaması",
  cashTitle: "Pul mükafatları başlığı",
  city: "Şəhər",
  color: "Rəng",
  content: "Məlumat",
  contactTextSuffix: "Əlaqə addımı açıqlaması",
  contactTitle: "Əlaqə başlığı",
  countSuffix: "Say göstəricisinin son sözü",
  continueButton: "Davam et düyməsi",
  cta: "Düymə mətni",
  date: "Tarix",
  darkThemeLabel: "Qaranlıq tema düyməsi",
  description: "Açıqlama",
  details: "Ətraflı məlumat",
  duration: "Müddət",
  eyebrow: "Hero üst mətni",
  email: "E-poçt",
  emailLabel: "E-poçt etiketi",
  emailPlaceholder: "E-poçt nümunəsi",
  facebook: "Facebook keçidi",
  features: "Üstünlüklər",
  feedbackChip: "Feedback qeydi",
  fields: "Forma sahələri",
  firstNameLabel: "Ad etiketi",
  firstNamePlaceholder: "Ad nümunəsi",
  firstStepLead: "İlk addım giriş mətni",
  firstStepText: "İlk addım açıqlaması",
  firstStepTitle: "İlk addım başlığı",
  footer: "Footer mətnləri",
  footerLinks: "Footer keçid mətnləri",
  heading: "Alt başlıq",
  highlight: "Vurğulanan qeyd",
  homeButton: "Ana səhifə düyməsi",
  hero: "Hero mətnləri",
  href: "Keçid ünvanı",
  id: "Sistem kodu",
  image: "Şəkil",
  images: "Qalereya şəkilləri",
  initials: "Adın baş hərfləri",
  interiorLead: "İnteryer giriş mətni",
  interiorText: "İnteryer əsas mətni",
  interiorTitle: "İnteryer başlığı",
  reelUrl: "Instagram reels keçidi (boş saxlasanız video gizlənir)",
  instagram: "Instagram keçidi",
  interests: "Proqram seçimləri",
  label: "Görünən ad",
  lastNameLabel: "Soyad etiketi",
  lastNamePlaceholder: "Soyad nümunəsi",
  latitude: "Enlik mətni",
  lead: "Giriş mətni",
  leftLabel: "Sol kart etiketi",
  leftText: "Sol kart açıqlaması",
  leftTitle: "Sol kart başlığı",
  lightThemeLabel: "İşıqlı tema düyməsi",
  longitude: "Uzunluq mətni",
  mentorChip: "Mentor qeydi",
  mentorNoteLabel: "Mentor qeydi etiketi",
  name: "Ad",
  narrativeParagraphs: "Studiya paraqrafları",
  narrativeTitle: "Studiya başlığı",
  navigation: "Menyu mətnləri",
  newApplicationButton: "Yeni müraciət düyməsi",
  news: "Yeniliklər bölməsi mətnləri",
  nextNews: "Növbəti xəbər mətni",
  noteText: "Qeyd açıqlaması",
  noteTitle: "Qeyd başlığı",
  note: "Əlavə qeyd",
  num: "Sıra nömrəsi",
  openMap: "Xəritə düyməsi",
  options: "Seçim variantları",
  ovalRadius: "Künc yumşaqlığı",
  pageTitle: "Səhifə başlığı",
  people: "Müəllimlər",
  periodLabel: "Müddət etiketi",
  phone: "Telefon",
  phoneLabel: "Telefon etiketi",
  phonePlaceholder: "Telefon nümunəsi",
  placeholder: "Sahədə görünən nümunə",
  portfolioStamp: "Portfolio qeydi",
  poster: "Önizləmə şəkli",
  price: "Qiymət",
  principles: "Tədris prinsipləri",
  principlesTitle: "Prinsiplər başlığı",
  problem: "Problem · Tanış gəlir? — mətnlər və xanımın şəkli",
  programs: "Proqram bölməsi mətnləri",
  progressPrefix: "Addım göstəricisi",
  program: "Proqram",
  q: "Sual",
  questions: "Sual",
  quote: "Rəy mətni",
  readMore: "Ətraflı oxu mətni",
  rightLabel: "Sağ kart etiketi",
  rightText: "Sağ kart açıqlaması",
  rightTitle: "Sağ kart başlığı",
  role: "Vəzifə / rol",
  roomCaption: "Studiya şəkli qeydi",
  secondStepLead: "İkinci addım giriş mətni",
  sections: "Mətn bölmələri",
  selectCta: "Proqram seç düyməsi",
  sketchLabel: "Eskiz qeydi",
  src: "Şəkil",
  statement: "Əsas fikir",
  steps: "Mərhələlər",
  storiesKicker: "Uğur hekayələri üst başlığı",
  storiesText: "Uğur hekayələri açıqlaması",
  storiesTitle: "Uğur hekayələri başlığı",
  studioDetails: "Studiya imkanları",
  studentWorkLabel: "Tələbə işi etiketi",
  submitButton: "Göndər düyməsi",
  subtitle: "Alt başlıq",
  successLabel: "Uğur etiketi",
  successTextSuffix: "Uğur mesajı",
  successTitlePrefix: "Təşəkkür başlığı",
  summary: "Qısa xülasə",
  systemChip: "Sistem qeydi",
  teachers: "Müəllim bölməsi mətnləri",
  text: "Mətn",
  title: "Başlıq",
  titleEmphasis: "Başlıq vurğusu",
  titleEnd: "Başlığın sonu",
  titleStart: "Başlığın əvvəli",
  topics: "Mövzular",
  transformationLabel: "Transformasiya etiketi",
  transformationTitle: "Transformasiya başlığı",
  travelEmptyText: "Səyahət mükafatı boş vəziyyət açıqlaması",
  travelEmptyTitle: "Səyahət mükafatı boş vəziyyət başlığı",
  travelText: "Səyahət mükafatları açıqlaması",
  travelTitle: "Səyahət mükafatları başlığı",
  type: "Növ",
  value: "Göstərici",
  video: "Video",
  visitSubtitle: "Ziyarət alt başlığı",
  visitTitle: "Ziyarət başlığı",
  week: "Həftə"
};

const mediaKeys = new Set(["image", "src", "poster", "video", "enrollImage"]);

function friendlyLabel(key: string) {
  return fieldLabels[key] ?? key
    .replaceAll("_", " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toLocaleUpperCase("az"));
}

function blankLike(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "id" ? crypto.randomUUID() : key === "createdAt" ? new Date().toISOString() : blankLike(child)]));
  }
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  return "";
}

type Props = {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  onUpload: (file: File) => Promise<string | null>;
  media: MediaLibraryItem[];
  path?: string;
  fieldKey?: string;
};

function templateAtPath(path: string): JsonValue | undefined {
  const [section, ...segments] = path.split(".");
  let value: JsonValue | undefined = defaultContent[section];
  for (const segment of segments) {
    if (Array.isArray(value)) value = value[Number(segment)] ?? value[0];
    else if (value && typeof value === "object") value = value[segment];
    else return undefined;
  }
  return value;
}

function StudentWorksEditor({ value, onChange, onUpload, media, path }: Props & { value: JsonValue[]; path: string }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const ordered = newestWorks(value.map((item, index) => ({ item, index, createdAt: item && typeof item === "object" && !Array.isArray(item) && typeof item.createdAt === "string" ? item.createdAt : "" })));
  const filtered = ordered.filter(({ item }) => JSON.stringify(item).toLocaleLowerCase("az").includes(query.trim().toLocaleLowerCase("az")));
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, pages);
  return <div className="json-array">
    <p>Ən yeni işlər əvvəl göstərilir. Ana səhifədə son 10 iş, qalereyada hər səhifədə 20 iş görünür. Ad, kateqoriya və şəkil mütləqdir.</p>
    <input aria-label="Tələbə işlərində axtar" placeholder="Ad, proqram və ya kateqoriya axtar..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
    <button className="json-add" type="button" onClick={() => {
      onChange([...value, { ...blankLike(studentWorks.items[0]) as Record<string, JsonValue>, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]);
      setQuery(""); setPage(1);
    }}><Plus /> Yeni iş kartı əlavə et</button>
    <p role="status">{filtered.length} iş · səhifə {currentPage} / {pages}</p>
    {filtered.slice((currentPage - 1) * 5, currentPage * 5).map(({ item, index }) => <div className="json-array-item" key={item && typeof item === "object" && !Array.isArray(item) && typeof item.id === "string" ? item.id : index}>
      <div className="json-array-toolbar"><span>İş kartı {index + 1}</span><button type="button" title="İşi sil" onClick={() => { if (window.confirm("Bu işi siyahıdan silmək istəyirsiniz? Dəyişiklik saxlandıqdan sonra sayta tətbiq olunacaq.")) onChange(value.filter((_, i) => i !== index)); }}><Trash2 /></button></div>
      <JsonEditor value={item} path={`${path}.${index}`} fieldKey="work" onUpload={onUpload} media={media} onChange={(next) => onChange(value.map((old, i) => i === index ? next : old))} />
    </div>)}
    <div className="json-array-toolbar"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Əvvəlki 5 iş</button><button type="button" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}>Növbəti 5 iş</button></div>
  </div>;
}

export default function JsonEditor({ value, onChange, onUpload, media, path = "content", fieldKey = "content" }: Props) {
  if (path === "student_works.items" && Array.isArray(value)) return <StudentWorksEditor value={value} onChange={onChange} onUpload={onUpload} media={media} path={path} />;
  if (fieldKey === "student_testimonials") return <TestimonialsEditor value={value} onChange={onChange} />;
  if (Array.isArray(value)) {
    const template = templateAtPath(path);
    const arrayTemplate = Array.isArray(template) ? template[0] : undefined;
    const isMediaGallery = fieldKey === "images" || (fieldKey === "gallery" && value.every((item) => typeof item === "string"));
    return (
      <div className={`json-array ${isMediaGallery ? "media-array" : ""}`}>
        {value.map((item, index) => (
          <div className="json-array-item" key={`${path}-${index}`}>
            <div className="json-array-toolbar">
              <span>{isMediaGallery ? `Şəkil ${index + 1}` : `${friendlyLabel(fieldKey)} ${index + 1}`}</span>
              <div>
                <button type="button" title="Yuxarı daşı" disabled={index === 0} onClick={() => {
                  const next = [...value];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}><ChevronUp /></button>
                <button type="button" title="Aşağı daşı" disabled={index === value.length - 1} onClick={() => {
                  const next = [...value];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  onChange(next);
                }}><ChevronDown /></button>
                <button type="button" title="Sil" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></button>
              </div>
            </div>
            {isMediaGallery && typeof item === "string" ? (
              <MediaField value={item} onChange={(next) => onChange(value.map((current, itemIndex) => itemIndex === index ? next : current).filter(Boolean))} onUpload={onUpload} media={media} compact />
            ) : (
              <JsonEditor
                value={item}
                path={`${path}.${index}`}
                fieldKey={fieldKey}
                onUpload={onUpload}
                media={media}
                onChange={(nextItem) => onChange(value.map((current, itemIndex) => itemIndex === index ? nextItem : current))}
              />
            )}
          </div>
        ))}
        <button className="json-add" type="button" onClick={() => {
          const item = isMediaGallery ? "" : blankLike(value.at(-1) ?? (fieldKey === "success_stories" ? { ...successStories[0], video: "" } : arrayTemplate ?? (fieldKey === "questions" ? { q: "", a: "" } : "")));
          onChange([...value, path.startsWith("student_works") && fieldKey === "items" && item && typeof item === "object" && !Array.isArray(item) ? { ...item, createdAt: new Date().toISOString() } : item]);
        }}>
          <Plus /> {isMediaGallery ? "Yeni şəkil əlavə et" : `Yeni ${friendlyLabel(fieldKey).toLocaleLowerCase("az")} əlavə et`}
        </button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="json-object">
        {Object.entries(path.startsWith("success_stories.") && "name" in value ? { video: "", ...value } : value).filter(([key]) => key !== "id" && key !== "createdAt" && !(path.startsWith("success_stories.") && ["summary", "duration", "quote", "note", "program"].includes(key)) && !(path === "home_page_copy.problem" && ["transformationLabel", "transformationTitle"].includes(key))).map(([key, child]) => (
          <div role="group" aria-labelledby={`${path}-${key}-label`} className={`json-field ${key === "id" ? "system-field" : ""}`} key={`${path}-${key}`}>
            <span id={`${path}-${key}-label`}>{path.startsWith("success_stories.") && key === "video" ? "YouTube video linki" : friendlyLabel(key)}{key === "id" ? <small>Avtomatik yaradılır, dəyişməyin</small> : null}</span>
            <JsonEditor
              value={child}
              path={`${path}.${key}`}
              fieldKey={key}
              onUpload={onUpload}
              media={media}
              onChange={(nextChild) => onChange({ ...value, [key]: nextChild })}
            />
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <button className={`json-toggle ${value ? "on" : ""}`} type="button" onClick={() => onChange(!value)}><i />{value ? "Aktiv" : "Deaktiv"}</button>;
  }

  if (typeof value === "number") {
    return <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />;
  }

  const text = value == null ? "" : String(value);
  if (path.startsWith("success_stories.") && fieldKey === "video") {
    const id = youtubeId(text);
    return <>
      <input type="url" aria-label="YouTube video linki" placeholder="https://www.youtube.com/watch?v=..." value={text} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(text && !id)} />
      <small>YouTube linkini daxil edin (watch, youtu.be və ya Shorts). Video kartın daxilində açılır; fayl yükləmək lazım deyil.</small>
      {text && !id && <small role="alert">Bu YouTube video linki deyil. Köhnə video faylının yerinə YouTube linkini daxil edin.</small>}
      {id && <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="YouTube video üz qabığı" style={{ width: "100%", maxWidth: 360, aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 12 }} />}
    </>;
  }
  if (path === "home_page_copy.footer.image") {
    return <><MediaField value={text} onChange={onChange} onUpload={onUpload} media={media} accept="image" /><small>“Gözləmə, başla” bölməsinin şəkli. Buradan yeni şəkil yükləyə və ya kitabxanadan seçə bilərsiniz.</small></>;
  }
  if (path === "home_page_copy.problem.image") {
    return <><MediaField value={text} onChange={onChange} onUpload={onUpload} media={media} accept="image" /><small>“Tanış gəlir?” bölməsinin mərkəzindəki xanımın şəkli. Şəffaf fonlu PNG və ya WEBP yükləyin; şəkil mövcud ölçüyə uyğun göstəriləcək.</small></>;
  }
  if (path.startsWith("student_works.items.") && fieldKey === "image") {
    return <><MediaField value={text} onChange={onChange} onUpload={onUpload} media={media} previewRatio="3 / 4" /><input aria-label="İş şəklinin ünvanı" placeholder="https://... və ya /assets/..." value={text} onChange={(event) => onChange(event.target.value)} /><small>Şəkli yükləyin, kitabxanadan seçin və ya mövcud şəklin ünvanını daxil edin.</small></>;
  }
  if (mediaKeys.has(fieldKey)) {
    return <><MediaField value={text} onChange={onChange} onUpload={onUpload} media={media} previewRatio={path.startsWith("success_stories.") ? "16 / 9" : undefined} accept={fieldKey === "video" ? "video" : "image"} />{path.startsWith("success_stories.") && <small>YouTube linki əlavə ediləndə videonun öz üz qabığı görünür. Bu şəkil yalnız link olmayan kart üçün ehtiyatdır. Kart ölçüsü 16:9-dur.</small>}</>;
  }
  if (fieldKey === "color") return <div className="json-color-field"><input type="color" value={text || "#ffffff"} onChange={(event) => onChange(event.target.value)} /><input value={text} onChange={(event) => onChange(event.target.value)} /></div>;
  if (fieldKey === "date") return <input type="date" value={text} onChange={(event) => onChange(event.target.value)} />;
  if (["q", "a", "body", "description", "lead", "note", "quote", "summary", "text"].includes(fieldKey) || text.length > 90) {
    return <textarea value={text} onChange={(event) => onChange(event.target.value)} rows={4} />;
  }
  return <input value={text} onChange={(event) => onChange(event.target.value)} />;
}
