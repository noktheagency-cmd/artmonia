# Artmonia Classic Next

Modern-classical Artmonia Academy frontend concept built with Next.js + React.

## What is included

- Responsive homepage architecture for desktop and mobile.
- Editorial atelier style inspired by the supplied reference image.
- Sections from the Artmoniya audit PDF: hero, problem, transformations, courses, studio, results, curriculum, diagnostic quiz, pricing, comparison, calculator, teachers, resources, future auth/kabinet notes, FAQ, lead form, privacy and footer.
- Frontend-only local interactions: mobile menu, diagnostic quiz, price calculator, FAQ accordion, lead form success state.
- No backend login/register implementation. Auth, kabinet and admin are documented as future frontend/backend flows.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Static QA Preview

Because npm registry access was not responding in this environment, a static visual QA preview is included:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/preview.html`.
