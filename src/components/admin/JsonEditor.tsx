"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { JsonValue } from "@/lib/admin-content";
import MediaField, { type MediaLibraryItem } from "./MediaField";

const fieldLabels: Record<string, string> = {
  a: "Cavab",
  alt: "Şəkil açıqlaması",
  alternateEmail: "Əlavə e-poçt",
  body: "Əsas mətn",
  category: "Kateqoriya",
  city: "Şəhər",
  color: "Rəng",
  content: "Məlumat",
  cta: "Düymə mətni",
  date: "Tarix",
  description: "Açıqlama",
  duration: "Müddət",
  email: "E-poçt",
  facebook: "Facebook keçidi",
  features: "Üstünlüklər",
  heading: "Alt başlıq",
  highlight: "Vurğulanan qeyd",
  href: "Keçid ünvanı",
  id: "Sistem kodu",
  image: "Şəkil",
  images: "Qalereya şəkilləri",
  initials: "Adın baş hərfləri",
  instagram: "Instagram keçidi",
  label: "Görünən ad",
  lead: "Giriş mətni",
  name: "Ad",
  note: "Əlavə qeyd",
  num: "Sıra nömrəsi",
  options: "Seçim variantları",
  ovalRadius: "Künc yumşaqlığı",
  phone: "Telefon",
  placeholder: "Sahədə görünən nümunə",
  poster: "Önizləmə şəkli",
  price: "Qiymət",
  program: "Proqram",
  q: "Sual",
  quote: "Rəy mətni",
  role: "Vəzifə / rol",
  sections: "Mətn bölmələri",
  src: "Şəkil",
  subtitle: "Alt başlıq",
  summary: "Qısa xülasə",
  text: "Mətn",
  title: "Başlıq",
  topics: "Mövzular",
  type: "Növ",
  value: "Göstərici",
  video: "Video",
  week: "Həftə"
};

const mediaKeys = new Set(["image", "src", "poster", "video"]);

function friendlyLabel(key: string) {
  return fieldLabels[key] ?? key.replaceAll("_", " ").replace(/^./, (character) => character.toLocaleUpperCase("az"));
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
