"use client";
import { useState } from "react";
import { Plus, Trash2, Newspaper } from "lucide-react";
import { parseBlog, type BlogPost } from "@/lib/blog";
import type { SiteSectionRecord } from "@/lib/admin-content";
import MediaField, { type MediaLibraryItem } from "./MediaField";

export default function BlogEditor({ section, busy, onSave, onUpload, media }: {
  section: SiteSectionRecord; busy: boolean; onSave: (section: SiteSectionRecord) => Promise<void>;
  onUpload: (file: File) => Promise<string | null>; media: MediaLibraryItem[];
}) {
  const [items, setItems] = useState(() => parseBlog(section.content));
  const [selectedId, setSelectedId] = useState<string | null>(() => parseBlog(section.content)[0]?.id ?? null);
  const [error, setError] = useState("");
  const selected = items.find((item) => item.id === selectedId);
  const update = (patch: Partial<BlogPost>) => setItems((current) => current.map((post) => post.id === selectedId ? { ...post, ...patch } : post));
  function add() {
    const post: BlogPost = { id: `blog-${crypto.randomUUID()}`, title: "Yeni yazı", excerpt: "", category: "", date: new Date().toISOString().slice(0, 10), author: "", image: "", imageAlt: "", body: "", published: false };
    setItems((current) => [post, ...current]); setSelectedId(post.id); setError("");
  }
  function save() {
    const invalid = items.find((post) => post.published && (!post.title.trim() || !post.excerpt.trim() || !post.image.trim() || !post.body.trim() || !post.date));
    if (invalid) { setError(`“${invalid.title || "Adsız yazı"}”: dərc etmək üçün başlıq, qısa mətn, tarix, üz qabığı və tam mətn lazımdır.`); return; }
    setError(""); void onSave({ ...section, content: items, is_published: true });
  }
  function remove() {
    if (!selected || !window.confirm(`“${selected.title}” silinsin? Dəyişiklikləri saxlamağı unutmayın.`)) return;
    const next = items.filter((post) => post.id !== selected.id); setItems(next); setSelectedId(next[0]?.id ?? null);
  }
  return <section className="collection-editor-view">
    <div className="admin-page-title collection-page-title"><div><h1>Blog</h1><p>Home-da son 8 yazı görünür. Bütün yazılar /blog səhifəsindədir. Qaralamalar yalnız admində görünür.</p></div><button className="primary-action" type="button" onClick={add}><Plus /> Yeni yazı</button></div>
    {error ? <p role="alert">{error}</p> : null}
    <div className="collection-workspace"><aside className="collection-list-pane"><header><h2>Yazılar</h2><span>{items.length}</span></header><div className="collection-item-list">{items.map((post) => <button key={post.id} type="button" className={post.id === selectedId ? "selected" : ""} onClick={() => setSelectedId(post.id)}><Newspaper /><span><strong>{post.title || "Adsız yazı"}</strong><small>{post.published ? "Dərc olunur" : "Qaralama"}</small></span></button>)}</div></aside>
      <div className="collection-form-pane">{selected ? <>
        <header className="collection-form-header"><h2>Yazını redaktə et</h2></header>
        <div className="collection-form-fields">
          <label className="admin-field wide"><span>Başlıq *</span><input maxLength={180} value={selected.title} onChange={(e) => update({ title: e.target.value })} /></label>
          <label className="admin-field"><span>Kateqoriya</span><input maxLength={60} list="blog-categories" value={selected.category} onChange={(e) => update({ category: e.target.value })} /><datalist id="blog-categories">{Array.from(new Set(items.map((p) => p.category).filter(Boolean))).map((category) => <option key={category} value={category} />)}</datalist></label>
          <label className="admin-field"><span>Tarix *</span><input type="date" value={selected.date} onChange={(e) => update({ date: e.target.value })} /></label>
          <label className="admin-field wide"><span>Müəllif (istəyə bağlı)</span><input maxLength={100} value={selected.author} onChange={(e) => update({ author: e.target.value })} /></label>
          <label className="admin-field wide"><span>Qısa mətn *</span><textarea rows={3} maxLength={280} value={selected.excerpt} onChange={(e) => update({ excerpt: e.target.value })} /></label>
          <label className="admin-field wide"><span>Tam mətn *</span><textarea rows={12} value={selected.body} onChange={(e) => update({ body: e.target.value })} /><small>Abzasları boş sətirlə ayırın. Mətn təhlükəsiz adi mətn kimi göstərilir.</small></label>
          <label className="admin-field wide"><span>Şəklin təsviri</span><input value={selected.imageAlt} onChange={(e) => update({ imageAlt: e.target.value })} /></label>
        </div>
        <div className="collection-upload-field"><span>Üz qabığı * <small style={{ fontSize: 11, fontWeight: 400, opacity: .7, marginLeft: 6 }}>3:4</small></span><MediaField previewRatio="3 / 4" value={selected.image} onChange={(image) => update({ image })} onUpload={onUpload} media={media} /><small>Tövsiyə: 900 × 1200 px. Şəkil həm kartda, həm məqalədə bu önbaxışdakı kimi 3:4 çərçivədə, dartılmadan mərkəzdən kəsilərək göstərilir.</small></div>
        <footer className="collection-form-actions"><button className="collection-delete" type="button" onClick={remove}><Trash2 /> Yazını sil</button><label className="collection-publish"><input type="checkbox" checked={selected.published} onChange={(e) => update({ published: e.target.checked })} /><span>{selected.published ? "Dərc olunur" : "Qaralama"}</span></label><button className="primary-action" type="button" disabled={busy} onClick={save}>{busy ? "Saxlanılır..." : "Dəyişiklikləri saxla"}</button></footer>
      </> : <div className="collection-form-empty"><h2>Yeni yazı əlavə edin</h2><button className="primary-action" type="button" onClick={add}><Plus /> Yeni yazı</button><button className="secondary-action" type="button" disabled={busy} onClick={save}>Boş siyahını saxla</button></div>}</div>
    </div>
  </section>;
}
