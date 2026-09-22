"use client";

/* Collection images can come from Supabase Storage or existing site assets. */
/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import type { CollectionEntry } from "@/data/collections";
import type { SiteSectionRecord } from "@/lib/admin-content";
import MediaField, { type MediaLibraryItem } from "./MediaField";
import ResultPortrait from "../ResultPortrait";

type CollectionKind = "results" | "awards" | "home_results";

const copy = {
  home_results: {
    title: "Ana səhifə · Nəticələr lenti",
    helper: "Hərəkətli lentdə desktopda 5 kart görünür. Foto 3:4-dür. Ad birinci, nəticə ikinci sətirdə göstərilir; uzun mətnlər üç nöqtə ilə qısaldılır.",
    add: "Yeni tələbə əlavə et",
    list: "Tələbələrin siyahısı",
    editor: "Tələbə kartını redaktə et",
    name: "Ad və soyad",
    subtitle: "Nəticə — bir qısa cümlə",
    delete: "Tələbə kartını sil",
    newTitle: "Yeni tələbə"
  },
  results: {
    title: "Nəticələr",
    helper: "Şagirdlərin işlərini əlavə edin, sıralayın və saytda yayımlayın.",
    add: "Yeni nəticə əlavə et",
    list: "Nəticələrin siyahısı",
    editor: "Nəticəni redaktə et",
    name: "Tələbənin adı",
    subtitle: "Kurs və ya texnika",
    delete: "Nəticəni sil",
    newTitle: "Yeni tələbə nəticəsi"
  },
  awards: {
    title: "Mükafatlar",
    helper: "Akademiyanın mükafat və nailiyyətlərini əlavə edib saytda göstərin.",
    add: "Yeni mükafat əlavə et",
    list: "Mükafatların siyahısı",
    editor: "Mükafatı redaktə et",
    name: "Mükafatın adı",
    subtitle: "Təşkilat və ya kateqoriya",
    delete: "Mükafatı sil",
    newTitle: "Yeni mükafat"
  }
} as const;

function parseItems(content: SiteSectionRecord["content"]): CollectionEntry[] {
  if (!Array.isArray(content)) return [];
  return content.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.id !== "string") return [];
    return [{
      id: item.id,
      published: item.published !== false,
      title: typeof item.title === "string" ? item.title : "",
      subtitle: typeof item.subtitle === "string" ? item.subtitle : "",
      description: typeof item.description === "string" ? item.description : "",
      image: typeof item.image === "string" ? item.image : "",
      date: typeof item.date === "string" ? item.date : "",
      resultCategory: typeof item.resultCategory === "string" ? item.resultCategory : "",
      ...(typeof item.demoPortrait === "number" ? { demoPortrait: item.demoPortrait } : {}),
      category: item.category === "travel" ? "travel" : "cash"
    }];
  });
}

function newEntry(kind: CollectionKind): CollectionEntry {
  return {
    id: crypto.randomUUID(),
    title: copy[kind].newTitle,
    subtitle: "",
    description: "",
    image: "",
    date: new Date().toISOString().slice(0, 10),
    category: kind === "awards" ? "cash" : undefined
  };
}

