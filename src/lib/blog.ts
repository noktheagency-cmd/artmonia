export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
  imageAlt: string;
  body: string;
  published: boolean;
};

export function parseBlog(value: unknown): BlogPost[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string") return [];
    const text = (key: string) => typeof entry[key] === "string" ? entry[key] : "";
    return [{ id: entry.id, title: text("title"), excerpt: text("excerpt"), category: text("category"), date: text("date"), author: text("author"), image: text("image"), imageAlt: text("imageAlt"), body: text("body"), published: entry.published === true }];
  });
}

export function publishedBlog(value: unknown) {
  return parseBlog(value).filter((post) => post.published && post.title.trim() && post.body.trim())
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const blogPosts: BlogPost[] = [
  { id: "portrete-ilk-addim", title: "Portretə ilk addım", category: "Rəsm", excerpt: "İnsan üzünü çəkmək təkcə texnika deyil, həm də müşahidə sənətidir.", image: "/assets/article-portrait-technique.webp", body: "Portretə detallardan deyil, ümumi formadan başlamaq faydalıdır. Başın meylini, enini və hündürlüyünü yüngül xətlərlə müəyyən edin. Göz, burun və ağız arasındakı münasibətləri müqayisə edin.\n\nİlk eskizdə xətti tündləşdirməyə tələsməyin. Güzgüdə və ya kağızı bir qədər uzaqlaşdıraraq işə baxmaq nisbət fərqlərini görməyə kömək edir. Məqsəd hər xətti bir dəfəyə düzgün çəkmək deyil, baxmağı və düzəliş etməyi öyrənməkdir." },
  { id: "rengleri-anlamaq", title: "Rəngləri anlamaq", category: "Rəng", excerpt: "Rənglər duyğuları ifadə etməyin güclü bir yoludur, onları tanıyaq.", image: "/assets/module-color.webp", body: "Kiçik palitra ilə işləmək rəng münasibətlərini daha aydın görməyə imkan verir. Bir rəngin açıq və tünd variantlarını hazırlayın, sonra onları yanaşı yerləşdirərək aralarındakı fərqi müşahidə edin.\n\nİsti və soyuq tonları eyni kompozisiyada sınaqdan keçirin. Qarışdırdığınız rəngləri eskiz dəftərində qeyd edin. Belə kiçik təcrübələr gələcək işlər üçün şəxsi rəng yaddaşınızı formalaşdırır." },
  { id: "yaradiciliq-ucun-mekan", title: "Yaradıcılıq üçün məkan", category: "İlham", excerpt: "Rahat və düşünülmüş iş yeri diqqəti yaradıcılığa yönəldir.", image: "/assets/studio-room.webp", body: "Yaradıcılıq üçün böyük studiya mütləq deyil. Sabit iş səthi, rahat oturacaq və yaxşı işıq başlanğıc üçün kifayətdir. Kağızın üzərinə əlinizin kölgəsi düşməyəcək işıq istiqaməti seçin.\n\nƏn çox istifadə etdiyiniz materialları yaxınlıqda saxlayın. İşə başlamaq üçün az hazırlıq tələb edən bir məkan gündəlik məşqi asanlaşdırır. Hər məşqdən sonra masanı növbəti eskiz üçün hazır qoyun." },
  { id: "eskiz-verdisi", title: "Eskiz vərdişi", category: "Təcrübə", excerpt: "Gündəlik kiçik işlər müşahidə bacarığınızı inkişaf etdirir.", image: "/assets/studio-brushes.webp", body: "Hər gün qısa bir eskiz üçün vaxt ayırın. Fincan, bitki və ya əliniz kimi sadə bir mövzu seçin. Əvvəlcə silueti, sonra əsas işıq və kölgə sahələrini qeyd edin.\n\nEskiz dəftəri bitmiş əsərlər albomu olmaq məcburiyyətində deyil. Burada axtarışlar, düzəlişlər və yarımçıq fikirlər də yer ala bilər. Köhnə səhifələrə vaxtaşırı qayıtmaq dəyişən müşahidə tərzinizi görməyə kömək edir." }
].map((post) => ({ ...post, date: "2026-09-22", author: "", imageAlt: post.title, published: true }));
