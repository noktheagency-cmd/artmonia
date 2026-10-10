export const moniDefaults = {
  enabled: true,
  welcome: "Haradan başlayacağını birlikdə tapaq?",
  startLabel: "Mənim yolumu tap",
  consultationLabel: "Ödənişsiz konsultasiyaya müraciət et",
  successMessage: "Müraciətin komandamıza çatdı. Sənə uyğun başlanğıcı birlikdə dəqiqləşdirəcəyik.",
  goalQuestion: "Rəsmlə nə etmək istəyirsən?",
  levelQuestion: "Hazırda hansı səviyyədəsən?",
  noteQuestion: "Sənin üçün başqa nə vacibdir?",
};

export const moniGoals = ["Özüm üçün öyrənmək", "Bacarığımı artırmaq", "Portfolio hazırlamaq"] as const;
export const moniLevels = ["İlk dəfə başlayıram", "Artıq rəsm çəkirəm"] as const;
export type MoniProfile = { goal: string; level: string; note: string };
export type MoniCourse = { id: string; title: string; text: string; details: string; duration: string; price: string; image: string; href: string };
export type MoniPlan = {
  reason: string;
  steps: string[];
  course: MoniCourse;
  proof: { image: string; name: string; result: string } | null;
  token: string;
};
