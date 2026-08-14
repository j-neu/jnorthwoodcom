# jnorthwood.com Single Author Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static single-page author site for Jonathan Northwood (cognitive dismantling, procrastination, making and breaking habits) with an ellipsus.com-derived design, all prose sourced from editable markdown files, deployable to Cloudflare Pages.

**Architecture:** Astro 5 static site. Five markdown files form a `site` content collection (`src/content/site/`); one Astro component per page section reads its entry and renders it. Global CSS holds design tokens (colors/type/spacing from the spec); shared button, container, and scroll-reveal classes live in global.css. Minimal vanilla JS (IntersectionObserver) powers scroll reveals.

**Tech Stack:** Astro 5, TypeScript, `@fontsource-variable/manrope` + `@fontsource-variable/newsreader` (self-hosted fonts), Cloudflare Pages (build `npm run build`, output `dist`), git.

## Global Constraints

- Prose for every section lives ONLY in `src/content/site/*.md` — never hardcoded in components. Editing a markdown file + git push updates the deployed site.
- Design tokens and values come verbatim from `docs/superpowers/specs/2026-08-14-jnorthwood-site-design.md` (colors `#f4f4f2`, `#292a2e`, `#0c0d0d`, `#282825`, `#fbfbf9`, `#2173be`; display type Newsreader weight 300; body Manrope; buttons radius 12px).
- Voice: professional, scientific, declarative. No hype, no emoji.
- Project URLs: `https://procrastitype.jnorthwood.com` and `https://cognitivedismantling.com`. Contact: `info@jnorthwood.com`.
- Node >= 20. Astro 5. No runtime JS framework.
- Verification commands: `npm run build` (must succeed), `npm run check` (must pass), `node scripts/verify.mjs` (final gate: built HTML must contain the expected strings).

---

### Task 1: Project scaffold, global styles, layout

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`
- Create: `public/scripts/reveal.js`
- Create: `src/pages/index.astro` (temporary placeholder, replaced in Task 3)

**Interfaces:**
- Produces: global CSS classes `.container`, `.inner`, `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--inverted`, `[data-reveal]`; CSS custom properties `--color-*`, `--font-display`, `--font-body`, `--radius-m`, `--spacing-m`, `--spacing-l`, `--container-max`; `BaseLayout` accepting props `title: string` and `description: string`; script served at `/scripts/reveal.js` that adds `.is-revealed` to `[data-reveal]` elements when scrolled into view.
- Consumes: nothing.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "jnorthwood-com",
  "type": "module",
  "version": "1.0.0",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check"
  },
  "dependencies": {
    "@fontsource-variable/manrope": "^5.2.5",
    "@fontsource-variable/newsreader": "^5.2.5",
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jnorthwood.com',
  output: 'static',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/base",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/styles/global.css`**

```css
:root {
  --color-surface-primary: #f4f4f2;
  --color-surface-light: #f8f8f7;
  --color-surface-dim: #ecece9;
  --color-surface-inverted: #020203;
  --color-surface-hero: #292a2e;
  --color-surface-footer: #0c0d0d;
  --color-content-primary: #282825;
  --color-content-secondary: #64645e;
  --color-content-inverted: #fbfbf9;
  --color-border-primary: #282825;
  --color-border-tertiary: #c5c5ba;
  --color-accent: #2173be;
  --radius-m: 12px;
  --spacing-m: 0.75rem;
  --spacing-l: 1rem;
  --container-max: 82rem;
  --font-display: 'Newsreader Variable', Georgia, 'Times New Roman', serif;
  --font-body: 'Manrope Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

html {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--color-surface-primary);
  color: var(--color-content-primary);
  font-family: var(--font-body);
  font-size: 100%;
  line-height: 1.5;
}

.container {
  width: 100%;
  padding: 0 1.5rem;
  box-sizing: border-box;
}
@media (min-width: 720px) { .container { padding: 0 2.5rem; } }
@media (min-width: 1024px) { .container { padding: 0 5rem; } }

.inner {
  position: relative;
  max-width: var(--container-max);
  margin: 0 auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-m) var(--spacing-l);
  border-radius: var(--radius-m);
  border: 1px solid transparent;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.125rem;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s;
}
.btn--primary { background: #0c0d0d; color: #fff; }
.btn--primary:hover { background: #55565e; }
.btn--secondary { background: transparent; border-color: var(--color-border-primary); color: var(--color-content-primary); }
.btn--secondary:hover { background: var(--color-surface-dim); }
.btn--inverted { background: #fff; color: #0c0d0d; }
.btn--inverted:hover { background: #ecece9; }

[data-reveal] {
  opacity: 0;
  transform: translateY(2.5rem);
  transition: opacity 0.4s linear, transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: var(--delay, 0ms);
}
[data-reveal].is-revealed { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 5: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '@fontsource-variable/manrope';
import '@fontsource-variable/newsreader';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <slot />
    <script is:inline src="/scripts/reveal.js"></script>
  </body>
</html>
```

