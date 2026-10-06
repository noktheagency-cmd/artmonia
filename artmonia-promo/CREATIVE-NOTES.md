# Artmonia Academy — launch film

36 seconds · 1920 × 1080 · 16:9 · 60 fps · Azerbaijani

The six scenes introduce Artmonia, reveal the live homepage, introduce three course categories, highlight the free drawing lesson, show the site on desktop and mobile, and close with “Ödənişsiz dərsə bax”.

The design uses generous whitespace, large typography, purple accents, restrained light, soft motion, and short dissolves. Website images, course artwork and the official logo were captured from https://artmoniya-academy-web-production.up.railway.app/. The desktop and mobile catalog screens are actual website captures. The lesson card is an animated marketing composition using the website's course artwork. It does not show a recorded lesson.

The stereo soundtrack is originally synthesized by `scripts/create-audio.cjs`, with soft pads, plucked notes, light percussion and transition accents. No third-party music samples or voiceover are used.

All six scenes have their own editable Remotion timelines in the `Scenes` folder. The full video is `Artmonia-Promo`.

Open preview: http://localhost:3100/Artmonia-Promo

Start Studio from this folder:

```powershell
npx.cmd remotion studio --no-open --port=3100
```

If the system drive is full, set the task's temporary paths before starting Studio:

```powershell
$env:TEMP='D:\artmonia\output\tool-temp'
$env:TMP=$env:TEMP
$env:npm_config_cache='D:\artmonia\output\npm-cache'
```

Validation: TypeScript, ESLint, and full-resolution stills from all six scenes. `scripts/verify-frames.cjs` writes inspection frames to `out/frames`. The soundtrack is 36-second, 48 kHz stereo PCM.

MP4 can be exported using Studio's Render action, or:

```powershell
npx.cmd remotion render src/index.ts Artmonia-Promo out/artmonia-promo.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p
```

Typography uses local Segoe UI fonts from the Windows host, including Azerbaijani characters.
