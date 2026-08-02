# Artmonia — Higgsfield Premium Video Generation Brief

Bu brief, üç referans görselle birlikte doğrudan ChatGPT'ye gönderilmek için hazırlanmıştır.

## Yüklenecek referanslar

1. `artmonia-hero-creation-poster.png`
   - Sahne: Hero / birbirine yaklaşan iki el
   - Çıktı adı: `artmonia-hero-premium.mp4`

2. `artmonia-line-to-art-poster.png`
   - Sahne: Scroll-film / çizgiden tamamlanmış sanat eserine dönüşüm
   - Çıktı adı: `artmonia-journey-premium.mp4`

3. `artmonia-future-atelier-poster.png`
   - Sahne: Footer CTA / geleceğin sanat atölyesi
   - Çıktı adı: `artmonia-atelier-premium.mp4`

## ChatGPT'ye gönderilecek master prompt

```text
Eklediğim üç Artmonia referans görselini Higgsfield connector/MCP kullanarak üç ayrı premium website videosuna dönüştür.

İşlem şekli:

1. Önce Higgsfield workspaces ve balance durumunu kontrol et. Ücretli/unlimited workspace varsa onu seç. Unlimited aktif değilse toplam maliyeti üretimden önce bildir; yeterli kredi yoksa job başlatma.
2. Üç referans görseli yükleyip doğrula.
3. Aşağıdaki üç videoyu ayrı job olarak, yeniden onay istemeden toplu şekilde üret.
4. Job'ları tamamlanana kadar takip et.
5. Tamamlanan her videonun generation ID'sini, modelini, teknik özelliklerini ve doğrudan indirilebilir raw MP4 URL'sini ver.
6. Çıktılarda yazı, altyazı, logo, watermark veya ses olmasın. Websitedeki metinler HTML/CSS ile ayrıca eklenecek.
7. Videolar sert kesme, fade-to-black veya ani kamera hareketi içermesin. İlk ve son kare birbirine yakın olsun; videolar loop oynatılacak.

GENEL TEKNİK AYARLAR

- Format: MP4
- Aspect ratio: 16:9
- Resolution: 1080p
- Audio: false / silent
- Bitrate: high
- Frame rate: modelin doğal 24 veya 30 fps çıktısı
- Count: her sahne için 1
- Görüntü sabitliği: yüksek
- Hareket: yavaş, kontrollü ve premium
- Website background kullanımına uygun
- Mobil crop için ana öğeler merkez güvenli alan içinde kalmalı

VİDEO 1 — HERO / CREATION SPARK

Referans: artmonia-hero-creation-poster.png
Tercih edilen model: Seedance 2.0
Fallback: Cinema Studio Video 3.0, ardından Kling 3.0
Süre: 8 saniye
Seedance ayarları: mode=std, resolution=1080p, bitrate_mode=high, genre=epic, generate_audio=false
Media role: start_image. Model izin verirse aynı görseli end_image olarak da kullanarak loop devamlılığını güçlendir.
Çıktı adı: artmonia-hero-premium.mp4

Prompt:
"Premium cinematic Artmonia Academy website hero loop. Preserve the exact composition and realistic anatomy of the supplied reference image: two human hands approach slowly from opposite sides through monumental luminous clouds. The fingertips move subtly closer as a refined violet and warm amber creative-energy nucleus blooms between them, releasing microscopic pigment particles, elegant golden sketch lines and restrained refracted light. Natural cloud drift, sophisticated atmospheric parallax and a very slow controlled camera push-in. Luxurious editorial fine-art direction, soft volumetric lighting, stable hands, stable fingers, clean anatomy and consistent composition. Keep both hands and the energy nucleus inside the central mobile-safe area. End close to the opening composition for a seamless loop. No text, no logo, no watermark, no extra fingers, no malformed hands, no scene cut, no fade to black, no aggressive zoom, no audio."

VİDEO 2 — JOURNEY / LINE TO ART

Referans: artmonia-line-to-art-poster.png
Tercih edilen model: Seedance 2.0
Fallback: Cinema Studio Video 3.0, ardından Kling 3.0
Süre: 7 saniye
Seedance ayarları: mode=std, resolution=1080p, bitrate_mode=high, genre=drama, generate_audio=false
Media role: start_image. Model izin verirse aynı görseli end_image olarak da kullan.
Çıktı adı: artmonia-journey-premium.mp4

Prompt:
"Premium cinematic art-transformation loop based on the supplied deep navy portrait composition. Preserve the female artistic portrait on the right and the generous dark negative space on the left for website typography. Fine graphite construction lines, violet pigment threads and warm amber particles travel gracefully across the canvas, subtly completing and refining the portrait without changing her identity or composition. Delicate brush texture movement, microscopic pigment drift, elegant layered parallax and a slow lateral camera move. Rich museum-grade navy, violet and amber palette, controlled highlights, tactile paper and paint texture. Keep the left side calm and readable; keep the portrait inside the right-side mobile-safe area. Return close to the opening composition for a seamless loop. No text, no logo, no watermark, no face morphing, no distorted anatomy, no scene cut, no fade to black, no flashing light, no audio."

VİDEO 3 — ATELIER / FUTURE STUDIO

Referans: artmonia-future-atelier-poster.png
Tercih edilen model: Cinema Studio Video 3.0
Fallback: Seedance 2.0, ardından Kling 3.0
Süre: 6 saniye
Cinema Studio ayarları: resolution=1080p, genre=drama, generate_audio=false
Media role: start_image. Model izin verirse aynı görseli end_image olarak da kullan.
Çıktı adı: artmonia-atelier-premium.mp4

Prompt:
"Cinema-grade futuristic fine-art atelier loop based on the supplied studio reference. Preserve the exact room layout, easels, canvases, classical sculpture and warm window composition. Soft sunlight shafts and dust motes drift slowly through the space; translucent canvas fabric moves almost imperceptibly; restrained violet and warm amber creative particles trace elegant paths around the easels and sculpture. Very slow cinematic dolly-in, subtle depth parallax, premium natural materials, atmospheric volumetric light and sophisticated editorial color. Keep the left side darker and calm for a large website CTA; retain the bright atelier depth on the right. No people entering, no object morphing, no changing architecture. End close to the opening frame for a seamless loop. No text, no logo, no watermark, no scene cut, no fade to black, no camera shake, no audio."

KALİTE KONTROLÜ VE RETRY KURALI

- Her sonuçta eller, yüz, oda geometrisi ve ana kompozisyonu kontrol et.
- Anatomy, face, scene geometry veya composition bozulursa o job'ı bir kez aynı premium modelle daha düşük motion intensity ve daha güçlü reference adherence talimatıyla tekrar üret.
- İlk premium model entitlement nedeniyle reddedilirse belirtilen fallback sırasına geç.
- 1080p yerine otomatik olarak 480p/720p'ye düşürme. Böyle bir fallback gerekiyorsa üretimi durdurup bildir.
- Üç job tamamlanınca sonuçları Hero, Journey ve Atelier başlıkları altında ayrı ayrı sun.
```

## Siteye teslim için gerekli dosyalar

ChatGPT'den üç MP4 dosyasını veya doğrudan indirilebilir `rawUrl` değerlerini isteyin:

- `artmonia-hero-premium.mp4`
- `artmonia-journey-premium.mp4`
- `artmonia-atelier-premium.mp4`

Dosyalar geldikten sonra aşağıdaki site slotlarına bağlanacaktır:

- Hero → `videoExperience.hero.src`
- Scroll-film → `videoExperience.journey.src`
- Footer CTA → `videoExperience.atelier.src`