- [ ] **Step 6: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#0c0d0d"/>
  <text x="16" y="23" font-family="Georgia, serif" font-size="20" fill="#fbfbf9" text-anchor="middle">J</text>
</svg>
```

- [ ] **Step 7: Create `public/scripts/reveal.js`**

```js
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  els.forEach((el) => io.observe(el));
})();
```

- [ ] **Step 8: Create temporary `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Jonathan Northwood" description="Temporary placeholder page.">
  <h1>Placeholder</h1>
</BaseLayout>
```

- [ ] **Step 9: Install dependencies and verify build**

Run: `npm install`
Expected: install completes without error.

Run: `npm run build`
Expected: build succeeds, `dist/index.html` is produced.

Run: `npm run check`
Expected: no type errors.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: scaffold Astro site with global styles, layout, fonts"
```

---

### Task 2: Markdown content collection with all prose

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/site/hero.md`
- Create: `src/content/site/expertise.md`
- Create: `src/content/site/projects.md`
- Create: `src/content/site/coming-soon.md`
- Create: `src/content/site/footer.md`
- Create: `scripts/verify.mjs`

**Interfaces:**
- Consumes: `package.json` from Task 1.
- Produces: content collection `site` whose entries have `id`s `hero`, `expertise`, `projects`, `coming-soon`, `footer`. Entry data shape: `{ title, eyebrow?, intro?, headline?, note?, email?, name?, buttons?: {label, href, variant?}[], items?: {name, body}[], projects?: {name, url, tagline, description}[] }`. Each entry supports `.render()` → `{ Content }`. Script `node scripts/verify.mjs` exits 0 when `dist/index.html` contains all required strings, exits 1 otherwise. This script is the end-to-end acceptance gate and only passes fully after Task 5.

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const site = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.object({
    title: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    headline: z.string().optional(),
    note: z.string().optional(),
    email: z.string().optional(),
    name: z.string().optional(),
    buttons: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          variant: z.enum(['primary', 'secondary', 'inverted']).optional(),
        })
      )
      .optional(),
    items: z
      .array(
        z.object({
          name: z.string(),
          body: z.string(),
        })
      )
      .optional(),
    projects: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          tagline: z.string(),
          description: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { site };
```

- [ ] **Step 2: Create `src/content/site/hero.md`**

```markdown
---
title: Hero
headline: Jonathan Northwood
buttons:
  - label: Explore the projects
    href: '#projects'
    variant: inverted
  - label: Coming soon
    href: '#coming-soon'
    variant: inverted
---
An expert on cognitive dismantling, procrastination, and making and breaking habits.
```

- [ ] **Step 3: Create `src/content/site/expertise.md`**

```markdown
---
title: Expertise
eyebrow: Areas of expertise
intro: Research and practical methods applied to the mechanics of behaviour — how avoidance compounds, and how deliberate restructuring dissolves it.
items:
  - name: Cognitive dismantling
    body: A systematic method for breaking any habit by taking it apart step by step — identifying its triggers, rewards, and feedback loops, and disassembling each in turn.
  - name: Procrastination
    body: Why we avoid, when avoidance becomes a pattern, and how to interrupt the cycle at its source rather than manage its symptoms.
  - name: Making and breaking habits
    body: The underlying structure of habit formation — how habits are built, how they are broken, and how the two processes inform one another.
---
```

