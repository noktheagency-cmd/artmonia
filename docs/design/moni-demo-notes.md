# Moni interaktiv prototipi

Sınaq səhifəsi: `/moni-demo`. Mövcud ana səhifə bu marşrutda yenidən istifadə olunur. Moni hero-dan aşağı keçəndə ekrana düşür. Girişdə yalnız maskot və üstündə kiçik mətn görünür. Söhbət istifadəçi Moniyə və ya həmin mətnə toxunanda açılır: solda maskot, sağda danışıq və cavab seçimləri.

## Özünüz yoxlayın

1. Səhifəni yuxarıdan açın, hero-nun aşağı hissəsinə keçin. Moninin düşməsini və başının üstündəki yazını gözləyin. Bu anda söhbət paneli açılmamalıdır.
2. Moniyə toxunun. Kiçik paneldə Moni solda, üç cavab sağda olmalıdır.
3. `Özüm üçün öyrənmək` → `İlk dəfə başlayıram` seçin. Üç mərhələli rəsm yolu çəkilməlidir. `Uyğun proqramı göstər` ilə kataloqdakı proqram təklifinə keçin.
4. `Ödənişsiz konsultasiya` ilə demo formanı açın. Əvvəl boş və ya qısa telefonla yoxlayın, sonra ad və `+994 50 123 45 67` yazıb tamamlayın. Nəticə açıq şəkildə demo olmalıdır; heç bir müraciət göndərilmir.
5. Başlıqdakı yenidən başlat ikonuna toxunun. `Bacarığımı artırmaq` → `Artıq rəsm çəkirəm` → `Rəqəmsal sənət` yolunu yoxlayın. Müvafiq proqram yayımlanıbsa, rəqəmsal proqram göstərilməlidir; yayımlanmayıbsa, mentorla dəqiqləşdirmə təklifi çıxmalıdır.
6. Geri qayıdıb cavabı dəyişin. Paneli `X` və ya `Escape` ilə bağlayıb Moniyə toxunaraq davam edin. Yazının kiçik `X` düyməsi giriş maskotunu kiçik ölçüyə salır.
7. Telefonda da eyni axını yoxlayın. Sisteminizdə “hərəkəti azalt” açıqdırsa, düşmə və davamlı hərəkət sakitləşməlidir.

## Əhatə və yoxlamalar

- Seçimlər və formanın məlumatları yalnız komponentin yaddaşındadır. AI sorğusu, CRM yazısı, real qeydiyyat və görüş yaratma yoxdur.
- Proqramın adı, müddəti və qiyməti mövcud yayımlanmış saytdan götürülür. Boş qiymət və olmayan proqram uydurulmur. Proqram görüntüləri vizual nümunə kimi göstərilir, real tələbə nəticəsi iddiası edilmir.
- Demo marşrutu `noindex` olaraq işarələnib.
- Sürətli yoxlamalar: `node --test scripts/moni-demo.test.cjs`, `node node_modules/typescript/bin/tsc --noEmit`, hədəf ESLint və Next build.
- Sahibin test seçiminə əsasən brauzer/telefon qəbul yoxlaması sahib tərəfindən aparılır. End-to-end təsdiqi iddia edilmir.

## Dizayn və assetlər

- Mövcud Next.js / React üzərində `motion/react`; panel və seçimlər HTML/CSS, yolun çəkilməsi SVG-dir.
- İlkin düzəlişdən sonrakı konsept: `docs/design/moni-compact-demo-concept.png`.
- İstehsal sprite atlası: `public/assets/moni/moni-poses-v1.png`, 1536 × 1024 RGBA, 3 sütun × 2 sətir. Sıra: sakit, salam, düşünmə, danışma, sevinc, təqdimat. Şəffaflıq metadata və künc alpha nümunələri ilə yoxlanıb.
- Təxminən 1.8 MB-lıq atlas Moni görünəndə istifadə olunur. Mənbədəki 18 MB-lıq bütün animasiya demo səhifəsinə yerləşdirilmir.
- Vizual istiqamət: krem-ağ `#fffdf9`, navy `#111344`, narıncı `#f49a13`, incə kontur, 24 px panel küncü. Panel desktopda maksimum 510 px-dir; mobil ölçüdə solda maskot və sağda söhbət quruluşu saxlanır.
- Mətn əsaslı təsdiqlənmiş flow həyata keçirilib. Generated konsept vizual istiqamətdir; brauzer screenshot-u ilə tam uyğunluq təsdiqi aparılmayıb.

