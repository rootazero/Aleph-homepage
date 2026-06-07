# Aleph 首页改版 + docs 视觉统一 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 `AlephHome/` 的亮色编辑风设计全量替换现有暗色 React 首页，并把 docs 所有页面改为同一视觉风格。

**Architecture:** 单个 Next.js App Router 应用。把 mockup 的 `styles.css` 移植为 `src/app/home.css`（类名制），调色板/字体 token 集中到 `globals.css`；mockup 的命令式 JS（`app.js`/`nav.js`）改写为 React 客户端组件 + 数据数组 `.map()` + hooks；所有可译文案进 next-intl messages；docs 通过 `--color-fd-*` 重映射 + `docs.css` 覆盖层统一为亮色。

**Tech Stack:** Next 16 / React 19 / next-intl 4 / Fumadocs 16 / Tailwind v4（CSS-first）/ `next/font/google`。动画以纯 CSS（`animation-timeline: view()`）+ IntersectionObserver 回退为主。

**源设计（只读参考，markup/CSS 的真相来源）：** `AlephHome/Aleph.html`、`AlephHome/assets/styles.css`、`AlephHome/assets/app.js`、`AlephHome/assets/nav.js`。

---

## 关键约定（所有任务遵循）

1. **字体 var 桥接**：`globals.css` 的 `:root` 设 `--serif/--display/--sans/--mono` 指向 next/font 变量（`--font-serif` 等）。`home.css` 内部一律用 `var(--serif)` 等，无需改动。
2. **调色板与 token 唯一来源**：所有颜色/`--maxw`/`--gutter`/`--color-fd-*` 在 `globals.css`。`home.css` 不含 `:root` token 定义。
3. **富文本**：含 `<span class="serif-it coral">` 的文案存为 HTML 字符串，用 `RichText` 组件经 `dangerouslySetInnerHTML` 渲染（均为站内静态内容，无用户输入）。
4. **结构化列表文案**：能力/画廊/步骤/agents/FAQ/models 的可译文本存在 messages，用 `useTranslations().raw(key)` 读数组/对象；纯结构字段（tone/figure/icon/id）放 `src/components/home/data.ts`。
5. **占位标记**：星数、评价人、虚构 agent 名、Sign in、聊天 demo 文案 —— 照搬，但在相关 messages 值后不动，在使用处加 `{/* TODO(placeholder): ... */}` 注释。
6. **客户端边界**：`Topbar`/`Hero`/`Capabilities`/`Faq` 为 `"use client"`；其余 section 为服务端组件（静态 + CSS 动画）。`page.tsx` 为服务端组件，组合各 section。
7. **提交**：每个 Task 末尾提交，分支 `feat/homepage-redesign`（已存在）。

---

# 阶段一 — 基础（tokens / 字体 / globals / home.css / 去暗色）

### Task 1: 根布局接入四套字体并移除暗色强制

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 重写 `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Instrument_Serif, Space_Grotesk, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Aleph (ℵ) — Universal Personal AI Agent Intelligence",
  description: "A self-hosted polymorphic personal AI assistant built in Rust. Local-first. Legible by design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${serif.variable} ${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: 校验编译**

Run: `pnpm typecheck`
Expected: PASS（无类型错误）

- [ ] **Step 3: 提交**

```bash
git add src/app/layout.tsx
git commit -m "home: load editorial fonts via next/font, drop forced dark class"
```

---

### Task 2: 重写 `globals.css` —— 亮色 token + 字体桥接 + Fumadocs 映射 + 纸张颗粒

**Files:**
- Modify: `src/app/globals.css`（整体替换）

- [ ] **Step 1: 用以下内容整体替换 `src/app/globals.css`**

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";
@import "./home.css";
@import "./docs.css";

/* Let Tailwind scan Fumadocs UI for class names (path relative to this file). */
@source "../../node_modules/fumadocs-ui/dist/**/*.js";

@theme {
  /* Brand tokens exposed as utilities (bg-paper, text-ink, text-coral, ...) */
  --color-paper: var(--paper);
  --color-paper-deep: var(--paper-deep);
  --color-panel: var(--panel);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-ink-3: var(--ink-3);
  --color-coral: var(--coral);
  --color-mustard: var(--mustard);
  --color-sage: var(--sage);
  --color-line: var(--line);

  /* Typography mapped to next/font CSS variables */
  --font-serif: var(--font-serif);
  --font-display: var(--font-display);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

/*
 * Light editorial palette (single source of truth). Aliases for home.css
 * (--serif/--display/--sans/--mono) bridge to the next/font variables.
 * Fumadocs UI reads the mapped --color-fd-* tokens (light).
 */
:root {
  /* paper + ink */
  --paper: #f0ead9;
  --paper-deep: #e8e0cc;
  --panel: #f6f1e4;
  --ink: #1b1712;
  --ink-2: #4d4639;
  --ink-3: #847a64;

  /* accents */
  --coral: #df4f26;
  --coral-deep: #bf3d1a;
  --coral-soft: #ec6a44;
  --mustard: #d4a23c;
  --stone: #c8b99c;
  --stone-deep: #ab9b78;
  --sage: #5c6f52;

  /* dark sections */
  --night: #15120d;
  --night-2: #211c15;

  /* lines */
  --line: rgba(27, 23, 18, 0.16);
  --line-soft: rgba(27, 23, 18, 0.09);

  --maxw: 1320px;
  --gutter: clamp(20px, 4vw, 64px);

  /* font aliases used throughout home.css */
  --serif: var(--font-serif), "Instrument Serif", Georgia, serif;
  --display: var(--font-display), "Space Grotesk", system-ui, sans-serif;
  --sans: var(--font-sans), "Archivo", system-ui, sans-serif;
  --mono: var(--font-mono), "Space Mono", ui-monospace, monospace;

  /* Map Aleph tokens -> Fumadocs UI variables (light) */
  --color-fd-background: var(--paper);
  --color-fd-foreground: var(--ink);
  --color-fd-muted: var(--paper-deep);
  --color-fd-muted-foreground: var(--ink-3);
  --color-fd-popover: var(--panel);
  --color-fd-popover-foreground: var(--ink);
  --color-fd-card: var(--panel);
  --color-fd-card-foreground: var(--ink);
  --color-fd-border: var(--line);
  --color-fd-primary: var(--coral);
  --color-fd-primary-foreground: #ffffff;
  --color-fd-secondary: var(--paper-deep);
  --color-fd-secondary-foreground: var(--ink);
  --color-fd-accent: var(--paper-deep);
  --color-fd-accent-foreground: var(--ink);
  --color-fd-ring: var(--coral);
}

:root {
  background-color: var(--paper);
  color: var(--ink);
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.62;
  overflow-x: hidden;
  position: relative;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* paper grain overlay */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.05;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

::selection {
  background-color: var(--coral);
  color: #fff;
}
```

> 注：`@import "./home.css"` 和 `@import "./docs.css"` 引用的文件将在 Task 3 / Task 18 创建。本任务结束时这两文件尚不存在，故先在 Task 3 创建 `home.css`、Task 18 创建 `docs.css` 之前 **不要** 运行 `pnpm dev`/`build`。下一步只做静态检查。

- [ ] **Step 2: 先创建空的 `docs.css` 占位以免 import 失败**

创建 `src/app/docs.css`，内容仅一行注释：

```css
/* docs overrides — populated in Task 18 */
```

- [ ] **Step 3: 提交**

```bash
git add src/app/globals.css src/app/docs.css
git commit -m "home: replace palette with light editorial tokens + Fumadocs light mapping"
```

---

### Task 3: 由 `styles.css` 派生 `home.css`

**Files:**
- Create: `src/app/home.css`（从 `AlephHome/assets/styles.css` 派生）

- [ ] **Step 1: 复制并裁剪**

把 `AlephHome/assets/styles.css` 的全部内容复制到 `src/app/home.css`，然后做且仅做两处删除：

1. 删除顶部 Google Fonts `@import url('https://fonts.googleapis.com/...')`（源文件第 6 行）。
2. 删除整个 `:root { ... }` 块（源文件第 8–41 行，含颜色/`--maxw`/`--gutter`/字体定义）—— 这些已迁入 `globals.css`。

其余（从 `* { box-sizing: border-box; }` 起到文件末尾的所有布局/组件/动画/拼贴样式）**原样保留**。`home.css` 中所有 `var(--serif/--display/--sans/--mono/--paper/--ink/...)` 都由 `globals.css` 提供，无需改动。

> 同时删除 `home.css` 内重复的 `body { ... }` 基础块（源文件 48–57 行）——`globals.css` 已定义 `body`。仅保留 `body::before` 之外的视觉规则；若保留 `body{}` 会与 globals 重复但不冲突，亦可保留。为避免重复，删除 `home.css` 内的 `body { margin:0; background:... }` 与 `body::before` 两块（已在 globals 定义）。

- [ ] **Step 2: 验证 dev 启动且首页背景变为纸色**

Run: `pnpm dev`，浏览 `http://localhost:3000`
Expected: 页面可编译；旧首页仍在（暂时样式错乱，颜色为旧硬编码），但全站底色/字体已切换。无控制台 CSS import 报错。

- [ ] **Step 3: 提交**

```bash
git add src/app/home.css
git commit -m "home: port editorial design-system CSS from mockup"
```

---

### Task 4: 清理 `[locale]/layout.tsx` 暗色包裹与未使用 import

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: 用以下内容整体替换**

```tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 2: 校验**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 3: 提交**

```bash
git add "src/app/[locale]/layout.tsx"
git commit -m "home: drop forced dark wrapper and unused imports in locale layout"
```

---

# 阶段二 — 首页组件、数据、文案

### Task 5: 共享 hooks 与 RichText

**Files:**
- Create: `src/components/home/hooks.ts`
- Create: `src/components/home/RichText.tsx`

- [ ] **Step 1: 创建 `src/components/home/hooks.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export type OS = "mac" | "windows" | "linux";

export function useOS(): OS {
  const [os, setOs] = useState<OS>("mac");
  useEffect(() => {
    const n = navigator as Navigator & { userAgentData?: { platform?: string } };
    const p = (n.userAgentData?.platform || n.platform || n.userAgent || "").toLowerCase();
    const ua = (n.userAgent || "").toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setOs("mac");
    else if (/android/.test(ua)) setOs("linux");
    else if (/mac/.test(p) || /mac os/.test(ua)) setOs("mac");
    else if (/win/.test(p) || /windows/.test(ua)) setOs("windows");
    else if (/linux|x11|cros/.test(p) || /linux/.test(ua)) setOs("linux");
  }, []);
  return os;
}