- [ ] **Step 4: Create `src/content/site/projects.md`**

```markdown
---
title: Projects
eyebrow: Projects
projects:
  - name: Procrastitype
    url: https://procrastitype.jnorthwood.com
    tagline: Find out what type of procrastinator you are.
    description: A diagnostic tool that maps your procrastination profile to a recognised type, with targeted, evidence-informed strategies for each.
  - name: Cognitive Dismantling
    url: https://cognitivedismantling.com
    tagline: Break any habit by taking it apart, step by step.
    description: A structured, step-by-step method for breaking any habit by taking it apart — trigger by trigger, loop by loop.
---
```

- [ ] **Step 5: Create `src/content/site/coming-soon.md`**

```markdown
---
title: Coming soon
eyebrow: Coming soon
name: Cognitive Construction
---
Build habits that last by reversing cognitive dismantling. Where dismantling disassembles a habit into its parts, construction assembles one from the ground up — designed to endure because it is built on the same mechanics, in reverse.
```

- [ ] **Step 6: Create `src/content/site/footer.md`**

```markdown
---
title: Footer
note: Research, writing, and practical methods on the science of behaviour change.
email: info@jnorthwood.com
---
```

- [ ] **Step 7: Create `scripts/verify.mjs`**

```js
import { readFileSync, existsSync } from 'node:fs';

const file = 'dist/index.html';
if (!existsSync(file)) {
  console.error('dist/index.html not found — run npm run build first.');
  process.exit(1);
}

const html = readFileSync(file, 'utf8');
const required = [
  'Jonathan Northwood',
  'Cognitive Dismantling',
  'procrastitype.jnorthwood.com',
  'cognitivedismantling.com',
  'Cognitive Construction',
  'info@jnorthwood.com',
];
const missing = required.filter((s) => !html.includes(s));
if (missing.length) {
  console.error('Missing content in built HTML:', missing.join(', '));
  process.exit(1);
}
console.log('Built HTML contains all required content.');
```

- [ ] **Step 8: Add verify script to `package.json`**

In `package.json`, replace the `"check"` script line with:

```json
    "check": "astro check",
    "verify": "node scripts/verify.mjs"
```

- [ ] **Step 9: Verify content collection compiles**

Run: `npm run build`
Expected: build succeeds — frontmatter in all five markdown files validates against the schema (any schema mismatch fails the build). Note: the placeholder index page still renders; the new content is not yet displayed.

Run: `npm run check`
Expected: no type errors.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: add markdown content collection with all site prose"
```

---

### Task 3: Index page, navigation, hero

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro` (replace placeholder with real layout)

**Interfaces:**
- Consumes: `BaseLayout` (Task 1), `site` collection entries `hero` (Task 2).
- Produces: `Nav` (no props), `Hero` (no props). `Hero` renders `hero.data.headline` as an `h1`, the markdown body via `<Content />` as a `div.statement`, and `hero.data.buttons` as buttons.

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
---
<header class="nav">
  <div class="container">
    <div class="inner nav-inner">
      <a class="wordmark" href="#top">Jonathan Northwood</a>
      <nav class="links" aria-label="Page navigation">
        <a href="#expertise">Expertise</a>
        <a href="#projects">Projects</a>
        <a href="#coming-soon">Coming soon</a>
      </nav>
    </div>
  </div>
</header>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 200;
    background: var(--color-surface-primary);
    border-bottom: 1px solid var(--color-border-tertiary);
  }
  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
  }
  .wordmark {
    font-family: var(--font-display);
    font-size: 1.25rem;
    color: var(--color-content-primary);
    text-decoration: none;
  }
  .links {
    display: flex;
    gap: 1.5rem;
  }
  .links a {
    font-size: 0.875rem;
    color: var(--color-content-secondary);
    text-decoration: none;
    text-underline-offset: 0.25rem;
    transition: color 0.3s;
  }
  .links a:hover {
    color: var(--color-accent);
    text-decoration: underline;
  }
  @media (max-width: 640px) {
    .links { display: none; }
  }
