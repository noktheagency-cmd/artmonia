insert into public.site_sections (
  key,
  label,
  description,
  category,
  content,
  is_published,
  sort_order
)
values
(
  'nav_items',
  'Naviqasiya',
  'Sayt menyusu və keçidlər',
  'website',
  '[{"label":"Proqram","href":"/#program"},{"label":"Akademiya","href":"/#academy"},{"label":"Nəticələr","href":"/neticeler"},{"label":"Mükafatlar","href":"/mukafatlar"},{"label":"Əlaqə","href":"/#contact"}]'::jsonb,
  true,
  0
),
(
  'hero_stats',
  'Başlanğıc statistikası',
  'Ana təqdimatdakı qısa göstəricilər',
  'website',
  '[{"value":"6 həftə","label":"akademik ritm"},{"value":"30+","label":"dərs və tapşırıq"},{"value":"Maks 20","label":"qrup ölçüsü"},{"value":"4.9","label":"127 rəy əsasında"}]'::jsonb,
  true,
  10
),
(
  'pain_points',
  'Problem mətni',
  'Ziyarətçinin əsas ehtiyacları',
  'website',
  '["YouTube-dan öyrənirsən, amma sistem yoxdur.","Başlayırsan, yarımçıq qoyursan.","Feedback almırsan - səhvlərini görmürsən.","Nə vaxt keçid etməli olduğunu bilmirsən."]'::jsonb,
  true,
  20
),
(
  'transformations',
  'Dəyişiklik nəticələri',
  'Proqramın yaratdığı nəticələr',
  'website',
  '[{"title":"Sistem var","text":"Hər addım planlaşdırılıb - təsadüfi yox, ölçülən inkişaf."},{"title":"Nəticə görünür","text":"Həftəlik tapşırıqlar + feedback = real progress."},{"title":"Mentor dəstəyi","text":"Peşəkar rəssamlardan birbaşa rəy alırsan."},{"title":"Portfolyo qurulur","text":"Kurs sonunda göstərə biləcəyin işlər olur."}]'::jsonb,
  true,
  30
),
(
  'courses',
  'Kurslar',
  'Kurs kartları, müddət və şəkillər',
  'academy',
  '[{"title":"Akademik Rəsm","duration":"12 həftə","text":"Proporsiya, anatomiya və klassik çəkim texnikaları ilə möhkəm təməl.","image":"https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=85"},{"title":"Rəng & Boyama","duration":"10 həftə","text":"Yağlı boya, akrilik və akvarel texnikaları ilə rəng nəzəriyyəsi.","image":"/assets/module-color.webp"},{"title":"Rəqəmsal Sənət","duration":"8 həftə","text":"Procreate və Photoshop ilə müasir rəqəmsal illüstrasiya.","image":"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=85"},{"title":"Kompozisiya","duration":"6 həftə","text":"Vizual tarazlıq, ritm və baxışı idarə etmək sənəti.","image":"/assets/module-composition.webp"},{"title":"Portret Sənəti","duration":"8 həftə","text":"İnsan üzünün anatomiyası, ifadə və işıq-kölgə ustalığı.","image":"/assets/module-portrait.webp"},{"title":"Portfolyo Hazırlığı","duration":"4 həftə","text":"Karyera üçün peşəkar portfolyo yaratma və təqdimat.","image":"https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=85"}]'::jsonb,
  true,
  40
),
(
  'studio_features',
  'Studiya üstünlükləri',
  'Studiya xüsusiyyətləri siyahısı',
  'academy',
  '["Professional molbertlər","Rahat atmosfer","Xoş musiqi","Unikal dizayn","Premium materiallar","Canlı dərslər"]'::jsonb,
  true,
  50
),
(
  'studio_cards',
  'Studiya kartları',
  'Studiya haqqında məzmun',
  'academy',
  '[{"title":"Professional Molbertlər","text":"Hər tələbə üçün fərdi iş stansiyası"},{"title":"Qaleriya & İstirahət","text":"İlham verən sənət əsərləri arasında"},{"title":"Premium Materiallar","text":"Ən keyfiyyətli boyalar və fırçalar"},{"title":"Unikal Dizayn","text":"Yaradıcılığa ilham verən məkan"},{"title":"Canlı Dərslər","text":"Xoş atmosfer, peşəkar təlim"}]'::jsonb,
  true,
  60
),
(
  'curriculum',
  'Tədris proqramı',
  'Həftələr, mövzular və materiallar',
  'academy',
  '[{"num":"01","week":"Həftə 1","title":"Əsaslar & Proporsiya","text":"Xətt, forma, ölçü - hər şeyin təməli. Geometrik formalardan başlayıb proporsiya qanunlarını mənimsəyirsən.","topics":["Xətt çəkiliş texnikası","Geometrik formalar","Proporsiya qaydaları","Perspektiv əsasları"],"image":"https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1400&q=85"},{"num":"02","week":"Həftə 2","title":"İşıq və Kölgə","text":"Həcm yaratmağın sirləri. Chiaroscuro texnikası ilə rəsmlərinə dərinlik ver.","topics":["İşıq mənbələri","Kölgə növləri","Həcm yaratma","Tonallıq"],"image":"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=85"},{"num":"03","week":"Həftə 3","title":"Rəng Nəzəriyyəsi","text":"Rəng dairəsi, harmoniya, kontrast. Rənglərin dilini öyrən, əsərlərinə ruh qat.","topics":["Rəng dairəsi","Soyuq-isti rənglər","Rəng harmoniyası","Akvarel texnikası"],"image":"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1400&q=85"},{"num":"04","week":"Həftə 4","title":"Kompozisiya","text":"Baxışı idarə etmək sənəti. Qızıl nisbət, üçlər qaydası və vizual tarazlıq.","topics":["Qızıl nisbət","Üçdəbir qaydası","Vizual balans","Diqqət nöqtəsi"],"image":"https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1400&q=85"},{"num":"05","week":"Həftə 5","title":"Portret & Fiqur","text":"İnsan formasını düzgün çəkmək. Üz proporsiyaları, ifadə və bədən anatomiyası.","topics":["Üz proporsiyası","Bədən anatomiyası","İfadə çəkiliş","Poza və hərəkət"],"image":"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=85"},{"num":"06","week":"Həftə 6","title":"Final Layihə","text":"Bütün bilikləri bir əsərdə birləşdir. Öz unikal üslubunu kəşf et.","topics":["Konsept hazırlığı","Texnika seçimi","İcra və tamamlama","Portfolyo təqdimatı"],"image":"https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1400&q=85"}]'::jsonb,
  true,
  70
),
(
  'packages',
  'Paketlər',
  'Qiymət və paket üstünlükləri',
  'academy',
  '[{"title":"Mini","price":"99 AZN","text":"Rəsmə giriş - əsasları öyrən.","features":["2 modul (Əsaslar + İşıq/Kölgə)","Video dərslər","Topluluq çatı","Sertifikat"],"cta":"Seç və yaz"},{"title":"Standart","price":"199 AZN","text":"Tam proqram - bütün modullar + feedback.","highlight":"Ən populyar","features":["6 modul - tam proqram","Həftəlik canlı sessiya","Fərdi feedback","Portfolyo layihəsi","Sertifikat","6 ay material girişi"],"cta":"Seç və yaz"},{"title":"Premium","price":"349 AZN","text":"1-on-1 mentorluq + VIP dəstək.","highlight":"Yalnız 5 yer qaldı","features":["Standart-ın hər şeyi","4 fərdi mentorluq sessiyası","Portfolyo review","Karyera məsləhəti","Ömürlük material girişi","VIP WhatsApp qrup"],"cta":"Seç və yaz"}]'::jsonb,
  true,
  80
),
(
  'comparison',
  'Paket müqayisəsi',
  'Müqayisə cədvəlinin sətirləri',
  'academy',
  '[["Modul sayı","2","6","6"],["Video dərslər","Var","Var","Var"],["Canlı sessiya","-","Var","Var"],["Fərdi feedback","-","Var","Var"],["1-on-1 mentorluq","-","-","Var"],["Portfolyo review","-","-","Var"],["Karyera məsləhəti","-","-","Var"],["Material girişi","3 ay","6 ay","Ömürlük"],["VIP qrup","-","-","Var"],["Sertifikat","Var","Var","Var"]]'::jsonb,
  true,
  90
),
(
  'teachers',
  'Müəllimlər',
  'Müəllim profilləri',
  'academy',
  '[{"initials":"VM","name":"Vaqif Məmmədov","role":"Peşəkar akademik müəllim","note":"Ana səhifədə göstərilən müəllim heyətindən."},{"initials":"ƏR","name":"Əsmər Ramazanova","role":"Akademik müəllim","note":"Akademik rəsm və tələbə feedback xətti."},{"initials":"ƏC","name":"Əminə Cəmaləddinova","role":"Həvəskar rəsm müəllimi","note":"Yeni başlayanlar üçün yumşaq keçid."},{"initials":"AH","name":"Aida Həsənova","role":"Baş Müəllim - Akvarel & Rəng","note":"15+ il təcrübə. Bakı Rəssamlıq Akademiyası məzunu."},{"initials":"KƏ","name":"Kamran Əliyev","role":"Müəllim - Portret & Fiqur","note":"Beynəlxalq sərgilərdə iştirak. 10+ il pedaqoji təcrübə."},{"initials":"NS","name":"Nərmin Sadıqova","role":"Müəllim - Kompozisiya & Dizayn","note":"Qrafik dizayner + rəssam. Gənc rəssamlara mentorluq."}]'::jsonb,
  true,
  100
),
(
  'resources',
  'Məqalələr',
  'Məqalə və resurs məzmunu',
  'content',
  '[{"type":"Məqalə","title":"Kompozisiyanın 3 Qızıl Qaydası","text":"Hər rəsmin güclü olmasının arxasında dayanan sadə prinsiplər.","image":"/assets/article-composition.webp","lead":"Yaxşı kompozisiya tamaşaçının baxışını təsadüfə buraxmır. O, gözü əsərin əsas nöqtəsinə aparır, orada saxlayır və sonra bütün səth boyunca ritmlə hərəkət etdirir.","sections":[{"heading":"1. Diqqət mərkəzini əvvəl seç","body":"Rəsmə başlamazdan əvvəl ən vacib formanı müəyyən et. Ən güclü kontrast, ən aydın kənar və ən çox detal həmin nöqtəyə yaxın olmalıdır. Hər hissə eyni dərəcədə danışanda əsərdə heç nə eşidilmir."},{"heading":"2. Boşluğu da forma kimi gör","body":"Obyektlərin arasındakı boş sahələr kompozisiyanın nəfəsidir. Üçdəbir qaydası başlanğıc üçün yaxşı çərçivədir, amma əsas məqsəd çəkilərlə boşluq arasında canlı tarazlıq yaratmaqdır."},{"heading":"3. Ritm və istiqamət qur","body":"Təkrarlanan xətlər, ölçü dəyişiklikləri və diaqonallar gözü hərəkət etdirir. Eyni forma ardıcıl təkrarlananda monotonluq yaranır; ölçü və məsafəni dəyişərək vizual musiqi yarat."}]},{"type":"Məqalə","title":"Rəng Harmoniyası: Başlanğıc Bələdçisi","text":"Rəngləri necə uyğunlaşdırmağı öyrən - sadə və aydın.","image":"/assets/article-color-harmony-crisp.webp","lead":"Rəng harmoniyası çox rəng istifadə etmək deyil; rənglər arasında aydın münasibət qurmaqdır. Məhdud palitra qərar verməyi asanlaşdırır və əsəri daha peşəkar göstərir.","sections":[{"heading":"Dominant rəngi müəyyən et","body":"Palitrada bir rəng əsas səsi daşısın, digərləri onu dəstəkləsin. Dominant rəng səthin böyük hissəsində görünə, vurğu rəngi isə az istifadə olunaraq diqqəti idarə edə bilər."},{"heading":"İsti və soyuq tarazlığı","body":"İsti rənglər adətən önə, soyuq rənglər arxaya gəlir. Bu münasibətdən məkan yaratmaq üçün istifadə et: işıqda isti, kölgədə soyuq keçid sınamaq yaxşı başlanğıcdır."},{"heading":"Rəngi qaraltmaq üçün yalnız qara istifadə etmə","body":"Qara rəngi tez çirkləndirə bilər. Tamamlayıcı rənglə qarışdırmaq daha zəngin kölgələr verir: məsələn, narıncıya az miqdarda mavi, yaşıl rəngə isə qırmızı əlavə et."}]},{"type":"Məqalə","title":"Portretdə Proporsiyalar","text":"Üz quruluşunu ölçü və istiqamət xətləri ilə düzgün qur.","image":"/assets/article-portrait-proportions.webp","lead":"Oxşarlıq detallardan əvvəl quruluşdan yaranır. Göz, burun və dodağı ayrıca gözəl çəkmək kifayət deyil; onların bir-birinə olan məsafəsi düzgün olmalıdır.","sections":[{"heading":"Baş formasını sadələşdir","body":"Əvvəl kəlləni yumurta və ya qutu kimi düşün. Mərkəz xətti üzün hansı istiqamətə döndüyünü, qaş xətti isə başın yuxarı-aşağı bucağını göstərir."},{"heading":"Əsas ölçü nöqtələri","body":"Gözlər təxminən başın hündürlüyünün ortasında yerləşir. Gözlər arasındakı məsafə bir göz eninə yaxındır; burun altı ilə çənə arasında ağız xətti yuxarı üçdəbirə yaxın olur."},{"heading":"Detal verməzdən əvvəl müqayisə et","body":"Qələmi ölçü aləti kimi istifadə et. Gözlərin meylini, burunun uzunluğunu və ağız künclərini hər mərhələdə müqayisə et. Böyük səhvi kirpik və saçla gizlətmək mümkün deyil."}]},{"type":"Texnika","title":"Akril boya ilə rəsm çəkmək: Yeni başlayanlar üçün bələdçi","text":"Lazımi materiallar, texnikalar və ilk addımlar haqqında məlumat.","image":"/assets/article-acrylic-technique.webp","lead":"Akril boya sürətli quruyur, qat-qat işləməyə imkan verir və həm nazik, həm də qalın faktura yarada bilir. Düzgün ardıcıllıqla işləyəndə bu sürət üstünlüyə çevrilir.","sections":[{"heading":"Sadə material dəsti","body":"Başlamaq üçün titan ağ, ultramarin, kadmium qırmızı, sarı və tünd qəhvəyi kifayətdir. İki sintetik fırça, palitra, su qabı və qalın kağız və ya kətan seç."},{"heading":"Nazik qatdan qalın qata","body":"İlk mərhələdə boyanı az su ilə duruldaraq böyük rəng sahələrini yerləşdir. Sonrakı qatlarda suyu azaldıb işıqları və əsas kənarları daha örtücü boya ilə qur."},{"heading":"Quruma vaxtını idarə et","body":"Palitraya yalnız istifadə edəcəyin qədər boya çıxar. Yumşaq keçid istəyirsənsə, iki rəngi səth hələ yaş ikən qarışdır; sərt kənar üçün alt qatın tam qurumasını gözlə."}]},{"type":"Texnika","title":"Portre rəsm texnikası: Üz proporsiyalarını düzgün çəkmək","text":"Üz proporsiyaları, işıq-kölgə texnikası və peşəkar məsləhətlər.","image":"/assets/article-portrait-technique.webp","lead":"Portret texnikasının məqsədi hər detalı köçürmək deyil, insanın xarakterini daşıyan böyük forma və işıq münasibətini qorumaqdır.","sections":[{"heading":"Böyük kütlələrlə başla","body":"Saç, üz və boyun sahələrini üç böyük forma kimi yerləşdir. Siluetin düzgünlüyünü yoxla; başın eni, hündürlüyü və çiyinlə əlaqəsi oturmadan üz detallarına keçmə."},{"heading":"İşıq və kölgəni ayır","body":"Əvvəlcə üzün işıqlı və kölgəli tərəfini iki böyük ton kimi qur. Yanaq, alın və çənə müstəviləri bu bölgü daxilində tədricən formalaşmalıdır."},{"heading":"Kənarları eyni sərtlikdə etmə","body":"Göz qapağı və burun dəliyi kimi fokus hissələrində kənar daha dəqiq ola bilər. Yanaqdan saç və boyuna keçiddə bəzi kənarları yumşaltmaq portreti hava ilə birləşdirir."}]},{"type":"Sənət tarixi","title":"Dünyaca məşhur 10 rəsm əsəri və onların hekayələri","text":"Mona Lizadan Ulduzlu gecəyə qədər məşhur əsərlərin hekayələri.","image":"/assets/quiz-starry-bg.webp","lead":"Bəzi əsərlər yalnız gözəl təsvir olduqları üçün deyil, dövrünün baxışını dəyişdirdikləri üçün yadda qalır. Bu on əsər rəssamlığın necə yeniləndiyini qısa xəritə kimi göstərir.","sections":[{"heading":"İntibahdan romantizmə","body":"Leonardo da Vinçinin “Mona Liza”sı sirli ifadə və sfumato keçidləri ilə portreti dəyişdi. Botticellinin “Veneranın doğuluşu” mifoloji gözəlliyi yenidən mərkəzə gətirdi. Velaskesin “Las Meninas”ı isə tamaşaçı, model və rəssam arasındakı sərhədi sual altına aldı."},{"heading":"İşıq, hərəkət və yeni baxış","body":"Rembrandtın “Gecə keşikçiləri” qrup portretinə dramatik hərəkət verdi. Hokusayın “Kanaqava sahilində böyük dalğa”sı kiçik insanı təbiətin nəhəng ritmi ilə qarşılaşdırdı. Delakruanın “Xalqa yol göstərən Azadlıq” əsəri siyasi hadisəni simvola çevirdi."},{"heading":"Müasir sənətə doğru","body":"Monenin “Təəssürat, günəşin doğuşu” əsəri anlıq işığı mövzu etdi. Van Qoqun “Ulduzlu gecə”si daxili duyğunu fırlanan səma ilə göstərdi. Munkun “Qışqırıq” əsəri müasir narahatlığın ikonuna çevrildi, Pikassonun “Gernika”sı isə müharibənin ağrısını parçalanmış formalarla danışdı."}]}]'::jsonb,
  true,
  110
),
(
  'testimonials',
  'Rəylər',
  'Tələbə rəyləri',
  'content',
  '[{"quote":"İlk dəfə öz portretimi çəkə bildim. Mentor feedback-i hər şeyi dəyişdi.","name":"Aynur M.","role":"Başlayan"},{"quote":"YouTube-da 2 il itirdim. Burada 6 həftədə daha çox irəlilədim.","name":"Rəşad K.","role":"Peşəkar keçid"},{"quote":"Struktur - budur fərq. Hər həftə nə edəcəyimi bilirdim.","name":"Günel H.","role":"Hobbi rəssam"},{"quote":"Portfolyom artıq var. İndi freelance sifarişlər alıram.","name":"Tural A.","role":"Freelancer"},{"quote":"Uşaqlarıma dərs verirəm, amma özüm də çox şey öyrəndim.","name":"Leyla S.","role":"Müəllim"},{"quote":"Qiymətinə görə aldığın dəyər inanılmazdır.","name":"Orxan V.","role":"Tələbə"}]'::jsonb,
  true,
  120
),
(
  'faq',
  'Tez-tez verilən suallar',
  'Sual-cavab bölməsi',
  'content',
  '[{"q":"Proqram kimə uyğundur?","a":"Tam başlayanlardan tutmuş orta səviyyəlilərə qədər - hər kəs üçün uyğun modullar var."},{"q":"Hər həftə nə qədər vaxt ayırmalıyam?","a":"Təxminən 4-6 saat. Dərslər + tapşırıqlar bu müddətə planlaşdırılıb."},{"q":"Online formatda keyfiyyət necə təmin olunur?","a":"Video dərslər + canlı sessiyalar + hər tapşırığa fərdi feedback."},{"q":"Materiallar nə qədər əlçatan olur?","a":"Kurs müddətində və bitdikdən sonra 6 ay ərzində bütün materiallara girişiniz var."},{"q":"Ödəniş necə edilir?","a":"Bank kartı, köçürmə və ya hissə-hissə ödəniş variantları mövcuddur."},{"q":"Əgər proqram mənə uyğun deyilsə?","a":"İlk 7 gün ərzində tam geri qaytarma təminatı var."},{"q":"Sertifikat verilirmi?","a":"Bəli, proqramı uğurla tamamlayanlara Artmonia sertifikatı verilir."},{"q":"Qrup böyüklüyü nə qədərdir?","a":"Hər qrupda maksimum 20 nəfər - fərdi diqqət təmin olunur."}]'::jsonb,
  true,
  130
),
(
  'contact',
  'Əlaqə məlumatları',
  'Telefon, e-poçt, ünvan və sosial şəbəkələr',
  'settings',
  '{"phone":"+994 10 383 13 93","email":"artmoniaacademy@gmail.com","alternateEmail":"info@artmonia.az","address":"Nizami kino mərkəzi, 2-ci mərtəbə","city":"Bakı, Azərbaycan","instagram":"https://instagram.com/artmoniya.academy","facebook":"https://facebook.com/artmoniya"}'::jsonb,
  true,
  140
),
(
  'form_fields',
  'Qeydiyyat formu',
  'Form sahələri və seçimlər',
  'settings',
  '[{"label":"Ad, Soyad *","type":"text","placeholder":"Adınız","name":"full_name"},{"label":"Telefon *","type":"tel","placeholder":"+994 50 111 22 33","name":"phone"},{"label":"Email","type":"email","placeholder":"email@nümunə.az","name":"email"},{"label":"Format","type":"select","name":"interest","options":["Online","Offline"]},{"label":"Səviyyə","type":"select","name":"level","options":["Başlayan","Orta","İrəliləmiş"]}]'::jsonb,
  true,
  150
),
(
  'privacy',
  'Məxfilik',
  'Məxfilik siyasəti məzmunu',
  'settings',
  '[{"title":"Toplanan məlumatlar","text":"Qeydiyyat formu vasitəsilə ad, telefon, email (istəyə bağlı) və maraq sahələriniz toplanır."},{"title":"Məlumatların istifadəsi","text":"Topladığımız məlumatlar yalnız sizinlə əlaqə saxlamaq, proqram haqqında məlumat vermək və xidmətlərimizi təkmilləşdirmək üçün istifadə olunur."},{"title":"Məlumatların paylaşılması","text":"Şəxsi məlumatlarınız üçüncü tərəflərlə paylaşılmır, satılmır və ya icarəyə verilmir."},{"title":"Təhlükəsizlik","text":"Məlumatlarınızın qorunması üçün müasir təhlükəsizlik tədbirləri tətbiq olunur."}]'::jsonb,
  true,
  160
),
(
  'gallery_images',
  'Sayt şəkilləri',
  'Əsas vizual və qalereya şəkilləri',
  'content',
  '[{"src":"https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1400&q=85","alt":"Klassik rəsm emalatxanası və kətanlar"},{"src":"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=85","alt":"Rəsm materialları və boya palitrası"},{"src":"https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=85","alt":"Rəssam emalatxanasında boya və kətan"},{"src":"https://images.unsplash.com/photo-1578926288207-a90a5366759d?auto=format&fit=crop&w=1000&q=85","alt":"Qalereya və sənət divarı"},{"src":"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=85","alt":"Rəsm materialları və boya teksturası"}]'::jsonb,
  true,
  170
)
on conflict (key) do update set
  label = excluded.label,
  description = excluded.description,
  category = excluded.category,
  content = excluded.content,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order,
  updated_at = now();