/** Continuous parallax driven by scrollY; rate e.g. 0.18 / -0.18. */
export function useParallax(rate: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * rate}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rate]);
  return ref;
}

/** IO fallback for .reveal -> .in (CSS scroll-timeline handles modern browsers). */
export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
}
```

- [ ] **Step 2: 创建 `src/components/home/RichText.tsx`**

```tsx
type RichTextProps = {
  html: string;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
};

/** Renders trusted, in-repo HTML strings (e.g. `<span class="serif-it coral">`). */
export function RichText({ html, className, as: Tag = "span" }: RichTextProps) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
```

- [ ] **Step 3: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/hooks.ts src/components/home/RichText.tsx
git commit -m "home: add OS/parallax/reveal hooks and RichText helper"
```

---

### Task 6: 拼贴图元 `figures.tsx`

**Files:**
- Create: `src/components/home/figures.tsx`

- [ ] **Step 1: 创建 `src/components/home/figures.tsx`**

把 SVG path 数据从 `AlephHome/Aleph.html` 一次性复制进来：bust 用第 16–21 行的 `d`，plant 用第 25–29 行四条 path + circle，wing 用第 33–37 行四条 path。封装为可复用组件。

```tsx
import type { CSSProperties } from "react";

type FigProps = { className?: string; style?: CSSProperties };

/** Classical profile bust (viewBox 0 0 240 300). Copy `d` from Aleph.html L16-21. */
export function BustFigure({ className, style }: FigProps) {
  return (
    <svg viewBox="0 0 240 300" className={className} style={style}>
      <path fill="currentColor" d="<PASTE bust d from Aleph.html line 16-21>" />
    </svg>
  );
}

/** Plant sprig (viewBox 0 0 120 140). Copy paths from Aleph.html L25-29. */
export function PlantFigure({ className, style }: FigProps) {
  return (
    <svg viewBox="0 0 120 140" className={className} style={style}>
      <path d="M60 140 C60 100 58 70 60 30" stroke="currentColor" strokeWidth="3.5" fill="none" />
      <path fill="currentColor" d="M60 92 C40 86 26 70 24 48 C46 50 58 66 60 88 Z" />
      <path fill="currentColor" d="M60 74 C82 70 96 54 98 34 C76 34 62 50 60 72 Z" />
      <path fill="currentColor" d="M60 50 C46 44 38 30 38 14 C54 18 60 32 60 48 Z" />
      <circle fill="currentColor" cx="60" cy="24" r="9" />
    </svg>
  );
}

/** Abstract winged figure (viewBox 0 0 200 300). Copy paths from Aleph.html L33-37. */
export function WingFigure({ className, style }: FigProps) {
  return (
    <svg viewBox="0 0 200 300" className={className} style={style}>
      <path fill="currentColor" d="<PASTE wing path1 from Aleph.html line 33>" />
      <path fill="currentColor" d="<PASTE wing path2 from Aleph.html line 34-35>" />
      <path fill="currentColor" d="<PASTE wing path3 from Aleph.html line 36>" />
      <path fill="currentColor" d="<PASTE wing path4 from Aleph.html line 37>" />
    </svg>
  );
}

export type FigKind = "bust" | "plant" | "wing";

export function Figure({ kind, className, style }: FigProps & { kind: FigKind }) {
  if (kind === "plant") return <PlantFigure className={className} style={style} />;
  if (kind === "wing") return <WingFigure className={className} style={style} />;
  return <BustFigure className={className} style={style} />;
}
```

> 执行时务必把三处 `<PASTE ...>` 替换为 `Aleph.html` 中对应 `d` 字符串的精确文本（含全部坐标），不要手写近似值。

- [ ] **Step 2: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/figures.tsx
git commit -m "home: add reusable collage figure SVGs"
```

---

### Task 7: 结构化数据 `data.ts`

**Files:**
- Create: `src/components/home/data.ts`

- [ ] **Step 1: 创建 `src/components/home/data.ts`**

仅放非文案的结构字段；文案经 messages 读取。id 与 messages key 对应。

```ts
import type { FigKind } from "./figures";

export type Tone = "coral" | "mustard" | "sage" | "ink";

export const CAP_IDS = ["research", "inbox", "schedule", "life", "write", "code"] as const;
export type CapId = (typeof CAP_IDS)[number];

/** Which preview renderer each capability uses. */
export const CAP_KIND: Record<CapId, "chat" | "steps" | "cal"> = {
  research: "chat",
  inbox: "steps",
  schedule: "cal",
  life: "steps",
  write: "chat",
  code: "steps",
};

export const GALLERY: { id: string; fig: FigKind; tone: Tone; anim: string }[] = [
  { id: "0", fig: "bust", tone: "coral", anim: "up" },
  { id: "1", fig: "plant", tone: "mustard", anim: "scale" },
  { id: "2", fig: "wing", tone: "ink", anim: "rot" },
  { id: "3", fig: "bust", tone: "sage", anim: "up" },
  { id: "4", fig: "plant", tone: "coral", anim: "scale" },
];

export const PROCESS: { id: string; num: string; fig: FigKind }[] = [
  { id: "0", num: "01", fig: "bust" },
  { id: "1", num: "02", fig: "plant" },
  { id: "2", num: "03", fig: "wing" },
  { id: "3", num: "04", fig: "bust" },
];

export const AGENTS: { id: string; tone: Tone }[] = [
  { id: "0", tone: "coral" },
  { id: "1", tone: "mustard" },
  { id: "2", tone: "sage" },
  { id: "3", tone: "coral" },
];

export const OS_ICON: Record<"mac" | "windows" | "linux", string> = {
  mac: "<PASTE mac svg path-only markup from AlephHome/assets/nav.js line 11>",
  windows: "<PASTE windows svg from nav.js line 12>",
  linux: "<PASTE linux svg from nav.js line 13>",
};

/** tone -> CSS var for coral-disc backgrounds */
export const TONE_VAR: Record<Tone, string> = {
  coral: "var(--coral)",
  mustard: "var(--mustard)",
  sage: "var(--sage)",
  ink: "var(--ink)",
};
```

> `OS_ICON` 三个值复制 `nav.js` 第 11–13 行 `OS_ICON` 对象里的 SVG 字符串（含 `<svg>` 外层），用 `dangerouslySetInnerHTML` 注入。

- [ ] **Step 2: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/data.ts
git commit -m "home: add structural data for sections"
```

---

### Task 8: 文案 messages（en + zh）

**Files:**
- Modify: `src/messages/en.json`（整体替换）
- Modify: `src/messages/zh.json`（整体替换）

- [ ] **Step 1: 用以下内容整体替换 `src/messages/en.json`**

英文照搬 mockup（`Aleph.html` 文案 + `app.js` 数据 + `nav.js` i18n 表）。`*_html` 为富文本。占位项原样保留。

