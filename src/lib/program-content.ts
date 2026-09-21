import { courses } from "@/data/site";

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
