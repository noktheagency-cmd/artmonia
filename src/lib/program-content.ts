import { courses } from "@/data/site";
import { certificateDefaults } from "./certificates";

export function programDetailDefaults(course: { text: string; details: string; image: string }) {
  return {
    backLabel: "Proqramlara qayıt",
    cta: "Müraciət et",
    image: course.image,
    audienceLabel: "Artmonia Academy",
    audienceTitle: "Kimlər üçündür?",
    audience: [
      { text: "Rəsmə sistemli və sıfırdan başlamaq istəyənlər", image: "" },
      { text: "Qabiliyyət imtahanına hazırlaşanlar", image: "" },
      { text: "Portfolyosunu inkişaf etdirmək istəyənlər", image: "" },
      { text: "Öz yaradıcı üslubunu formalaşdıranlar", image: "" }
    ],
    learningLabel: "Proqramın məzmunu",
    learningTitle: "Hansı biliklərə hakim olacaqsan?",
    certificateImage: "/assets/artmonia-certificate-sample.png",
    certificate: { ...certificateDefaults },
    resultCategory: "",
    studentResults: [] as { name: string; image: string; result: string }[],
    syllabus: [{ title: "Proqram haqqında", text: course.details || course.text, image: "" }],
    enrollLabel: "Sənin növbəti addımın",
    enrollTitle: "Başlamağa hazırsan?",
    enrollText: course.text,
    enrollImage: "",
    enrollCta: "Konsultasiya üçün yazıl",
    durationLabel: "Müddət",
    priceLabel: "Qiymət",
    priceFallback: "Əlaqə saxlayın"
  };
}

export type Program = (typeof courses)[number] & { detail: ReturnType<typeof programDetailDefaults> };

// Defaults fill missing fields only; intentional blank strings and empty lists survive.
export function withProgramDetail(course: (typeof courses)[number] & { detail?: Partial<Program["detail"]> }): Program {
  return { ...course, detail: { ...programDetailDefaults(course), ...course.detail } };
}

export function matchingProgramResults(title: string, category: string, entries: unknown) {
  if (!Array.isArray(entries)) return [];
  const normalize = (value: string) => value.trim().toLocaleLowerCase("az");
  const selected = normalize(category);
  const program = normalize(title);
  return entries.filter((entry) => {
    if (!entry || entry.published === false || typeof entry.image !== "string" || !entry.image.trim()) return false;
    const label = typeof entry.resultCategory === "string" ? normalize(entry.resultCategory) : "";
    return Boolean(label && (selected ? label === selected : program === label || program.startsWith(`${label} `)));
  }).map((entry) => ({ name: entry.title || "Tələbə nəticəsi", image: entry.image, result: entry.subtitle || "" }));
}