```json
{
  "topbar": {
    "philosophy": "Philosophy",
    "capabilities": "Capabilities",
    "skills": "Skills",
    "how": "How it works",
    "models": "Models",
    "docs": "Docs",
    "faq": "FAQ",
    "signin": "Sign in",
    "github_count": "3.4k"
  },
  "hero": {
    "index_label": "[ Index — 00 ]",
    "tag_label": "Personal · Local · Multi-agent",
    "est_label": "Est. 2026 — Aleph Labs",
    "geo_label": "N 37.77° · W 122.41°",
    "eyebrow": "Universal Personal AI",
    "title": "Aleph",
    "sub_html": "Your <span class=\"serif-it coral\">agent</span> intelligence — <span class=\"serif-it\">not</span> a black box.",
    "desc": "One personal agent that remembers you, runs on your terms, and quietly orchestrates a team of specialists across research, writing, code, scheduling, and the small logistics of a life.",
    "star": "Star on GitHub",
    "star_count": "★ 3.4k",
    "dl_for": "Download for {os}",
    "dl_also": "Also for",
    "dl_sub_mac": "Free · Apple silicon & Intel",
    "dl_sub_windows": "Free · Windows 10 & 11 · 64-bit",
    "dl_sub_linux": "Free · .deb · .rpm · AppImage",
    "spec1_b": "Runs locally",
    "spec1": "by default",
    "spec2_b": "Remembers",
    "spec2": "across sessions",
    "spec3_b": "Orchestrates",
    "spec3": "sub-agents",
    "scroll": "Scroll to explore ↓"
  },
  "marquee": {
    "items": ["Research", "Inbox triage", "Calendar", "Writing", "Code", "Data analysis", "Bookings", "Memory", "Local-first", "Multi-agent"]
  },
  "manifesto": {
    "eyebrow_label": "[ Philosophy — 01 ]",
    "sub_label": "Aleph / ℵ — the first letter",
    "statement_html": "We treat your <span class=\"serif-it coral\">assistant</span> as a partner you can <span class=\"serif-it\">read</span>, not a box you have to <span class=\"serif-it\">trust</span>.",
    "body": "Most AI hides its reasoning and hopes you don't ask. Aleph does the opposite — every plan it forms, every sub-agent it dispatches, every memory it keeps about you is legible, editable, and yours. It works on your device, with your data, under your rules. Intelligence that earns trust by showing its work.",
    "s1_b": "Legible",
    "s1": "see every step",
    "s2_b": "Local",
    "s2": "your data stays put",
    "s3_b": "Yours",
    "s3": "export anything, anytime",
    "fig_caption": "Fig. 1 — the legible mind"
  },
  "capabilities": {
    "eyebrow": "Capabilities — 02",
    "heading_html": "Skills, systems & an interface — <span class=\"serif-it coral\">all in service of one</span> agent.",
    "lede": "Pick a capability to preview how Aleph actually handles it — live, step by step. Ten specialists, one conversation, zero context-switching.",
    "items": {
      "research": {
        "title": "Deep research",
        "desc": "Multi-source synthesis with citations you can trace.",
        "ix": "A1",
        "label": "aleph · deep research",
        "user": "Compare the three leading approaches to local-first agent memory. Cite sources.",
        "steps": ["Searched 11 sources", "Cross-checked 3 with citations", "Drafting comparison table…"],
        "reply_html": "Three approaches: <b>vector recall</b>, <b>event-sourced logs</b>, and <b>hybrid graphs</b>. Hybrid wins on traceability — full reasoning + 6 citations attached. Open the trace?"
      },
      "inbox": {
        "title": "Inbox & messages",
        "desc": "Triage, draft, and follow up across every thread.",
        "ix": "A2",
        "label": "aleph · inbox & messages",
        "head": "Triaging 34 unread",
        "steps": ["Sorted 34 messages into 5 lanes", "Drafted 6 replies in your voice", "Flagged 2 needing your call", "Scheduled 3 follow-ups for Thu"],
        "footer": "You review the drafts. Aleph never sends without a nod."
      },
      "schedule": {
        "title": "Schedule & tasks",
        "desc": "Plans your day, defends your focus, never drops a thread.",
        "ix": "A3",
        "label": "aleph · schedule & tasks",
        "head": "Plan Thursday around 3h of deep work",
        "footer": "3 hours of focus carved out, meetings batched, lunch defended."
      },
      "life": {
        "title": "Life logistics",
        "desc": "Books travel, orders, and errands end to end.",
        "ix": "A4",
        "label": "aleph · life logistics",
        "head": "Booking: Lisbon, Fri–Mon",
        "steps": ["Found 3 flights under your budget", "Matched hotel to past preferences", "Held the aisle seat you like", "Built a 1-tap confirm cart"],
        "footer": "Everything assembled. One confirmation, zero tabs."
      },
      "write": {
        "title": "Writing & docs",
        "desc": "Long-form in your voice, from notes to finished draft.",
        "ix": "A5",
        "label": "aleph · writing & docs",
        "user": "Turn these 9 voice notes into a tight 600-word essay in my voice.",
        "steps": ["Transcribed & clustered 9 notes", "Matched your cadence from past writing", "Drafting 600 words…"],
        "reply_html": "Draft ready — 612 words, your rhythm, three clean section breaks. Tracked every claim back to a note. Want it tighter or warmer?"
      },
      "code": {
        "title": "Code & analysis",
        "desc": "Writes, runs, and explains code on real data.",
        "ix": "A6",
        "label": "aleph · code & analysis",
        "head": "Analyzing sales.csv · 48k rows",
        "steps": ["Loaded & profiled the dataset", "Wrote + ran the query locally", "Built 2 charts, flagged 1 anomaly", "Explaining the dip in March…"],
        "footer": "Code, output, and reasoning all visible — nothing runs off-device."
      }
    },
    "cal_slots": [
      { "t": "09:00", "label": "Deep work — Q3 memo", "kind": "block" },
      { "t": "12:00", "label": "Lunch (protected)", "kind": "soft" },
      { "t": "13:00", "label": "Deep work — research", "kind": "block" },
      { "t": "15:30", "label": "2 meetings, batched", "kind": "soft" },
      { "t": "17:00", "label": "Inbox sweep — 12 min", "kind": "soft" }
    ]
  },
  "archive": {
    "eyebrow": "Skills archive — 03",
    "heading_html": "A living archive of skills your <span class=\"serif-it coral\">agent</span> keeps learning.",
    "browse": "Browse all skills",
    "items": [
      { "t": "guzang-ppt", "n": "A·01", "d": "Decks that argue, not just list." },
      { "t": "kami-notes", "n": "A·02", "d": "Voice memos → structured docs." },
      { "t": "atlas-research", "n": "A·03", "d": "Sourced briefs with live citations." },
      { "t": "ledger", "n": "A·04", "d": "Reads your data, explains the why." },
      { "t": "concierge", "n": "A·05", "d": "Bookings & errands, start to finish." }
    ]
  },
  "process": {
    "eyebrow": "How it works — 04",
    "heading_html": "From a <span class=\"serif-it coral\">signal</span> to a finished <span class=\"serif-it\">system</span>.",
    "lede": "You give Aleph an intention. It handles the rest as a transparent, four-beat loop you can pause and steer at any point.",
    "steps": [
      { "t": "Capture", "d": "You hand over an intention — a sentence, a file, a voice note." },
      { "t": "Understand", "d": "Aleph reads context from memory and forms a legible plan." },
      { "t": "Orchestrate", "d": "Sub-agents run in parallel; you can pause and steer any one." },
      { "t": "Deliver", "d": "A finished artifact, plus the full trace of how it got there." }
    ]
  },
  "agents": {
    "eyebrow": "Agents — 05",
    "statement_html": "Turn a vague <span class=\"serif-it coral\">brief</span> into a memorable, deliverable <span class=\"serif-it\">artifact</span>.",
    "body": "Aleph spins up purpose-built sub-agents on demand. Each one is a named, inspectable specialist you can reuse, share, or retire.",
    "stat1_b": "12+",
    "stat1": "built-in agents",
    "stat2_b": "∞",
    "stat2": "custom skills",
    "items": [
      { "name": "guzang", "tag": "decks", "d": "Builds argued, on-brand presentations from a one-line brief." },
      { "name": "kami", "tag": "docs", "d": "Captures messy thinking and returns a structured, sourced doc." },
      { "name": "atlas", "tag": "research", "d": "Runs deep, multi-source research with a traceable reasoning log." },
      { "name": "concierge", "tag": "logistics", "d": "Handles travel, orders, and errands end to end — you just confirm." }
    ]
  },
  "testimonial": {
    "notes_label": "[ Field notes — 06 ]",
    "access_label": "From early access",
    "quote_html": "“Aleph turned my fuzzy AI wishlist into a system that's <span class=\"serif-it coral\">sharp</span>, trustworthy, and genuinely <span class=\"serif-it\">mine</span>.”",
    "name": "Mira Adelstein",
    "role": "Independent researcher",
    "logos": ["Helix", "Northbeam", "Kerná", "BYVÖK", "Atlas&Co"],
    "fig_caption": "Fig. 6 — partner, not tool"
  },
  "models": {
    "eyebrow": "Engine room — 07",
    "heading_html": "Powered by the world's <span class=\"serif-it coral\">best</span> agents & models — pick yours.",
    "lede": "Aleph is model-agnostic. Route any task to the engine you trust, or let it choose. Swap providers without losing your memory or your skills.",
    "chips": ["Claude", "GPT", "Gemini", "Llama (local)", "Mistral", "Qwen", "DeepSeek", "Your own"]
  },
  "faq": {
    "eyebrow": "Questions — 08",
    "title_html": "On <span class=\"coral\">Aleph</span>, agents, memory & the local-first question.",
    "talk": "Talk to us",
    "items": [
      { "q": "What makes Aleph \"local-first\"?", "a": "By default, Aleph runs on your device with your data. Memory, files, and reasoning stay local unless you explicitly route a task to a cloud model — and even then, you see exactly what leaves your machine." },
      { "q": "How is this different from a single chatbot?", "a": "A chatbot answers. Aleph orchestrates. It dispatches named sub-agents for research, writing, code, and logistics, runs them in parallel, and stitches the results into one finished artifact — all in a single conversation." },
      { "q": "What does \"legible\" actually mean here?", "a": "Every plan, every sub-agent call, and every memory Aleph keeps about you is visible and editable. You can open the trace on any task, see the reasoning, and correct it. Nothing happens in a black box." },
      { "q": "Can I choose which AI model powers it?", "a": "Yes. Aleph is model-agnostic. Route any task to Claude, GPT, Gemini, a local Llama, or your own fine-tune — and switch providers anytime without losing your memory or your skills." },
      { "q": "How does memory and personalization work?", "a": "Aleph builds a private, structured memory of your preferences, projects, and people. It is yours: inspectable, exportable, and deletable at the level of a single fact." }
    ]
  },
  "footer": {
    "tagline": "Universal personal AI agent intelligence. Local-first. Legible by design.",
    "h_product": "Product",
    "h_company": "Company",
    "h_start": "Get started",
    "product": ["Capabilities", "Skills", "How it works", "Models"],
    "company": ["About", "Manifesto", "Careers", "Press"],
    "start": ["Download", "Docs", "Changelog", "Status"],
    "copyright": "© 2026 Aleph Labs · ℵ · Local-first AI",
    "motto": "Built for people who read the footnotes."
  }
}
```

- [ ] **Step 2: 用以下内容整体替换 `src/messages/zh.json`**

中文：nav + hero 复用 `nav.js` 已有中文，其余翻译。占位项（人名/agent 名/品牌名）保留原文。

