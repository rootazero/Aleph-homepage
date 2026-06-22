# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Aleph-homepage** is the official marketing website for the [Aleph (ℵ)](https://github.com/rootazero/Aleph) project — a self-hosted polymorphic personal AI assistant built in Rust.

This repo is the **homepage only**. It is a Next.js App Router app of custom React sections
(Topbar, Hero, Marquee, Manifesto, Capabilities, Archive, Process, AgentsShowcase, Testimonial,
Models, Faq, Footer).

```
/        → Homepage (en)
/zh      → Homepage (zh)
```

### Documentation lives in a separate project

The docs were split out into a standalone site:

- **Repo**: [`Aleph-docs`](https://github.com/rootazero/Aleph-docs) (sibling dir `/Volumes/TBU4/Workspace/Aleph-docs`)
- **URL**: `https://docs.heyaleph.com` (en at root, zh at `/zh`) — a dedicated Vercel project running Fumadocs with native i18n.
- The homepage's **Docs** nav link points there (locale-aware: en → `docs.heyaleph.com`, zh → `docs.heyaleph.com/zh`).
- The old bundled URLs (`/docs`, `/zh/docs`, …) **redirect** to the docs site via `next.config.ts` `redirects()` (for existing links / SEO).

> History: docs originally lived in a standalone `Aleph-docs` project, were merged into this app for a while (under `[locale]/docs/` with Fumadocs), then split back out into the dedicated `Aleph-docs` site so `docs.heyaleph.com` is a real, clean URL instead of a redirect alias.

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router, Turbopack) | 16+ |
| **Styling** | Tailwind CSS | 4.2+ (CSS-first config via `@theme`) |
| **i18n** | next-intl | 4+ |
| **Language** | TypeScript | 5+ |
| **Package Manager** | pnpm | 9+ |
| **Animations** | CSS `animation-timeline: view()` + IntersectionObserver fallback | — |
| **Testing** | Playwright | Latest |
| **Deployment** | Vercel | — |

No Fumadocs/MDX in this repo anymore — that all moved to `Aleph-docs`.

---

## Architecture

### Routing & i18n

One middleware (`next-intl`, in `src/proxy.ts`) drives all locale routing.

- `routing.ts`: `localePrefix: "as-needed"` → default locale `en` has no prefix, `zh` is prefixed.
- The canonical host is **`www.heyaleph.com`**; the apex `heyaleph.com` 308-redirects to www.
  Any absolute/cross-host redirect should target www directly, with no trailing slash.

```
src/
├── app/
│   ├── layout.tsx                # Root layout (four editorial fonts via next/font, globals.css)
│   ├── globals.css               # Tailwind v4 entry + light editorial tokens
│   ├── home.css                  # Homepage section styles
│   └── [locale]/
│       ├── layout.tsx            # NextIntlClientProvider
│       └── page.tsx              # Homepage — all marketing sections
├── components/
│   └── home/                     # Topbar, Hero, Marquee, Manifesto, Capabilities, Archive, Process,
│                                 # AgentsShowcase, Testimonial, Models, Faq, Footer, RevealRunner,
│                                 # RichText, figures.tsx, hooks.ts, data.ts
├── i18n/                         # next-intl config: routing.ts, request.ts, navigation.ts
├── lib/
│   ├── utils.ts                  # cn helper (clsx + tailwind-merge)
│   └── github.ts                 # GitHub stars fetch
├── messages/                     # next-intl JSON (en.json, zh.json) — homepage strings
└── proxy.ts                      # next-intl middleware (Next.js 16 renamed middleware.ts → proxy.ts)

next.config.ts                    # next-intl plugin + redirects() for old /docs URLs → docs.heyaleph.com
```

### Key Design Decisions

- **Homepage-only app**: docs are a separate deployment (`Aleph-docs` → `docs.heyaleph.com`).
- **Old /docs URLs redirect out**: `next.config.ts` maps `/docs`, `/zh/docs`, and their sub-paths
  to the docs site (single hop, zh keeps its prefix). `REDIRECT_PERMANENT` toggles 307↔308.
- **Tailwind CSS v4 CSS-first config**: no `tailwind.config.js`. Tokens live in `globals.css` `@theme` + `:root`.
- **Light editorial design**: paper background `#f0ead9`, ink text `#1b1712`, coral accent `#df4f26`
  (with mustard/sage/stone supporting tones and dark `#15120d` showcase sections). No light/dark toggle.
- **Editorial collage + CSS scroll animations**: paper-grain overlay, halftone, classical figure SVGs;
  scroll-driven entrances via `animation-timeline: view()` with an IntersectionObserver fallback.

---

## Development Commands

```bash
pnpm install          # Install deps
pnpm dev              # Dev server at http://localhost:3000
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
```

---

## Tailwind CSS v4.2 Conventions

`src/app/globals.css` imports Tailwind + `home.css`, then defines the light editorial palette.
Fonts (Instrument Serif, Space Grotesk, Archivo, Space Mono) are loaded via `next/font/google`
in `layout.tsx` and bridged into CSS via `--serif / --display / --sans / --mono` aliases:

```css
@import "tailwindcss";
@import "./home.css";

@theme {
  --color-paper: var(--paper);
  --color-coral: var(--coral);     /* #df4f26 */
  /* ...ink / ink-2 / ink-3 / mustard / sage / stone / line... */
}

:root {
  --paper: #f0ead9;
  --ink: #1b1712;
  --coral: #df4f26;
  /* ...palette... */
}
```

Do NOT create a `tailwind.config.js` or `tailwind.config.ts` — all configuration is in CSS.

---

## Language Conventions

- **UI text**: English (with zh translations in `messages/`)
- **Code comments**: English
- **Conversation with developer**: 中文
- **Commit messages**: English, format `<scope>: <description>` (e.g., `home: add hero section`, `chore: redirect old docs URLs`)
