"use client";

/* Media can come from Supabase Storage or bundled site assets. */
/* eslint-disable @next/next/no-img-element */

import { useRef, useState } from "react";
import { Check, ImagePlus, Images, UploadCloud, X } from "lucide-react";

export type MediaLibraryItem = {
  id: string;
  name: string;
  public_url: string;
  mime_type: string | null;
  alt_text: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<string | null>;
  media: MediaLibraryItem[];
  accept?: "image" | "video" | "both";
  compact?: boolean;
};

export default function MediaField({
  value,
  onChange,
  onUpload,
  media,
  accept = "image",
  compact = false
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const acceptValue = accept === "image"
    ? "image/jpeg,image/png,image/webp,image/gif"
    : accept === "video"
      ? "video/mp4"
      : "image/jpeg,image/png,image/webp,image/gif,video/mp4";
  const library = media.filter((item) => accept === "both" || (accept === "video" ? item.mime_type?.startsWith("video/") : !item.mime_type?.startsWith("video/")));
  const isVideo = value.toLowerCase().includes(".mp4") || media.some((item) => item.public_url === value && item.mime_type?.startsWith("video/"));

  async function handleFile(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const url = await onUpload(file);
      if (url) onChange(url);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={`smart-media-field ${compact ? "compact" : ""}`}>
      <input ref={inputRef} hidden type="file" accept={acceptValue} onChange={(event) => void handleFile(event.target.files?.[0])} />
      {value ? (
        <div className="smart-media-preview">
          {isVideo ? <video src={value} muted controls /> : <img src={value} alt="Seçilmiş media" />}
          <button type="button" onClick={() => onChange("")} aria-label="Medianı sil"><X /></button>
        </div>
      ) : null}
      <div className="smart-media-actions">
        <button
          type="button"
          className="smart-media-upload"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); void handleFile(event.dataTransfer.files[0]); }}
        >
          {uploading ? <UploadCloud className="is-uploading" /> : <ImagePlus />}
          <span><strong>{uploading ? "Yüklənir..." : value ? "Faylı dəyiş" : "Kompüterdən yüklə"}</strong><small>{accept === "video" ? "MP4" : accept === "both" ? "Şəkil və ya MP4" : "JPG, PNG, WEBP və GIF"} · maksimum 10 MB</small></span>
        </button>
        <button type="button" className="smart-media-library-button" onClick={() => setLibraryOpen((open) => !open)}><Images /> Kitabxanadan seç</button>
      </div>
      {libraryOpen ? (
        <div className="smart-media-library">
          <header><div><strong>Media kitabxanası</strong><small>{library.length} uyğun fayl</small></div><button type="button" onClick={() => setLibraryOpen(false)} aria-label="Kitabxananı bağla"><X /></button></header>
          {library.length ? <div>{library.map((item) => (
            <button key={item.id} type="button" className={item.public_url === value ? "selected" : ""} onClick={() => { onChange(item.public_url); setLibraryOpen(false); }}>
              {item.mime_type?.startsWith("video/") ? <video src={item.public_url} muted /> : <img src={item.public_url} alt={item.alt_text || item.name} />}
              <span>{item.name}</span>{item.public_url === value ? <Check /> : null}
            </button>
          ))}</div> : <p>Əvvəlcə Media bölməsindən fayl yükləyin.</p>}
        </div>
      ) : null}
    </div>
  );
}
