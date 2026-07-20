export type CollectionEntry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  date: string;
};

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
