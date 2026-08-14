# jnorthwood.com — Single Author Page Design Spec

Date: 2026-08-14
Status: Approved by user

## 1. Purpose

A single-page author site for Jonathan Northwood — researcher/expert in cognitive
dismantling, procrastination, and making and breaking habits. The page presents his
expertise, links to two existing projects, and a coming-soon announcement for a third.

The site is a static build deployed to Cloudflare Pages. All prose is authored in
standalone markdown files that can be manually edited; the page renders from those
files, so a markdown edit pushed to git automatically rebuilds and updates the site.

## 2. Stack

- **Astro 5** static site (content collections for markdown prose)
- Deployed to **Cloudflare Pages** (git-connected, auto-rebuild on push)
- No JS framework runtime; minimal vanilla JS for scroll-reveal if needed
- Version control: git (initialized at repo root)

## 3. Content model

Markdown files under `src/content/site/` (an Astro content collection), one file per
page section. Each file has frontmatter for structured data (headline, links, CTAs,
buttons) and a markdown body for prose. Editing the body of any file and pushing
updates the rendered section.

Files:

| File | Supplies |
|---|---|
| `src/content/site/hero.md` | Hero headline, one-line position statement, CTA buttons |
| `src/content/site/expertise.md` | Display-statement paragraphs on the three expertises |
| `src/content/site/projects.md` | Project cards: name, description, URL |
| `src/content/site/coming-soon.md` | Cognitive Construction announcement |
| `src/content/site/footer.md` | Contact email, footer links/note |

Any prose written for the site lives in these files and nowhere else.

## 4. Page structure (single page)

1. **Sticky nav** — wordmark "Jonathan Northwood"; links to Expertise / Projects / Coming soon
2. **Hero** (dark `#292a2e`) — name, one-line position statement, CTA buttons
3. **Expertise** — short display-statement paragraphs:
   - procrastination
   - cognitive dismantling
   - making and breaking habits
4. **Projects** — two cards:
   - **Procrastitype** — procrastitype.jnorthwood.com (figure out what type of procrastinator you are)
   - **Cognitive Dismantling** — cognitivedismantling.com (break any habit by taking it apart step by step)
5. **Coming soon** — **Cognitive Construction**: build habits that last by reversing cognitive dismantling
6. **Footer** (dark) — contact email **info@jnorthwood.com**, project links

## 5. Visual language (derived from ellipsus.com)

### Colors

Light theme:

| Token | Value |
|---|---|
| `--color-surface-primary` | `#f4f4f2` (page base, navbar) |
| `--color-surface-light` | `#f8f8f7` |
| `--color-surface-dim` | `#ecece9` |
| `--color-surface-inverted` | `#020203` |
| `--color-content-primary` | `#282825` |
| `--color-content-secondary` | `#64645e` |
| `--color-border-primary` | `#282825` |
| `--color-border-tertiary` | `#c5c5ba` |

Fixed section colors: hero `#292a2e` (gradient toward `#464669`), footer/primary
button `#0c0d0d`, footer text `#fbfbf9`, statement section `#e5e5e1`.

Accent: scientific blue `#2173be` for links/hover emphasis.

### Typography

- **Display/headings:** Newsreader (stand-in for Roslindale Display Narrow), weight 300, sizes `clamp(2.5rem, 7vw, 6rem)` scale, no letter-spacing, serif.
- **Body/UI:** Manrope, 400/500/700. Base `1rem`; small labels `0.875rem` uppercase for footer/legal/eyebrows.
- `-webkit-font-smoothing: antialiased; text-rendering: optimizelegibility`.

### Components

- **Buttons:** `border-radius: 12px`, padding `.75rem 1rem`, `font-size: 1rem`, weight 500, `transition .3s`.
  - Primary: bg `#0c0d0d`, text `#fff`, hover bg `#55565e`.
  - Secondary: transparent, `1px solid #282825`, text `#282825`, hover bg `#ecece9`.
  - Inverted (on dark): border/text `#fff`.
- **Links:** underline on hover (`text-underline-offset: .25rem`, `.3s` transition), accent blue.
- **Containers:** content column `max-width: 82rem; margin: 0 auto`; page padding `0 1.5rem` mobile → `0 5rem` desktop.
- **Spacing:** hero `padding: 5rem 0; min-height: 100svh`; large section gaps in the `4rem–12.5rem` range; `max-width` text lines kept readable.
- **Motion:** subtle scroll-reveal — `opacity: 0; translateY(2.5rem)` → fade/slide in with per-element `--delay`; no autoplay video.

## 6. Voice

Professional and scientific: declarative, precise, no hype. Third-person descriptive
prose in the expertise section; plain functional microcopy for CTAs.

## 7. Content details (prose seed)

Draft prose is written directly into the markdown content files. Frontmatter carries
URLs and labels so links remain editable.

- Hero headline: Jonathan Northwood
- Hero statement: expert on cognitive dismantling, procrastination, and making and breaking habits
- Project 1: **Procrastitype** — procrastitype.jnorthwood.com — "Find out what type of procrastinator you are."
- Project 2: **Cognitive Dismantling** — cognitivedismantling.com — "Break any habit by taking it apart, step by step."
- Coming soon: **Cognitive Construction** — "Build habits that last by reversing cognitive dismantling."
- Contact: info@jnorthwood.com

## 8. Acceptance criteria

- [ ] Single-page site renders all sections above with the ellipsus-derived design
- [ ] All prose editable via markdown files in `src/content/site/`; edits + git push update the deployed site
- [ ] Both project links resolve to the real destinations
- [ ] Coming soon section present with Cognitive Construction copy
- [ ] Contact email info@jnorthwood.com in footer
- [ ] Deployable to Cloudflare Pages via git connection
- [ ] Repo initialized with git; committed to source control
