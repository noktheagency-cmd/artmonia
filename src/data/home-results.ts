import type { CollectionEntry } from "./collections";

// Demo seed is used only until an administrator saves this section.
export const homeResults: CollectionEntry[] = [
  ["Aylin Məmmədova", "Qabiliyyət imtahanında 10 bal topladı."],
  ["Murad Əliyev", "Rəssamlıq ixtisasına qəbul oldu."],
  ["Nərmin Həsənova", "Dizayn ixtisasına qəbul oldu."],
  ["Tunar Qasımov", "Qabiliyyət imtahanında 9 bal topladı."],
  ["Leyla Rzayeva", "Arzuladığı sənət ixtisasını qazandı."],
  ["Ömər İsmayılov", "Memarlıq ixtisasına qəbul oldu."],
  ["Dəniz Səfərova", "Qabiliyyət imtahanında 10 bal topladı."],
  ["Əli Hüseynov", "Qrafik dizayn ixtisasını qazandı."],
  ["İnci Vəliyeva", "Rəngkarlıq ixtisasına qəbul oldu."],
  ["Kənan Abbasov", "Qabiliyyət imtahanında 9 bal topladı."],
].map(([title, subtitle], index) => ({ id: `home-result-demo-${index + 1}`, title, subtitle, image: "", description: "", date: "", demoPortrait: index }));
