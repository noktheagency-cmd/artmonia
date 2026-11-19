"use client";
import { Search, Share2, Settings2, FileText, RefreshCw, Save, ExternalLink, ChevronDown, CheckCircle2 } from "lucide-react";
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
  const [category, setCategory] = useState("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const page = data?.pages.find(item => item.path === selected);
  async function load() {
    if (dirty && !window.confirm("Saxlanmamış dəyişikliklər ləğv olunsun?")) return;
    setNoticeError(false); setBusy(true);
    try {
      const response = await fetch("/api/admin/metadata", { cache: "no-store" });
      const next = await response.json(); if (!response.ok) throw new Error(next.error);
      setData(next); const path = next.pages.some((item: SeoPage) => item.path === selected) ? selected : next.pages[0]?.path ?? "";
      setSelected(path); setDraft({ ...emptySeo, ...next.pages.find((item: SeoPage) => item.path === path)?.defaults, ...next.overrides[path] }); setDirty(false); setResetConfirm(false); setNotice("");
    } catch (error) { setNoticeError(true); setNotice(error instanceof Error ? error.message : "Yüklənmədi."); }
    finally { setBusy(false); }
  }
  // Load the protected catalog once; refresh is explicit to preserve unsaved edits.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(key: keyof PageSeo, value: string) {
    const next = { ...draft, [key]: value };
    const baseline = { ...emptySeo, ...page?.defaults, ...data?.overrides[selected] };
    setDraft(next);
    setDirty(Object.keys(emptySeo).some(field => next[field as keyof PageSeo] !== baseline[field as keyof PageSeo]));
    setNotice(""); setResetConfirm(false);
  }
  async function save(reset = false) {
    if (!data || !page) return;
    setResetConfirm(false);
    setNoticeError(false); setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/metadata", { method: reset ? "DELETE" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: selected, version: data.version, metadata: draft }) });
      const next = await response.json(); if (!response.ok) throw new Error(next.error);
      setData({ ...data, ...next }); setDraft({ ...emptySeo, ...page.defaults, ...next.overrides[selected] }); setDirty(false);
      setNotice(reset ? "Standart metadata bərpa edildi." : "Metadata saxlanıldı.");
    } catch (error) { setNoticeError(true); setNotice(error instanceof Error ? error.message : "Saxlanmadı."); }
    finally { setBusy(false); }
  }
  const fields: [keyof PageSeo, string, string][] = [
    ["title", "SEO başlığı", page?.defaults?.title ?? page?.title ?? ""], ["description", "Qısa açıqlama", page?.defaults?.description ?? page?.description ?? ""],
    ["keywords", "Açar sözlər (keywords)", "rəsm kursları, sənət, Artmonia"], ["canonical", "Səhifənin əsas ünvanı (canonical)", `${SITE_URL}${selected}`],
    ["shareTitle", "Paylaşım başlığı", draft.title || page?.defaults?.title || page?.title || ""], ["shareDescription", "Paylaşım açıqlaması", draft.description || page?.defaults?.description || page?.description || ""]
  ];
  const categories = [{id:"all",label:"Hamısı"},{id:"main",label:"Əsas səhifələr"},{id:"programlar",label:"Proqramlar"},{id:"yenilikler",label:"Yeniliklər"},{id:"blog",label:"Blog"}];
  const categoryOf = (path: string) => ["programlar", "yenilikler", "blog"].find(prefix => path.startsWith(`/${prefix}/`)) || "main";
  const shortTitle = (title: string) => title.split(" | ")[0];
  const filtered = data?.pages.filter(item => (category === "all" || categoryOf(item.path) === category) && `${item.title} ${item.path}`.toLocaleLowerCase("az").includes(query.toLocaleLowerCase("az"))) ?? [];
  const previewTitle = draft.title || page?.defaults?.title || page?.title || "";
  const previewDescription = draft.description || page?.defaults?.description || page?.description || "";
  const previewImage = draft.image || page?.defaults?.image || page?.image;
  return <section className="admin-view-section metadata-workspace">
    <div className="admin-page-title"><div><span className="metadata-eyebrow">SAYTIN GÖRÜNÜRLÜYÜ</span><h1>SEO və paylaşım</h1><p>Hər səhifə üçün aydın başlıq, düzgün açıqlama və paylaşım görünüşü.</p></div><button className="secondary-action" disabled={busy} onClick={() => void load()}><RefreshCw size={16} /> Yenilə</button></div>
    {notice && <p role={noticeError ? "alert" : "status"} className={`metadata-notice ${noticeError ? "is-error" : "is-success"}`}>{notice}</p>}
    {!data ? <div className="metadata-loading" role="status">{busy ? "Səhifələr yüklənir…" : "Siyahını yeniləyərək təkrar cəhd edin."}</div> : <div className="metadata-layout">
      <aside className="metadata-pages">
        <button type="button" className="metadata-picker-toggle" aria-expanded={pickerOpen} aria-controls="metadata-picker" onClick={() => setPickerOpen(!pickerOpen)}><FileText size={19}/><span><small>SƏHİFƏ SEÇİMİ</small><strong>{shortTitle(page?.title || "Səhifə seçin")}</strong></span><ChevronDown size={18}/></button>
        <div id="metadata-picker" className={`metadata-picker-content ${pickerOpen ? "is-open" : ""}`}>
          <div className="metadata-list-heading"><FileText size={19}/><strong>Səhifələr</strong><span>{data.pages.length}</span></div>
          <label className="admin-field"><span>Səhifə axtar</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ad və ya ünvan yazın" /></label>
          <div className="metadata-filters" aria-label="Səhifə növü">{categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
          <p className="metadata-list-count">{filtered.length} səhifə</p>
          <div className="metadata-page-list">{filtered.map(item => <button type="button" disabled={busy} aria-current={selected === item.path ? "page" : undefined} className={selected === item.path ? "active" : ""} key={item.path} onClick={() => {
            if (dirty && !window.confirm("Saxlanmamış dəyişikliklər ləğv olunsun?")) return;
            setSelected(item.path); setDraft({ ...emptySeo, ...item.defaults, ...data.overrides[item.path] }); setDirty(false); setResetConfirm(false); setNotice(""); setPickerOpen(false);
          }}><strong>{shortTitle(item.title)}</strong><small title={item.path}>{item.path}</small><small className={`metadata-badge ${data.overrides[item.path] ? "custom" : ""}`}>{data.overrides[item.path] ? "Əl ilə düzəldilib" : "Avtomatik məlumat"}</small></button>)}{!filtered.length && <p className="metadata-empty">Uyğun səhifə tapılmadı. Axtarışı və ya filtri dəyişin.</p>}</div>
        </div>
      </aside>
      {page && <form onSubmit={event => { event.preventDefault(); void save(); }} className="metadata-form" data-group={group}>
        <header className="metadata-form-heading"><div><span className="metadata-eyebrow">REDAKTƏ EDİLƏN SƏHİFƏ</span><h2>{shortTitle(page.title)}</h2><p className="metadata-path">{selected}</p></div><a href={selected} target="_blank" rel="noreferrer" aria-label="Səhifəyə bax" title="Səhifəyə bax"><ExternalLink size={18}/></a></header>
        <div className="metadata-tabs" aria-label="Metadata sahələri">{[{id:"search",label:"Axtarış",icon:Search},{id:"share",label:"Paylaşım",icon:Share2},{id:"settings",label:"Texniki ayarlar",icon:Settings2}].map(tab => <button key={tab.id} type="button" aria-pressed={group === tab.id} onClick={() => setGroup(tab.id)}><tab.icon size={17}/>{tab.label}</button>)}</div>
        <p className="metadata-hint">{data.overrides[selected] ? "Bu səhifənin məlumatları əl ilə düzəldilib." : "Məlumatlar səhifənin məzmunundan avtomatik götürülür."} Boş saxladığınız sahələr avtomatik məlumatdan istifadə edəcək.</p>
        <fieldset disabled={busy}>
          {fields.filter(([key]) => group === "search" ? ["title", "description", "keywords"].includes(key) : group === "share" ? key.startsWith("share") : key === "canonical").map(([key, label, placeholder]) => <label className="admin-field" key={key}><span>{label}</span>{key.toLowerCase().includes("description") ? <textarea value={draft[key]} placeholder={placeholder} maxLength={1000} rows={3} onChange={event => change(key, event.target.value)}/> : <input value={draft[key]} placeholder={placeholder} maxLength={key === "canonical" ? 2048 : 1000} onChange={event => change(key, event.target.value)}/>}
            {key === "keywords" ? <small>Vergüllə ayırın. Məsələn: rəsm kursu, portret. Google bu sahəni sıralama üçün istifadə etmir.</small> : key === "canonical" ? <small>Eyni məzmun bir neçə ünvanda varsa, əsas sayılacaq linki yazın. Məsələn: {SITE_URL}{selected}. Əmin deyilsinizsə, dəyişməyin.</small> : <small className="metadata-counter"><b>{draft[key].length} simvol</b><span>{key.toLowerCase().includes("description") ? "140–160" : "50–60"} simvol tövsiyə olunur, məcburi hədd deyil.</span></small>}</label>)}
          {group === "share" && <div className="admin-field"><span>Paylaşım şəkli</span><MediaField value={draft.image} onChange={value => change("image", value)} onUpload={onUpload} media={media} accept="image" previewRatio="1.91 / 1"/><small>1200 × 630 px tövsiyə olunur. Link paylaşılarkən görünəcək şəkildir.</small></div>}
          {group === "settings" && <label className="admin-field"><span>Google və digər axtarışlarda görünsün?</span><select value={draft.indexing} onChange={event => change("indexing", event.target.value)}><option value="default">Saytın avtomatik ayarını istifadə et</option><option value="index">Bəli, axtarışda görünməyə icazə ver</option><option value="noindex">Xeyr, axtarış nəticələrində göstərmə</option></select><small>“Xeyr” seçimi səhifəni saytdan silmir. Linki olanlar yenə aça bilər; axtarış sistemlərindən onu nəticələrə daxil etməmək istənilir.</small></label>}
          {group !== "settings" && <div className={`metadata-preview ${group === "share" ? "metadata-social" : ""}`}><small>{group === "share" ? <Share2 size={15}/> : <Search size={15}/>} {group === "share" ? "PAYLAŞIM ÖNİZLƏMƏSİ" : "AXTARIŞ ÖNİZLƏMƏSİ"}</small>{group === "share" && (previewImage ? <img src={previewImage} alt="Paylaşım kartının önizləməsi"/> : <div className="metadata-image-empty">Paylaşım şəkli seçilməyib</div>)}<p className="metadata-preview-url">{draft.canonical || `${SITE_URL}${selected}`}</p><h3>{group === "share" ? draft.shareTitle || previewTitle : previewTitle}</h3><p>{group === "share" ? draft.shareDescription || previewDescription : previewDescription}</p><small>Görünüş nümunədir; {group === "share" ? "platformaya görə fərqlənə bilər." : "Google mətni dəyişə bilər."}</small></div>}
        </fieldset>
        {resetConfirm && <div role="alert" className="metadata-notice"><p>Yalnız bu səhifənin əl ilə daxil edilmiş SEO ayarları silinəcək. Səhifənin məzmunu dəyişməyəcək.</p><div className="metadata-actions"><button disabled={busy} type="button" className="primary-action" onClick={() => void save(true)}>Bəli, avtomatik məlumatı bərpa et</button><button type="button" className="secondary-action" onClick={() => setResetConfirm(false)}>Ləğv et</button></div></div>}
        <footer className="metadata-savebar"><span role="status" className={dirty ? "is-dirty" : ""}><CheckCircle2 size={16}/>{dirty ? "Saxlanmamış dəyişiklik var" : "Bütün dəyişikliklər saxlanılıb"}</span><div className="metadata-actions"><button disabled={busy || (!data.overrides[selected] && !dirty)} className="secondary-action" type="button" onClick={() => setResetConfirm(true)}>Avtomatikə qaytar</button><button disabled={busy || !dirty} className="primary-action" type="submit"><Save size={16}/>{busy ? "Gözləyin…" : "Saxla"}</button></div></footer>
      </form>}
    </div>}
  </section>;
}
