# Artmonia Mobile — məxfilik siyasəti layihəsi

**Status:** hüquqi və ERP təsdiqi gözlənilir; dərc etməyin.  
**Yoxlama tarixi:** 25 sentyabr 2026.  
**Nəzərdə tutulan ünvan:** `https://artmoniya.com/mexfilik-siyaseti` (hələ mövcud deyil).

Bu layihə mobil tətbiq və ERP kodunda yoxlanmış məlumat axınlarını təsvir edir. Kvadrat mötərizədəki qərarlar təsdiqlənmədən ictimai səhifə yaradılmamalıdır. Tətbiqin faktiki App Store build-i ilə yenidən tutuşdurulmalıdır.

## İctimai mətn layihəsi

### 1. Kim məsuldur və necə əlaqə saxlamaq olar?

Artmonia Mobile tələbələrə öz təhsil məlumatlarını görmək, dərs davamiyyətini qeyd etmək, tapşırıqları göndərmək və icmada iştirak etmək imkanı verir. Əlaqə və icma moderasiyası üzrə bildirilmiş məsul şəxs: **İsmət Əliyev**. Məlumatların işlənilməsinə cavabdeh qeydiyyatlı hüquqi şəxs və ya fərdi sahibkar: **[rəsmi status/ad — TƏSDİQ]**. Poçt ünvanı: **[rəsmi ünvan — TƏSDİQ]**. Məxfilik və məlumatlarla bağlı müraciətlər: **ressamismat@gmail.com** (bu məqsəd üçün işlək kanal kimi təsdiqlənməlidir).

### 2. Hansı məlumatlar işlənilir və nə üçün?

| Məlumat | Məqsəd |
| --- | --- |
| E-poçt, parolun autentifikasiya qeydi, hesab və sessiya identifikatorları | Supabase Auth vasitəsilə hesaba giriş və təhlükəsizlik. Parol tətbiqdə açıq mətn kimi saxlanmamalıdır. ERP tələbəni Supabase access tokeni ilə server tərəfində müəyyən edir. |
| Ad, telefon (daxil edilibsə), profil şəkli, proqram və müəllim bağlantısı | Tələbə profilini göstərmək və yeniləmək, tədris xidmətini təşkil etmək. Profil şəkli Storage-da saxlanır. |
| Dərs cədvəli, mövzular/materiallar, müəllim qeydləri, davamiyyət, paket qalığı, tapşırıq və göndərilən foto/PDF, müəllim qərarı | Dərsləri izləmək, davamiyyəti və tapşırıqları idarə etmək. Akademik mənbə Artmonia ERP-dir. |
| Journey mərhələsi, XP, Fırça xalı və sıralama | ERP qaydalarına əsasən tədris irəliləyişini göstərmək. Mobil tətbiq bu nəticələri müstəqil hesablamır. |
| QR check-in üçün təsadüfi quraşdırma ID-si, scan və check-in qeydləri | Dərsdə iştirakın təsdiqi və eyni hesabın cihaz bağlantısının yoxlanması. Quraşdırma ID-si cihazda SecureStore/Keychain-də saxlanır və check-in zamanı ERP-yə ötürülür. |
| Profil, tapşırıq və icma üçün seçilmiş şəkil/fayllar | İstifadəçinin istədiyi kontenti göstərmək, müəllimə tapşırıq təqdim etmək, icma paylaşımını yayımlamaq. Kamera QR oxunması, foto kitabxanası isə seçilmiş fayl üçün istifadə olunur; bütün kitabxananın ötürülməsi barədə iddia edilmir. |
| İcma profili, post və şəkillər, şərhlər, bəyənmələr, bloklama və şikayətlər | Qapalı tələbə icmasını işlətmək, uyğun olmayan məzmunu yoxlamaq və təhlükəsizliyi təmin etmək. Yayımlanmış post/şərh digər icma üzvlərinə; şikayət isə səlahiyyətli moderatora görünür. |
| Push tokeni, bildiriş icazəsi və seçimləri, akademik bildiriş və çatdırılma qeydləri | Dərs, tapşırıq, paket və akademiya bildirişlərini çatdırmaq və istifadəçinin bildiriş seçiminə əməl etmək. |
| Texniki sorğu, xəta və təhlükəsizlik qeydləri | Nasazlıqları araşdırmaq və xidməti qorumaq. Konkret qeyd növləri və saxlanma müddəti təsdiqlənməlidir. |

Artmonia saytından gələn açıq yeniliklər ayrıca website mənbəyindən oxunur; tələbənin akademik access tokeni website xəbər layihəsinə ötürülmür.

### 3. Məlumatlar kimə görünür və hansı xidmətlərdən keçir?

Tələbənin akademik məlumatlarına öz hesabı, səlahiyyətinə uyğun müəllim və ERP əməkdaşları daxil ola bilər. Tapşırıq faylları müəllim tərəfindən yoxlanılır. İcmanın yayımlanmış məzmunu digər daxil olmuş tələbələrə, şikayətlər və gizlədilmiş məzmun isə səlahiyyətli moderasiya heyətinə görünə bilər. Bloklama digər istifadəçinin akademik məlumatlarını dəyişmir.

Giriş, verilənlər bazası, fayl saxlama və server funksiyaları üçün Supabase; ERP API-si üçün Artmonia-nın hostinq infrastrukturu; push çatdırılması üçün Expo və cihaz platformasının Apple/Google bildiriş xidmətləri istifadə olunur. Bu xidmətlərə məlumat texniki emal üçün ötürülə bilər. **[Xidmət təminatçılarının hüquqi rolu, emal regionları və transsərhəd ötürülmə əsası — TƏSDİQ]**. İstifadəçi məlumatının reklam, data brokeri və ya digər izləmə məqsədilə paylaşılması barədə təsdiqlənməmiş iddia verilmir.

