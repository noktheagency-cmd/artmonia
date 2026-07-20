"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { JsonValue } from "@/lib/admin-content";

function blankLike(value: JsonValue): JsonValue {
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankLike(child)]));
  }
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  return "";
}

export default function JsonEditor({
  value,
  onChange,
  path = "content"
}: {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  path?: string;
}) {
  if (Array.isArray(value)) {
    return (
      <div className="json-array">
        {value.map((item, index) => (
          <div className="json-array-item" key={`${path}-${index}`}>
            <div className="json-array-toolbar">
              <span>{index + 1}</span>
              <div>
                <button type="button" title="Yuxarı" disabled={index === 0} onClick={() => {
                  const next = [...value];
                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                  onChange(next);
                }}><ChevronUp /></button>
                <button type="button" title="Aşağı" disabled={index === value.length - 1} onClick={() => {
                  const next = [...value];
                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                  onChange(next);
                }}><ChevronDown /></button>
                <button type="button" title="Sil" onClick={() => onChange(value.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></button>
              </div>
            </div>
            <JsonEditor
              value={item}
              path={`${path}.${index}`}
              onChange={(nextItem) => onChange(value.map((current, itemIndex) => itemIndex === index ? nextItem : current))}
            />
          </div>
        ))}
        <button className="json-add" type="button" onClick={() => onChange([...value, blankLike(value.at(-1) ?? "")])}>
          <Plus /> Yeni element əlavə et
        </button>
      </div>
    );
  }

  if (value && typeof value === "object") {
    return (
      <div className="json-object">
        {Object.entries(value).map(([key, child]) => (
          <label className="json-field" key={`${path}-${key}`}>
            <span>{key.replaceAll("_", " ")}</span>
            <JsonEditor
              value={child}
              path={`${path}.${key}`}
              onChange={(nextChild) => onChange({ ...value, [key]: nextChild })}
            />
          </label>
        ))}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return <button className={`json-toggle ${value ? "on" : ""}`} type="button" onClick={() => onChange(!value)}><i />{value ? "Aktiv" : "Deaktiv"}</button>;
  }

  if (typeof value === "number") {
    return <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />;
  }

  const text = value == null ? "" : String(value);
  return text.length > 90 ? (
    <textarea value={text} onChange={(event) => onChange(event.target.value)} rows={4} />
  ) : (
    <input value={text} onChange={(event) => onChange(event.target.value)} />
  );
}

