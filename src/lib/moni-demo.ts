export type MoniGoal = "create" | "grow" | "portfolio";
export type MoniLevel = "beginner" | "practicing";
export type MoniFocus = "drawing" | "painting" | "portrait" | "digital" | "composition";
export type MoniProgramKind = MoniFocus | "portfolio";

export type MoniSelection = {
  goal: MoniGoal | null;
  level: MoniLevel | null;
  focus: MoniFocus | null;
};

export type MoniProgram = {
  title: string;
  duration: string;
  price: string;
  text: string;
  image: string;
};

export const emptyMoniSelection: MoniSelection = { goal: null, level: null, focus: null };

export const moniGoals: { id: MoniGoal; label: string }[] = [
  { id: "create", label: "Özüm üçün öyrənmək" },
  { id: "grow", label: "Bacarığımı artırmaq" },
  { id: "portfolio", label: "Portfolio hazırlamaq" }
];

export const moniLevels: { id: MoniLevel; label: string }[] = [
  { id: "beginner", label: "İlk dəfə başlayıram" },
  { id: "practicing", label: "Artıq rəsm çəkirəm" }
];

export const moniFocuses: { id: MoniFocus; label: string }[] = [
  { id: "drawing", label: "Akademik rəsm" },
  { id: "painting", label: "Rəng və boyama" },
  { id: "portrait", label: "Portret" },
  { id: "digital", label: "Rəqəmsal sənət" },
  { id: "composition", label: "Kompozisiya" }
];

const learningPaths: Record<MoniProgramKind, { title: string; detail: string }[]> = {
  drawing: [
    { title: "İlk xətlər", detail: "Forma və proporsiyanı müşahidə et." },
    { title: "İşıq və kölgə", detail: "Çəkdiyin formaya həcm ver." },
    { title: "İlk tamamlanmış işin", detail: "Öyrəndiklərini bir rəsmdə birləşdir." }
  ],
  painting: [
    { title: "Palitranı kəşf et", detail: "Rənglər arasındakı əlaqəni gör." },
    { title: "Rəngləri birləşdir", detail: "Ton və boya texnikaları ilə məşq et." },
    { title: "İlk rəngli işin", detail: "Öz kompozisiyanı rəngə çevir." }
  ],
  portrait: [
    { title: "Proporsiyadan başla", detail: "Üzün quruluşunu müşahidə et." },
    { title: "İfadəni tap", detail: "İşıq və xarakter üzərində işlə." },
    { title: "Portretini tamamla", detail: "Detalları bütöv bir işdə birləşdir." }
  ],
  digital: [
    { title: "Alətlərlə tanış ol", detail: "Rəqəmsal rəsm mühitini kəşf et." },
    { title: "Eskizdən rəngə", detail: "Laylar, rəng və işıqla məşq et." },
    { title: "İlk rəqəmsal işin", detail: "Öz illüstrasiyanı tamamla." }
  ],
  composition: [
    { title: "Baxışı yönləndir", detail: "İşinin əsas diqqət nöqtəsini seç." },
    { title: "Tarazlığı tap", detail: "Forma, ritm və məkanı birləşdir." },
    { title: "Kompozisiyanı qur", detail: "Fikrini bütöv bir işə çevir." }
  ],
  portfolio: [
    { title: "İşlərini seç", detail: "Məqsədinə uyğun işləri topla." },
    { title: "Boşluqları tamamla", detail: "Mentorla növbəti işlərini planla." },
    { title: "Portfolionu təqdim et", detail: "İşlərinin ardıcıllığını və təqdimatını qur." }
  ]
};

const programMatchers: Record<MoniProgramKind, RegExp> = {
  drawing: /akademik|qara qələm|qara qelem/i,
  painting: /rəng|reng|boyama|rəngkarlıq/i,
  portrait: /portret|portre|fiqur/i,
  digital: /rəqəmsal|reqemsal|digital/i,
  composition: /kompozisiya/i,
  portfolio: /portfolio|portfolyo/i
};

// Only published catalog fields reach the assistant. It never invents prices or availability.
export function toMoniCatalog(value: unknown): MoniProgram[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || typeof item.title !== "string" || !item.title.trim()) return [];
    const field = (key: string) => typeof item[key] === "string" ? item[key].trim() : "";
    return [{ title: field("title"), duration: field("duration"), price: field("price"), text: field("text"), image: field("image") }];
  });
}

export function getMoniRecommendation(selection: MoniSelection, catalog: MoniProgram[]) {
  if (!selection.goal || !selection.level || (selection.goal === "grow" && !selection.focus)) return null;
  const kind: MoniProgramKind = selection.goal === "portfolio" ? "portfolio"
    : selection.goal === "grow" ? selection.focus!
    : selection.level === "beginner" ? "drawing" : "painting";
  const program = catalog.find((item) => programMatchers[kind].test(item.title)) ?? null;
  const reason = selection.goal === "portfolio"
    ? "Məqsədin portfolio hazırlamaqdır. İşlərinin seçimini və növbəti addımlarını mentorla planlamaq yaxşı başlanğıc ola bilər."
    : selection.goal === "grow"
      ? "Seçdiyin istiqamətdə texnikanı inkişaf etdirmək üçün məşq və mentor rəyi ilə davam edə bilərsən."
      : selection.level === "beginner"
        ? "İlk dəfə başladığın üçün forma, proporsiya və işıq-kölgə ilə tanış olmaq yaxşı başlanğıc ola bilər."
        : "Artıq rəsm çəkirsən. Rəng və boya texnikalarını kəşf edərək yaradıcılığına yeni bir istiqamət verə bilərsən.";
  return { kind, program, reason, steps: learningPaths[kind] };
}

export function validateMoniDemoContact(name: string, phone: string): string | null {
  if (name.trim().length < 2 || name.trim().length > 60) return "Adını ən azı 2 hərflə yaz.";
  if (!/^[+\d\s()-]+$/.test(phone) || !/^\d{9,15}$/.test(phone.replace(/\D/g, ""))) {
    return "Telefon nömrəni 9–15 rəqəmlə yaz.";
  }
  return null;
}
