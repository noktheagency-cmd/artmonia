"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp, Newspaper, Plus, Trash2 } from "lucide-react";
import { newsItems, type NewsItem } from "@/data/site";
import type { SiteSectionRecord } from "@/lib/admin-content";
import { mergeNewsItems } from "@/lib/news";
import MediaField, { type MediaLibraryItem } from "./MediaField";

function parseItems(content: SiteSectionRecord["content"]): NewsItem[] {
  if (!Array.isArray(content)) return [];
  return content.flatMap((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const item = value as Record<string, unknown>;
    if (typeof item.id !== "string") return [];
    return [{
      id: item.id,
      date: typeof item.date === "string" ? item.date : "",
      category: typeof item.category === "string" ? item.category : "",
      title: typeof item.title === "string" ? item.title : "",
      excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
      image: typeof item.image === "string" ? item.image : "",
      images: Array.isArray(item.images) ? item.images.filter((image): image is string => typeof image === "string") : undefined,
      body: Array.isArray(item.body) ? item.body.filter((paragraph): paragraph is string => typeof paragraph === "string") : []
    }];
  });
}

function newItem(): NewsItem {
  return {
    id: `yenilik-${crypto.randomUUID()}`,
    date: new Date().toISOString().slice(0, 10),
    category: "Elan",
    title: "Yeni xəbər",
    excerpt: "",
    image: "",
    images: [],
    body: [""]
  };
}

export default function NewsEditor({
  section,
  busy,
  onSave,
  onUpload,
  media
}: {
  section: SiteSectionRecord;
  busy: boolean;
  onSave: (section: SiteSectionRecord) => Promise<void>;
  onUpload: (file: File) => Promise<string | null>;
  media: MediaLibraryItem[];
}) {
  const initialItems = useMemo(
    () => mergeNewsItems(parseItems(section.content), newsItems),
    [section.content]
  );
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(initialItems[0]?.id ?? null);
  const [published, setPublished] = useState(section.is_published);
  const selected = items.find((item) => item.id === selectedId) ?? null;

  function addItem() {
    const item = newItem();
    setItems((current) => [item, ...current]);
    setSelectedId(item.id);
  }

  function updateSelected(patch: Partial<NewsItem>) {
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
    <section className="collection-editor-view news-editor-view">
      <div className="admin-page-title collection-page-title">
        <div><h1>Yeniliklər</h1><p>Hero lentində və yeniliklər səhifəsində görünən xəbərləri idarə edin.</p></div>
        <button className="primary-action" type="button" onClick={addItem}><Plus /> Yeni xəbər əlavə et</button>
      </div>

      <div className="collection-workspace">
        <aside className="collection-list-pane">
          <header><h2>Xəbərlərin siyahısı</h2><span>{items.length}</span></header>
          {items.length ? (
            <div className="collection-item-list">
              {items.map((item, index) => (
                <button key={item.id} type="button" className={item.id === selectedId ? "selected" : ""} onClick={() => setSelectedId(item.id)}>
                  <span className="collection-thumb news-admin-index">{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{item.title || "Yeni xəbər"}</strong><small><i />{item.date || "Tarixsiz"}</small></span>
                  <ChevronRight />
                  <em>{index + 1}</em>
                </button>
              ))}
            </div>
          ) : (
            <div className="collection-list-empty"><Newspaper /><p>Hələ xəbər yoxdur.</p><button type="button" onClick={addItem}><Plus /> İlk xəbəri əlavə et</button></div>
          )}
        </aside>

        <div className="collection-form-pane">
          {selected ? (
            <>
              <header className="collection-form-header">
                <h2>Xəbəri redaktə et</h2>
                <div><button type="button" title="Yuxarı daşı" onClick={() => moveSelected(-1)}><ChevronUp /></button><button type="button" title="Aşağı daşı" onClick={() => moveSelected(1)}><ChevronDown /></button></div>
              </header>
              <div className="collection-form-fields">
                <label className="admin-field wide"><span>Xəbər başlığı</span><input value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} /></label>
                <label className="admin-field"><span>Kateqoriya</span><input value={selected.category} onChange={(event) => updateSelected({ category: event.target.value })} /></label>
                <label className="admin-field"><span>Tarix</span><input type="date" value={selected.date} onChange={(event) => updateSelected({ date: event.target.value })} /></label>
                <label className="admin-field wide"><span>Qısa mətn</span><textarea rows={3} value={selected.excerpt} onChange={(event) => updateSelected({ excerpt: event.target.value })} /></label>
                <label className="admin-field wide"><span>Tam mətn</span><textarea rows={10} value={selected.body.join("\n\n")} onChange={(event) => updateSelected({ body: event.target.value.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean) })} /><small>Abzasları bir boş sətirlə ayırın.</small></label>
              </div>
              <div className="news-media-fields">
                <div className="admin-field"><span>Xəbərin əsas şəkli</span><MediaField value={selected.image ?? ""} onChange={(image) => updateSelected({ image })} onUpload={onUpload} media={media} /></div>
                <div className="admin-field"><span>Detallı səhifə qalereyası</span><small>Şəkilləri əlavə edin, dəyişin və ya silin.</small>
                  <div className="news-gallery-editor">
                    {(selected.images ?? []).map((image, index) => <div key={`${selected.id}-${index}`}><MediaField compact value={image} onChange={(nextImage) => updateSelected({ images: (selected.images ?? []).map((current, itemIndex) => itemIndex === index ? nextImage : current).filter(Boolean) })} onUpload={onUpload} media={media} /><button type="button" onClick={() => updateSelected({ images: (selected.images ?? []).filter((_, itemIndex) => itemIndex !== index) })}><Trash2 /> Şəkli sil</button></div>)}
                    <button className="json-add" type="button" onClick={() => updateSelected({ images: [...(selected.images ?? []), ""] })}><Plus /> Qalereyaya şəkil əlavə et</button>
                  </div>
                </div>
              </div>
              <footer className="collection-form-actions">
                <button className="collection-delete" type="button" onClick={removeSelected}><Trash2 /> Xəbəri sil</button>
                <label className="collection-publish"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>{published ? "Dərc olunur" : "Qaralama"}</span></label>
                <button className="primary-action" type="button" disabled={busy || !selected.title.trim()} onClick={() => onSave({ ...section, content: items, is_published: published })}>{busy ? "Saxlanılır..." : "Dəyişiklikləri saxla"}</button>
              </footer>
            </>
          ) : (
            <div className="collection-form-empty"><Newspaper /><h2>Redaktə üçün xəbər seçin</h2><p>Sol siyahıdan seçim edin və ya yeni xəbər əlavə edin.</p><button className="primary-action" type="button" onClick={addItem}><Plus /> Yeni xəbər əlavə et</button></div>
          )}
        </div>
      </div>
    </section>
  );
}
