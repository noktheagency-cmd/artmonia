"use client";

import { useState } from "react";
import { homePageCopy } from "@/data/site-copy";
import type { JsonValue, SiteSectionRecord } from "@/lib/admin-content";
import JsonEditor from "./JsonEditor";
import type { MediaLibraryItem } from "./MediaField";

export default function TeachersEditor({ section, busy, onSave, onUpload, media }: {
  section: SiteSectionRecord;
  busy: boolean;
  onSave: (section: SiteSectionRecord) => Promise<void>;
  onUpload: (file: File) => Promise<string | null>;
  media: MediaLibraryItem[];
}) {
  const content = section.content && typeof section.content === "object" && !Array.isArray(section.content) ? section.content : {};
  const teacherSection = content.teachers && typeof content.teachers === "object" && !Array.isArray(content.teachers) ? content.teachers : homePageCopy.teachers;
  const [people, setPeople] = useState<JsonValue>(() => {
    const source: JsonValue = content.teachers ?? homePageCopy.teachers;
    if (!source || typeof source !== "object" || Array.isArray(source) || !Array.isArray(source.people)) return homePageCopy.teachers.people;
    return source.people.map((person, index) => person && typeof person === "object" && !Array.isArray(person)
      ? { image: homePageCopy.teachers.people[index]?.image ?? "", ...person } : person);
  });
  const [error, setError] = useState("");

  return <section className="admin-view-section">
    <div className="admin-page-title"><div><h1>Müəllimlər</h1><p>Müəllim əlavə edin, şəkillərini və məlumatlarını dəyişin, sıralayın və ya silin.</p></div></div>
    <form onSubmit={(event) => {
      event.preventDefault();
      if (!Array.isArray(people) || people.some(person => !person || typeof person !== "object" || Array.isArray(person) || typeof person.name !== "string" || !person.name.trim() || typeof person.image !== "string" || !person.image.trim())) {
        setError("Hər müəllim üçün ad və şəkil əlavə edin.");
        return;
      }
      setError("");
      void onSave({ ...section, content: { ...content, teachers: { ...teacherSection, people } } });
    }}>
      <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        <JsonEditor value={people} path="home_page_copy.teachers.people" fieldKey="people" onChange={setPeople} onUpload={onUpload} media={media} />
        {error && <p role="alert">{error}</p>}
        <button className="primary-action" type="submit" style={{ marginTop: 24 }}>{busy ? "Saxlanılır..." : "Müəllimləri yadda saxla"}</button>
      </fieldset>
    </form>
  </section>;
}
