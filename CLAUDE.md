# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Aleph-homepage** is the official website for the [Aleph (ℵ)](https://github.com/rootazero/Aleph) project — a self-hosted polymorphic personal AI assistant built in Rust.

Currently implemented: **Homepage** (`/`) — Product landing page showcasing Aleph's philosophy, architecture, features, and quick start guide.

Planned: **Documentation** (`/docs`) — Technical docs powered by Fumadocs, sourced from the Aleph project's `/docs` directory.

Content source: `/Volumes/TBU4/Workspace/Aleph` (the main Aleph repository)

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | 16+ |
| **Styling** | Tailwind CSS | 4.2+ (CSS-first config via `@theme`) |
| **i18n** | next-intl | 4+ |
| **Language** | TypeScript | 5+ |
| **Package Manager** | pnpm | 9+ |
| **Animations** | Motion (Framer Motion) | 12+ |
| **Testing** | Playwright | Latest |
| **Deployment** | Vercel | — |

---

## Architecture

### Routing

Uses `[locale]` dynamic segments with `next-intl` for i18n (en/zh). No route groups yet.

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts via next/font, ThemeProvider removed — dark only)
│   ├── globals.css             # Tailwind v4 entry (@import "tailwindcss" + @theme tokens)
│   └── [locale]/
│       ├── layout.tsx          # Locale layout (NextIntlClientProvider, Navbar, Footer)
│       └── page.tsx            # Homepage — assembles all section components
├── components/
│   ├── home/                   # Section components: Hero, Philosophy, Architecture, Features, QuickStart
│   ├── layout/                 # Navbar, Footer
│   └── shared/                 # AlephLogo, CodeBlock, GlassCard, ThemeToggle, LanguageSwitcher
├── i18n/                       # next-intl config: routing.ts, request.ts, navigation.ts
├── messages/                   # Translation JSON files (en.json, zh.json)
├── lib/                        # Utilities (cn helper using clsx + tailwind-merge)
└── middleware.ts               # next-intl locale detection middleware
```

### Key Design Decisions

- **Tailwind CSS v4 CSS-first config**: No `tailwind.config.js`. All theme tokens live in `globals.css` using `@theme` directive
- **Dark-only design**: Background `#050508`, accent `#22d3ee` (cyan). No light mode toggle currently active
- **i18n via next-intl**: Locale routing (`/en/`, `/zh/`), default locale `en`, messages in `src/messages/`
- **Glass-morphism pattern**: `GlassCard` component with backdrop-blur and translucent borders used across sections
- **Motion library**: Uses the `motion` package (Framer Motion successor) for entrance animations

---

## Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server at http://localhost:3000
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
```

No `typecheck` script is configured yet. Run `npx tsc --noEmit` manually.

---

## Tailwind CSS v4.2 Conventions

Theme tokens defined in `src/app/globals.css`:

```css
@theme {
  --color-page: #050508;
  --color-accent: #22d3ee;
  --color-heading: #f3f4f6;
  --color-muted: #9ca3af;
  --color-faint: #4b5563;
  --color-edge: #1f2937;
  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}
```

Do NOT create a `tailwind.config.js` or `tailwind.config.ts` — all configuration is in CSS.

---

## Language Conventions

- **UI text**: English (with zh translations in messages/)
- **Code comments**: English
- **Conversation with developer**: 中文
- **Commit messages**: English, format `<scope>: <description>` (e.g., `home: add hero section`)
