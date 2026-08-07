"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { JsonValue } from "@/lib/admin-content";
import MediaField, { type MediaLibraryItem } from "./MediaField";

const fieldLabels: Record<string, string> = {
  a: "Cavab",
  aboutLead: "Haqqımızda giriş mətni",
  aboutParagraphs: "Haqqımızda paraqrafları",
  aboutStatement: "Haqqımızda əsas fikir",
  aboutTitle: "Haqqımızda başlığı",
  addressLabel: "Ünvan etiketi",
  afterLabel: "Sonra etiketi",
  alt: "Şəkil açıqlaması",
  allLink: "Hamısına keçid mətni",
  allNews: "Bütün yeniliklər mətni",
  alternateEmail: "Əlavə e-poçt",
  applicationCta: "Müraciət düyməsi",
  archiveLabel: "Arxiv başlığı",
  backButton: "Geri düyməsi",
  backHome: "Ana səhifəyə qayıt mətni",
  backToNews: "Yeniliklərə qayıt mətni",
  beforeLabel: "Əvvəl etiketi",
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
  comparisonKicker: "Müqayisə üst başlığı",
  comparisonTitle: "Müqayisə başlığı",
  comparisons: "Müqayisələr",
  content: "Məlumat",
  contactTextSuffix: "Əlaqə addımı açıqlaması",
  contactTitle: "Əlaqə başlığı",
  countSuffix: "Say göstəricisinin son sözü",
  continueButton: "Davam et düyməsi",
  cta: "Düymə mətni",
  date: "Tarix",
  darkThemeLabel: "Qaranlıq tema düyməsi",
  description: "Açıqlama",
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
  instagram: "Instagram keçidi",
  interests: "Proqram seçimləri",
  journey: "Keçid səhnəsi mətnləri",
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
  pricing: "Qiymət bölməsi mətnləri",
  principles: "Tədris prinsipləri",
  principlesTitle: "Prinsiplər başlığı",
  problem: "Problem bölməsi mətnləri",
  programs: "Proqram bölməsi mətnləri",
  progressPrefix: "Addım göstəricisi",
  program: "Proqram",
  q: "Sual",
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

const mediaKeys = new Set(["image", "src", "poster", "video"]);

function friendlyLabel(key: string) {
  return fieldLabels[key] ?? key
    .replaceAll("_", " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toLocaleUpperCase("az"));
}

function blankLike(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, key === "id" ? crypto.randomUUID() : blankLike(child)]));
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

export default function JsonEditor({ value, onChange, onUpload, media, path = "content", fieldKey = "content" }: Props) {
  if (Array.isArray(value)) {
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
        <button className="json-add" type="button" onClick={() => onChange([...value, isMediaGallery ? "" : blankLike(value.at(-1) ?? "")])}>
          <Plus /> {isMediaGallery ? "Yeni şəkil əlavə et" : `Yeni ${friendlyLabel(fieldKey).toLocaleLowerCase("az")} əlavə et`}
        </button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="json-object">
        {Object.entries(value).filter(([key]) => key !== "id").map(([key, child]) => (
          <label className={`json-field ${key === "id" ? "system-field" : ""}`} key={`${path}-${key}`}>
            <span>{friendlyLabel(key)}{key === "id" ? <small>Avtomatik yaradılır, dəyişməyin</small> : null}</span>
            <JsonEditor
              value={child}
              path={`${path}.${key}`}
              fieldKey={key}
              onUpload={onUpload}
              media={media}
              onChange={(nextChild) => onChange({ ...value, [key]: nextChild })}
            />
          </label>
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
  if (mediaKeys.has(fieldKey)) {
    return <MediaField value={text} onChange={onChange} onUpload={onUpload} media={media} accept={fieldKey === "video" ? "video" : "image"} />;
  }
  if (fieldKey === "color") return <div className="json-color-field"><input type="color" value={text || "#ffffff"} onChange={(event) => onChange(event.target.value)} /><input value={text} onChange={(event) => onChange(event.target.value)} /></div>;
  if (fieldKey === "date") return <input type="date" value={text} onChange={(event) => onChange(event.target.value)} />;
  if (["body", "description", "lead", "note", "quote", "summary", "text"].includes(fieldKey) || text.length > 90) {
    return <textarea value={text} onChange={(event) => onChange(event.target.value)} rows={4} />;
  }
  return <input value={text} onChange={(event) => onChange(event.target.value)} />;
}