### Built-in ImageGen asset prompt

Use case: background-extraction and identity-preserve. Asset type: production website mascot sprite atlas on genuine transparency. Input image 1 is the exact Artmonia Moni mascot identity and pose reference. Create a SINGLE landscape 1536x1024 transparent PNG sprite sheet arranged as exactly THREE columns and TWO rows of equal square cells. Each cell is exactly 512x512 conceptually, with one full-body Moni centered and equal scale (body fits within a 400px tall central area with 50px margin all sides), feet aligned to the same baseline. No cell separators, no labels, no text, no logo, no background, no green screen, no gradients, no grey checkerboard painted into the output, no props except the last cell. Preserve the exact reference's orange painterly spiral brush-stroke silhouette, creamy pale face, dark navy oval eyes and smile, orange hands and feet, visible natural brush texture. This is the same original character, do not redesign or make it 3D, robotic, plastic or generic. Cell order left to right, top to bottom: 1 friendly neutral attentive smile with arms gently relaxed; 2 happy wave using the exact large waving reference pose; 3 thoughtful pose with hand under chin like the left reference pose; 4 speaking pose with one hand open to the right and a small open smile; 5 joyful celebration with both arms up and eyes happy; 6 pointing toward a small blank cream artboard held on his right like the right reference pose. Keep identical character identity in all six cells. Every character isolated with clean alpha edges and no background pixels inside the spiral or around arms, keep creamy face opaque. Very faint soft grounding shadow allowed only just below feet. This will be displayed as CSS sprite frames and animated with code, equal-cell composition and full uncut limbs essential.

### Built-in ImageGen UI concept prompt

Use case: ui-mockup. Design a polished minimal compact assistant widget concept for Artmonia's mascot Moni. IMPORTANT user correction: this is a SMALL floating conversation panel shown ONLY after the user clicks Moni; never a fullscreen wizard or large selection page. Create one landscape screenshot at 1200x800-like proportions. Main deliverable centered in screenshot is a 520px wide by 330px high light white compact widget on a plain light grey website background. Single outer surface with 24px rounded corners, delicate warm grey border and very soft shadow, no nested panels. Layout: left column 130px wide contains the EXACT supplied orange brush-stroke spiral Moni mascot at 120px tall, standing and speaking, preserving reference identity; right column 320px has conversation and click answers. At top of right column small name 'Moni' with an orange dot, tiny grey 'Demo', reset icon and close X. Question in 22px dark navy sans-serif 'Rəsmlə nə etmək istəyirsən?' followed by 14px supporting line 'Sənə uyğun başlanğıcı birlikdə tapaq.' Three compact selectable horizontal rows with fine warm-grey outlines and 12px corners, 15px navy text and small outlined right arrow: 'Özüm üçün öyrənmək', 'Bacarığımı artırmaq', 'Portfolio hazırlamaq'. Bottom row subtle orange three-segment progress, small left arrow 'Geri', and small grey footer 'Seçimlərinə uyğun yönləndirirəm.' All right content must fit gracefully in this small widget, large open margin 20px, no big headings, no cards inside cards, no images besides Moni, no gradients, no full-page app chrome, no made-up metrics, no prices. Navy #111344, orange #f49a13, white #fffdf9, UI font Segoe UI or a refined equivalent. Small secondary inset at TOP LEFT, outside the main compact widget, showing entrance state ONLY: a 120px Moni by himself on the webpage with a tiny 190x46 white speech bubble above his head saying 'Salam! Mən Moniyəm.' and small next text underneath 'Sənə uyğun rəsm yolunu tapaq?'. The entrance inset has NO popup, NO panel, NO overlay behind it, only mascot and tiny words. Clearly separate these as two alternate interaction states, not simultaneous widgets. Beautiful minimal production-ready UI, with clear readable Azerbaijani text, faithful mascot.
