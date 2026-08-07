"use client";

/* Media previews may point to Supabase Storage or existing site assets. */
/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Award,
  Check,
  ChevronRight,
  CircleUserRound,
  Eye,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Medal,
  Menu,
  Newspaper,
  Pencil,
  Search,
  Settings,
  Trash2,
  UploadCloud,
  X
} from "lucide-react";
import CollectionEditor from "./CollectionEditor";
import NewsEditor from "./NewsEditor";
import JsonEditor from "./JsonEditor";
import { createClient } from "@/lib/supabase/client";
import { defaultSections, type JsonValue, type SiteSectionRecord } from "@/lib/admin-content";
import { logout } from "@/app/admin/actions";

export type AdminMessage = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  interest: string | null;
  level: string | null;
  goal: string | null;
  status: "new" | "contacted" | "archived";
  created_at: string;
};

export type MediaAsset = {
  id: string;
  name: string;
  path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string;
  is_public: boolean;
  created_at: string;
};

type View = "dashboard" | "homepage" | "news" | "results" | "awards" | "media" | "messages" | "settings";

const nav = [
  { id: "dashboard" as const, label: "Ana panel", icon: LayoutDashboard },
  { id: "homepage" as const, label: "Sayt məzmunu", icon: Home },
  { id: "news" as const, label: "Yeniliklər", icon: Newspaper },
  { id: "results" as const, label: "Nəticələr", icon: Medal },
  { id: "awards" as const, label: "Mükafatlar", icon: Award },
  { id: "media" as const, label: "Media", icon: ImageIcon },
  { id: "messages" as const, label: "Mesajlar", icon: Mail }
];

const categoryLabels: Record<SiteSectionRecord["category"], string> = {
  website: "Sayt",
  academy: "Akademiya",
  content: "Kontent",
  settings: "Ayarlar"
};

