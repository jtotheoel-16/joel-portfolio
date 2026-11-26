# Joel Kennedy — Portfolio

Static portfolio site built with **Vite + vanilla TypeScript**, **GSAP/ScrollTrigger** for build-in motion and **Lenis** for smooth scrolling. `npm run build` outputs plain HTML/CSS/JS in `dist/`, which runs on any static host.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

## Structure

```
index.html                 page markup (all content lives here)
src/main.ts                boots everything
src/styles/tokens.css      colors, type, spacing, easing (desktop overrides ≥768px)
src/styles/sections.css    header, hero, case studies, about, bites, footer, cursor
src/modules/               smoothScroll, reveal, heroPills, nav (mobile menu), cursor, bites (drag)
public/                    fonts, images, video (served as-is)
```

- Case-study cards use `data-cursor="Label ↗"` for the hover cursor. Their `href="#"` is a placeholder until the case-study pages exist.
- Anything with `data-reveal` animates in on scroll; `data-reveal-stagger` staggers its children.
- Motion turns off automatically for visitors with *Reduce motion* enabled.

## Deploy

**Vercel (testing):** import the repo in Vercel. The framework preset is *Vite*, the build command is `npm run build`, and the output directory is `dist`.

**Bluehost (production):** run `npm run build`, then upload the **contents** of `dist/` into `public_html/` (or a subfolder) with File Manager or SFTP. Asset paths are relative, so the site works from a subfolder too.
