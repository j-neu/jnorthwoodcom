# jnorthwood.com

Single author page for Jonathan Northwood — cognitive dismantling, procrastination,
and making and breaking habits.

## Local development

- `npm install`
- `npm run dev` — dev server
- `npm run build` — static build to `dist/`
- `npm run check` — type check
- `npm run verify` — assert built HTML contains all required content

## Editing site content

All prose lives in `src/content/site/*.md`:

| File | Section |
|---|---|
| `hero.md` | Hero headline, statement, CTA buttons |
| `expertise.md` | Expertise eyebrow, intro, three topic cards |
| `projects.md` | Project cards (name, tagline, description, URL) |
| `coming-soon.md` | Cognitive Construction announcement |
| `footer.md` | Footer note and contact email |

Edit the markdown, commit, and push — Cloudflare Pages rebuilds and deploys
automatically.

## Deployment

Connected to Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20+
