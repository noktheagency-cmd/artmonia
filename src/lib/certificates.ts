export const certificateDefaults = {
  enabled: true,
  eyebrow: "Proqramın sonunda",
  title: "Əməyinin qarşılığı —",
  highlightedTitle: "sertifikat.",
  description: "Proqramı uğurla tamamladıqda, öyrəndiyin bacarıqları əks etdirən Artmonia sertifikatı əldə edirsən.",
  buttonLabel: "Sertifikata yaxından bax",
  caption: "Sertifikat nümunəsi",
  imageAlt: "Artmonia tədris proqramını tamamlama sertifikatının nümunəsi"
};

export type Certificate = typeof certificateDefaults & { image: string };
export const programSlug = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

export function certificateFor(detail: { certificateImage?: string; certificate?: Partial<typeof certificateDefaults> }): Certificate {
  return { ...certificateDefaults, ...detail.certificate, image: detail.certificateImage ?? "/assets/artmonia-certificate-sample.png" };
}

export function validateCertificate(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Sertifikat məlumatları düzgün deyil.";
  const c = value as Record<string, unknown>;
  if (typeof c.enabled !== "boolean") return "Görünmə statusu düzgün deyil.";
  for (const key of ["image", "eyebrow", "title", "highlightedTitle", "description", "buttonLabel", "caption", "imageAlt"]) {
    const limit = key === "image" ? 2048 : key === "description" ? 2000 : 200;
    if (typeof c[key] !== "string" || (c[key] as string).length > limit) return `${key}: mətn boş tipdə və ya icazə verilən uzunluqda deyil.`;
  }
  const image = (c.image as string).trim();
  if (image && !/^\/(?!\/)[^\\\s]*$/.test(image)) {
    try { const url = new URL(image); if (url.protocol !== "https:" || url.username || url.password) return "Şəkil üçün HTTPS ünvanı seçin."; }
    catch { return "Şəklin ünvanı düzgün deyil."; }
  }
  if (c.enabled && (!image || !String(c.title).trim() || !String(c.description).trim() || !String(c.buttonLabel).trim() || !String(c.imageAlt).trim())) return "Aktiv sertifikat üçün şəkil, başlıq, açıqlama, düymə mətni və şəkil təsviri vacibdir.";
}

// Whitelist fields; never copy arbitrary request properties into stored content.
export function certificateDetail(value: Certificate) {
  return { certificateImage: value.image.trim(), certificate: {
    enabled: value.enabled, eyebrow: value.eyebrow.trim(), title: value.title.trim(),
    highlightedTitle: value.highlightedTitle.trim(), description: value.description.trim(),
    buttonLabel: value.buttonLabel.trim(), caption: value.caption.trim(), imageAlt: value.imageAlt.trim()
  } };
}