</style>
```

- [ ] **Step 2: Create `src/components/Hero.astro`**

```astro
---
import { getCollection, render } from 'astro:content';

const entry = (await getCollection('site')).find((e) => e.id === 'hero')!;
const { headline, buttons } = entry.data;
const { Content } = await render(entry);
---
<section id="top" class="hero">
  <div class="container">
    <div class="inner hero-inner">
      <h1 class="display" data-reveal>{headline}</h1>
      <div class="statement" data-reveal style="--delay:150ms">
        <Content />
      </div>
      <div class="actions" data-reveal style="--delay:300ms">
        {buttons?.map((b) => (
          <a
            class:list={['btn', `btn--${b.variant ?? 'inverted'}`]}
            href={b.href}
          >
            {b.label}
          </a>
        ))}
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(180deg, #292a2e, #464669);
    color: var(--color-content-inverted);
    min-height: 100svh;
    display: flex;
    align-items: center;
    padding: 5rem 0;
  }
  .hero-inner { max-width: 62rem; }
  .display {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(3rem, 8vw, 6rem);
    line-height: 1.05;
    margin: 0 0 1.5rem;
  }
  .statement {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    line-height: 1.4;
    max-width: 32rem;
    color: #d7d7dc;
  }
  .statement :global(p) { margin: 0; }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2.5rem;
  }
</style>
```

- [ ] **Step 3: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout
  title="Jonathan Northwood"
  description="Jonathan Northwood — research and practical methods on cognitive dismantling, procrastination, and making and breaking habits."
>
  <Nav />
  <main id="top">
    <Hero />
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify build and hero content**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` contains "Jonathan Northwood" and "An expert on cognitive dismantling" (rendered from the markdown body).

Run: `npm run check`
Expected: no type errors.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add navigation and hero sections rendered from markdown"
```

---

### Task 4: Expertise and Projects sections

**Files:**
- Create: `src/components/Expertise.astro`
- Create: `src/components/Projects.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site` collection entries `expertise` and `projects` (Task 2), `.container`/`.inner`/`[data-reveal]` classes (Task 1).
- Produces: `Expertise` (no props) and `Projects` (no props). `Projects` links each project to `projects.data.projects[].url` in a new tab (`target="_blank" rel="noopener"`).

- [ ] **Step 1: Create `src/components/Expertise.astro`**

```astro
---
import { getCollection } from 'astro:content';

