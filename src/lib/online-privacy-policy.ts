export const onlinePrivacyPolicy = {
  updatedAt: "2026-10-29",
  updatedLabel: "29 oktyabr 2026",
  introduction: "Bu siyasət Artmonia Academy-nin onlayn kurs mobil tətbiqində, onunla eyni hesabdan istifadə edən onlayn kurs platformasında və artmoniya.com saytında şəxsi məlumatların necə işlənməsini izah edir.",
  sections: [
    {
      id: "ehate",
      title: "1. Əhatə dairəsi və əlaqə",
      paragraphs: [
        "Onlayn tədris xidmətini Artmonia Academy təqdim edir. Məxfilik və hesab məlumatları ilə bağlı info@artmoniya.com və ya artmoniaacademy@gmail.com ünvanına müraciət edə bilərsiniz.",
        "Bu siyasətin onlayn hesab və tədris məlumatları ilə bağlı müddəaları onlayn kurs xidmətini əhatə edir. Ayrı tələbə/ERP xidmətləri və əyani tədris sənədləri həmin xidmətlərə aid məlumat emalı qaydaları ilə tənzimlənir.",
      ],
    },
    {
      id: "melumatlar",
      title: "2. Hansı məlumatları işləyirik",
      paragraphs: [
        "Hesab məlumatları: qeydiyyat və profil redaktəsi zamanı daxil etdiyiniz ad, e-poçt ünvanı, hesab identifikatoru və e-poçtun təsdiq vəziyyəti. Şifrənin yoxlanması Supabase Auth vasitəsilə aparılır; şifrəni profil məlumatı kimi açıq mətnlə saxlamırıq.",
        "Tədris məlumatları: saxladığınız kurslar, tamamlanmış dərslər, dərslərə baxış müddəti, kurslara giriş hüquqları, mövcud satınalma və abunəlik vəziyyəti. Mobil tətbiq kart nömrəsi və CVV qəbul etmir.",
        "Texniki məlumatlar: giriş sessiyaları və onların təhlükəsizlik tokenləri, sorğu vaxtı, IP ünvanı, brauzer/cihaz barədə sorğu məlumatları və xidmət təminatçılarının işləməsi üçün yaranan texniki qeydlər.",
        "Saytda müraciət göndərdikdə: verdiyiniz ad, telefon, e-poçt və tədris məqsədi, maraqlandığınız proqram, səviyyə və müraciət mətni. Dəstəyə yazdıqda mesajınız və cavab vermək üçün lazım olan əlaqə məlumatları da işlənir.",
      ],
    },
    {
      id: "meqsedler",
      title: "3. Məlumatlardan nə üçün istifadə edirik",
      paragraphs: [
        "Məlumatlar hesab yaratmaq və girişi təsdiqləmək, şifrəni bərpa etmək, kurs və videolara icazəli girişi təmin etmək, saxlanılan kursları və irəliləyişi cihazlar arasında sinxronlaşdırmaq üçün işlənir.",
        "Baxış müddəti tədris irəliləyişini və liderlər sıralamasını göstərmək üçün istifadə olunur. Müraciət məlumatları sorğunuza cavab verməyə və uyğun proqram barədə məlumat çatdırmağa xidmət edir. Texniki qeydlər xidmətin işləməsi, nasazlıqların araşdırılması və sui-istifadənin qarşısının alınması üçün işlənir.",
      ],
    },
    {
      id: "liderler",
      title: "4. Liderlər sıralamasında görünən məlumatlar",
      paragraphs: [
        "Hesaba daxil olmuş istifadəçilərə göstərilən liderlər sıralamasında ilk 50 iştirakçının adı, sırası və ümumi dərs izləmə müddəti görünə bilər. E-poçt ünvanı və ayrı-ayrı dərslərə baxış tarixçəsi bu siyahıda göstərilmir.",
        "Bu sıralama reklam izləməsi deyil; tətbiqin tədris funksiyasıdır. Onlayn hesab silindikdə həmin hesaba aid baxış qeydləri və sıralamadakı iştirak da silinir.",
      ],
    },
    {
      id: "xidmetler",
      title: "5. Xidmət təminatçıları və xarici keçidlər",
      paragraphs: [
        "Supabase hesabların autentifikasiyası, verilənlər bazası və qorunan video fayllarının saxlanması üçün istifadə olunur. Onlayn kurs layihəsinin Supabase infrastrukturu Avropa regionunda yerləşir. Hostinq və şəbəkə təminatçıları da sorğuları çatdırmaq üçün zəruri texniki məlumatları emal edə bilər.",
        "YouTube və Vimeo videolarını açdıqda həmin xidmətlər video çatdırılması üçün IP ünvanı, cihaz/brauzer məlumatları, kukilər və oynatma qarşılıqlı əlaqələri kimi məlumatları öz qaydalarına uyğun emal edə bilər. Xarici sayt, e-poçt və WhatsApp keçidləri açıldıqda müvafiq xidmətin məxfilik qaydaları tətbiq olunur.",
        "Saytdakı könüllü Moni AI tövsiyəsindən razılıq verərək istifadə etdikdə daxil etdiyiniz tədris məqsədi, səviyyə, seçim və qeydlər tövsiyənin hazırlanması üçün OpenRouter vasitəsilə konfiqurasiya edilmiş AI modelinə göndərilir. Bu sahələrə həssas şəxsi məlumat daxil etməyin.",
        "Məlumatları reklam məqsədilə satmırıq. Xidmətin göstərilməsi üçün lazım olduqda təminatçılara, qanuni tələb olduqda səlahiyyətli qurumlara zəruri məlumat təqdim edilə bilər. Bəzi təminatçıların infrastrukturu yaşadığınız ölkədən kənarda ola bilər.",
      ],
    },
    {
      id: "cihaz",
      title: "6. Cihaz yaddaşı, kukilər və analitika",
      paragraphs: [
        "Mobil tətbiq giriş sessiyasını cihazın tətbiq yaddaşında saxlayır. Qonaq kimi saxlanılan kurslar həmin cihazda qalır; hesabla saxlanılan kurslar serverdə hesabınıza bağlanır. Tətbiqin məlumatlarını təmizləmək lokal seçimləri silə bilər, lakin serverdəki hesabı silmir.",
        "Onlayn kursların web versiyası giriş sessiyası üçün brauzer yaddaşından istifadə edir. artmoniya.com saytı görünüş seçiminizi lokal yaddaş və kuki ilə yadda saxlayır və ziyarət statistikasını Google Analytics vasitəsilə ölçür. Brauzer ayarlarında kukiləri və sayt yaddaşını idarə edə bilərsiniz.",
        "Mobil tətbiqin özünə ayrıca reklam və Google Analytics SDK-sı qoşulmayıb. Bununla belə, tətbiqdən açılan saytların və daxilində oynadılan xarici videoların öz analitika və kuki mexanizmləri ola bilər.",
      ],
    },
    {
      id: "saxlanma",
      title: "7. Saxlanma müddəti",
      paragraphs: [
        "Hesab, saxlanılan kurslar, tədris irəliləyişi, baxış və kurslara giriş qeydləri hesabınız istifadə olunduğu müddətdə xidmətin göstərilməsi üçün saxlanılır. Hesabın silinməsi təsdiqləndikdə onlayn kurs sisteminin aktiv bazasından bu hesaba bağlı qeydlər silinir.",
        "Ayrıca göndərilmiş dəstək və sayt müraciətləri onların cavablandırılması və əlaqəli məsələnin həlli üçün lazım olan müddətdə saxlanıla bilər. Qanunla saxlanmalı maliyyə sənədləri və hüquqi tələbə aid qeydlər yalnız həmin məqsəd üçün zəruri həcmdə qoruna bilər.",
        "Texniki jurnallar və ehtiyat nüsxələr xidmət təminatçılarının saxlama və rotasiya qaydalarına tabedir. Aktiv bazadan silinmə bütün ehtiyat nüsxələrdən eyni anda silinmə demək deyil; belə nüsxələr adi tətbiq istifadəsi üçün təqdim edilmir. Öz məlumatlarınıza aid saxlanma barədə əlaqə ünvanlarımızdan məlumat istəyə bilərsiniz.",
      ],
    },
    {
      id: "hesabin-silinmesi",
      title: "8. Hesabın silinməsi",
      paragraphs: [
        "Mobil tətbiqdə Profil → Hesabı sil bölməsini açın, göstərilən nəticələri oxuyun, cari şifrənizi daxil edin və «Hesabı birdəfəlik sil» düyməsi ilə təsdiqləyin. Təsdiqədək «Ləğv et» seçimi ilə əməliyyatı dayandıra bilərsiniz.",
        "Server cari hesabı və şifrəni yoxlayır, giriş sessiyalarını ləğv edir və onlayn hesabı silir. Profil, saxlanılan kurslar, dərs irəliləyişi, baxış müddəti, satınalma və abunəlik üzrə onlayn giriş qeydləri birlikdə silinir. Mobil tətbiqdəki lokal hesab məlumatları və giriş sessiyası da təmizlənir.",
        "Mobil tətbiq və onlayn kurs saytı eyni hesabdan istifadə edir; silinmə həmin onlayn hesaba hər iki yerdən girişi dayandırır. Eyni giriş hesabı başqa Artmonia xidmətinə bağlanıbsa, həmin hesabla giriş də dayandırılır. Silinmə geri qaytarılmır və öz-özlüyündə ödənişin geri qaytarılması sorğusu sayılmır.",
        "Bu əməliyyat onlayn kurs hesabına aiddir. Ayrı müqavilə, əyani tədris və ya qanuni uçot çərçivəsində saxlanılan sənədlərlə bağlı ayrıca müraciət edə bilərsiniz. Tətbiqə girişiniz yoxdursa, şifrə bərpasından istifadə edin və ya məlumatlarla bağlı kömək üçün əlaqə ünvanlarımıza yazın.",
      ],
    },
    {
      id: "huquqlar",
      title: "9. Məlumatlarınız üzərində nəzarət",
      paragraphs: [
        "Profil bölməsində adınızı və e-poçtunuzu yeniləyə bilərsiniz; e-poçt dəyişməsi təsdiq tələb edə bilər. Hesabınızı tətbiqdən silə, həmçinin məlumatlarınıza çıxış, düzəliş, surət və silinmə ilə bağlı əlaqə ünvanlarımıza müraciət edə bilərsiniz.",
        "Sorğunun sizə aid olduğunu yoxlamaq üçün hesabın e-poçt ünvanı və ya digər zəruri təsdiq istənilə bilər. Dəstəyə şifrənizi göndərməyin. Hüquqların tətbiqi və qanuni saxlama istisnaları müraciətin məzmununa uyğun qiymətləndirilir.",
      ],
    },
    {
      id: "tehlukesizlik",
      title: "10. Təhlükəsizlik",
      paragraphs: [
        "Şəbəkə əlaqələri HTTPS vasitəsilə qorunur. Hesaba bağlı məlumatlara giriş autentifikasiya və server icazələri ilə məhdudlaşdırılır; hesab silmə əməliyyatı əlavə şifrə təsdiqi tələb edir. Serverin inzibati açarları mobil tətbiqə daxil edilmir.",
        "Heç bir şəbəkə və saxlama üsulu mütləq təhlükəsizlik təmin etmir. Hesabınıza icazəsiz girişdən şübhələndikdə şifrənizi dəyişin və dəstəyə məlumat verin.",
      ],
    },
    {
      id: "usaqlar",
      title: "11. Uşaqların məlumatları",
      paragraphs: [
        "Valideyn və ya qanuni nümayəndə uşağa aid hesab və məlumatlarla bağlı sual, düzəliş və silinmə müraciəti göndərə bilər. Müraciətin icrasından əvvəl hesabla əlaqə və nümayəndəlik səlahiyyəti yoxlanıla bilər. Uşaqlara aid məlumatlarla bağlı narahatlığınızı əlaqə ünvanlarımıza bildirin.",
      ],
    },
    {
      id: "deyisiklikler",
      title: "12. Siyasətin yenilənməsi",
      paragraphs: [
        "Məlumatların istifadəsində və xidmətlərdə dəyişiklik olduqda bu səhifə yenilənir və son yenilənmə tarixi dəyişdirilir. Məlumat emalına təsir edən mühüm dəyişikliklər barədə xidmət daxilində və ya hesabın e-poçtu ilə əlavə məlumat verilə bilər.",
      ],
    },
  ],
};
