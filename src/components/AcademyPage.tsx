import Image from "next/image";
import Link from "next/link";
import styles from "./AcademyPage.module.css";

const studioDetails = [
  ["Gün işığı", "Rəng və formanı təbii işıqda müşahidə etmək üçün."],
  ["Fərdi iş sahəsi", "Hər tələbəyə rahat hərəkət və fokus imkanı."],
  ["Peşəkar materiallar", "Məşqdən yekun işə qədər lazım olan hər detal."]
];

const principles = [
  ["Sistemli yanaşma", "Hər addım əvvəlkini tamamlayır və inkişafı görünən edir."],
  ["Peşəkar rəhbərlik", "Mentor rəyi dəqiq yön, düzgün texnika və davamlı dəstək verir."],
  ["Nəticəyə yönəlik təhsil", "Praktika ölçülən irəliləyişə və şəxsi üsluba çevrilir."]
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function AcademyPage() {
  return (
    <main className={styles.page}>
      <section className={styles.interior} id="interyer" aria-labelledby="academy-title">
        <div className={styles.gridTexture} aria-hidden="true" />
        <div className={styles.interiorShell}>
          <header className={styles.titleBlock}>
            <h1 id="academy-title">Akademiya</h1>
            <span className={styles.titleStroke} aria-hidden="true" />
          </header>

          <div className={styles.interiorCopy}>
            <h2>İnteryer</h2>
            <p className={styles.sectionLead}>Sənətin nəfəs aldığı məkan.</p>
            <p className={styles.bodyCopy}>
              Sakitlik, təbii işıq və yaradıcılıq üçün düşünülmüş hər detal tələbənin diqqətini işinə yönəldir.
              Artmonia sadəcə dərs otağı deyil — ideyanın formaya çevrildiyi canlı studiyadır.
            </p>
          </div>

          <figure className={styles.roomFigure}>
            <Image
              src="/assets/studio-room.webp"
              alt="Artmonia Academy-nin gün işıqlı, molbertli studiya interyeri"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 58vw"
            />
            <figcaption>İşıq · Məkan · Fokus</figcaption>
          </figure>

          <figure className={styles.brushFigure}>
            <Image
              src="/assets/studio-brushes.webp"
              alt="Artmonia studiyasındakı rəngli peşəkar fırçalar"
              fill
              sizes="(max-width: 760px) 88vw, 32vw"
            />
          </figure>

          <div className={styles.studioDetails} aria-label="Studiyanın imkanları">
            {studioDetails.map(([title, copy]) => (
              <div key={title}>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
            ))}
          </div>

          <div className={styles.interiorNarrative}>
            <h3>Bir studiyadan daha artıq.</h3>
            <div>
              <p>
                Məkanımız dərsin tempinə uyğun qurulub: müşahidə üçün sakit zona, uzunmüddətli iş üçün rahat
                molbert məsafəsi və müəllimin hər tələbəyə yaxınlaşa bildiyi açıq plan.
              </p>
              <p>
                Divarlardakı işlər, klassik formalar və materialların daim əlçatan olması tələbəyə yalnız tapşırığı
                yerinə yetirməyi deyil, sənətin içində yaşamağı öyrədir.
              </p>
            </div>
          </div>

          <svg className={styles.gestureLine} aria-hidden="true" viewBox="0 0 320 90" preserveAspectRatio="none">
            <path d="M3 66C77 18 118 79 177 42C225 12 259 25 317 57" />
          </svg>
        </div>
      </section>

      <section className={styles.about} id="haqqimizda" aria-labelledby="about-title">
        <div className={styles.aboutShell}>
          <div className={styles.aboutCopy}>
            <h2 id="about-title">Haqqımızda</h2>
            <p className={styles.aboutLead}>Sistem. Rəhbərlik. Nəticə.</p>
            <p className={styles.aboutStatement}>
              Artmonia — istedadı sistemli inkişaf etdirən sənət akademiyasıdır.
            </p>
            <div className={styles.aboutText}>
              <p>
                Biz rəsmə yalnız texnika kimi baxmırıq. Məqsədimiz tələbənin müşahidə etmə, qərar vermə və öz
                vizual dilini qurma bacarığını mərhələli şəkildə inkişaf etdirməkdir.
              </p>
              <p>
                Proqramlarımız ilk dəfə fırça tutanlardan portfolio hazırlayanlara qədər fərqli səviyyələr üçün
                qurulur. Hər tələbə eyni nəticəni deyil, öz potensialının ən güclü versiyasını hədəfləyir.
              </p>
            </div>

            <div className={styles.principles}>
              <h3>Tədris yanaşmamız</h3>
              {principles.map(([title, copy]) => (
                <div key={title}>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              ))}
            </div>

            <Link className={styles.aboutCta} href="/muraciet">
              Müraciət et <ArrowIcon />
            </Link>
          </div>

          <figure className={styles.aboutFigure}>
            <Image
              src="/assets/about-art-system.webp"
              alt="Artmonia Academy-də klassik heykəl üzərində akademik rəsm çəkən tələbə"
              fill
              sizes="(max-width: 900px) 100vw, 62vw"
            />
          </figure>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© 2026 Artmonia Academy</span>
        <div>
          <Link href="/akademiya#interyer">İnteryer</Link>
          <Link href="/akademiya#haqqimizda">Haqqımızda</Link>
          <Link href="/">Ana səhifə</Link>
        </div>
      </footer>
    </main>
  );
}