function dateLabel(value?: string) {
  if (!value) return "İlkin kontent";
  return new Intl.DateTimeFormat("az-AZ", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function countCollection(section: SiteSectionRecord | undefined) {
  return Array.isArray(section?.content) ? section.content.length : 0;
}

export default function AdminDashboard({
  initialSections,
  initialMessages,
  initialMedia,
  configured,
  adminName
}: {
  initialSections: SiteSectionRecord[];
  initialMessages: AdminMessage[];
  initialMedia: MediaAsset[];
  configured: boolean;
  adminName: string;
}) {
  const [view, setView] = useState<View>("dashboard");
  const [sections, setSections] = useState(initialSections);
  const [messages, setMessages] = useState(initialMessages);
  const [media, setMedia] = useState(initialMedia);
  const [editing, setEditing] = useState<SiteSectionRecord | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaAsset | null>(null);
  const [profileName, setProfileName] = useState(adminName);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const unread = messages.filter((message) => message.status === "new").length;
  const homepageSections = useMemo(() => sections.filter((section) => !["news_items", "awards"].includes(section.key)), [sections]);
  const resultSections = useMemo(() => sections.filter((section) => ["collections_page_copy", "success_stories"].includes(section.key)), [sections]);
  const filteredSections = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("az");
    if (!query) return homepageSections;
    return homepageSections.filter((section) => `${section.label} ${section.description}`.toLocaleLowerCase("az").includes(query));
  }, [homepageSections, search]);

  function getSection(key: "news_items" | "awards") {
    return sections.find((section) => section.key === key)
      ?? defaultSections.find((section) => section.key === key)!;
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  async function saveSection(section: SiteSectionRecord) {
    setBusy(true);
    try {
      let saved: SiteSectionRecord = { ...section, updated_at: new Date().toISOString() };
      if (configured) {
        const supabase = createClient();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Oturum tapılmadı.");

        const payload = {
          key: section.key,
          label: section.label,
          description: section.description,
          category: section.category,
          content: section.content,
          is_published: section.is_published,
          sort_order: section.sort_order,
          updated_by: userData.user.id
        };

        if (section.id) {
          const { data, error } = await supabase.from("site_sections").update(payload).eq("id", section.id).select().single();
          if (error) throw error;
          saved = data as SiteSectionRecord;
        } else {
          const { data, error } = await supabase.from("site_sections").insert({ ...payload, created_by: userData.user.id }).select().single();
          if (error) throw error;
          saved = data as SiteSectionRecord;
        }
      }

      setSections((current) => current.some((item) => item.key === saved.key)
        ? current.map((item) => item.key === saved.key ? saved : item)
        : [...current, saved]);
      setEditing(null);
      flash(configured ? "Dəyişikliklər saytda yayımlandı." : "Demo dəyişikliyi bu sessiyada saxlanıldı.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Yadda saxlamaq mümkün olmadı.");
    } finally {
      setBusy(false);
    }
  }

  async function removeSection(section: SiteSectionRecord) {
    if (!window.confirm(`“${section.label}” bölməsi silinsin?`)) return;
    setBusy(true);
    try {
      if (configured && section.id) {
        const { error } = await createClient().from("site_sections").delete().eq("id", section.id);
        if (error) throw error;
      }
      setSections((current) => current.filter((item) => item.key !== section.key));
      flash("Bölmə silindi.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Silmək mümkün olmadı.");
    } finally {
      setBusy(false);
    }
  }

  async function updateMessage(message: AdminMessage, status: AdminMessage["status"]) {
    if (configured) {
      const { error } = await createClient().from("contact_submissions").update({ status }).eq("id", message.id);
      if (error) return flash(error.message);
    }
    setMessages((current) => current.map((item) => item.id === message.id ? { ...item, status } : item));
    flash("Mesaj statusu yeniləndi.");
  }

  async function removeMessage(message: AdminMessage) {
    if (!window.confirm(`“${message.full_name}” müraciəti silinsin?`)) return;
    setBusy(true);
    try {
      if (configured) {
        const { error } = await createClient().from("contact_submissions").delete().eq("id", message.id);
        if (error) throw error;
      }
      setMessages((current) => current.filter((item) => item.id !== message.id));
      flash("Müraciət silindi.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Müraciəti silmək mümkün olmadı.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadMedia(file: File): Promise<string | null> {
    if (!configured) {
      flash("Media yükləmə hazır deyil.");
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      flash("Fayl ölçüsü 10 MB-dan böyük ola bilməz.");
      return null;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Oturum tapılmadı.");
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, { cacheControl: "3600" });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("site-media").getPublicUrl(path);
      const { data, error } = await supabase.from("media_assets").insert({
        name: file.name,
        path,
        public_url: urlData.publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: userData.user.id
      }).select().single();
      if (error) {
        await supabase.storage.from("site-media").remove([path]);
        throw error;
      }
      setMedia((current) => [data as MediaAsset, ...current]);
      flash("Şəkil yükləndi və media kitabxanasına əlavə edildi.");
      return urlData.publicUrl;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Yükləmə uğursuz oldu.");
      return null;
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeMedia(asset: MediaAsset) {
    if (!window.confirm(`“${asset.name}” faylı silinsin?`)) return;
    setBusy(true);
    try {
      if (configured) {
        const supabase = createClient();
        const { error: storageError } = await supabase.storage.from("site-media").remove([asset.path]);
        if (storageError) throw storageError;
        const { error } = await supabase.from("media_assets").delete().eq("id", asset.id);
        if (error) throw error;
      }
      setMedia((current) => current.filter((item) => item.id !== asset.id));
      flash("Media faylı silindi.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Media faylını silmək mümkün olmadı.");
    } finally {
      setBusy(false);
    }
  }

  async function saveMedia(asset: MediaAsset) {
    setBusy(true);
    try {
      let saved = asset;
      if (configured) {
        const { data, error } = await createClient().from("media_assets").update({
          name: asset.name.trim(),
          alt_text: asset.alt_text.trim(),
          is_public: asset.is_public
        }).eq("id", asset.id).select().single();
        if (error) throw error;
        saved = data as MediaAsset;
      }
      setMedia((current) => current.map((item) => item.id === saved.id ? saved : item));
      setEditingMedia(null);
      flash("Media məlumatları yeniləndi.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Media məlumatlarını saxlamaq mümkün olmadı.");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile() {
    if (!profileName.trim()) return;
    setBusy(true);
    try {
      if (configured) {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!data.user) throw new Error("Oturum tapılmadı.");
        const { error } = await supabase.from("admin_users").update({ display_name: profileName.trim() }).eq("user_id", data.user.id);
        if (error) throw error;
      }
      flash("Admin adı yeniləndi.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Admin adını saxlamaq mümkün olmadı.");
    } finally {
      setBusy(false);
    }
  }

  function selectView(next: View) {
    setView(next);
    setSidebarOpen(false);
  }

  const dashboardLinks: Array<{ view: View; icon: typeof Home; title: string; text: string; count?: string }> = [
    { view: "homepage", icon: Home, title: "Sayt məzmunu", text: "Başlıqlar, kurslar, müəllimlər, qiymətlər və əlaqə məlumatları", count: `${homepageSections.length} bölmə` },
    { view: "news", icon: Newspaper, title: "Yeniliklər", text: "Ana səhifə lentində və yeniliklər səhifəsində görünən xəbərləri idarə edin", count: `${countCollection(getSection("news_items"))} xəbər` },
    { view: "results", icon: Medal, title: "Nəticələr", text: "Nəticə səhifəsinin mətnlərini və uğur hekayələrini idarə edin", count: `${countCollection(sections.find((section) => section.key === "success_stories"))} hekayə` },
    { view: "awards", icon: Award, title: "Mükafatlar", text: "Akademiyanın mükafat və nailiyyətlərini idarə edin", count: `${countCollection(getSection("awards"))} mükafat` },
    { view: "media", icon: ImageIcon, title: "Media", text: "Kompüterdən şəkil və video yükləyin", count: `${media.length} fayl` },
    { view: "messages", icon: Mail, title: "Mesajlar", text: "Saytdan gələn müraciətləri izləyin", count: unread ? `${unread} yeni` : "Yeni mesaj yoxdur" }
  ];

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <img src="/assets/artmonia-logo.webp" alt="Artmonia" />
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Menyunu bağla"><X /></button>
        </div>
        <nav>
          {nav.map((item) => (
            <button key={item.id} type="button" className={view === item.id ? "active" : ""} onClick={() => selectView(item.id)}>
              <item.icon /><span>{item.label}</span>
              {item.id === "messages" && unread ? <b>{unread}</b> : null}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <button type="button" className={view === "settings" ? "active" : ""} onClick={() => selectView("settings")}><Settings /> Parametrlər</button>
          <Link href="/" target="_blank"><Eye /> Sayta bax</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-menu-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Menyunu aç"><Menu /></button>
          <div className="admin-location"><strong>{nav.find((item) => item.id === view)?.label ?? "Parametrlər"}</strong><span>Sayt idarəetməsi</span></div>
          <Link className="admin-view-site" href="/" target="_blank"><Eye /> Sayta bax</Link>
          <div className="admin-profile"><CircleUserRound /><span><strong>{profileName}</strong><small>Administrator</small></span></div>
        </header>

        <main className="admin-content">
          {view === "dashboard" ? (
            <section className="dashboard-hub">
              <div className="admin-page-title"><div><h1>Nəyi dəyişmək istəyirsiniz?</h1><p>Saytda görünən səhifəni seçin. Hər məlumat öz yerindədir.</p></div></div>
              <div className="dashboard-hub-list">
                {dashboardLinks.map((item) => <button key={item.view} type="button" onClick={() => selectView(item.view)}>
                  <span className="dashboard-hub-icon"><item.icon /></span>
                  <span className="dashboard-hub-copy"><strong>{item.title}</strong><small>{item.text}</small></span>
                  <em>{item.count}</em><ChevronRight />
                </button>)}
              </div>
            </section>
          ) : null}

          {view === "homepage" ? (
            <section className="admin-view-section">
              <div className="admin-page-title"><div><h1>Sayt məzmunu</h1><p>Texniki kod axtarmağa ehtiyac yoxdur — dəyişmək istədiyiniz hissəni seçin.</p></div></div>
              <div className="content-toolbar"><div><Search /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Məsələn: kurslar, müəllimlər..." /></div><span>{filteredSections.length} bölmə</span></div>
              <div className="content-table">
                <div className="content-table-head"><span>Bölmə</span><span>Kateqoriya</span><span>Status</span><span>Son dəyişiklik</span><span /></div>
                {filteredSections.map((section) => <article key={section.key}>
                  <div className="content-name"><span className={`recent-icon ${section.category}`}><Home /></span><p><strong>{section.label}</strong><small>{section.description}</small></p></div>
                  <span>{categoryLabels[section.category]}</span>
                  <span className={`status-label ${section.is_published ? "published" : "draft"}`}><i />{section.is_published ? "Dərc olunub" : "Qaralama"}</span>
                  <time>{dateLabel(section.updated_at)}</time>
                  <div className="row-actions"><button onClick={() => setEditing(section)} title="Redaktə et"><Pencil /></button><button onClick={() => removeSection(section)} title="Sil"><Trash2 /></button></div>
                </article>)}
              </div>
            </section>
          ) : null}

          {view === "news" ? <NewsEditor key={`news-${getSection("news_items").updated_at ?? "default"}`} section={getSection("news_items")} busy={busy} onSave={saveSection} onUpload={uploadMedia} media={media} /> : null}
          {view === "results" ? (
            <section className="admin-view-section">
              <div className="admin-page-title"><div><h1>Nəticələr</h1><p>Ekranda görünən nəticə mətnlərini və uğur hekayələrini dəyişin.</p></div></div>
              <div className="content-table">
                <div className="content-table-head"><span>Bölmə</span><span>Kateqoriya</span><span>Status</span><span>Son dəyişiklik</span><span /></div>
                {resultSections.map((section) => <article key={section.key}>
                  <div className="content-name"><span className={`recent-icon ${section.category}`}><Medal /></span><p><strong>{section.label}</strong><small>{section.description}</small></p></div>
                  <span>{categoryLabels[section.category]}</span>
                  <span className={`status-label ${section.is_published ? "published" : "draft"}`}><i />{section.is_published ? "Dərc olunub" : "Qaralama"}</span>
                  <time>{dateLabel(section.updated_at)}</time>
                  <div className="row-actions"><button onClick={() => setEditing(section)} title="Redaktə et"><Pencil /></button></div>
                </article>)}
              </div>
            </section>
          ) : null}
          {view === "awards" ? <CollectionEditor key={`awards-${getSection("awards").updated_at ?? "default"}`} kind="awards" section={getSection("awards")} busy={busy} onSave={saveSection} onUpload={uploadMedia} media={media} /> : null}

          {view === "media" ? (
            <section className="admin-view-section">
              <div className="admin-page-title"><div><h1>Media</h1><p>Şəkil və videoları birbaşa kompüterinizdən yükləyin.</p></div></div>
              <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadMedia(file); }} />
              <button className="media-upload-zone" type="button" disabled={busy} onClick={() => fileRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.files[0]; if (file) void uploadMedia(file); }}>
                <UploadCloud /><span><strong>{busy ? "Fayl yüklənir..." : "Kompüterdən fayl yüklə"}</strong><small>Faylı buraya sürükləyin və ya seçmək üçün klikləyin · maksimum 10 MB</small></span>
              </button>
              {!media.length ? <div className="admin-empty"><ImageIcon /><h3>Media kitabxanası boşdur</h3><p>İlk şəkli yuxarıdakı sahədən yükləyə bilərsiniz.</p></div> : <div className="media-grid">{media.map((asset) => <article key={asset.id}>{asset.mime_type?.startsWith("video") ? <video src={asset.public_url} muted /> : <img src={asset.public_url} alt={asset.alt_text || asset.name} />}<div><strong>{asset.name}</strong><small>{asset.alt_text || (asset.size_bytes ? `${(asset.size_bytes / 1024 / 1024).toFixed(1)} MB` : "Açıqlama əlavə edilməyib")}</small></div><div className="media-card-actions"><button type="button" onClick={() => setEditingMedia(asset)} title="Məlumatları dəyiş"><Pencil /></button><button className="media-delete" type="button" onClick={() => removeMedia(asset)} title="Faylı sil"><Trash2 /></button></div></article>)}</div>}
            </section>
          ) : null}

          {view === "messages" ? (
            <section className="admin-view-section">
              <div className="admin-page-title"><div><h1>Mesajlar</h1><p>Qeydiyyat formasından gələn müraciətləri izləyin.</p></div></div>
              {!messages.length ? <div className="admin-empty"><Mail /><h3>Hələ mesaj yoxdur</h3><p>Yeni müraciətlər burada görünəcək.</p></div> : <div className="messages-list">{messages.map((message) => <article key={message.id} className={message.status === "new" ? "unread" : ""}><div className="message-avatar">{message.full_name.charAt(0).toUpperCase()}</div><div className="message-copy"><div><strong>{message.full_name}</strong><time>{dateLabel(message.created_at)}</time></div><p>{message.goal || `${message.interest ?? "Kurs"} · ${message.level ?? "Səviyyə qeyd edilməyib"}`}</p><span>{message.phone}{message.email ? ` · ${message.email}` : ""}</span></div><div className="message-actions"><select value={message.status} onChange={(event) => updateMessage(message, event.target.value as AdminMessage["status"])}><option value="new">Yeni</option><option value="contacted">Əlaqə saxlanıb</option><option value="archived">Arxiv</option></select><button type="button" onClick={() => removeMessage(message)} title="Müraciəti sil"><Trash2 /></button></div></article>)}</div>}
            </section>
          ) : null}

          {view === "settings" ? (
            <section className="admin-view-section settings-view">
              <div className="admin-page-title"><div><h1>Parametrlər</h1><p>Admin hesabınızda görünən məlumatı idarə edin.</p></div></div>
              <div className="settings-grid"><article><span className="settings-number">ADMIN</span><h3>Profil məlumatı</h3><p>Bu ad panelin yuxarı hissəsində görünür.</p><label className="admin-field"><span>Görünən ad</span><input value={profileName} onChange={(event) => setProfileName(event.target.value)} /></label><button className="primary-action" type="button" disabled={busy || !profileName.trim()} onClick={() => void saveProfile()}>{busy ? "Saxlanılır..." : "Adı yadda saxla"}</button></article></div>
              {configured ? <form action={logout}><button className="logout-button" type="submit"><LogOut /> Çıxış et</button></form> : null}
            </section>
          ) : null}
        </main>
        <footer className="admin-footer"><span>© 2026 Artmonia Academy</span></footer>
      </div>

      {editing ? (
        <div className="editor-overlay" role="dialog" aria-modal="true" aria-label={`${editing.label} redaktəsi`}>
          <div className="editor-drawer">
            <header><div><span>Sayt məzmunu redaktoru</span><h2>{editing.label}</h2></div><button type="button" onClick={() => setEditing(null)} aria-label="Bağla"><X /></button></header>
            <div className="editor-body">
              <div className="editor-meta">
                <label><span>Ad</span><input value={editing.label} onChange={(event) => setEditing({ ...editing, label: event.target.value })} /></label>
                <label className="wide"><span>İzah</span><input value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} /></label>
                <button className={`publish-switch ${editing.is_published ? "on" : ""}`} type="button" onClick={() => setEditing({ ...editing, is_published: !editing.is_published })}><i />{editing.is_published ? "Dərc olunur" : "Qaralama"}</button>
              </div>
              <div className="editor-content-heading"><div><h3>Məzmun sahələri</h3><p>Mətnləri və siyahıları aşağıdakı sahələrdən dəyişin.</p></div></div>
              <JsonEditor value={editing.content as JsonValue} onChange={(content) => setEditing({ ...editing, content })} onUpload={uploadMedia} media={media} />
            </div>
            <footer><button type="button" className="secondary-action" onClick={() => setEditing(null)}>Ləğv et</button><button type="button" className="primary-action" disabled={busy || !editing.label} onClick={() => saveSection(editing)}>{busy ? "Saxlanılır..." : "Dəyişiklikləri saxla"}</button></footer>
          </div>
        </div>
      ) : null}
      {editingMedia ? (
        <div className="editor-overlay" role="dialog" aria-modal="true" aria-label="Media məlumatlarını dəyiş">
          <div className="media-editor-dialog">
            <header><div><span>Media kitabxanası</span><h2>Fayl məlumatları</h2></div><button type="button" onClick={() => setEditingMedia(null)} aria-label="Bağla"><X /></button></header>
            <div className="media-editor-preview">{editingMedia.mime_type?.startsWith("video/") ? <video src={editingMedia.public_url} controls /> : <img src={editingMedia.public_url} alt={editingMedia.alt_text || editingMedia.name} />}</div>
            <div className="media-editor-fields"><label className="admin-field"><span>Faylın görünən adı</span><input value={editingMedia.name} onChange={(event) => setEditingMedia({ ...editingMedia, name: event.target.value })} /></label><label className="admin-field"><span>Şəkil açıqlaması</span><textarea rows={3} value={editingMedia.alt_text} onChange={(event) => setEditingMedia({ ...editingMedia, alt_text: event.target.value })} /><small>Saytın əlçatanlığı və axtarış sistemləri üçün şəkli qısa təsvir edin.</small></label></div>
            <footer><button type="button" className="secondary-action" onClick={() => setEditingMedia(null)}>Ləğv et</button><button type="button" className="primary-action" disabled={busy || !editingMedia.name.trim()} onClick={() => void saveMedia(editingMedia)}>{busy ? "Saxlanılır..." : "Yadda saxla"}</button></footer>
          </div>
        </div>
      ) : null}
      {notice ? <div className="admin-toast"><Check />{notice}</div> : null}
    </div>
  );
}