```json
{
  "topbar": {
    "philosophy": "理念",
    "capabilities": "能力",
    "skills": "技能",
    "how": "工作方式",
    "models": "模型",
    "docs": "文档",
    "faq": "常见问题",
    "signin": "登录",
    "github_count": "3.4k"
  },
  "hero": {
    "index_label": "[ 索引 — 00 ]",
    "tag_label": "个人 · 本地 · 多 Agent",
    "est_label": "创立于 2026 — Aleph Labs",
    "geo_label": "N 37.77° · W 122.41°",
    "eyebrow": "通用个人 AI",
    "title": "Aleph",
    "sub_html": "你的 <span class=\"serif-it coral\">Agent</span> 智能 —— <span class=\"serif-it\">不是</span>黑盒。",
    "desc": "一个记得你、按你的方式运行的个人 Agent，在后台默默协调一支专家团队——覆盖研究、写作、代码、日程，以及生活里的琐碎事务。",
    "star": "在 GitHub 点 Star",
    "star_count": "★ 3.4k",
    "dl_for": "下载 {os} 版",
    "dl_also": "也支持",
    "dl_sub_mac": "免费 · 支持 Apple 芯片与 Intel",
    "dl_sub_windows": "免费 · Windows 10 & 11 · 64 位",
    "dl_sub_linux": "免费 · .deb · .rpm · AppImage",
    "spec1_b": "本地运行",
    "spec1": "默认",
    "spec2_b": "跨会话",
    "spec2": "持续记忆",
    "spec3_b": "编排",
    "spec3": "子 Agent",
    "scroll": "下滚探索 ↓"
  },
  "marquee": {
    "items": ["研究", "收件箱整理", "日历", "写作", "代码", "数据分析", "预订", "记忆", "本地优先", "多 Agent"]
  },
  "manifesto": {
    "eyebrow_label": "[ 理念 — 01 ]",
    "sub_label": "Aleph / ℵ — 第一个字母",
    "statement_html": "我们把你的 <span class=\"serif-it coral\">助手</span> 视为一个你可以 <span class=\"serif-it\">读懂</span> 的伙伴，而不是一个你只能 <span class=\"serif-it\">信任</span> 的黑盒。",
    "body": "大多数 AI 隐藏推理过程，并指望你不要追问。Aleph 恰恰相反——它形成的每个计划、调度的每个子 Agent、以及关于你的每一段记忆，都是可读、可改、属于你的。它在你的设备上运行，用你的数据，遵你的规则。用展示过程来赢得信任的智能。",
    "s1_b": "可读",
    "s1": "看到每一步",
    "s2_b": "本地",
    "s2": "数据留在本地",
    "s3_b": "属于你",
    "s3": "随时导出任何内容",
    "fig_caption": "图 1 — 可读的心智"
  },
  "capabilities": {
    "eyebrow": "能力 — 02",
    "heading_html": "技能、系统与一个界面 — <span class=\"serif-it coral\">全都服务于同一个</span> Agent。",
    "lede": "选一项能力，看 Aleph 如何真正处理它——实时、逐步。十位专家，一场对话，零上下文切换。",
    "items": {
      "research": {
        "title": "深度研究",
        "desc": "多源综合，引用可追溯。",
        "ix": "A1",
        "label": "aleph · 深度研究",
        "user": "比较本地优先 Agent 记忆的三种主流方案，并标注出处。",
        "steps": ["检索了 11 个来源", "对 3 个进行交叉引用核对", "正在起草对比表…"],
        "reply_html": "三种方案：<b>向量召回</b>、<b>事件源日志</b> 与 <b>混合图谱</b>。混合方案在可追溯性上胜出——附完整推理 + 6 条引用。打开追踪？"
      },
      "inbox": {
        "title": "收件箱与消息",
        "desc": "跨所有会话整理、起草、跟进。",
        "ix": "A2",
        "label": "aleph · 收件箱与消息",
        "head": "正在整理 34 条未读",
        "steps": ["把 34 条消息分入 5 个轨道", "以你的语气起草 6 条回复", "标出 2 条需你拍板", "为周四安排 3 项跟进"],
        "footer": "你审阅草稿。未经你点头，Aleph 绝不发送。"
      },
      "schedule": {
        "title": "日程与任务",
        "desc": "规划你的一天，守护你的专注，绝不漏接。",
        "ix": "A3",
        "label": "aleph · 日程与任务",
        "head": "围绕 3 小时深度工作安排周四",
        "footer": "腾出 3 小时专注，会议批处理，午餐被守护。"
      },
      "life": {
        "title": "生活事务",
        "desc": "预订出行、下单、跑腿，从头到尾。",
        "ix": "A4",
        "label": "aleph · 生活事务",
        "head": "预订：里斯本，周五至周一",
        "steps": ["找到 3 趟低于预算的航班", "按往期偏好匹配酒店", "预留你喜欢的靠走道座位", "生成一键确认购物车"],
        "footer": "一切就绪。一次确认，零标签页。"
      },
      "write": {
        "title": "写作与文档",
        "desc": "以你的语气写长文，从笔记到成稿。",
        "ix": "A5",
        "label": "aleph · 写作与文档",
        "user": "把这 9 条语音笔记整成一篇 600 字、紧凑且符合我语气的文章。",
        "steps": ["转写并聚类 9 条笔记", "从你过往写作中匹配节奏", "正在起草 600 字…"],
        "reply_html": "草稿就绪——612 字，你的节奏，三个干净的分段。每个论点都追溯到笔记。要更紧凑还是更温暖？"
      },
      "code": {
        "title": "代码与分析",
        "desc": "在真实数据上编写、运行并解释代码。",
        "ix": "A6",
        "label": "aleph · 代码与分析",
        "head": "分析 sales.csv · 48k 行",
        "steps": ["加载并剖析数据集", "本地编写并运行查询", "生成 2 张图表，标出 1 处异常", "正在解释三月的下滑…"],
        "footer": "代码、输出与推理全都可见——一切都在本地运行。"
      }
    },
    "cal_slots": [
      { "t": "09:00", "label": "深度工作 — Q3 备忘录", "kind": "block" },
      { "t": "12:00", "label": "午餐（受保护）", "kind": "soft" },
      { "t": "13:00", "label": "深度工作 — 研究", "kind": "block" },
      { "t": "15:30", "label": "2 个会议，批处理", "kind": "soft" },
      { "t": "17:00", "label": "收件箱清理 — 12 分钟", "kind": "soft" }
    ]
  },
  "archive": {
    "eyebrow": "技能档案 — 03",
    "heading_html": "一个你的 <span class=\"serif-it coral\">Agent</span> 不断学习的技能活档案。",
    "browse": "浏览全部技能",
    "items": [
      { "t": "guzang-ppt", "n": "A·01", "d": "会论证的演示，而非罗列。" },
      { "t": "kami-notes", "n": "A·02", "d": "语音备忘 → 结构化文档。" },
      { "t": "atlas-research", "n": "A·03", "d": "带实时引用的有源简报。" },
      { "t": "ledger", "n": "A·04", "d": "读懂你的数据，解释原因。" },
      { "t": "concierge", "n": "A·05", "d": "预订与跑腿，从头到尾。" }
    ]
  },
  "process": {
    "eyebrow": "工作方式 — 04",
    "heading_html": "从一个 <span class=\"serif-it coral\">信号</span> 到一套完整的 <span class=\"serif-it\">系统</span>。",
    "lede": "你给 Aleph 一个意图。其余交给它——一个透明的四拍子循环，你可随时暂停与引导。",
    "steps": [
      { "t": "捕捉", "d": "你交出一个意图——一句话、一个文件、一段语音。" },
      { "t": "理解", "d": "Aleph 从记忆中读取上下文，形成可读的计划。" },
      { "t": "编排", "d": "子 Agent 并行运行；你可暂停并引导其中任何一个。" },
      { "t": "交付", "d": "一份完成的成果，附上它如何完成的完整追踪。" }
    ]
  },
  "agents": {
    "eyebrow": "Agents — 05",
    "statement_html": "把一个模糊的 <span class=\"serif-it coral\">需求</span> 变成一份难忘、可交付的 <span class=\"serif-it\">成果</span>。",
    "body": "Aleph 按需启动专门打造的子 Agent。每个都是可命名、可审视的专家，你可以复用、共享或停用。",
    "stat1_b": "12+",
    "stat1": "内置 Agent",
    "stat2_b": "∞",
    "stat2": "自定义技能",
    "items": [
      { "name": "guzang", "tag": "decks", "d": "从一句话需求生成有论证、合品牌的演示。" },
      { "name": "kami", "tag": "docs", "d": "捕捉混乱的思路，返回结构化、有源的文档。" },
      { "name": "atlas", "tag": "research", "d": "进行深度多源研究，附可追溯的推理日志。" },
      { "name": "concierge", "tag": "logistics", "d": "从头到尾处理出行、下单与跑腿——你只需确认。" }
    ]
  },
  "testimonial": {
    "notes_label": "[ 现场笔记 — 06 ]",
    "access_label": "来自抢先体验",
    "quote_html": "“Aleph 把我模糊的 AI 愿望清单变成了一套 <span class=\"serif-it coral\">锐利</span>、可靠、且真正 <span class=\"serif-it\">属于我</span> 的系统。”",
    "name": "Mira Adelstein",
    "role": "独立研究者",
    "logos": ["Helix", "Northbeam", "Kerná", "BYVÖK", "Atlas&Co"],
    "fig_caption": "图 6 — 伙伴，而非工具"
  },
  "models": {
    "eyebrow": "引擎室 — 07",
    "heading_html": "由全球 <span class=\"serif-it coral\">最佳</span> 的 Agent 与模型驱动 — 你来选。",
    "lede": "Aleph 与模型无关。把任何任务路由给你信任的引擎，或让它自己选。更换提供商不丢失记忆与技能。",
    "chips": ["Claude", "GPT", "Gemini", "Llama (local)", "Mistral", "Qwen", "DeepSeek", "Your own"]
  },
  "faq": {
    "eyebrow": "问题 — 08",
    "title_html": "关于 <span class=\"coral\">Aleph</span>、Agent、记忆，以及本地优先。",
    "talk": "联系我们",
    "items": [
      { "q": "Aleph 的“本地优先”是什么意思？", "a": "默认情况下，Aleph 在你的设备上、用你的数据运行。除非你明确把任务路由给云端模型，否则记忆、文件与推理都留在本地——即使路由云端，你也能看到到底什么离开了你的机器。" },
      { "q": "这跟单一的聊天机器人有什么不同？", "a": "聊天机器人回答。Aleph 编排。它调度命名的子 Agent 处理研究、写作、代码与事务，并行运行，并把结果缝合成一份完整成果——全部在一场对话里。" },
      { "q": "这里的“可读”到底指什么？", "a": "Aleph 形成的每个计划、每次子 Agent 调用、以及它关于你的每段记忆，都可见且可编辑。你可以打开任何任务的追踪，查看推理并纠正。不在黑盒里发生任何事。" },
      { "q": "我能选择由哪个 AI 模型驱动吗？", "a": "能。Aleph 与模型无关。把任何任务路由给 Claude、GPT、Gemini、本地 Llama，或你自己的微调模型——并可随时切换提供商，不丢失记忆与技能。" },
      { "q": "记忆与个性化是如何工作的？", "a": "Aleph 为你建立一份私有、结构化的记忆，记录你的偏好、项目与人际。它属于你：可审视、可导出，甚至可以精确到单条事实的删除。" }
    ]
  },
  "footer": {
    "tagline": "通用个人 AI Agent 智能。本地优先。生来可读。",
    "h_product": "产品",
    "h_company": "公司",
    "h_start": "开始使用",
    "product": ["能力", "技能", "工作方式", "模型"],
    "company": ["关于", "理念", "加入我们", "媒体"],
    "start": ["下载", "文档", "更新日志", "状态"],
    "copyright": "© 2026 Aleph Labs · ℵ · 本地优先 AI",
    "motto": "为那些读脚注的人而造。"
  }
}
```

> 执行后请人工核对：保存为 UTF-8，zh 文本中无多余空格或转义残留。

- [ ] **Step 2: 校验 JSON 合法**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/messages/en.json','utf8'));JSON.parse(require('fs').readFileSync('src/messages/zh.json','utf8'));console.log('ok')"`
Expected: 输出 `ok`

- [ ] **Step 3: 提交**

```bash
git add src/messages/en.json src/messages/zh.json
git commit -m "home: replace i18n messages with new section content (en/zh)"
```

---

### Task 9: `Topbar`

**Files:**
- Create: `src/components/home/Topbar.tsx`

参考 markup：`AlephHome/Aleph.html` 第 42–78 行（topbar）。语言下拉用 next-intl 切换，仅 EN/中文。

