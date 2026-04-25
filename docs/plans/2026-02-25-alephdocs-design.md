# AlephDocs — Documentation Site Design

> Design document for the Aleph documentation website, a standalone Next.js project powered by Fumadocs.

Date: 2026-02-25

---

## 1. Overview

AlephDocs is a standalone documentation website for the Aleph (ℵ) personal AI assistant. It lives at a separate subdomain (e.g., `docs.aleph.xxx`) from the main homepage (`aleph.xxx`), deployed independently on Vercel.

**Goals:**
- Comprehensive technical documentation for Aleph
- Bilingual support (EN/ZH)
- Dark-first design consistent with Aleph brand
- Full-text search, sidebar navigation, table of contents
- Content maintained directly in this project (copied from Aleph's `docs/book/src/`)

---

## 2. Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Project structure | Standalone project (`AlephDocs/`) | Independent deployment on separate subdomain |
| Docs engine | Fumadocs (core + mdx + ui) | Native Next.js App Router, built-in i18n, search, sidebar |
| i18n | fumadocs-core/i18n | Simpler than next-intl for docs; `[lang]` route + per-language content dirs |
| Content source | Copied into project | No external deps; content maintained solely in this repo |
| Styling | Tailwind CSS v4.2 (CSS-first) | Reuse Homepage design tokens; no tailwind.config file |
| Deployment | Vercel | Same platform as Homepage, independent project |

---

## 3. Project Structure

```
AlephDocs/
├── src/
│   ├── app/
│   │   ├── [lang]/
│   │   │   ├── docs/
│   │   │   │   ├── layout.tsx         # Fumadocs DocsLayout (sidebar + TOC)
│   │   │   │   └── [[...slug]]/
│   │   │   │       └── page.tsx       # Fumadocs DocsPage
│   │   │   ├── layout.tsx             # Language layout (fonts, theme, navbar)
│   │   │   └── page.tsx               # Docs landing page (card navigation)
│   │   ├── layout.tsx                 # Root layout (html, body, ThemeProvider)
│   │   └── globals.css                # Tailwind v4 @theme (reuse Homepage palette)
│   ├── components/
│   │   ├── layout/                    # Navbar, Footer
│   │   └── docs/                      # Custom MDX components (Callout, Steps, Tabs)
│   ├── lib/
│   │   ├── source.ts                  # Fumadocs source loader config
│   │   └── i18n.ts                    # i18n config (locales: en, zh)
│   └── middleware.ts                  # Fumadocs i18n middleware
├── content/
│   └── docs/
│       ├── en/                        # English docs (from Aleph book/src/)
│       │   ├── meta.json
│       │   ├── index.mdx
│       │   ├── getting-started/
│       │   ├── architecture/
│       │   ├── gateway/
│       │   ├── interfaces/
│       │   ├── tools/
│       │   ├── security/
│       │   ├── cli/
│       │   ├── development/
│       │   └── api/
│       └── zh/                        # Chinese translations (progressive)
│           ├── meta.json
│           └── ... (mirrors en/ structure)
├── public/
├── next.config.ts                     # fumadocs-mdx plugin
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

---

## 4. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15+ |
| Docs Engine | fumadocs-core + fumadocs-mdx + fumadocs-ui | Latest |
| Styling | Tailwind CSS (CSS-first @theme) | 4.2+ |
| i18n | fumadocs-core/i18n | Built-in |
| Theme | next-themes | Latest |
| Animations | motion (Framer Motion) | Landing page only |
| Code Highlight | Shiki (via Fumadocs) | Built-in |
| Search | Fumadocs built-in search | Built-in |
| Package Manager | pnpm | 9+ |
| Deployment | Vercel | — |

---

## 5. Content Migration

### Source
- Aleph project: `/Volumes/TBU4/Workspace/Aleph/docs/book/src/`
- 42 pages organized in 9 sections with SUMMARY.md navigation

### Migration Steps
1. Copy all `.md` files from `book/src/` to `content/docs/en/`
2. Rename `.md` → `.mdx`
3. Add frontmatter (`title`, `description`) to each file
4. Fix internal links to use Fumadocs route paths
5. Create `meta.json` files for sidebar navigation order
6. Ensure code blocks have language annotations (especially `rust`)

### Content Map

| Section | Pages | Source Path |
|---------|-------|-------------|
| Getting Started | 3 | getting-started/ |
| Architecture | 5 | architecture/ |
| Gateway RPC | 10 | gateway/ |
| Interfaces | 5 | interfaces/ |
| Tools & Extensions | 4 | tools/ |
| Security | 3 | security/ |
| CLI Reference | 3 | cli/ |
| Development | 3 | development/ |
| API Reference | 2 | api/ |

---

## 6. Page Design

### Docs Landing Page (`/en`, `/zh`)

Card-based navigation inspired by docs.openclaw.ai:
- Hero section with Aleph branding and search
- 9 category cards with icons, titles, descriptions
- Links to first page of each section

### Docs Inner Pages (`/en/docs/**`)

Standard Fumadocs three-column layout:
- Left: collapsible sidebar with section navigation
- Center: MDX content with headings, code blocks, diagrams
- Right: table of contents (auto-generated from headings)
- Bottom: prev/next page navigation

### Visual Style
- Dark-first design (aleph-deep #0a0e27 background)
- Brand colors: aleph-blue, aleph-purple, aleph-cyan
- Fonts: Geist (display) + Inter (body) + Geist Mono (code)
- Glassmorphism cards on landing page
- Fumadocs UI theme customized via CSS variables

---

## 7. Development & Deployment

### Local Development
```bash
cd /Volumes/TBU4/Workspace/AlephDocs
pnpm install
pnpm dev          # http://localhost:3001
```

### Commands
```bash
pnpm dev          # Dev server (port 3001)
pnpm build        # Production build
pnpm start        # Preview production build
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
```

### Deployment
- Independent Git repository on GitHub
- Vercel project connected to the repo
- Domain: `docs.aleph.xxx` (separate from Homepage)
- Auto-deploy on push to main
