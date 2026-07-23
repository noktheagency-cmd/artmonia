export type CollectionEntry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  date: string;
  category?: "cash" | "travel";
};

export type SuccessStoryEntry = {
  id: string;
  name: string;
  program: string;
  duration: string;
  poster: string;
  alt: string;
  summary: string;
  quote: string;
  note: string;
  video?: string;
};

export const successStories: SuccessStoryEntry[] = [
  {
    id: "aylin",
    name: "Aylin Məmmədli",
    program: "Akademik rəsm",
    duration: "00:42",
    poster: "/assets/about-art-system.webp",
    alt: "Molbert qarşısında portret üzərində çalışan tələbə",
    summary: "Sistemli məşq və mentor rəyi ilə başladığı hər işi sona çatdırmağı öyrəndi.",
    quote: "İlk dəfə başladığım işi yarımçıq saxlamadım. Hər həftə aldığım rəy növbəti addımı aydınlaşdırdı.",
    note: "Portret proqramı · həftəlik fərdi mentor rəyi"
  },
  {
    id: "nargiz",
    name: "Nərgiz Əliyeva",
    program: "Rəng və boyama",
    duration: "01:08",
    poster: "/assets/footer-cta-portrait.webp",
    alt: "Emalatxanada rəngli əsər üzərində çalışan tələbə",
    summary: "Rəng qorxusunu aşaraq düşünülmüş palitra və daha sərbəst üslub qazandı.",
    quote: "Rəngdən qorxurdum. İndi palitranı düşünərək qurur, hər tonu nə üçün seçdiyimi bilirəm.",
    note: "Rəng proqramı · kompozisiya və palitra işi"
  },
  {
    id: "murad",
    name: "Murad Həsənli",
    program: "Final layihə",
    duration: "00:55",
    poster: "/assets/module-final-project.webp",
    alt: "Molbertdə tamamlanmış rəngli final əsəri",
    summary: "Eskizdən təqdimata qədər bütöv yaradıcılıq prosesi quraraq ilk final işini tamamladı.",
    quote: "Eskizdən final işinə qədər hər mərhələnin öz qaydası olduğunu öyrəndim. Nəticə artıq təsadüfi deyil.",
    note: "Final layihə · konseptdən təqdimata qədər"
  }
];

export const studentResults: CollectionEntry[] = [];

export const awards: CollectionEntry[] = [];

export const collectionPageContent = {
  results: {
    sectionKey: "student_results",
    title: "Nəticələr",
    description: "Tələbələrimizin inkişafını və tamamlanmış işlərini burada paylaşırıq.",
    emptyTitle: "Nəticələr hazırlanır",
    emptyText: "Tələbə işləri əlavə edildikcə ad, vizual və qısa açıqlama ilə burada görünəcək."
  },
  awards: {
    sectionKey: "awards",
    title: "Mükafatlar",
    description: "Artmonia icmasının nailiyyətləri və mükafatları üçün ayrılmış məkan.",
    emptyTitle: "Mükafatlar tezliklə burada",
    emptyText: "Yeni nailiyyətlər əlavə olunduqca bu səhifədə görünəcək."
  }
} as const;