- [ ] **Step 1: 创建 `src/components/home/Topbar.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export function Topbar() {
  const t = useTranslations("topbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (l: string) => {
    router.replace(pathname, { locale: l });
    setOpen(false);
  };

  return (
    <header className="topbar">
      <div className="wrap">
        <a className="brand" href="#top">
          <span className="mark">A</span>
          <span className="name">Aleph<sup>&trade;</sup></span>
        </a>
        <nav className="nav">
          <a href="#manifesto">{t("philosophy")}</a>
          <a href="#capabilities">{t("capabilities")}</a>
          <a href="#archive">{t("skills")}</a>
          <a href="#process">{t("how")}</a>
          <a href="#models">{t("models")}</a>
          <Link href="/docs">{t("docs")}</Link>
          <a href="#faq">{t("faq")}</a>
        </nav>
        <div className="topbar-right">
          <a
            className="icon-link"
            href="https://github.com/rootazero/Aleph"
            target="_blank"
            rel="noopener"
            aria-label="Aleph on GitHub"
          >
            {/* GitHub icon: copy <svg> from Aleph.html line 60 */}
            <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="<PASTE github icon d from Aleph.html line 60>" />
            </svg>
            {/* TODO(placeholder): real GitHub star count */}
            <span className="gh-count">{t("github_count")}</span>
          </a>
          <div className={`lang${open ? " open" : ""}`}>
            <button
              className="lang-btn"
              aria-haspopup="true"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18" />
              </svg>
              <span>{locale === "zh" ? "中文" : "EN"}</span>
              <span className="caret">▾</span>
            </button>
            <div className="lang-menu" role="menu">
              <button onClick={() => switchLocale("en")} className={locale === "en" ? "active" : ""}>English</button>
              <button onClick={() => switchLocale("zh")} className={locale === "zh" ? "active" : ""}>中文</button>
            </div>
          </div>
          {/* TODO(placeholder): Sign in has no backend yet */}
          <a className="btn btn-ghost btn-sm hide-sm" href="#">{t("signin")}</a>
        </div>
      </div>
    </header>
  );
}
```

> 把 `<PASTE github icon d ...>` 替换为 `Aleph.html` 第 60 行 GitHub `<path d>` 文本。下拉点击外部关闭由后续全局处理可省略；如需，可在组件内加 `useEffect` 监听 document click 关闭（可选，先不加以保持简单）。

- [ ] **Step 2: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/Topbar.tsx
git commit -m "home: add Topbar with next-intl language switch"
```

---

### Task 10: `Hero` + `Marquee`

**Files:**
- Create: `src/components/home/Hero.tsx`（覆盖旧文件）
- Create: `src/components/home/Marquee.tsx`

参考 markup：Hero `Aleph.html` 第 82–146 行；Marquee 第 148–154 行。Hero 为客户端（视差 + OS 下载）。

- [ ] **Step 1: 创建 `src/components/home/Marquee.tsx`（服务端组件）**

```tsx
import { useTranslations } from "next-intl";