const entry = (await getCollection('site')).find((e) => e.id === 'expertise')!;
const { eyebrow, intro, items } = entry.data;
---
<section id="expertise" class="expertise">
  <div class="container">
    <div class="inner">
      {eyebrow && <p class="eyebrow" data-reveal>{eyebrow}</p>}
      {intro && <p class="intro" data-reveal style="--delay:120ms">{intro}</p>}
      <div class="grid">
        {items?.map((item, i) => (
          <article class="card" data-reveal style={`--delay:${i * 150}ms`}>
            <h2 class="card-title">{item.name}</h2>
            <p class="card-body">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  </div>
</section>

<style>
  .expertise { padding: 8rem 0; }
  .eyebrow {
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-content-secondary);
    margin: 0 0 1rem;
  }
  .intro {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    line-height: 1.25;
    max-width: 45rem;
    margin: 0 0 4rem;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 2rem;
  }
  .card {
    background: var(--color-surface-light);
    border: 1px solid var(--color-border-tertiary);
    border-radius: 1rem;
    padding: 2rem;
  }
  .card-title {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 1.75rem;
    margin: 0 0 0.75rem;
  }
  .card-body {
    color: var(--color-content-secondary);
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Create `src/components/Projects.astro`**

```astro
---
import { getCollection } from 'astro:content';

const entry = (await getCollection('site')).find((e) => e.id === 'projects')!;
const { eyebrow, projects } = entry.data;
---
<section id="projects" class="projects">
  <div class="container">
    <div class="inner">
      {eyebrow && <p class="eyebrow" data-reveal>{eyebrow}</p>}
      <div class="list">
        {projects?.map((p, i) => (
          <a
            class="card"
            href={p.url}
            target="_blank"
            rel="noopener"
            data-reveal
            style={`--delay:${i * 150}ms`}
          >
            <div>
              <h2 class="card-title">{p.name}</h2>
              <p class="tagline">{p.tagline}</p>
              <p class="body">{p.description}</p>
            </div>
            <span class="arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </div>
  </div>
</section>

<style>
  .projects {
    background: var(--color-surface-inverted);
    color: var(--color-content-inverted);
    padding: 8rem 0;
  }
  .eyebrow {
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #8f8f89;
    margin: 0 0 3rem;
  }
  .list { display: grid; gap: 1.5rem; }
  .card {
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    background: #1d1e20;
    border: 1px solid #32332f;
    border-radius: 1rem;
    padding: 2.5rem;
    color: inherit;
    text-decoration: none;
    transition: background-color 0.3s, border-color 0.3s;
  }
  .card:hover {
    background: #222325;
    border-color: var(--color-accent);
  }
  .card-title {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    margin: 0 0 0.5rem;
  }
  .tagline { color: #bdbdbd; margin: 0 0 1rem; }
  .body { color: #8f8f89; margin: 0; max-width: 40rem; }
  .arrow { font-size: 1.5rem; }
</style>
```

- [ ] **Step 3: Update `src/pages/index.astro`**

Replace the file with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Expertise from '../components/Expertise.astro';
import Projects from '../components/Projects.astro';
---
<BaseLayout
  title="Jonathan Northwood"
  description="Jonathan Northwood — research and practical methods on cognitive dismantling, procrastination, and making and breaking habits."
>
  <Nav />
  <main id="top">
    <Hero />
    <Expertise />
    <Projects />
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify build and project content**

Run: `npm run build`
Expected: build succeeds; `dist/index.html` contains "Procrastitype", `https://procrastitype.jnorthwood.com`, "Cognitive Dismantling", and `https://cognitivedismantling.com`.

Run: `npm run check`
Expected: no type errors.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add expertise and projects sections rendered from markdown"
```

---

### Task 5: Coming soon and footer sections

**Files:**
- Create: `src/components/ComingSoon.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `site` collection entries `coming-soon` and `footer` (Task 2).
- Produces: `ComingSoon` (no props) rendering `name` as an `h2` and the markdown body via `<Content />` in a `div.prose`; `Footer` (no props) rendering `note`, `email` as a `mailto:` link, and a copyright line.

- [ ] **Step 1: Create `src/components/ComingSoon.astro`**

```astro
---
import { getCollection, render } from 'astro:content';

const entry = (await getCollection('site')).find((e) => e.id === 'coming-soon')!;
const { eyebrow, name } = entry.data;
const { Content } = await render(entry);
---
<section id="coming-soon" class="coming">
  <div class="container">
    <div class="inner">
      {eyebrow && <p class="eyebrow" data-reveal>{eyebrow}</p>}
      <h2 class="title" data-reveal>{name}</h2>
      <div class="prose" data-reveal style="--delay:120ms">
        <Content />
      </div>
    </div>
  </div>
</section>

<style>
  .coming { padding: 8rem 0; }
  .eyebrow {
    text-transform: uppercase;
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-content-secondary);
    margin: 0 0 1rem;
  }
  .title {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    margin: 0 0 1.5rem;
  }
  .prose {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    line-height: 1.45;
    max-width: 40rem;
    color: var(--color-content-secondary);
  }
  .prose :global(p) { margin: 0; }
</style>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
import { getCollection } from 'astro:content';

const entry = (await getCollection('site')).find((e) => e.id === 'footer')!;
const { note, email } = entry.data;
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="container">
    <div class="inner footer-inner">
      {note && <p class="note">{note}</p>}
      <p class="email">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      <p class="legal">© {year} Jonathan Northwood</p>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: #0c0d0d;
    color: #fbfbf9;
    padding: 6.875rem 0 3.375rem;
  }
  .footer-inner {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .note { color: #8f8f89; margin: 0; max-width: 30rem; }
  .email { margin: 0; }
  .email a {
    color: #fbfbf9;
    text-underline-offset: 0.25rem;
    transition: color 0.3s;
  }
  .email a:hover { color: #6ab8ff; }
  .legal {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8f8f89;
    margin: 2rem 0 0;
  }
</style>
```

- [ ] **Step 3: Update `src/pages/index.astro`**

Replace the file with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import Expertise from '../components/Expertise.astro';
import Projects from '../components/Projects.astro';
import ComingSoon from '../components/ComingSoon.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout
  title="Jonathan Northwood"
  description="Jonathan Northwood — research and practical methods on cognitive dismantling, procrastination, and making and breaking habits."
>
  <Nav />
  <main id="top">
    <Hero />
    <Expertise />
    <Projects />
    <ComingSoon />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 4: Run the end-to-end verification gate**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run check`
Expected: no type errors.

Run: `npm run verify`
Expected: `Built HTML contains all required content.` and exit code 0 — confirms all prose from the markdown files (project names/URLs, Cognitive Construction, contact email) is present in the built HTML.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add coming soon and footer sections; full page assembled"
```

---

### Task 6: Cloudflare Pages config, README, final polish

**Files:**
- Create: `README.md`
- Modify: `public/favicon.svg` (if desired — optional; skip unless a design adjustment is wanted)
- Create: `wrangler.toml` (optional Cloudflare Pages config — only needed if using Wrangler preview; Cloudflare Pages git integration reads build settings from the dashboard or `.toml`)

**Interfaces:**
- Consumes: final site from Task 5.
- Produces: documentation and Cloudflare deployment config so the repo deploys correctly when connected to Cloudflare Pages.

- [ ] **Step 1: Create `README.md`**

```markdown
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
```

- [ ] **Step 2: Create `wrangler.toml`**

```toml
name = "jnorthwood-com"
compatibility_date = "2026-08-14"
pages_build_output_dir = "dist"

[build]
command = "npm run build"
```

- [ ] **Step 3: Final verification pass**

Run: `npm run build && npm run check && npm run verify`
Expected: build succeeds, no type errors, `Built HTML contains all required content.`

- [ ] **Step 4: Review the rendered page**

Run: `npm run dev` (or `npm run preview`), open the local URL, and confirm:
- Sticky nav with wordmark and section links
- Dark hero with name, statement, two buttons
- Expertise cards (3)
- Dark projects section with both project cards linking to real URLs
- Coming soon section
- Footer with email link and copyright
- Scroll-reveal animations work and respect `prefers-reduced-motion`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "docs: add README and Cloudflare Pages config"
```

---

## Self-Review Checklist

1. **Spec coverage:** Every section of the spec maps to a task — scaffold/design tokens (Task 1), content model with five markdown files (Task 2), nav/hero (Task 3), expertise/projects (Task 4), coming soon/footer (Task 5), deployment config/README (Task 6). Acceptance criteria covered: prose editable via markdown (Task 2 + components reading the collection), both project URLs rendered (Task 4), coming soon present (Task 5), contact email in footer (Task 5), Cloudflare Pages config (Task 6), git repo already initialized.
2. **Placeholder scan:** The only placeholder is the Task 1 temporary `index.astro`, explicitly replaced in Task 3. No TBD/TODO.
3. **Type consistency:** `buttons[].variant` uses `'primary' | 'secondary' | 'inverted'` in both the schema (Task 2) and the `class:list` template literal in Hero (Task 3). Entry ids `hero`, `expertise`, `projects`, `coming-soon`, `footer` match the filenames in Task 2 and the `find((e) => e.id === ...)` lookups in Tasks 3–5. `BaseLayout` props `title`/`description` match usage in all `index.astro` versions.