### 4. Nə qədər saxlanılır və necə silinir?

**[QƏRAR TƏLƏB OLUNUR]** Hesab/profil, akademik qeydlər, davamiyyət və tapşırıq faylları, icma məzmunu və şəkilləri, şikayət/moderasiya qeydləri, cihaz/push qeydləri, texniki loglar və ehtiyat nüsxələri üçün saxlanma meyarları və silinmə müddətləri Artmonia tərəfindən təsdiqlənməlidir. Hazırkı texniki audit icma və push qeydləri üçün avtomatik təmizləmə cədvəlini təsdiqləmir; silinmiş icma post/şərhi bəzi hallarda yalnız feed-dən gizlədilir. Storage fayllarının ayrıca silinməsi tələb olunur. Buna görə “hesab silinən kimi bütün məlumatlar dərhal silinir” iddiası yazıla bilməz.

İstifadəçi məlumatına çıxış, düzəliş və silinmə barədə **ressamismat@gmail.com** ünvanına müraciət edə bilər **[kanal və cavab müddəti təsdiqlənsin]**. Tətbiq daxilində hesabın silinməsini başlatma axını və onun ERP, Supabase Auth, icma/fayl, push və ehtiyat nüsxələrinə təsiri ayrıca yoxlanmalı və tətbiq edilməlidir. Hüquqi səbəbdən saxlanması məcburi olan qeydlərin kateqoriyası və müddəti istifadəçiyə izah edilməlidir. Razılığın geri götürülməsi üçün praktik yol da təsdiqlənməlidir.

### 5. 13–17 yaşlı tələbələr və icma təhlükəsizliyi

Tətbiqin ilk App Store buraxılışı 13+ kimi planlaşdırılıb. Yetkinlik yaşına çatmayan tələbələrin məlumatları, profil şəkilləri və icma paylaşımları ilə bağlı əlavə razılıq və valideyn/qanuni nümayəndə prosesi **[hüquq komandasının təsdiqi]** tələb edir. İstifadəçi post və şərhdən şikayət edə, başqa icma üzvünü bloklaya bilər. Şikayətlərin məsul şəxsi kimi **İsmət Əliyev** bildirilib; növbənin yoxlanma tezliyi, müdaxilə meyarları və cavab müddəti **[TƏSDİQ]** edilməlidir. Təsdiqlənməmiş “24 saatda baxılır” kimi vəd yazılmır.

### 6. Yenilənmə

Siyasətin qüvvəyə minmə tarixi **[dərc günü]** olacaq. Mühüm dəyişikliklər tətbiqdə və ya rəsmi saytda bildiriləcək **[bildiriş üsulu TƏSDİQ]**. Əvvəlki versiyalar və əlaqə kanalı saxlanmalıdır **[versiyalaşdırma qaydası TƏSDİQ]**.

## App Store Connect üçün texniki məlumat növləri cədvəli — ilkin, təsdiqsiz

Bu cədvəl Apple forması üçün tövsiyə olunan **inventardır**, “toplanır/toplanmır”, “tracking” və yekun cavabları hüquqi və mobil build auditi olmadan avtomatik təsdiqləmir. Apple kateqoriyaları [rəsmi App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/) ilə tutuşdurulmalıdır.

| Apple kateqoriyası | Artmonia Mobile nümunəsi | Məqsəd | Hesaba bağlı? | Emal/paylaşım | Saxlanma/silinmə |
| --- | --- | --- | --- | --- | --- |
| Contact Info → Name, Email Address, Phone Number | Ad, giriş e-poçtu, profil telefonu | Giriş, profil, tədris əlaqəsi | Bəli | Supabase Auth, ERP | TƏSDİQ |
| User Content → Photos or Videos, Other User Content | Profil/tapşırıq/icma şəkli, PDF, post, şərh, şikayət mətni | Tədris, icma, moderasiya | Bəli | Supabase Storage, ERP, səlahiyyətli icma üzvləri/moderator | TƏSDİQ |
| Identifiers → User ID, Device ID | Auth/ERP hesab ID-si, quraşdırma ID-si, push tokeni | Kimlik, QR təhlükəsizliyi, push | Bəli | Supabase, ERP, Expo/Apple/Google | TƏSDİQ |
| Usage Data → Product Interaction / Other Usage Data | Davamiyyət scan-i, icma hərəkətləri, bildiriş oxunması | Tədris funksiyası, təhlükəsizlik | Bəli | ERP, Supabase | TƏSDİQ |
| Other Data Types | Dərs, proqram, paket, Journey, XP/Fırça, akademik statuslar | Tədris xidməti | Bəli | ERP, Supabase gateway | TƏSDİQ |
| Diagnostics → Crash / Performance / Other Diagnostic Data | Tətbiq və server logları **yalnız faktiki build/hostinq auditi ilə** | Səhv diaqnostikası | Yoxlanmalıdır | Yoxlanmalıdır | TƏSDİQ |

**Açıq qərarlar:** rəsmi hüquqi ad/ünvan; məlumat kateqoriyaları üzrə retention və backup; hesabın tətbiqdən silinməsi; icma moderatoru/SLA; 13–17 yaş razılığı; Expo/Apple/Google/Supabase emal regionları və hüquqi əsas; son iOS build-də SDK/analytics/tracking auditi; hüquq və ERP təsdiqi. Təsdiqdən sonra mətn saytın girişsiz, mobilə uyğun HTTPS səhifəsinə köçürülməli, App Store Connect və tətbiq Settings-də eyni URL işlədilməlidir.
