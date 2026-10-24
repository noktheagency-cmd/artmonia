"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { certificateFor, certificateDetail, programSlug, validateCertificate, type Certificate } from "@/lib/certificates";
import { withProgramDetail, type Program } from "@/lib/program-content";
import type { SiteSectionRecord } from "@/lib/admin-content";
import MediaField, { type MediaLibraryItem } from "./MediaField";

const labels: Record<string, string> = {
  eyebrow: "Üst etiket", title: "Başlıq", highlightedTitle: "Vurğulanan başlıq",
  description: "Açıqlama", buttonLabel: "Böyütmə düyməsinin mətni", caption: "Şəklin alt yazısı", imageAlt: "Şəklin təsviri (alt mətn)"
};

export default function CertificatesEditor({ section, configured, media, onUpload, onSaved }: {
  section: SiteSectionRecord; configured: boolean; media: MediaLibraryItem[];
  onUpload: (file: File) => Promise<string | null>; onSaved: (section: SiteSectionRecord) => void;
}) {
  const programs = Array.isArray(section.content) ? section.content as Program[] : [];
  const [selected, setSelected] = useState(0);
  const [value, setValue] = useState<Certificate | null>(() => programs[0] ? certificateFor(withProgramDetail(programs[0]).detail) : null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  function update(patch: Partial<Certificate>) { setValue((old) => old ? { ...old, ...patch } : null); setDirty(true); setMessage(""); }
  function select(index: number) {
    if (dirty && !window.confirm("Saxlanmamış dəyişikliklərdən imtina edilsin?")) return;
    setSelected(index); setValue(certificateFor(withProgramDetail(programs[index]).detail)); setDirty(false); setMessage("");
  }
  async function save() {
    if (!value || !programs[selected]) return;
    const error = validateCertificate(value);
    if (error) { setMessage(error); return; }
    setBusy(true); setMessage("");
    try {
      let saved: SiteSectionRecord;
      if (configured) {
        const response = await fetch("/api/certificates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ program: programSlug(programs[selected].title), version: section.updated_at ?? null, certificate: value }) });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Saxlama alınmadı.");
        saved = body.section;
      } else {
        saved = { ...section, content: programs.map((p, i) => i === selected ? { ...p, detail: { ...p.detail, ...certificateDetail(value) } } : p) };
      }
      onSaved(saved); setDirty(false);
      setMessage(configured ? "Sertifikat saxlanıldı. Yalnız seçilmiş proqram dəyişdi." : "Demo önbaxışı yeniləndi. Bazaya yazılmadı.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Saxlama alınmadı."); }
    finally { setBusy(false); }
  }
  return <section className="collection-editor-view">
    <div className="admin-page-title"><div><h1>Sertifikatlar</h1><p>Hər proqramın sertifikatını ayrıca idarə edin. Yeni proqramı “Sayt məzmunu → Proqramlar” bölməsində əlavə edin.</p></div></div>
    {!configured && <p role="status">Demo rejimi: dəyişikliklər yalnız bu admin sessiyasında qalır.</p>}
    <div className="collection-workspace">
      <aside className="collection-list-pane"><header><h2>Proqramlar</h2><span>{programs.length}</span></header><div className="collection-item-list">{programs.map((p, index) => <button type="button" key={programSlug(p.title)} className={index === selected ? "selected" : ""} disabled={busy} onClick={() => select(index)}><Award /><span><strong>{p.title}</strong><small>{certificateFor(withProgramDetail(p).detail).enabled && certificateFor(withProgramDetail(p).detail).image ? "Sertifikat aktivdir" : "Gizlidir"}</small></span></button>)}</div></aside>
      <div className="collection-form-pane">{value && programs[selected] ? <>
        <header className="collection-form-header"><h2>{programs[selected].title}</h2></header>
        <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
          <div className="collection-form-fields">{Object.entries(labels).map(([key, label]) => <label className={`admin-field ${key === "description" || key === "imageAlt" ? "wide" : ""}`} key={key}><span>{label}</span>{key === "description" ? <textarea rows={4} maxLength={2000} value={value.description} onChange={(e) => update({ description: e.target.value })} /> : <input maxLength={200} value={value[key as keyof Certificate] as string} onChange={(e) => update({ [key]: e.target.value })} />}</label>)}</div>
          <div className="collection-upload-field"><span>Sertifikat şəkli</span><MediaField value={value.image} onChange={(image) => update({ image, enabled: image ? value.enabled : false })} onUpload={onUpload} media={media} previewRatio="original" /><small>Şəkil kəsilmir və dartılmır. Şəkli silmək yalnız bu proqramın sertifikatını gizlədir; kitabxanadakı faylı silmir.</small></div>
          <footer className="collection-form-actions"><label className="collection-publish"><input type="checkbox" checked={value.enabled} onChange={(e) => update({ enabled: e.target.checked })} /><span>Saytda göstər</span></label><button type="button" className="primary-action" disabled={busy || !dirty} onClick={() => void save()}>{busy ? "Saxlanılır..." : "Sertifikatı saxla"}</button></footer>
        </fieldset>
        {message && <p role="status" style={{ padding: "0 24px 20px" }}>{message}</p>}
      </> : <div className="collection-form-empty">Əvvəlcə proqram əlavə edin.</div>}</div>
    </div>
  </section>;
}
