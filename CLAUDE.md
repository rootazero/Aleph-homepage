# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**AlephHomepage** is the official website and documentation portal for the [Aleph (ℵ)](../Aleph) project — a self-hosted polymorphic personal AI assistant built in Rust.

The project has two main parts:
1. **Homepage** (`/`) — Product landing page inspired by [openclaw.ai](https://openclaw.ai), showcasing Aleph's philosophy, architecture, features, and integrations
2. **Documentation** (`/docs`) — Technical documentation site inspired by [docs.openclaw.ai](https://docs.openclaw.ai), powered by MDX content sourced from the Aleph project's `/docs` directory

Content source: `/Volumes/TBU4/Workspace/Aleph` (the main Aleph repository with README.md, docs/reference/, and docs/plans/)

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | 15+ |
| **Styling** | Tailwind CSS | 4.2+ (CSS-first config via `@theme`) |
| **Docs Engine** | Fumadocs | Latest |
| **Language** | TypeScript | 5+ |
| **Package Manager** | pnpm | 9+ |
| **Deployment** | Vercel | — |
| **UI Components** | shadcn/ui + Radix | — |
| **Animations** | Framer Motion | — |
| **Content** | MDX | — |

---

## Architecture

```
AlephHomepage/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (home)/             # Homepage route group
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── layout.tsx      # Homepage layout (nav + footer)
│   │   ├── docs/               # Documentation routes (Fumadocs)
│   │   │   ├── [[...slug]]/    # Catch-all docs pages
│   │   │   └── layout.tsx      # Docs layout (sidebar + TOC)
│   │   ├── layout.tsx          # Root layout (fonts, theme provider)
│   │   └── globals.css         # Tailwind v4 entry (@import "tailwindcss" + @theme)
│   ├── components/
│   │   ├── home/               # Homepage sections (Hero, Features, Architecture, etc.)
│   │   ├── docs/               # Docs-specific components
│   │   ├── ui/                 # shadcn/ui primitives
│   │   └── shared/             # Shared components (ThemeToggle, Logo, etc.)
│   ├── lib/                    # Utilities, source provider config
│   └── content/
│       └── docs/               # MDX documentation files (mirrored/adapted from Aleph docs)
├── public/                     # Static assets (icons, images, OG images)
├── next.config.ts              # Next.js config (with Fumadocs MDX)
├── postcss.config.mjs          # PostCSS with @tailwindcss/postcss
├── tsconfig.json
├── package.json
└── vercel.json                 # Vercel deployment config (if needed)
```

### Key Design Decisions

- **Tailwind CSS v4 CSS-first config**: No `tailwind.config.js`. All theme customization lives in `globals.css` using `@theme` directive and CSS custom properties
- **Fumadocs for docs**: Provides sidebar navigation, search, TOC, MDX processing — all within the Next.js App Router
- **Route groups**: `(home)` group separates the landing page layout from the docs layout
- **Dark mode default**: Like the Aleph project, the site defaults to dark theme with light mode toggle

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server locally
pnpm start

# Lint
pnpm lint

# Type check
pnpm typecheck
```

### Vercel Deployment

The project deploys automatically on push via Vercel. No special `vercel.json` configuration is needed for standard Next.js projects.

For preview deployments: `vercel` (via Vercel CLI)
For production: `vercel --prod`

---

## Tailwind CSS v4.2 Conventions

This project uses Tailwind CSS v4.2 with the new CSS-first configuration model:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --font-display: "Satoshi", sans-serif;
  --font-body: "Inter", sans-serif;

  --color-aleph-*: /* custom Aleph brand palette */;

  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

Key v4.2 features to use:
- **`@theme` directive** for all design tokens (colors, fonts, spacing, animations)
- **Automatic content detection** — no `content` paths needed
- **New color palettes**: `mauve`, `olive`, `mist`, `taupe` available in addition to standard palette
- **`font-features-*`** utilities for OpenType font features
- **Logical properties** for internationalization-ready spacing (`inline-s-*`, `inline-e-*`, `block-*`)
- **Container queries** with `@container` variant

Do NOT create a `tailwind.config.js` or `tailwind.config.ts` — all configuration is in CSS.

---

## Content Strategy

### Homepage Sections (reference: openclaw.ai)

1. **Hero** — "The point containing all points in the universe" tagline, animated Aleph (ℵ) symbol, CTA buttons
2. **Philosophy** — Five Layers of Emergence visualization (L1-L5), Borges quote
3. **Architecture** — Interactive 1-2-3-4 model diagram (1 Core, 2 Faces, 3 Limbs, 4 Nerves)
4. **Features** — Grid of capabilities (Multi-Channel, Memory, Tools, Skills, Security)
5. **Interfaces** — Showcase of CLI, Desktop, macOS, Telegram, Discord
6. **Getting Started** — Quick start code snippets with tab switching
7. **Footer** — Links, GitHub, license

### Documentation Structure (reference: docs.openclaw.ai / Mintlify style)

Content is adapted from the Aleph project's `/docs/reference/` directory:

| Source Doc | Docs Page |
|------------|-----------|
| `ARCHITECTURE.md` | `/docs/architecture` |
| `AGENT_SYSTEM.md` | `/docs/agent-system` |
| `GATEWAY.md` | `/docs/gateway` |
| `TOOL_SYSTEM.md` | `/docs/tools` |
| `MEMORY_SYSTEM.md` | `/docs/memory` |
| `EXTENSION_SYSTEM.md` | `/docs/extensions` |
| `SECURITY.md` | `/docs/security` |
| `AGENT_DESIGN_PHILOSOPHY.md` | `/docs/design-philosophy` |
| `DOMAIN_MODELING.md` | `/docs/domain-modeling` |
| `SERVER_DEVELOPMENT.md` | `/docs/server-development` |

Plus overview pages: Getting Started, Installation, Configuration, API Reference.

---

## Design Language

- **Color palette**: Dark-first design. Deep navy/black backgrounds with subtle gradients. Accent colors inspired by "Liquid Glass" aesthetic — translucent, ethereal, mathematical
- **Typography**: Display font for headings (Satoshi or similar geometric sans), body font (Inter)
- **Motion**: Subtle entrance animations (fade-in, slide-up), smooth transitions (`ease-fluid`). No excessive or distracting animations
- **Components**: Glass-morphism cards, code blocks with syntax highlighting, architectural diagrams using CSS/SVG
- **Aleph symbol (ℵ)**: Central brand element, used as favicon and in hero section with ambient glow effect

---

## Language Conventions

- **UI text**: English
- **Code comments**: English
- **Conversation with developer**: 中文
- **Commit messages**: English, format `<scope>: <description>` (e.g., `home: add hero section`)
