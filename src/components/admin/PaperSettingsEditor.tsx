"use client";

import type { JsonValue } from "@/lib/admin-content";
import { heroPaperSettings, type HeroPaperComponent, type HeroPaperSettings } from "@/data/site";

type Props = {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
};

const ids: HeroPaperComponent["id"][] = ["left", "center", "right"];

function normalize(value: JsonValue): HeroPaperSettings {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Partial<HeroPaperSettings>
    : heroPaperSettings;
  const sourceComponents = Array.isArray(source.components) ? source.components : [];

  return {
    ovalRadius: typeof source.ovalRadius === "number" ? source.ovalRadius : heroPaperSettings.ovalRadius,
    components: ids.map((id) => {
      const fallback = heroPaperSettings.components.find((component) => component.id === id)!;
      const current = sourceComponents.find((component) => component?.id === id);
      return {
        id,
        label: typeof current?.label === "string" ? current.label : fallback.label,
        color: typeof current?.color === "string" ? current.color : fallback.color
      };
    })
  };
}

export default function PaperSettingsEditor({ value, onChange }: Props) {
  const settings = normalize(value);

  const updateComponent = (id: HeroPaperComponent["id"], patch: Partial<HeroPaperComponent>) => {
    onChange({
      ...settings,
      components: settings.components.map((component) => component.id === id ? { ...component, ...patch } : component)
    });
  };

  return (
    <div className="paper-settings-editor">
      <div
        className="paper-settings-preview"
        style={{
          "--admin-paper-left": settings.components[0].color,
          "--admin-paper-center": settings.components[1].color,
          "--admin-paper-right": settings.components[2].color,
          "--admin-paper-radius": `${settings.ovalRadius}px`
        } as React.CSSProperties}
      >
        <span />
        <span />
        <span />
      </div>
      <div className="paper-settings-fields">
        {settings.components.map((component) => (
          <label key={component.id}>
            <span>{component.label}</span>
            <input
              type="color"
              value={component.color}
              onChange={(event) => updateComponent(component.id, { color: event.target.value })}
            />
          </label>
        ))}
        <label className="wide">
          <span>Oval radius: {settings.ovalRadius}px</span>
          <input
            type="range"
            min={8}
            max={58}
            value={settings.ovalRadius}
            onChange={(event) => onChange({ ...settings, ovalRadius: Number(event.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}
