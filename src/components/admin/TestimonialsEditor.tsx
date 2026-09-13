"use client";

import { TESTIMONIAL_LIMIT, TESTIMONIAL_NAME_LIMIT, TESTIMONIAL_TEXT_LIMIT, type Testimonial } from "@/data/testimonials";
import type { JsonValue } from "@/lib/admin-content";

export default function TestimonialsEditor({ value, onChange }: { value: JsonValue; onChange: (value: JsonValue) => void }) {
  const items = (Array.isArray(value) ? value : []) as Testimonial[];
  const update = (index: number, patch: Partial<Testimonial>) => onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  const move = (index: number, direction: number) => {
    const next = [...items];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  };
  return <div className="json-array">
    <p>FAQ-dan sonra sonsuz hərəkətli lent. Desktopda 4 kart. Maksimum {TESTIMONIAL_LIMIT} rəy; ad {TESTIMONIAL_NAME_LIMIT}, rəy {TESTIMONIAL_TEXT_LIMIT} simvol. Boş rəylər yayımlanmır. Anonim seçildikdə ad sayta göndərilmir.</p>
    {items.map((item, index) => <div className="json-array-item" key={item.id}>
      <div className="json-array-toolbar"><strong>Rəy {index + 1}</strong><div>
        <button type="button" disabled={!index} onClick={() => move(index, -1)}>Yuxarı</button>
        <button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)}>Aşağı</button>
        <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))}>Sil</button>
      </div></div>
      <button type="button" className={`json-toggle ${item.anonymous ? "on" : ""}`} aria-pressed={item.anonymous} onClick={() => update(index, { anonymous: !item.anonymous, ...(!item.anonymous ? { name: "" } : {}) })}><i />{item.anonymous ? "Anonim: aktiv" : "Anonim: deaktiv"}</button>
      {!item.anonymous && <label className="admin-field"><span>Ad və soyad ({item.name.length}/{TESTIMONIAL_NAME_LIMIT})</span><input maxLength={TESTIMONIAL_NAME_LIMIT} value={item.name} onChange={(event) => update(index, { name: event.target.value })} /></label>}
      <label className="admin-field"><span>Tələbənin rəyi ({item.text.length}/{TESTIMONIAL_TEXT_LIMIT})</span><textarea rows={6} maxLength={TESTIMONIAL_TEXT_LIMIT} value={item.text} onChange={(event) => update(index, { text: event.target.value })} /></label>
      <small>Görünən ad: {item.anonymous || !item.name.trim() ? "Anonim" : item.name}</small>
      {item.text.length > TESTIMONIAL_TEXT_LIMIT && <p role="alert">Bu rəy əvvəlki limitlə yazılıb. Saytda ilk {TESTIMONIAL_TEXT_LIMIT} simvol görünür. Mətni qısaldın; mövcud rəy avtomatik silinmir.</p>}
    </div>)}
    <button className="json-add" type="button" disabled={items.length >= TESTIMONIAL_LIMIT} onClick={() => onChange([...items, { id: crypto.randomUUID(), name: "", anonymous: false, text: "" }])}>Yeni rəy əlavə et</button>
  </div>;
}
