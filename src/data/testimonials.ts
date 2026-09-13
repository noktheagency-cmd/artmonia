export const TESTIMONIAL_NAME_LIMIT = 60;
export const TESTIMONIAL_TEXT_LIMIT = 300;
export const TESTIMONIAL_LIMIT = 30;
export type Testimonial = { id: string; name: string; anonymous: boolean; text: string };
// Clearly labelled design samples, not statements from real students.
export const testimonials: Testimonial[] = [
  "Dərslərin addım-addım qurulması yeni başlayan biri üçün rahat ola bilər. Hər məşğələdə kiçik bir mövzu üzərində işləmək öyrənmə prosesini daha aydın edir.",
  "Rəsm çəkərkən səhvin harada olduğunu anlamaq vacibdir. Müəllimin konkret nümunə ilə izah etməsi növbəti cəhddə nəyə diqqət yetirməli olduğunu göstərir.",
  "Sakit və işıqlı studiya yaradıcı işə köklənmək üçün gözəl mühitdir. Materialların əlçatan olması da məşqə başlamağı asanlaşdırır.",
  "Qara qələmlə sadə formalardan başlayıb tədricən daha mürəkkəb mövzulara keçmək mənə uyğun öyrənmə yanaşmasıdır.",
  "Rəngləri bir-biri ilə uyğunlaşdırmağı öyrənmək maraqlı prosesdir. Eyni mövzunu müxtəlif palitralarla sınamaq yeni fikirlər yarada bilər.",
  "Məşqlər üçün aydın planın olması faydalıdır. Nəyi təkrar etməli olduğunu biləndə evdə ayrılan vaxtı daha məqsədli istifadə etmək mümkündür.",
  "Portret çəkilişində proporsiyaya ayrıca vaxt ayrılması yaxşı yanaşmadır. Kiçik detallardan əvvəl ümumi formanı görmək vacibdir.",
  "Yaradıcılıq üçün həftədə müəyyən vaxt ayırmaq gündəlik ritmə xoş dəyişiklik gətirə bilər. Rəsm dərsi buna yaxşı fürsətdir.",
  "İşlərə birlikdə baxıb fərqli yanaşmaları müzakirə etmək maraqlıdır. Eyni tapşırığın müxtəlif həllərini görmək baxış bucağını genişləndirir.",
  "İlk eskizlə sonrakı işləri müqayisə etmək inkişafı izləmək üçün yaxşı üsuldur. Kiçik addımları görmək məşqə davam etməyə həvəs yaradır."
].map((text, index) => ({
  id: `sample-review-${index + 1}`,
  name: "",
  anonymous: true,
  text: `Nümunə rəy — ${text}`
}));
