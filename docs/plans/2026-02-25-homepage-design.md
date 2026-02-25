# Aleph Homepage Design

**Date**: 2026-02-25
**Status**: Approved
**Reference**: [openclaw.ai](https://openclaw.ai) (design style), [Aleph project](/Volumes/TBU4/Workspace/Aleph) (content source)

---

## 1. Overview

A single-page, dark-first product landing page for the Aleph (ℵ) personal AI assistant. Deep sci-fi aesthetic with glassmorphism, gradient glows, and particle effects. Bilingual (English + Chinese) with route-based i18n.

**Goal**: Communicate Aleph's philosophical depth, technical sophistication, and practical value in a concise, visually stunning page.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 15 (App Router) | `src/` directory, SSG output |
| Styling | Tailwind CSS 4.2 | CSS-first `@theme`, no tailwind.config |
| Animation | Framer Motion | Entrance animations, glow effects |
| i18n | next-intl | Route prefix: `/en`, `/zh` |
| Theme | next-themes | Dark default, light toggle |
| UI Primitives | shadcn/ui + Radix | Buttons, tabs, etc. |
| Fonts | Geist (display) + Inter (body) | Via `next/font` |
| Package Manager | pnpm | |
| Deployment | Vercel | Zero config |

---

## 3. Brand Colors

Defined in `globals.css` via Tailwind v4 `@theme` directive:

```css
@theme {
  --color-aleph-deep: #0a0e27;
  --color-aleph-blue: #0A84FF;
  --color-aleph-purple: #5E5CE6;
  --color-aleph-cyan: #80E0FF;
  --color-aleph-muted: #a0aec0;
  --color-aleph-surface: rgba(255, 255, 255, 0.05);
  --color-aleph-border: rgba(255, 255, 255, 0.1);

  --font-display: "Geist", sans-serif;
  --font-body: "Inter", sans-serif;

  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  --animate-fade-in: fade-in 0.6s var(--ease-fluid);
  --animate-glow-pulse: glow-pulse 3s ease-in-out infinite;
}
```

---

## 4. Project Structure

```
src/
├── app/
│   ├── [locale]/              # i18n route prefix (en, zh)
│   │   ├── page.tsx           # Homepage (assembles sections)
│   │   └── layout.tsx         # Root layout (fonts, theme, nav, footer)
│   ├── globals.css            # Tailwind v4 @theme + custom styles
│   └── layout.tsx             # Minimal root layout (html, body)
├── components/
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── Philosophy.tsx     # Five Layers of Emergence
│   │   ├── Architecture.tsx   # 1-2-3-4 Model
│   │   ├── Features.tsx       # Feature card grid
│   │   └── QuickStart.tsx     # Tabbed code blocks
│   ├── layout/
│   │   ├── Navbar.tsx         # Logo + language switcher + theme toggle
│   │   └── Footer.tsx
│   ├── ui/                    # shadcn/ui components
│   └── shared/
│       ├── AlephLogo.tsx      # SVG logo with glow animation
│       ├── GlassCard.tsx      # Reusable glassmorphism card
│       ├── CodeBlock.tsx      # Syntax-highlighted code with copy button
│       └── LanguageSwitcher.tsx
├── lib/
│   └── utils.ts               # cn() helper, etc.
├── messages/
│   ├── en.json                # English translations
│   └── zh.json                # Chinese translations
└── public/
    ├── aleph-logo.svg         # From Aleph project
    ├── og-image.png           # OpenGraph image
    └── favicon.ico
```

---

## 5. Page Sections

### 5.1 Navbar (fixed, transparent → solid on scroll)

- Left: Aleph ℵ logo + "Aleph" text
- Right: Language switcher (EN/中) + Theme toggle (sun/moon) + GitHub icon link
- Background: transparent at top, `backdrop-blur` on scroll
- Height: 64px

### 5.2 Hero (100vh, centered)

**Content**:
- Aleph star logo SVG (128px) with animated blue-purple gradient glow + subtle particle effect
- Main title: "The point containing all points" / "包含所有点的那个点"
- Subtitle: "A self-hosted polymorphic AI assistant built in Rust" / "以 Rust 构建的自托管多态 AI 助手"
- Borges quote (small, italic): *"El Aleph es uno de los puntos del espacio que contiene todos los puntos."*
- Two CTA buttons: [Get Started →] (primary, gradient) + [GitHub ↗] (outline)

**Animation**:
- Logo fades in + scales from 0.8 → 1.0 with glow pulse
- Title slides up with stagger
- Background: radial gradient from center (#0a0e27 with subtle lighter center)

### 5.3 Philosophy — Five Layers of Emergence

**Content**:
- Section title: "Five Layers of Emergence" / "五层涌现"
- 5 horizontal bars stacked vertically (bottom=L1, top=L5)
- Each bar: ℵ symbol + Layer name + one-line description + Chinese name
  - L1: Sea of Knowledge — 经验之海
  - L2: Domain Classification (ℵ₀) — 领域分类
  - L3: Atomic Skills (ℵ₁) — 原子技能
  - L4: Functional Modules (ℵ₂) — 功能模块
  - L5: Polymorphic Agents (ℵ₃) — 多态智能体 ← highlighted
- Closing statement: "Aleph IS Layer 5 — The shell for a ghost."

**Animation**:
- Layers appear sequentially from bottom, 200ms stagger, slide-up + fade-in
- L5 has a glow border effect when fully visible

**Visual**:
- Each layer bar: gradient background, wider as you go up (funnel shape)
- L5 uses brand gradient (#0A84FF → #5E5CE6)
- Others use increasingly transparent versions

### 5.4 Architecture — 1-2-3-4 Model

**Content**:
- Section title: "1-2-3-4 Architecture" / "1-2-3-4 架构模型"
- 4 number cards in a row:
  - **1** Core — "The Brain" / Rust Core: reasoning, state, routing
  - **2** Faces — "The Faces" / Unified Panel + Social Bots
  - **3** Limbs — "The Limbs" / Native + MCP + Skills
  - **4** Nerves — "The Nerves" / WebSocket + IPC + gRPC + JSON-RPC

**Layout**: Horizontal card row (desktop), 2x2 grid (tablet), vertical stack (mobile)

**Visual**:
- Number in oversized font (text-8xl, gradient text)
- Card: GlassCard component
- Subtle connecting lines between cards (CSS border or SVG)

### 5.5 Features — Card Grid

**Content**: 6 feature cards in 3x2 grid (desktop), 2x3 (tablet), 1x6 (mobile)

| Feature | Icon Concept | Description (EN) |
|---------|-------------|------------------|
| Polymorphic Intelligence | Brain + infinity | One AI core, infinite manifestations across CLI, desktop, mobile, and messaging |
| Self-Learning Agent | Neural crystal | POE architecture crystallizes successful experiences into reusable skills |
| Hybrid Memory | Database + waves | Facts DB + vector search + full-text search with automatic compression |
| 19+ Built-in Tools | Toolbox | File ops, web search, code execution, plus MCP protocol for any tool server |
| Multi-Provider | Grid of logos | Claude, GPT, Gemini, DeepSeek, Moonshot, Ollama — use any LLM |
| Privacy-First | Shield + lock | Self-hosted, runs entirely on your devices, your data never leaves |

**Visual**:
- GlassCard with icon (gradient SVG), title (bold), and 2-line description
- Hover: subtle lift + border glow

### 5.6 Quick Start — Tabbed Code Blocks

**Content**:
- Section title: "Quick Start" / "快速开始"
- 3 tabs: Gateway / CLI / Desktop
- Each tab shows shell commands:

**Gateway tab**:
```bash
cargo run -p alephcore --features gateway --bin aleph-gateway -- start
```

**CLI tab**:
```bash
cargo run -p aleph-cli -- "Hello, Aleph!"
```

**Desktop tab**:
```bash
cd apps/desktop && pnpm install && pnpm tauri dev
```

- "Requires Rust 1.92+" note below
- Copy-to-clipboard button on each code block

**Visual**: Terminal-style dark card, monospace font, green/cyan text

### 5.7 Footer

**Content**:
- Left: ℵ logo + "Aleph" + one-line description
- Right: Link columns — Project (GitHub, Docs, Roadmap), Resources (Architecture, API), Community
- Bottom: MIT License + closing Borges quote in italic
- Language: matches current locale

**Visual**: Darker than main bg (#060818), subtle top border

---

## 6. Internationalization

- **Routing**: `next-intl` with `/en` and `/zh` prefixes
- **Default**: `/en` (root `/` redirects to `/en`)
- **Content files**: `src/messages/en.json`, `src/messages/zh.json`
- **Switcher**: Dropdown or pill toggle in Navbar
- **Scope**: All UI text, section titles, descriptions, and CTA labels. Code blocks remain in English.

---

## 7. Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| < 640px (sm) | Single column, stacked sections, hamburger nav |
| 640-1024px (md) | 2 columns for features/architecture |
| > 1024px (lg) | Full layout, 3-column features, horizontal architecture cards |

---

## 8. Performance Targets

- **Lighthouse Performance**: 95+
- **First Contentful Paint**: < 1.5s
- **Total Bundle Size**: < 150KB gzipped (excluding fonts)
- **SSG**: All pages statically generated at build time
- **Images**: All SVG (no raster images on homepage)
