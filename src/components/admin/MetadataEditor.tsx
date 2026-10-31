"use client";
import { Search, Share2, Settings2, FileText, RefreshCw, Save, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { emptySeo, type PageSeo, type SeoPage } from "@/lib/page-seo";
import { SITE_URL } from "@/lib/seo";
import MediaField, { type MediaLibraryItem } from "./MediaField";

type Data = { pages: SeoPage[]; overrides: Record<string, PageSeo>; version: string | null };
export default function MetadataEditor({ media, onUpload }: { media: MediaLibraryItem[]; onUpload: (file: File) => Promise<string | null> }) {
  const [data, setData] = useState<Data | null>(null);
  const [selected, setSelected] = useState("");
  const [draft, setDraft] = useState<PageSeo>(emptySeo);
  const [group, setGroup] = useState("search");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const page = data?.pages.find(item => item.path === selected);
  async function load() {
    if (dirty && !window.confirm("Saxlanmamış dəyişikliklər ləğv olunsun?")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/metadata", { cache: "no-store" });
      const next = await response.json(); if (!response.ok) throw new Error(next.error);
      setData(next); const path = next.pages.some((item: SeoPage) => item.path === selected) ? selected : next.pages[0]?.path ?? "";
      setSelected(path); setDraft({ ...emptySeo, ...next.pages.find((item: SeoPage) => item.path === path)?.defaults, ...next.overrides[path] }); setDirty(false); setResetConfirm(false); setNotice("");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Yüklənmədi."); }
    finally { setBusy(false); }
  }
  // Load the protected catalog once; refresh is explicit to preserve unsaved edits.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(key: keyof PageSeo, value: string) { setDraft(current => ({ ...current, [key]: value })); setDirty(true); }
  async function save(reset = false) {
    if (!data || !page) return;
    setResetConfirm(false);
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/metadata", { method: reset ? "DELETE" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: selected, version: data.version, metadata: draft }) });
      const next = await response.json(); if (!response.ok) throw new Error(next.error);
      setData({ ...data, ...next }); setDraft({ ...emptySeo, ...page.defaults, ...next.overrides[selected] }); setDirty(false);
      setNotice(reset ? "Standart metadata bərpa edildi." : "Metadata saxlanıldı.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Saxlanmadı."); }
    finally { setBusy(false); }
  }
  const fields: [keyof PageSeo, string, string][] = [
    ["title", "SEO başlığı", page?.defaults?.title ?? page?.title ?? ""], ["description", "Qısa açıqlama", page?.defaults?.description ?? page?.description ?? ""],
    ["keywords", "Açar sözlər (keywords)", "rəsm kursları, sənət, Artmonia"], ["canonical", "Əsas URL (canonical)", `${SITE_URL}${selected}`],
    ["shareTitle", "Paylaşım başlığı", draft.title || page?.defaults?.title || page?.title || ""], ["shareDescription", "Paylaşım açıqlaması", draft.description || page?.defaults?.description || page?.description || ""]
  ];
  return <section className="admin-view-section metadata-workspace">
    <div className="admin-page-title"><div><span className="metadata-eyebrow">SƏHİFƏ AYARLARI</span><h1>Metadata</h1><p>Səhifənizin axtarışda və paylaşımda necə göründüyünü idarə edin.</p></div><button className="secondary-action" disabled={busy} onClick={() => void load()}><RefreshCw size={16} /> Yenilə</button></div>
    {notice && <p role="status" className="metadata-notice">{notice}</p>}
    {!data ? <p>{busy ? "Səhifələr yüklənir..." : "Siyahını yeniləyərək təkrar cəhd edin."}</p> : <div className="metadata-layout">
      <aside className="metadata-pages"><div className="metadata-list-heading"><FileText size={20} /><strong>Səhifələr</strong><span>{data.pages.length}</span></div><label className="admin-field"><span>Səhifə axtar</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Başlıq və ya ünvan" /></label>
        <div className="metadata-page-list">{data.pages.filter(item => `${item.title} ${item.path}`.toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az"))).map(item => <button type="button" disabled={busy} className={selected === item.path ? "active" : ""} key={item.path} onClick={() => {
          if (dirty && !window.confirm("Saxlanmamış dəyişikliklər ləğv olunsun?")) return;
          setSelected(item.path); setDraft({ ...emptySeo, ...item.defaults, ...data.overrides[item.path] }); setDirty(false); setResetConfirm(false); setNotice("");
        }}><strong>{item.title}</strong><small>{item.path}</small><small className={`metadata-badge ${data.overrides[item.path] ? "custom" : ""}`}>{data.overrides[item.path] ? "Fərdi" : "Standart"}</small></button>)}</div>
      </aside>
      {page && <form onSubmit={event => { event.preventDefault(); void save(); }} className="metadata-form"><header className="metadata-form-heading"><div><span className="metadata-eyebrow">SEÇİLMİŞ SƏHİFƏ</span><h2>{page.title}</h2></div><a href={selected} target="_blank" rel="noreferrer" aria-label="Səhifəyə bax"><ExternalLink size={18} /></a></header>
        <div className="metadata-tabs" role="tablist" aria-label="Metadata sahələri">{[{id:"search",label:"Axtarış",icon:Search},{id:"share",label:"Paylaşım",icon:Share2},{id:"settings",label:"Əlavə ayarlar",icon:Settings2}].map(tab => <button key={tab.id} type="button" role="tab" aria-selected={group === tab.id} onClick={() => setGroup(tab.id)}><tab.icon size={17} />{tab.label}</button>)}</div>
        <p className="metadata-hint">Boş saxlanan sahələrdə səhifənin standart məlumatları işləyir.</p>
        <fieldset disabled={busy}>
          {fields.filter(([key]) => group === "search" ? ["title", "description", "keywords"].includes(key) : group === "share" ? key.startsWith("share") : key === "canonical").map(([key, label, placeholder]) => <label className="admin-field" key={key}><span>{label}</span>{key.toLowerCase().includes("description") ? <textarea value={draft[key]} placeholder={placeholder} maxLength={1000} rows={3} onChange={event => change(key, event.target.value)} /> : <input value={draft[key]} placeholder={placeholder} maxLength={key === "canonical" ? 2048 : 1000} onChange={event => change(key, event.target.value)} />}
            {key === "keywords" ? <small>Vergüllə ayırın. Google meta keywords teqini sıralama üçün istifadə etmir.</small> : key === "title" || key === "description" ? <small>{draft[key].length} simvol · {key === "title" ? "Təxminən 50–60" : "Təxminən 140–160"} simvol tövsiyə olunur; məcburi hədd deyil.</small> : null}</label>)}
          {group === "share" && <div className="admin-field"><span>Paylaşım şəkli</span><MediaField value={draft.image} onChange={value => change("image", value)} onUpload={onUpload} media={media} accept="image" previewRatio="1.91 / 1" /><small>1200 × 630 px tövsiyə olunur. Boş saxlasanız səhifənin standart şəkli işləyəcək.</small></div>}
          {group === "settings" && <label className="admin-field"><span>Axtarış sistemlərində görünmə</span><select value={draft.indexing} onChange={event => change("indexing", event.target.value)}><option value="default">Standart davranış</option><option value="index">İndeksləməyə icazə ver</option><option value="noindex">İndeksləmə (noindex)</option></select></label>}
          <div className="metadata-preview"><small><Search size={14} /> AXTARIŞ ÖNİZLƏMƏSİ</small><p>{draft.canonical || `${SITE_URL}${selected}`}</p><h3>{draft.title || page.defaults?.title || page.title}</h3><p>{draft.description || page.defaults?.description || page.description}</p><small>Görünüş nümunədir; Google mətni dəyişə bilər.</small></div>
          <div className="metadata-actions"><button className="primary-action" type="submit"><Save size={16} />{busy ? "Saxlanılır..." : "Dəyişiklikləri saxla"}</button><button className="secondary-action" type="button" onClick={() => setResetConfirm(true)}>Standarta qaytar</button></div>
          {resetConfirm && <div role="alert" className="metadata-notice"><p>Bu səhifənin xüsusi metadata-sı silinsin və standart məlumatlar tətbiq edilsin?</p><div className="metadata-actions"><button type="button" className="primary-action" onClick={() => void save(true)}>Bəli, bərpa et</button><button type="button" className="secondary-action" onClick={() => setResetConfirm(false)}>Ləğv et</button></div></div>}
        </fieldset>
      </form>}
    </div>}
  </section>;
}