export function Marquee() {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {row.map((it, i) => (
          <span className="item" key={i}>{it}</span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `src/components/home/Hero.tsx`（客户端组件）**

按 `Aleph.html` 82–146 行结构转写为 JSX：`hero-spec`（用 `hero.index_label/tag_label/est_label/geo_label`）、左右侧翼 `hero-fig`（用 `useParallax(0.18)` / `useParallax(-0.18)` 的 ref 套在 `.hero-fig` 上；内部用 `<BustFigure>`/`<PlantFigure>`/`<WingFigure>` + `coral-disc` span，inline style 照搬源文件）、`hero-title-wrap`（eyebrow、`display-xl` 标题=`hero.title`、`RichText` 渲染 `hero.sub_html`、`hero.desc`、CTA）。下载按钮用 `useOS()` + `OS_ICON` + `hero.dl_for/{os}` + `hero.dl_sub_*`；`dl-alts` 高亮当前 OS。

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useOS, useParallax } from "./hooks";
import { RichText } from "./RichText";
import { BustFigure, PlantFigure, WingFigure } from "./figures";
import { OS_ICON } from "./data";

const OS_NAME = { mac: "macOS", windows: "Windows", linux: "Linux" } as const;

export function Hero() {
  const t = useTranslations("hero");
  const os = useOS();
  const leftRef = useParallax(0.18);
  const rightRef = useParallax(-0.18);

  return (
    <section className="hero section ruled" id="top">
      <div className="wrap">
        <div className="hero-spec">
          <div className="col">
            <span className="label">{t("index_label")}</span>
            <span className="label">{t("tag_label")}</span>
          </div>
          <div className="col r">
            <span className="label">{t("est_label")}</span>
            <span className="label">{t("geo_label")}</span>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-fig left" ref={leftRef}>
            <div style={{ position: "relative" }}>
              <span className="coral-disc" style={{ width: "62%", aspectRatio: 1, left: "18%", top: "6%" }} />
              <BustFigure className="grain-fig" style={{ position: "relative", width: "100%", color: "var(--stone)" }} />
              <PlantFigure style={{ position: "absolute", width: "34%", right: "-6%", top: "-12%", color: "var(--sage)" }} />
            </div>
          </div>
          <div className="hero-fig right" ref={rightRef}>
            <div style={{ position: "relative", transform: "scaleX(-1)" }}>
              <span className="coral-disc" style={{ width: "58%", aspectRatio: 1, left: "22%", top: "10%", background: "var(--ink)" }} />
              <WingFigure className="grain-fig" style={{ position: "relative", width: "100%", color: "var(--stone-deep)" }} />
            </div>
          </div>

          <div className="hero-title-wrap">
            <div className="hero-eyebrow"><span className="eyebrow"><span className="dot" />{t("eyebrow")}</span></div>
            <h1 className="display-xl">{t("title")}</h1>
            <RichText as="div" className="hero-sub" html={t("sub_html")} />
            <p className="hero-desc">{t("desc")}</p>
            <div className="hero-cta">
              <a className="btn btn-ghost btn-star" href="https://github.com/rootazero/Aleph" target="_blank" rel="noopener">
                <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="<PASTE github icon d from Aleph.html line 119>" />
                </svg>
                <span>{t("star")}</span>
                {/* TODO(placeholder): real star count */}
                <span className="star-count">{t("star_count")}</span>
              </a>
              <a className="btn btn-dl" href="https://github.com/rootazero/Aleph/releases">
                <span className="os-ico lg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: OS_ICON[os] }} />
                <span className="dl-stack">
                  <b>{t("dl_for", { os: OS_NAME[os] })}</b>
                  <small>{t(`dl_sub_${os}`)}</small>
                </span>
              </a>
            </div>
            <div className="dl-alts">
              <span>{t("dl_also")}</span>{" "}
              <a href="https://github.com/rootazero/Aleph/releases" style={os === "mac" ? { color: "var(--coral)", borderColor: "var(--coral)" } : undefined}>macOS</a> {"·"}{" "}
              <a href="https://github.com/rootazero/Aleph/releases" style={os === "windows" ? { color: "var(--coral)", borderColor: "var(--coral)" } : undefined}>Windows</a> {"·"}{" "}
              <a href="https://github.com/rootazero/Aleph/releases" style={os === "linux" ? { color: "var(--coral)", borderColor: "var(--coral)" } : undefined}>Linux</a>
            </div>
          </div>
        </div>

        <div className="hero-foot">
          <div className="spec-row">
            <span className="spec"><span className="n">01</span> <b>{t("spec1_b")}</b> {t("spec1")}</span>
            <span className="spec"><span className="n">02</span> <b>{t("spec2_b")}</b> {t("spec2")}</span>
            <span className="spec"><span className="n">03</span> <b>{t("spec3_b")}</b> {t("spec3")}</span>
          </div>
          <span className="label">{t("scroll")}</span>
        </div>
      </div>
    </section>
  );
}
```

> 替换 `<PASTE github icon d ...>` 为 `Aleph.html` 第 119 行 path。`t(\`dl_sub_${os}\`)` 依赖 messages 键 `dl_sub_mac/windows/linux`，已在 Task 8 提供。

- [ ] **Step 3: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/Hero.tsx src/components/home/Marquee.tsx
git commit -m "home: add Hero (parallax + OS download) and Marquee"
```

---

### Task 11: `Manifesto`

**Files:**
- Create: `src/components/home/Manifesto.tsx`（服务端组件）

参考 markup：`Aleph.html` 第 156–185 行。collage-card 内的 coral-disc / halftone / 图形 / tape / caption 照搬 inline style。

- [ ] **Step 1: 创建组件**

```tsx
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { BustFigure, PlantFigure } from "./figures";

export function Manifesto() {
  const t = useTranslations("manifesto");
  return (
    <section className="manifesto section ruled" id="manifesto">
      <div className="wrap">
        <div className="hero-spec" style={{ marginBottom: 36 }}>
          <span className="label">{t("eyebrow_label")}</span>
          <span className="label">{t("sub_label")}</span>
        </div>
        <div className="manifesto-grid">
          <div className="reveal" data-anim="left">
            <RichText as="h2" className="h-statement" html={t("statement_html")} />
            <p className="body">{t("body")}</p>
            <div className="spec-row mt-l">
              <span className="spec"><b>{t("s1_b")}</b> {"—"} {t("s1")}</span>
              <span className="spec"><b>{t("s2_b")}</b> {"—"} {t("s2")}</span>
              <span className="spec"><b>{t("s3_b")}</b> {"—"} {t("s3")}</span>
            </div>
          </div>
          <div className="collage-card reveal" data-anim="right">
            <div style={{ position: "relative", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 6, aspectRatio: "3/3.4", overflow: "hidden" }}>
              <span className="coral-disc" style={{ width: "55%", aspectRatio: 1, left: "24%", top: "14%" }} />
              <span className="stone-block halftone" style={{ left: 0, bottom: 0, width: "46%", height: "30%", opacity: 0.5, backgroundImage: "radial-gradient(var(--ink) 26%,transparent 28%)", backgroundSize: "8px 8px" }} />
              <BustFigure className="grain-fig" data-drift="" style={{ position: "absolute", width: "62%", left: "20%", bottom: 0, color: "var(--ink)" }} />
              <PlantFigure style={{ position: "absolute", width: "26%", right: "14%", top: "8%", color: "var(--sage)" }} />
              <span className="tape rot-r" style={{ top: 10, left: 14 }} />
              <span className="label" style={{ position: "absolute", bottom: 12, left: 14 }}>{t("fig_caption")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

> `data-drift` 在 TSX 上以 `data-drift=""` 形式书写即可（空属性）。

- [ ] **Step 2: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/Manifesto.tsx
git commit -m "home: add Manifesto section"
```

---

### Task 12: `Capabilities` + `CapabilityPreview`

**Files:**
- Create: `src/components/home/CapabilityPreview.tsx`
- Create: `src/components/home/Capabilities.tsx`

逻辑参考 `app.js` 第 7–183 行（CAPS / chatBlock / stepsBlock / calBlock / showCap）。卡片 markup 参考 `Aleph.html` 第 189–250 行。

- [ ] **Step 1: 创建 `src/components/home/CapabilityPreview.tsx`**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { CAP_KIND, type CapId } from "./data";

function Step({ text, done }: { text: string; done: boolean }) {
  return (
    <div className="agent-step">
      <div className={`tick${done ? "" : " pending"}`}>
        {done ? (
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6" /></svg>
        ) : (
          <span className="typing" style={{ transform: "scale(.6)" }}><i /><i /><i /></span>
        )}
      </div>
      <span><b>{text}</b></span>
    </div>
  );
}

export function CapabilityPreview({ id }: { id: CapId }) {
  const t = useTranslations("capabilities");
  const item = t.raw(`items.${id}`) as Record<string, unknown>;
  const kind = CAP_KIND[id];

  if (kind === "chat") {
    const steps = (item.steps as string[]) ?? [];
    return (
      <div className="chat">
        <div className="bubble user">{item.user as string}</div>
        <div className="bubble bot" style={{ width: "88%" }}>
          <span className="who">Aleph · working</span>
          <div className="agent-steps">
            {steps.map((s, i) => <Step key={i} text={s} done={i < steps.length - 1} />)}
          </div>
        </div>
        <div className="bubble bot">
          <span className="who">Aleph</span>
          <RichText html={item.reply_html as string} />
        </div>
      </div>
    );
  }

  if (kind === "cal") {
    const slots = t.raw("cal_slots") as { t: string; label: string; kind: "block" | "soft" }[];
    return (
      <div className="chat">
        <div className="bubble user" style={{ alignSelf: "flex-start", background: "var(--coral)", color: "#fff", whiteSpace: "nowrap" }}>{item.head as string}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
          {slots.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", opacity: 0, transform: "translateX(-8px)", animation: "stepin .5s forwards", animationDelay: `${i * 0.12}s` }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", width: 42, flex: "none" }}>{s.t}</span>
              <div style={s.kind === "block"
                ? { flex: 1, padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500, background: "var(--ink)", color: "var(--paper)" }
                : { flex: 1, padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500, background: "var(--paper-deep)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 8 }}>{item.footer as string}</p>
      </div>
    );
  }

  // kind === "steps"
  const steps = (item.steps as string[]) ?? [];
  return (
    <div className="chat">
      <div className="bubble user" style={{ alignSelf: "flex-start", background: "var(--coral)", color: "#fff", whiteSpace: "nowrap" }}>{item.head as string}</div>
      <div className="agent-steps" style={{ marginTop: 4 }}>
        {steps.map((s, i) => <Step key={i} text={s} done={i < steps.length - 1} />)}
      </div>
      <p className="small" style={{ marginTop: 6 }}>{item.footer as string}</p>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `src/components/home/Capabilities.tsx`**

卡片图标用源文件第 205/211/217/223/229/235 行的内联 `<svg>`（六个），可直接照搬到一个 `CAP_ICON[id]` 的 JSX 映射，或在组件内 switch。下面用内联 switch。

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { CAP_IDS, type CapId } from "./data";
import { CapabilityPreview } from "./CapabilityPreview";

function CapIcon({ id }: { id: CapId }) {
  // Copy the matching <svg> inner markup from Aleph.html (research L205, inbox L211,
  // schedule L217, life L223, write L229, code L235). Keep className="ico".
  switch (id) {
    case "research": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M16 16l5 5" /></svg>;
    case "inbox": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
    case "schedule": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>;
    case "life": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 8h16l-1.5 11H5.5L4 8z" /><path d="M8 8a4 4 0 018 0" /></svg>;
    case "write": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z" /></svg>;
    case "code": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>;
  }
}

export function Capabilities() {
  const t = useTranslations("capabilities");
  const [active, setActive] = useState<CapId>("research");
  // remount key forces preview animation replay on tab change / first view
  const [replay, setReplay] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { setReplay((n) => n + 1); io.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (id: CapId) => { setActive(id); setReplay((n) => n + 1); };

  return (
    <section className="caps section" id="capabilities" ref={sectionRef}>
      <div className="wrap">
        <div className="caps-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18 }} html={t("heading_html")} />
          </div>
          <p className="lede reveal" data-anim="right" style={{ justifySelf: "end" }}>{t("lede")}</p>
        </div>

        <div className="caps-layout">
          <div className="cap-tabs reveal">
            {CAP_IDS.map((id) => (
              <button key={id} className={`cap-card${active === id ? " active" : ""}`} onClick={() => select(id)}>
                <div className="ix"><span>{t(`items.${id}.ix`)}</span><span>{"↳"}</span></div>
                <CapIcon id={id} />
                <h4>{t(`items.${id}.title`)}</h4>
                <p>{t(`items.${id}.desc`)}</p>
              </button>
            ))}
          </div>

          <div className="cap-preview reveal" data-anim="scale">
            <div className="cap-preview-top">
              <div className="cap-preview-dots"><i /><i /><i /></div>
              <span className="label">{t(`items.${active}.label`)}</span>
            </div>
            <div className="cap-body" key={replay}>
              <CapabilityPreview id={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

> `RichText` 需支持 `style` 透传——它已接受 `className`，再加 `style?: CSSProperties` 到 `RichTextProps` 并透传给 `Tag`。请在 Task 5 的 `RichText.tsx` 顺带加上 `style` 属性（若执行 Task 5 时未加，回到该文件补 `style?: React.CSSProperties` 并 `<Tag className={className} style={style} .../>`）。

- [ ] **Step 3: 给 `RichText` 增加 `style` 支持（若尚未）**

确保 `src/components/home/RichText.tsx` 为：

```tsx
import type { CSSProperties } from "react";

type RichTextProps = {
  html: string;
  className?: string;
  style?: CSSProperties;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
};

export function RichText({ html, className, style, as: Tag = "span" }: RichTextProps) {
  return <Tag className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
```

- [ ] **Step 4: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/CapabilityPreview.tsx src/components/home/Capabilities.tsx src/components/home/RichText.tsx
git commit -m "home: add Capabilities tabs with live preview renderers"
```

---

### Task 13: `Archive` + `Process`

**Files:**
- Create: `src/components/home/Archive.tsx`（服务端）
- Create: `src/components/home/Process.tsx`（服务端）

数据：`data.ts` 的 `GALLERY` / `PROCESS`；文案：`archive.items` / `process.steps`（raw 数组）。markup 参考 `Aleph.html` 254–266（archive）、270–282（process）+ `app.js` 185–239 的注入逻辑。

- [ ] **Step 1: 创建 `src/components/home/Archive.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { Figure } from "./figures";
import { GALLERY, TONE_VAR } from "./data";

export function Archive() {
  const t = useTranslations("archive");
  const items = t.raw("items") as { t: string; n: string; d: string }[];
  return (
    <section className="archive section" id="archive">
      <div className="wrap">
        <div className="archive-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18, maxWidth: "18ch" }} html={t("heading_html")} />
          </div>
          <a className="btn btn-ghost reveal" href="#">{t("browse")} <span className="arr">{"→"}</span></a>
        </div>
        <div className="gallery">
          {GALLERY.map((g, i) => {
            const item = items[i];
            const bustCol = g.tone === "ink" ? "var(--stone)" : "var(--ink)";
            return (
              <div className="tile" data-anim={g.anim} key={g.id}>
                <div className="frame">
                  <span className="coral-disc" style={{ width: "54%", aspectRatio: 1, left: "23%", top: "12%", background: TONE_VAR[g.tone] }} />
                  <Figure kind={g.fig} className={g.fig === "plant" ? undefined : "grain-fig"} style={{ position: "absolute", width: g.fig === "plant" ? "40%" : "62%", left: g.fig === "plant" ? "30%" : g.fig === "wing" ? "20%" : "19%", bottom: g.fig === "plant" ? "6%" : 0, color: g.fig === "wing" ? bustCol : "var(--ink)" }} />
                  <span className="label" style={{ position: "absolute", top: 10, left: 10 }}>{item.n}</span>
                </div>
                <div className="meta"><span className="t">{item.t}</span><span className="n">{"↗"}</span></div>
                <div className="desc">{item.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 创建 `src/components/home/Process.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { Figure } from "./figures";
import { PROCESS } from "./data";

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { t: string; d: string }[];
  return (
    <section className="process section ruled" id="process">
      <div className="wrap">
        <div className="process-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18 }} html={t("heading_html")} />
          </div>
          <p className="lede reveal" data-anim="right" style={{ maxWidth: "34ch" }}>{t("lede")}</p>
        </div>
        <div className="steps">
          {PROCESS.map((p, i) => (
            <div className="step reveal" key={p.id}>
              <div className="topline"><span className="num">{p.num}</span><span className="ln" /></div>
              <div className="frame">
                <span className="coral-disc" style={{ width: "50%", aspectRatio: 1, left: "25%", top: "14%" }} />
                <Figure kind={p.fig} className={p.fig === "plant" ? undefined : "grain-fig"} style={{ position: "absolute", width: p.fig === "plant" ? "42%" : "64%", left: p.fig === "plant" ? "29%" : "18%", bottom: p.fig === "plant" ? "8%" : 0, color: "var(--ink)" }} />
              </div>
              <h4>{steps[i].t}</h4>
              <p>{steps[i].d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/Archive.tsx src/components/home/Process.tsx
git commit -m "home: add Archive gallery and Process steps"
```

---

### Task 14: `AgentsShowcase`（暗色）

**Files:**
- Create: `src/components/home/AgentsShowcase.tsx`（服务端）

markup 参考 `Aleph.html` 284–300 + `app.js` 241–264（agent 卡片注入，含暗色 art SVG）。

- [ ] **Step 1: 创建组件**

```tsx
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { BustFigure } from "./figures";
import { AGENTS, TONE_VAR } from "./data";

export function AgentsShowcase() {
  const t = useTranslations("agents");
  const items = t.raw("items") as { name: string; tag: string; d: string }[];
  return (
    <section className="dark section">
      <div className="wrap">
        <div className="dark-grid">
          <div className="reveal" data-anim="left">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-statement" style={{ marginTop: 20 }} html={t("statement_html")} />
            <p style={{ color: "#b3a98f", marginTop: 22, maxWidth: "40ch" }}>{t("body")}</p>
            <div className="spec-row mt-l">
              <span className="spec"><b style={{ color: "#fff" }}>{t("stat1_b")}</b> {t("stat1")}</span>
              <span className="spec"><b style={{ color: "#fff" }}>{t("stat2_b")}</b> {t("stat2")}</span>
            </div>
          </div>
          <div className="agent-cards reveal" data-anim="right">
            {AGENTS.map((a, i) => {
              const item = items[i];
              return (
                <div className="agent-card" key={a.id}>
                  <div className="ac-head">
                    {/* TODO(placeholder): invented agent name */}
                    <span className="ac-name"><b>aleph/</b>{item.name}</span>
                    <span className="ac-tag">{item.tag}</span>
                  </div>
                  <div className="ac-art">
                    <span className="coral-disc" style={{ width: "46%", aspectRatio: 1, left: "10%", top: "14%", background: TONE_VAR[a.tone] }} />
                    <BustFigure className="grain-fig" style={{ position: "absolute", width: "42%", right: "8%", bottom: 0, color: "#3a3326" }} />
                    <span className="label" style={{ position: "absolute", bottom: 8, left: 10, color: "#7d745c" }}>live</span>
                  </div>
                  <p>{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/AgentsShowcase.tsx
git commit -m "home: add dark Agents showcase"
```

---

### Task 15: `Testimonial` + `Models`

**Files:**
- Create: `src/components/home/Testimonial.tsx`（服务端）
- Create: `src/components/home/Models.tsx`（服务端）

markup 参考 `Aleph.html` 302–334（testimonial）、336–344（models）。

- [ ] **Step 1: 创建 `src/components/home/Testimonial.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { BustFigure, PlantFigure } from "./figures";

export function Testimonial() {
  const t = useTranslations("testimonial");
  const logos = t.raw("logos") as string[];
  return (
    <section className="quote section ruled">
      <div className="wrap">
        <div className="hero-spec" style={{ marginBottom: 40 }}>
          <span className="label">{t("notes_label")}</span>
          <span className="label">{t("access_label")}</span>
        </div>
        <div className="quote-grid">
          <div className="reveal" data-anim="left">
            <RichText as="p" className="quote-text" html={t("quote_html")} />
            <div className="quote-by">
              <span className="av"><BustFigure style={{ position: "absolute", width: "130%", left: "-12%", top: "18%", color: "var(--ink)" }} /></span>
              <div>
                {/* TODO(placeholder): fictional testimonial */}
                <div className="nm">{t("name")}</div>
                <div className="rl">{t("role")}</div>
              </div>
            </div>
            <div className="logos-row">
              {logos.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>
          <div className="reveal" data-anim="clip" style={{ position: "relative" }}>
            <div style={{ position: "relative", aspectRatio: "1/1", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
              <span className="coral-disc" style={{ width: "48%", aspectRatio: 1, right: "12%", top: "12%" }} />
              <BustFigure className="grain-fig" data-drift="strong" style={{ position: "absolute", width: "58%", right: "8%", bottom: 0, color: "var(--ink)", transform: "scaleX(-1)" }} />
              <span className="stone-block" style={{ left: "10%", bottom: "14%", width: "22%", height: "22%", background: "var(--mustard)" }} />
              <PlantFigure style={{ position: "absolute", width: "24%", left: "12%", top: "14%", color: "var(--sage)" }} />
              <span className="label" style={{ position: "absolute", bottom: 12, left: 14 }}>{t("fig_caption")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 创建 `src/components/home/Models.tsx`**

```tsx
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";

export function Models() {
  const t = useTranslations("models");
  const chips = t.raw("chips") as string[];
  return (
    <section className="models section" id="models">
      <div className="wrap">
        <span className="eyebrow reveal" style={{ justifyContent: "center", display: "flex" }}><span className="dot" />{t("eyebrow")}</span>
        <RichText as="h2" className="h-section reveal" style={{ marginTop: 18 }} html={t("heading_html")} />
        <p className="lede reveal" style={{ margin: "18px auto 0", textAlign: "center" }}>{t("lede")}</p>
        <div className="model-chips reveal">
          {chips.map((c, i) => (
            <span className="chip" key={i}><span className="d" />{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/Testimonial.tsx src/components/home/Models.tsx
git commit -m "home: add Testimonial and Models sections"
```

---

### Task 16: `Faq` + `Footer`

**Files:**
- Create: `src/components/home/Faq.tsx`（客户端，手风琴）
- Create: `src/components/home/Footer.tsx`（服务端，覆盖 layout 旧 Footer 角色——新文件在 home/）

markup 参考 `Aleph.html` 348–360（faq）、364–390（footer）+ `app.js` 275–314（手风琴逻辑）。

- [ ] **Step 1: 创建 `src/components/home/Faq.tsx`**

用 React state 控制开合，`max-height` 用 ref 测量；默认展开第 0 项。

```tsx
"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="faq section" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div className="reveal" data-anim="left">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h3" className="faq-title" style={{ marginTop: 18 }} html={t("title_html")} />
            <a className="btn btn-ghost" href="#" style={{ marginTop: 40 }}>{t("talk")} <span className="arr">{"→"}</span></a>
          </div>
          <div className="acc reveal" data-anim="right">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div className={`acc-item${isOpen ? " open" : ""}`} key={i}>
                  <button className="acc-q" onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span>{f.q}</span><span className="pm">+</span>
                  </button>
                  <div
                    className="acc-a"
                    ref={(el) => { refs.current[i] = el; }}
                    style={{ maxHeight: isOpen ? refs.current[i]?.scrollHeight ?? 600 : 0 }}
                  >
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

> 首次渲染时 `refs.current[0]?.scrollHeight` 可能为 0（ref 尚未挂载）。为确保默认项展开，给 fallback `?? 600`；CSS `transition` 会在后续切换平滑。如需更精确，可加一个 `useEffect(() => setOpen(0), [])` 触发重测（可选）。

- [ ] **Step 2: 创建 `src/components/home/Footer.tsx`**

```tsx
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const product = t.raw("product") as string[];
  const company = t.raw("company") as string[];
  const start = t.raw("start") as string[];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <div className="big-mark">Aleph</div>
            <p style={{ color: "#9c917a", maxWidth: "30ch", marginTop: 14, fontSize: 14 }}>{t("tagline")}</p>
          </div>
          <div>
            <h5>{t("h_product")}</h5>
            <ul>{product.map((x, i) => <li key={i}><a href="#">{x}</a></li>)}</ul>
          </div>
          <div>
            <h5>{t("h_company")}</h5>
            <ul>{company.map((x, i) => <li key={i}><a href="#">{x}</a></li>)}</ul>
          </div>
          <div>
            <h5>{t("h_start")}</h5>
            <ul>{start.map((x, i) => <li key={i}><a href="#">{x}</a></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="label">{t("copyright")}</span>
          <span className="label">{t("motto")}</span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: 校验 + 提交**

Run: `pnpm typecheck`
Expected: PASS

```bash
git add src/components/home/Faq.tsx src/components/home/Footer.tsx
git commit -m "home: add FAQ accordion and Footer"
```

---

### Task 17: 组装首页 `page.tsx` 并接通滚动揭示

**Files:**
- Modify: `src/app/[locale]/page.tsx`（整体替换）
- Create: `src/components/home/RevealRunner.tsx`（客户端，挂 `useScrollReveal`）

- [ ] **Step 1: 创建 `src/components/home/RevealRunner.tsx`**

```tsx
"use client";

import { useScrollReveal } from "./hooks";

/** Mounts the IntersectionObserver fallback for `.reveal` elements. Renders nothing. */
export function RevealRunner() {
  useScrollReveal();
  return null;
}
```

- [ ] **Step 2: 用以下内容整体替换 `src/app/[locale]/page.tsx`**

```tsx
import { Topbar } from "@/components/home/Topbar";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Manifesto } from "@/components/home/Manifesto";
import { Capabilities } from "@/components/home/Capabilities";
import { Archive } from "@/components/home/Archive";
import { Process } from "@/components/home/Process";
import { AgentsShowcase } from "@/components/home/AgentsShowcase";
import { Testimonial } from "@/components/home/Testimonial";
import { Models } from "@/components/home/Models";
import { Faq } from "@/components/home/Faq";
import { Footer } from "@/components/home/Footer";
import { RevealRunner } from "@/components/home/RevealRunner";

export default function HomePage() {
  return (
    <>
      <Topbar />
      <main>
        <Hero />
        <Marquee />
        <Manifesto />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Capabilities />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Archive />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Process />
        <AgentsShowcase />
        <Testimonial />
        <Models />
        <div className="wrap"><hr className="hr-soft" /></div>
        <Faq />
      </main>
      <Footer />
      <RevealRunner />
    </>
  );
}
```

- [ ] **Step 3: 本地核对首页**

Run: `pnpm dev`，浏览 `http://localhost:3000` 与 `http://localhost:3000/zh`
Expected: 新首页完整渲染；语言切换可在 en/zh 间切换；能力 tab 可切换；FAQ 可展开；滚动有揭示动画；无控制台报错（缺失 message key 会在控制台报错——若有，回到 Task 8 补齐）。

- [ ] **Step 4: 提交**

```bash
git add "src/app/[locale]/page.tsx" src/components/home/RevealRunner.tsx
git commit -m "home: assemble new homepage and wire scroll reveal"
```

---

# 阶段三 — docs 统一为亮色编辑风

### Task 18: 填充 `docs.css` 覆盖层

**Files:**
- Modify: `src/app/docs.css`（替换 Task 2 创建的占位）

- [ ] **Step 1: 用以下内容替换 `src/app/docs.css`**

把 Fumadocs UI 调成纸张/珊瑚编辑风，与首页字体一致。`--color-fd-*` 已在 globals 映射，这里补字体与细节。

```css
/* ============================================================
   Docs (Fumadocs) — align with the homepage editorial look.
   Color tokens come from globals.css (--color-fd-*). Here we set
   typography, accents, and surface details.
   ============================================================ */

/* fonts: headings = display, body = sans, code = mono */
#nd-docs-layout,
.fd-docs,
[data-fd-docs] {
  font-family: var(--sans);
}

#nd-docs-layout h1,
#nd-docs-layout h2,
#nd-docs-layout h3,
#nd-docs-layout h4 {
  font-family: var(--display);
  letter-spacing: -0.01em;
}

#nd-docs-layout code,
#nd-docs-layout pre {
  font-family: var(--mono);
}

/* top nav: paper + blur + hairline, matching the homepage topbar */
#nd-nav,
[data-fd-nav] {
  background: color-mix(in srgb, var(--paper) 86%, transparent) !important;
  backdrop-filter: blur(10px) saturate(1.2);
  border-bottom: 1px solid var(--line);
}

/* links + accents */
#nd-docs-layout a {
  text-decoration-color: color-mix(in srgb, var(--coral) 50%, transparent);
}
#nd-docs-layout a:hover {
  color: var(--coral);
}

/* inline code chip */
#nd-docs-layout :not(pre) > code {
  background: var(--paper-deep);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 0.1em 0.4em;
}

/* code block surface */
#nd-docs-layout pre {
  background: var(--panel);
  border: 1px solid var(--line);
}

/* active sidebar item gets coral */
#nd-sidebar a[data-active="true"],
[data-fd-sidebar] a[data-active="true"] {
  color: var(--coral);
}

/* paper grain is global via body::before; nothing needed here */
```

> 选择器以 Fumadocs v16 常见结构为准。执行时用浏览器 DevTools 核对实际 DOM 的 id/属性（如 `#nd-nav`/`#nd-sidebar` 是否存在），按实际命名微调；保持"纸色底 + 珊瑚强调 + 三套字体"的目标即可。

- [ ] **Step 2: 本地核对 docs**

Run: `pnpm dev`，浏览 `http://localhost:3000/docs` 与 `http://localhost:3000/zh/docs`
Expected: docs 为纸色底、深墨文字、珊瑚强调、标题 Space Grotesk、代码 Space Mono；侧栏/TOC 正常；无亮/暗切换按钮（已禁用）。

- [ ] **Step 3: 验证搜索可用**

在 docs 页用搜索框输入关键词（如 "gateway"）。
Expected: `/api/search` 返回结果，下拉正常显示。

- [ ] **Step 4: 提交**

```bash
git add src/app/docs.css
git commit -m "docs: restyle Fumadocs to light editorial look"
```

---

# 阶段四 — 清理、测试、验证

### Task 19: 删除被替换的旧组件与未使用文件

**Files:**
- Delete: `src/components/home/Philosophy.tsx`、`Architecture.tsx`、`Features.tsx`、`QuickStart.tsx`
- Delete: `src/components/layout/Navbar.tsx`、`src/components/layout/Footer.tsx`
- Delete: `src/components/shared/ThemeToggle.tsx`、`LanguageSwitcher.tsx`、`GlassCard.tsx`、`AlephLogo.tsx`、`CodeBlock.tsx`

- [ ] **Step 1: 确认无残留引用**

Run: `grep -rn "components/layout\|components/shared\|home/Philosophy\|home/Architecture\|home/Features\|home/QuickStart" src --include=*.tsx --include=*.ts`
Expected: 无输出（或仅匹配将被删除的文件自身）。若 `page.tsx`/`layout.tsx` 等仍引用，先修正。

- [ ] **Step 2: 删除文件**

```bash
git rm src/components/home/Philosophy.tsx src/components/home/Architecture.tsx src/components/home/Features.tsx src/components/home/QuickStart.tsx \
  src/components/layout/Navbar.tsx src/components/layout/Footer.tsx \
  src/components/shared/ThemeToggle.tsx src/components/shared/LanguageSwitcher.tsx src/components/shared/GlassCard.tsx src/components/shared/AlephLogo.tsx src/components/shared/CodeBlock.tsx
```

- [ ] **Step 3: 校验**

Run: `pnpm typecheck && pnpm lint`
Expected: PASS（无"找不到模块"或未使用变量错误）

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "home: remove replaced dark-era components and unused shared files"
```

---

### Task 20: 更新 Playwright brand validation

**Files:**
- Modify: `tests/brand-validation.spec.ts`（整体替换）

新断言针对亮色新首页（中文 `/zh`）。

- [ ] **Step 1: 用以下内容整体替换**

```ts
import { test, expect } from '@playwright/test';

test('Aleph homepage — light editorial redesign (zh)', async ({ page }) => {
  test.setTimeout(60000);

  const response = await page.goto('http://localhost:3000/zh');
  expect(response?.status()).toBe(200);

  // 1. 纸色底（亮色设计，非 #050508）
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  // #f0ead9 -> rgb(240, 234, 217)
  expect(bg).toBe('rgb(240, 234, 217)');

  // 2. Hero 巨型标题
  await expect(page.locator('h1.display-xl')).toHaveText('Aleph');

  // 3. 关键中文板块标题可见（来自 zh messages）
  await expect(page.locator('text=能力 — 02')).toBeVisible(); // Capabilities eyebrow
  await expect(page.locator('text=工作方式 — 04')).toBeVisible(); // Process eyebrow

  // 4. 能力 tab 切换：点击第二个卡片，预览标签更新
  const cards = page.locator('.cap-card');
  await expect(cards.first()).toHaveClass(/active/);
  await cards.nth(1).click();
  await expect(cards.nth(1)).toHaveClass(/active/);

  // 5. FAQ 手风琴：默认第 0 项展开，点击第 1 项展开它
  const accItems = page.locator('.acc-item');
  await accItems.nth(1).locator('.acc-q').click();
  await expect(accItems.nth(1)).toHaveClass(/open/);

  // 6. 语言切换器存在且当前为中文
  await expect(page.locator('.lang-btn')).toContainText('中文');
});

test('Docs render in light theme (zh)', async ({ page }) => {
  const response = await page.goto('http://localhost:3000/zh/docs');
  expect(response?.status()).toBe(200);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(240, 234, 217)');
});
```

- [ ] **Step 2: 跑测试**

先在一个终端 `pnpm dev`，另一终端：
Run: `pnpm exec playwright test`
Expected: 两个测试 PASS。若某断言文案不符，按实际渲染微调（文案以 zh.json 为准）。

- [ ] **Step 3: 提交**

```bash
git add tests/brand-validation.spec.ts
git commit -m "test: update brand validation for light editorial redesign"
```

---

### Task 21: 更新 `CLAUDE.md` 设计描述

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: 更新"Key Design Decisions"与 Tailwind 段落中关于暗色的描述**

把 `CLAUDE.md` 中以下要点改为新设计（精确替换原句）：

1. "Dark-only design" 项 → 改为：
   `- **Light editorial design**: paper background \`#f0ead9\`, ink text \`#1b1712\`, coral accent \`#df4f26\` (with mustard/sage/stone supporting tones and dark \`#15120d\` showcase sections). No light/dark toggle; Fumadocs theme is disabled (\`RootProvider theme={{ enabled: false }}\` + \`baseOptions.themeSwitch.enabled = false\`).`
2. globals.css 示例块里的暗色 token 注释/值 → 改为新亮色 token（paper/ink/coral）与"light"措辞；删除 `<html class="dark">` 强制的描述（改为不再强制 dark）。
3. 字体相关：把 Geist 改为 Instrument Serif / Space Grotesk / Archivo / Space Mono（经 `next/font`）。
4. "Glass-morphism + Motion" 项 → 改为：`- **Editorial collage + CSS scroll animations**: paper-grain overlay, halftone, classical figure SVGs; scroll-driven entrances via \`animation-timeline: view()\` with an IntersectionObserver fallback.`

> 仅改这些与设计现状相符的描述；不要改动 routing/i18n/docs 内容结构等仍然准确的章节。

- [ ] **Step 2: 提交**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md to reflect light editorial redesign"
```

---

### Task 22: 全量构建与 Vercel 兼容核验

**Files:** 无（验证任务）

- [ ] **Step 1: 干净构建**

Run: `pnpm install && pnpm typecheck && pnpm lint && pnpm build`
Expected: 全部 PASS；`next build` 成功产出（`.source/` 生成、各 locale 静态页生成、无预渲染抛错）。

- [ ] **Step 2: 生产启动核对**

Run: `pnpm start`，浏览 `/`、`/zh`、`/docs`、`/zh/docs`
Expected: 四个路由均 200，视觉统一亮色编辑风，字体为构建期自托管（Network 无 fonts.googleapis.com 外链）。

- [ ] **Step 3: 占位清单交付**

在 PR/对话中列出 `grep -rn "TODO(placeholder)" src` 的结果，连同 messages 中的占位项（星数、Mira Adelstein、guzang/kami/atlas、Sign in、聊天 demo），交付给用户确认/替换。

Run: `grep -rn "TODO(placeholder)" src`
Expected: 列出 Topbar/Hero（星数）、Hero（star_count）、AgentsShowcase（agent 名）、Testimonial（评价）、Topbar（Sign in）等位置。

- [ ] **Step 4: 收尾提交（如有微调）**

```bash
git add -A
git commit -m "home: final polish after full build verification"
```

---

## 自检（spec 覆盖核对）

- 设计系统反转（亮色 token/字体/grain/selection）→ Task 1–3 ✅
- 去暗色强制（root + locale layout）→ Task 1, 4 ✅
- 首页 13 组件 + figures + data + hooks → Task 5–17 ✅
- 占位"忠实搬运+标记" → messages 保留原值 + `TODO(placeholder)` 注释（Topbar/Hero/Agents/Testimonial）+ Task 22 Step 3 交付清单 ✅
- 仅 en/zh，丢弃 ja 与 localStorage 三语 → Task 8 messages 仅 en/zh；Topbar 仅 EN/中文 ✅
- 动画沿用 CSS + 轻量 JS（改 React hooks，无 DOM 注入）→ home.css 保留 CSS 动画 + hooks.ts ✅
- docs 亮色 only、无切换、token 映射 + 覆盖层 + Fumadocs 顶栏对齐 + 搜索验证 → Task 2（fd 映射）+ Task 18 ✅
- Vercel：next/font、纯 CSS 动画、`"use client"` 边界、`.source/` 构建链 → Task 1, 22 ✅
- React 栈不变 → 全程 React 组件/hooks ✅
- 清理旧组件 + 更新 Playwright + 更新 CLAUDE.md + 构建验证 → Task 19–22 ✅

## 类型一致性核对

- `useOS()` 返回 `OS = "mac"|"windows"|"linux"`；`OS_ICON`/`OS_NAME`/`dl_sub_${os}` 键一致 ✅
- `CapId` 来自 `CAP_IDS`；`CAP_KIND`/`messages.capabilities.items.<id>` 键一致 ✅
- `RichText` 含 `style` 支持（Task 5/Task 12 Step 3 确保）✅
- `Figure({kind})` 与 `data.ts` 的 `fig: FigKind` 一致 ✅
- `t.raw(...)` 读取的数组/对象结构与 messages JSON 结构一致（marquee.items / capabilities.items.<id> / cal_slots / archive.items / process.steps / agents.items / testimonial.logos / models.chips / faq.items / footer.product|company|start）✅

## YAGNI / 非目标

不加 ja；不为 docs 做暗色或切换；不引入新动画库/状态库；不改 docs 内容本身；不实现真实下载/登录后端。