export default function CollectionEditor({
  kind,
  section,
  busy,
  onSave,
  onUpload,
  media
}: {
  kind: CollectionKind;
  section: SiteSectionRecord;
  busy: boolean;
  onSave: (section: SiteSectionRecord) => Promise<void>;
  onUpload: (file: File) => Promise<string | null>;
  media: MediaLibraryItem[];
}) {
  const labels = copy[kind];
  const [items, setItems] = useState<CollectionEntry[]>(() => parseItems(section.content));
  const [selectedId, setSelectedId] = useState<string | null>(() => parseItems(section.content)[0]?.id ?? null);
  const [sectionPublished, setSectionPublished] = useState(section.is_published);
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  function addItem() {
    const entry = newEntry(kind);
    setItems((current) => [...current, entry]);
    setSelectedId(entry.id);
  }

  function updateSelected(patch: Partial<CollectionEntry>) {
    if (!selectedId) return;
    setItems((current) => current.map((item) => item.id === selectedId ? { ...item, ...patch } : item));
  }

  function removeSelected() {
    if (!selected || !window.confirm(`“${selected.title}” silinsin?`)) return;
    const next = items.filter((item) => item.id !== selected.id);
    setItems(next);
    setSelectedId(next[0]?.id ?? null);
  }

  function moveSelected(direction: -1 | 1) {
    if (!selectedId) return;
    const index = items.findIndex((item) => item.id === selectedId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    setItems(next);
  }

  return (
    <section className="collection-editor-view">
      <div className="admin-page-title collection-page-title">
        <div><h1>{labels.title}</h1><p>{labels.helper}</p></div>
        <button className="primary-action" type="button" onClick={addItem}><Plus /> {labels.add}</button>
      </div>

      <label className="collection-publish"><input type="checkbox" checked={sectionPublished} onChange={(event) => setSectionPublished(event.target.checked)} />Bütün bölmə saytda görünsün (saxladıqdan sonra)</label>
      <div className="collection-workspace">
        <aside className="collection-list-pane">
          <header><h2>{labels.list}</h2><span>{items.length}</span></header>
          {items.length ? (
            <div className="collection-item-list">
              {items.map((item, index) => (
                <button key={item.id} type="button" className={item.id === selectedId ? "selected" : ""} onClick={() => setSelectedId(item.id)}>
                  <span className="collection-thumb">{kind === "home_results" ? <ResultPortrait student={item} /> : item.image ? <img src={item.image} alt="" /> : <ImagePlus />}</span>
                  <span><strong>{item.title || labels.newTitle}</strong><small><i />{item.published !== false ? "Dərc olunub" : "Qaralama"}</small></span>
                  <ChevronRight />
                  <em>{index + 1}</em>
                </button>
              ))}
            </div>
          ) : (
            <div className="collection-list-empty"><ImagePlus /><p>Hələ məlumat yoxdur.</p><button type="button" onClick={addItem}><Plus /> İlkini əlavə et</button></div>
          )}
        </aside>

        <div className="collection-form-pane">
          {selected ? (
            <>
              <header className="collection-form-header">
                <h2>{labels.editor}</h2>
                <div><button type="button" title="Yuxarı daşı" onClick={() => moveSelected(-1)}><ChevronUp /></button><button type="button" title="Aşağı daşı" onClick={() => moveSelected(1)}><ChevronDown /></button></div>
              </header>
              <div className="collection-form-fields">
                <label className="admin-field"><span>{labels.name}</span><input maxLength={kind === "home_results" ? 60 : undefined} value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} /></label>
                <label className="admin-field"><span>{labels.subtitle}</span><input maxLength={kind === "home_results" ? 100 : undefined} value={selected.subtitle} onChange={(event) => updateSelected({ subtitle: event.target.value })} /></label>
                {kind !== "awards" ? <label className="admin-field wide"><span>Nəticə kateqoriyası</span><input list="result-category-options" maxLength={60} placeholder="Məsələn: Portret, Rəngkarlıq" value={selected.resultCategory ?? ""} onChange={(event) => updateSelected({ resultCategory: event.target.value })} onBlur={(event) => updateSelected({ resultCategory: event.target.value.trim() })} /><datalist id="result-category-options">{Array.from(new Set(items.map((item) => item.resultCategory?.trim()).filter(Boolean))).map((category) => <option key={category} value={category} />)}</datalist><small>Mövcud kateqoriyanı seçin və ya yenisini yazın. Düymələr hər iki səhifədə avtomatik yaranır. Boş saxlanılanlar “Digər” bölməsində görünür.</small></label> : null}
                {kind !== "home_results" ? <><label className="admin-field wide"><span>Qısa izah</span><textarea rows={4} value={selected.description} onChange={(event) => updateSelected({ description: event.target.value })} /></label>
                <label className="admin-field"><span>Tarix</span><input type="date" value={selected.date} onChange={(event) => updateSelected({ date: event.target.value })} /></label></> : null}
                {kind === "awards" ? <label className="admin-field"><span>Mükafat kateqoriyası</span><select value={selected.category ?? "cash"} onChange={(event) => updateSelected({ category: event.target.value as "cash" | "travel" })}><option value="cash">Pul mükafatı</option><option value="travel">Səyahət mükafatı</option></select></label> : null}
              </div>

              <div className="collection-upload-field">
                <span>Şəkil</span>
                {kind === "home_results" ? <div style={{ width: 180, maxWidth: "100%", marginBottom: 16 }}><ResultPortrait student={selected} /></div> : null}
                <MediaField value={selected.image} onChange={(image) => updateSelected({ image, ...(kind === "home_results" ? { demoPortrait: undefined } : {}) })} onUpload={onUpload} media={media} />
              </div>

              <footer className="collection-form-actions">
                <button className="collection-delete" type="button" onClick={removeSelected}><Trash2 /> {labels.delete}</button>
                <label className="collection-publish"><input type="checkbox" checked={selected.published !== false} onChange={(event) => updateSelected({ published: event.target.checked })} /><span>{selected.published !== false ? "Bu kart dərc olunur" : "Bu kart qaralamadır"}</span></label>
                <button className="primary-action" type="button" disabled={busy || !selected.title.trim()} onClick={() => onSave({ ...section, content: items, is_published: sectionPublished })}>{busy ? "Saxlanılır..." : "Dəyişiklikləri saxla"}</button>
              </footer>
            </>
          ) : (
            <div className="collection-form-empty"><ImagePlus /><h2>Redaktə üçün məlumat seçin</h2><p>Sol siyahıdan seçim edin və ya yeni məlumat əlavə edin.</p><div><button className="secondary-action" type="button" onClick={addItem}><Plus /> {labels.add}</button>{items.length === 0 ? <button className="primary-action" type="button" disabled={busy} onClick={() => onSave({ ...section, content: [] })}>{busy ? "Saxlanılır..." : "Boş siyahını saxla"}</button> : null}</div></div>
          )}
        </div>
      </div>
    </section>
  );
}
