# Aleph Homepage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a bilingual (EN/ZH), dark-first single-page product landing page for Aleph using Next.js 15 + Tailwind CSS 4.2.

**Architecture:** Next.js App Router with `src/` directory, route-based i18n via next-intl (`/en`, `/zh`), Tailwind v4 CSS-first configuration, Framer Motion for scroll-triggered animations, glassmorphism cards. All pages SSG.

**Tech Stack:** Next.js 15, Tailwind CSS 4.2, TypeScript, next-intl, next-themes, motion (Framer Motion), pnpm, Vercel

**Design doc:** `docs/plans/2026-02-25-homepage-design.md`

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/lib/utils.ts`

**Step 1: Initialize Next.js project**

```bash
cd /Volumes/TBU4/Workspace/AlephHomepage
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --skip-install
```

If it asks to overwrite, say yes. This creates the scaffold.

**Step 2: Install Tailwind CSS v4.2 and dependencies**

```bash
cd /Volumes/TBU4/Workspace/AlephHomepage
pnpm install
pnpm install tailwindcss@latest @tailwindcss/postcss@latest
pnpm install motion next-themes next-intl
pnpm install -D @types/node
```

**Step 3: Configure PostCSS for Tailwind v4**

Replace `postcss.config.mjs` with:

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Step 4: Set up Tailwind v4 globals.css with @theme**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-aleph-deep: #0a0e27;
  --color-aleph-navy: #060818;
  --color-aleph-blue: #0A84FF;
  --color-aleph-purple: #5E5CE6;
  --color-aleph-cyan: #80E0FF;
  --color-aleph-muted: #a0aec0;
  --color-aleph-surface: oklch(100% 0 0 / 0.05);
  --color-aleph-border: oklch(100% 0 0 / 0.1);

  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  --animate-fade-in: fade-in 0.6s var(--ease-fluid) both;
  --animate-slide-up: slide-up 0.6s var(--ease-fluid) both;
  --animate-glow-pulse: glow-pulse 3s ease-in-out infinite;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glow-pulse {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(10, 132, 255, 0.3)); }
  50% { filter: drop-shadow(0 0 40px rgba(94, 92, 230, 0.5)); }
}
```

**Step 5: Set up root layout with fonts**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aleph (ℵ) — The point containing all points",
  description: "A self-hosted polymorphic AI assistant built in Rust",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 6: Create utility helper**

Create `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install clsx and tailwind-merge:

```bash
pnpm install clsx tailwind-merge
```

**Step 7: Verify dev server starts**

```bash
pnpm dev
```

Expected: Server starts on http://localhost:3000, no errors.

**Step 8: Commit**

```bash
git init
echo "node_modules/\n.next/\nout/\n.DS_Store\n*.tsbuildinfo" > .gitignore
git add -A
git commit -m "scaffold: Next.js 15 + Tailwind CSS 4.2 project setup"
```

---

## Task 2: Internationalization Setup (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Create: `src/messages/en.json`
- Create: `src/messages/zh.json`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `next.config.ts`

**Step 1: Create i18n routing config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
});
```

**Step 2: Create navigation helpers**

Create `src/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

**Step 3: Create request config**

Create `src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Step 4: Create middleware**

Create `src/middleware.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

**Step 5: Create message files**

Create `src/messages/en.json`:

```json
{
  "nav": {
    "github": "GitHub",
    "docs": "Docs"
  },
  "hero": {
    "title": "The point containing all points",
    "subtitle": "A self-hosted polymorphic AI assistant built in Rust",
    "borges": "El Aleph es uno de los puntos del espacio que contiene todos los puntos.",
    "cta_start": "Get Started",
    "cta_github": "GitHub"
  },
  "philosophy": {
    "title": "Five Layers of Emergence",
    "closing": "Aleph IS Layer 5 — The shell for a ghost.",
    "l1_name": "Sea of Knowledge",
    "l1_desc": "The ocean of human experience — text, code, history, wisdom",
    "l2_name": "Domain Classification",
    "l2_desc": "Medical, Legal, Code, Physics — knowledge gains structure",
    "l3_name": "Atomic Skills",
    "l3_desc": "Know-what transforms into Know-how — knowledge becomes capability",
    "l4_name": "Functional Modules",
    "l4_desc": "Plug & Play encapsulation — skills become composable building blocks",
    "l5_name": "Polymorphic Agents",
    "l5_desc": "The soul finally has a shell — transform into any form to act upon the world"
  },
  "architecture": {
    "title": "1-2-3-4 Architecture",
    "core_title": "Core",
    "core_label": "The Brain",
    "core_desc": "Rust Core: reasoning, state management, routing",
    "faces_title": "Faces",
    "faces_label": "The Faces",
    "faces_desc": "Unified Panel (Leptos/WASM) + Social Bot channels",
    "limbs_title": "Limbs",
    "limbs_label": "The Limbs",
    "limbs_desc": "Native capabilities + MCP tools + Skills & Plugins",
    "nerves_title": "Nerves",
    "nerves_label": "The Nerves",
    "nerves_desc": "WebSocket + IPC + gRPC + JSON-RPC protocols"
  },
  "features": {
    "title": "Features",
    "polymorphic_title": "Polymorphic Intelligence",
    "polymorphic_desc": "One AI core, infinite manifestations across CLI, desktop, mobile, and messaging",
    "learning_title": "Self-Learning Agent",
    "learning_desc": "POE architecture crystallizes successful experiences into reusable skills",
    "memory_title": "Hybrid Memory",
    "memory_desc": "Facts DB + vector search + full-text search with automatic compression",
    "tools_title": "19+ Built-in Tools",
    "tools_desc": "File ops, web search, code execution, plus MCP protocol for any tool server",
    "provider_title": "Multi-Provider",
    "provider_desc": "Claude, GPT, Gemini, DeepSeek, Moonshot, Ollama — use any LLM",
    "privacy_title": "Privacy-First",
    "privacy_desc": "Self-hosted, runs entirely on your devices, your data never leaves"
  },
  "quickstart": {
    "title": "Quick Start",
    "tab_gateway": "Gateway",
    "tab_cli": "CLI",
    "tab_desktop": "Desktop",
    "requires": "Requires Rust 1.92+",
    "copied": "Copied!"
  },
  "footer": {
    "description": "A self-hosted polymorphic AI assistant",
    "project": "Project",
    "resources": "Resources",
    "architecture_link": "Architecture",
    "roadmap": "Roadmap",
    "license": "MIT License",
    "borges_closing": "The Aleph is one of the points in space that contains all other points."
  }
}
```

Create `src/messages/zh.json`:

```json
{
  "nav": {
    "github": "GitHub",
    "docs": "文档"
  },
  "hero": {
    "title": "包含所有点的那个点",
    "subtitle": "以 Rust 构建的自托管多态 AI 助手",
    "borges": "Aleph 是空间中包含所有其他点的那个点。",
    "cta_start": "快速开始",
    "cta_github": "GitHub"
  },
  "philosophy": {
    "title": "五层涌现",
    "closing": "Aleph 就是第五层 — 灵魂的躯壳。",
    "l1_name": "经验之海",
    "l1_desc": "人类经验的海洋 — 文本、代码、历史、智慧",
    "l2_name": "领域分类",
    "l2_desc": "医学、法律、编程、物理 — 知识有了学科边界",
    "l3_name": "原子技能",
    "l3_desc": "Know-what 蜕变为 Know-how — 从拥有知识到拥有能力",
    "l4_name": "功能模块",
    "l4_desc": "即插即用的封装 — 技能成为可组合的构建块",
    "l5_name": "多态智能体",
    "l5_desc": "灵魂终于获得躯壳 — 随需变身，干涉物理与数字世界"
  },
  "architecture": {
    "title": "1-2-3-4 架构模型",
    "core_title": "核心",
    "core_label": "大脑",
    "core_desc": "Rust Core：推理规划、状态管理、路由分发",
    "faces_title": "界面",
    "faces_label": "面孔",
    "faces_desc": "统一面板 (Leptos/WASM) + 社交 Bot 通道",
    "limbs_title": "四肢",
    "limbs_label": "执行",
    "limbs_desc": "原生能力 + MCP 工具 + 技能与插件",
    "nerves_title": "神经",
    "nerves_label": "通信",
    "nerves_desc": "WebSocket + IPC + gRPC + JSON-RPC 协议"
  },
  "features": {
    "title": "核心特性",
    "polymorphic_title": "多态智能",
    "polymorphic_desc": "一个 AI 核心，通过 CLI、桌面、移动端和即时通讯无限化身",
    "learning_title": "自学习 Agent",
    "learning_desc": "POE 架构将成功经验结晶化为可复用的技能",
    "memory_title": "混合记忆",
    "memory_desc": "事实库 + 向量检索 + 全文搜索，自动压缩上下文",
    "tools_title": "19+ 内置工具",
    "tools_desc": "文件操作、网络搜索、代码执行，加 MCP 协议接入任意工具",
    "provider_title": "多模型支持",
    "provider_desc": "Claude、GPT、Gemini、DeepSeek、Moonshot、Ollama — 任选 LLM",
    "privacy_title": "隐私优先",
    "privacy_desc": "自托管，完全运行在你的设备上，数据绝不离开"
  },
  "quickstart": {
    "title": "快速开始",
    "tab_gateway": "网关",
    "tab_cli": "命令行",
    "tab_desktop": "桌面端",
    "requires": "需要 Rust 1.92+",
    "copied": "已复制！"
  },
  "footer": {
    "description": "自托管多态 AI 助手",
    "project": "项目",
    "resources": "资源",
    "architecture_link": "架构文档",
    "roadmap": "路线图",
    "license": "MIT 许可证",
    "borges_closing": "Aleph 是空间中包含所有其他点的那个点。"
  }
}
```

**Step 6: Create locale layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
```

**Step 7: Create placeholder page**

Create `src/app/[locale]/page.tsx`:

```tsx
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("hero");
  return (
    <main className="min-h-screen bg-aleph-deep text-white flex items-center justify-center">
      <h1 className="text-5xl font-display font-bold">{t("title")}</h1>
    </main>
  );
}
```

**Step 8: Update next.config.ts**

Add the next-intl plugin:

```ts
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {};

export default withNextIntl(nextConfig);
```

**Step 9: Remove old page.tsx if it exists**

Delete `src/app/page.tsx` (the default Next.js page) since we now use `src/app/[locale]/page.tsx`.

**Step 10: Verify i18n works**

```bash
pnpm dev
# Visit http://localhost:3000/en — should show "The point containing all points"
# Visit http://localhost:3000/zh — should show "包含所有点的那个点"
# Visit http://localhost:3000 — should redirect to /en
```

**Step 11: Commit**

```bash
git add -A
git commit -m "i18n: add next-intl with EN/ZH bilingual routing"
```

---

## Task 3: Shared Components (Logo, GlassCard, CodeBlock)

**Files:**
- Create: `public/aleph-logo.svg` (copy from Aleph project)
- Create: `src/components/shared/AlephLogo.tsx`
- Create: `src/components/shared/GlassCard.tsx`
- Create: `src/components/shared/CodeBlock.tsx`

**Step 1: Copy logo SVG**

```bash
cp /Volumes/TBU4/Workspace/Aleph/docs/assets/aleph-logo.svg /Volumes/TBU4/Workspace/AlephHomepage/public/aleph-logo.svg
```

**Step 2: Create AlephLogo component**

Create `src/components/shared/AlephLogo.tsx`:

```tsx
"use client";

import { motion } from "motion/react";

export function AlephLogo({ size = 128 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.3, 0, 0, 1] }}
      className="relative"
    >
      <div className="absolute inset-0 animate-glow-pulse rounded-full" />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id="mainGradient" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A84FF" />
            <stop offset="1" stopColor="#5E5CE6" />
          </linearGradient>
          <linearGradient id="satGradient" x1="30" y1="15" x2="45" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#80E0FF" />
            <stop offset="1" stopColor="#0A84FF" />
          </linearGradient>
        </defs>
        <path
          d="M55 15 C59 40 70 51 95 55 C70 59 59 70 55 95 C51 70 40 59 15 55 C40 51 51 40 55 15Z"
          fill="url(#mainGradient)"
        />
        <path
          d="M35 14 C35.8 19 37 21 43 22 C37 23 35.8 25 35 30 C34.2 25 33 23 27 22 C33 21 34.2 19 35 14Z"
          fill="url(#satGradient)"
        />
      </svg>
    </motion.div>
  );
}
```

**Step 3: Create GlassCard component**

Create `src/components/shared/GlassCard.tsx`:

```tsx
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-aleph-border bg-aleph-surface backdrop-blur-xl p-6",
        hover && "transition-all duration-300 ease-fluid hover:-translate-y-1 hover:border-aleph-blue/30 hover:shadow-[0_0_30px_rgba(10,132,255,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Step 4: Create CodeBlock component**

Create `src/components/shared/CodeBlock.tsx`:

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  code,
  language = "bash",
  className,
}: {
  code: string;
  language?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group rounded-xl bg-[#0d1117] border border-aleph-border overflow-hidden", className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-aleph-border">
        <span className="text-xs text-aleph-muted font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-aleph-muted hover:text-white transition-colors"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm font-mono text-aleph-cyan">{code}</code>
      </pre>
    </div>
  );
}
```

**Step 5: Verify components render**

Temporarily use them in the page to verify they render correctly. Check dev server for errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "components: add AlephLogo, GlassCard, and CodeBlock shared components"
```

---

## Task 4: Navbar + Footer Layout

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/shared/LanguageSwitcher.tsx`
- Create: `src/components/shared/ThemeToggle.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Install next-themes**

Already installed in Task 1. If not:

```bash
pnpm install next-themes
```

**Step 2: Create ThemeToggle component**

Create `src/components/shared/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-aleph-muted hover:text-white transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
```

**Step 3: Create LanguageSwitcher component**

Create `src/components/shared/LanguageSwitcher.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "en" ? "text-white" : "text-aleph-muted hover:text-white"
        }`}
      >
        EN
      </button>
      <span className="text-aleph-border">/</span>
      <button
        onClick={() => switchLocale("zh")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "zh" ? "text-white" : "text-aleph-muted hover:text-white"
        }`}
      >
        中
      </button>
    </div>
  );
}
```

**Step 4: Create Navbar component**

Create `src/components/layout/Navbar.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled
          ? "bg-aleph-deep/80 backdrop-blur-xl border-b border-aleph-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" fill="none" className="w-7 h-7">
            <defs>
              <linearGradient id="navGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0A84FF" />
                <stop offset="1" stopColor="#5E5CE6" />
              </linearGradient>
            </defs>
            <path d="M55 15 C59 40 70 51 95 55 C70 59 59 70 55 95 C51 70 40 59 15 55 C40 51 51 40 55 15Z" fill="url(#navGrad)" />
          </svg>
          <span className="font-display font-semibold text-lg text-white">Aleph</span>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <a
            href="https://github.com/user/aleph"
            target="_blank"
            rel="noopener noreferrer"
            className="text-aleph-muted hover:text-white transition-colors"
            aria-label={t("github")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
```

**Step 5: Create Footer component**

Create `src/components/layout/Footer.tsx`:

```tsx
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-aleph-border bg-aleph-navy">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-aleph-blue to-aleph-purple bg-clip-text text-transparent">
                ℵ
              </span>
              <span className="font-display font-semibold text-white">Aleph</span>
            </div>
            <p className="text-sm text-aleph-muted">{t("description")}</p>
          </div>

          {/* Project links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("project")}</h3>
            <ul className="space-y-2 text-sm text-aleph-muted">
              <li><a href="https://github.com/user/aleph" className="hover:text-white transition-colors">{t("project")}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("roadmap")}</a></li>
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t("resources")}</h3>
            <ul className="space-y-2 text-sm text-aleph-muted">
              <li><a href="#" className="hover:text-white transition-colors">{t("architecture_link")}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-aleph-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-aleph-muted">{t("license")}</p>
          <p className="text-xs text-aleph-muted italic">
            &ldquo;{t("borges_closing")}&rdquo; — Jorge Luis Borges
          </p>
        </div>
      </div>
    </footer>
  );
}
```

**Step 6: Update locale layout to include Navbar, Footer, and ThemeProvider**

Update `src/app/[locale]/layout.tsx`:

```tsx
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = useMessages();
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
```

**Step 7: Verify layout renders**

```bash
pnpm dev
# Visit http://localhost:3000/en — Navbar on top, content, Footer at bottom
# Verify language switcher works (EN/中 buttons)
# Verify theme toggle works (dark/light)
```

**Step 8: Commit**

```bash
git add -A
git commit -m "layout: add Navbar with i18n switcher and Footer"
```

---

## Task 5: Hero Section

**Files:**
- Create: `src/components/home/Hero.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create Hero component**

Create `src/components/home/Hero.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { AlephLogo } from "@/components/shared/AlephLogo";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-aleph-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <AlephLogo size={128} />
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.3, 0, 0, 1] }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.3, 0, 0, 1] }}
          className="mt-6 text-lg md:text-xl text-aleph-muted max-w-2xl mx-auto"
        >
          {t("subtitle")}
        </motion.p>

        {/* Borges quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-sm text-aleph-muted/60 italic"
        >
          &ldquo;{t("borges")}&rdquo;
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.3, 0, 0, 1] }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-aleph-blue to-aleph-purple text-white font-medium transition-all hover:shadow-[0_0_30px_rgba(10,132,255,0.3)] hover:-translate-y-0.5"
          >
            {t("cta_start")}
            <span aria-hidden>→</span>
          </a>
          <a
            href="https://github.com/user/aleph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-aleph-border text-aleph-muted hover:text-white hover:border-aleph-blue/50 transition-all"
          >
            {t("cta_github")}
            <span aria-hidden>↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: Update page to use Hero**

Replace `src/app/[locale]/page.tsx`:

```tsx
import { Hero } from "@/components/home/Hero";

export default function HomePage() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

**Step 3: Verify Hero renders**

```bash
pnpm dev
# Visit http://localhost:3000/en — Full viewport hero with animated logo, title, buttons
# Visit http://localhost:3000/zh — Chinese text renders correctly
```

**Step 4: Commit**

```bash
git add -A
git commit -m "home: add Hero section with animated logo and bilingual text"
```

---

## Task 6: Philosophy Section (Five Layers of Emergence)

**Files:**
- Create: `src/components/home/Philosophy.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create Philosophy component**

Create `src/components/home/Philosophy.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const layers = [
  { key: "l1", symbol: "", number: "L1" },
  { key: "l2", symbol: "ℵ₀", number: "L2" },
  { key: "l3", symbol: "ℵ₁", number: "L3" },
  { key: "l4", symbol: "ℵ₂", number: "L4" },
  { key: "l5", symbol: "ℵ₃", number: "L5" },
];

export function Philosophy() {
  const t = useTranslations("philosophy");

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <div className="flex flex-col gap-3">
          {layers.map((layer, i) => {
            const isL5 = i === 4;
            return (
              <motion.div
                key={layer.key}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: [0.3, 0, 0, 1],
                }}
                className={`relative flex items-center gap-4 rounded-xl px-6 py-4 border transition-all ${
                  isL5
                    ? "bg-gradient-to-r from-aleph-blue/20 to-aleph-purple/20 border-aleph-blue/40 shadow-[0_0_30px_rgba(10,132,255,0.15)]"
                    : "bg-aleph-surface border-aleph-border"
                }`}
                style={{ marginLeft: `${(4 - i) * 16}px`, marginRight: `${(4 - i) * 16}px` }}
              >
                <span className="shrink-0 w-10 text-center font-mono text-sm text-aleph-cyan">
                  {layer.number}
                </span>
                {layer.symbol && (
                  <span className="shrink-0 w-8 text-center font-display text-aleph-blue">
                    {layer.symbol}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-white">
                    {t(`${layer.key}_name`)}
                  </span>
                  <span className="ml-3 text-sm text-aleph-muted">
                    {t(`${layer.key}_desc`)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center text-lg font-display text-aleph-muted italic"
        >
          {t("closing")}
        </motion.p>
      </div>
    </section>
  );
}
```

**Step 2: Add to page**

Update `src/app/[locale]/page.tsx`:

```tsx
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Philosophy />
    </main>
  );
}
```

**Step 3: Verify**

```bash
pnpm dev
# Scroll down past Hero — five layers should animate in sequentially
# L5 should have special glow treatment
# Check both /en and /zh
```

**Step 4: Commit**

```bash
git add -A
git commit -m "home: add Philosophy section with Five Layers of Emergence"
```

---

## Task 7: Architecture Section (1-2-3-4 Model)

**Files:**
- Create: `src/components/home/Architecture.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create Architecture component**

Create `src/components/home/Architecture.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/shared/GlassCard";

const cards = [
  { key: "core", number: "1" },
  { key: "faces", number: "2" },
  { key: "limbs", number: "3" },
  { key: "nerves", number: "4" },
];

export function Architecture() {
  const t = useTranslations("architecture");

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.3, 0, 0, 1],
              }}
            >
              <GlassCard className="text-center h-full">
                <div className="text-7xl md:text-8xl font-display font-bold bg-gradient-to-b from-aleph-blue to-aleph-purple bg-clip-text text-transparent leading-none mb-4">
                  {card.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {t(`${card.key}_title`)}
                </h3>
                <p className="text-sm text-aleph-cyan font-medium mb-3">
                  {t(`${card.key}_label`)}
                </p>
                <p className="text-sm text-aleph-muted">
                  {t(`${card.key}_desc`)}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add to page**

Update `src/app/[locale]/page.tsx` to include `<Architecture />` after `<Philosophy />`.

**Step 3: Verify**

```bash
pnpm dev
# Four cards with big numbers 1-2-3-4, gradient text, glass cards
# Responsive: 4-col → 2-col → 1-col
```

**Step 4: Commit**

```bash
git add -A
git commit -m "home: add Architecture section with 1-2-3-4 model cards"
```

---

## Task 8: Features Section

**Files:**
- Create: `src/components/home/Features.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create Features component**

Create `src/components/home/Features.tsx`:

```tsx
"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/shared/GlassCard";

const features = [
  { key: "polymorphic", icon: "◇" },
  { key: "learning", icon: "⬡" },
  { key: "memory", icon: "◈" },
  { key: "tools", icon: "⚙" },
  { key: "provider", icon: "⊞" },
  { key: "privacy", icon: "⛊" },
];

export function Features() {
  const t = useTranslations("features");

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.3, 0, 0, 1],
              }}
            >
              <GlassCard className="h-full">
                <div className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-aleph-blue/20 to-aleph-purple/20 text-aleph-cyan">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(`${feature.key}_title`)}
                </h3>
                <p className="text-sm text-aleph-muted leading-relaxed">
                  {t(`${feature.key}_desc`)}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add to page**

Update `src/app/[locale]/page.tsx` to include `<Features />` after `<Architecture />`.

**Step 3: Verify**

```bash
pnpm dev
# 3x2 grid of glass cards with icons, titles, descriptions
# Responsive: 3-col → 2-col → 1-col
```

**Step 4: Commit**

```bash
git add -A
git commit -m "home: add Features section with 6 capability cards"
```

---

## Task 9: Quick Start Section

**Files:**
- Create: `src/components/home/QuickStart.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create QuickStart component**

Create `src/components/home/QuickStart.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CodeBlock } from "@/components/shared/CodeBlock";

const tabs = [
  {
    key: "tab_gateway",
    code: `# Start the Gateway server
cargo run -p alephcore --features gateway \\
  --bin aleph-gateway -- start`,
  },
  {
    key: "tab_cli",
    code: `# Use the CLI client
cargo run -p aleph-cli -- "Hello, Aleph!"`,
  },
  {
    key: "tab_desktop",
    code: `# Launch the Desktop app (Tauri)
cd apps/desktop
pnpm install
pnpm tauri dev`,
  },
];

export function QuickStart() {
  const t = useTranslations("quickstart");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="quickstart" className="relative py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-12 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.3, 0, 0, 1] }}
        >
          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl bg-aleph-surface border border-aleph-border w-fit">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === i
                    ? "bg-aleph-blue/20 text-white"
                    : "text-aleph-muted hover:text-white"
                }`}
              >
                {t(tab.key)}
              </button>
            ))}
          </div>

          {/* Code block */}
          <CodeBlock code={tabs[activeTab].code} language="bash" />

          <p className="mt-4 text-sm text-aleph-muted text-center">
            {t("requires")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2: Add to page**

Update `src/app/[locale]/page.tsx` to include `<QuickStart />` after `<Features />`.

**Step 3: Verify**

```bash
pnpm dev
# Tabbed code blocks with Gateway/CLI/Desktop tabs
# Copy button works
# "Requires Rust 1.92+" note below
```

**Step 4: Commit**

```bash
git add -A
git commit -m "home: add QuickStart section with tabbed code blocks"
```

---

## Task 10: Final Assembly, Polish, and Build Verification

**Files:**
- Modify: `src/app/[locale]/page.tsx` (final assembly)
- Modify: `src/app/globals.css` (any polish tweaks)
- Modify: `package.json` (add typecheck script)

**Step 1: Ensure final page assembles all sections**

`src/app/[locale]/page.tsx` should be:

```tsx
import { Hero } from "@/components/home/Hero";
import { Philosophy } from "@/components/home/Philosophy";
import { Architecture } from "@/components/home/Architecture";
import { Features } from "@/components/home/Features";
import { QuickStart } from "@/components/home/QuickStart";

export default function HomePage() {
  return (
    <main className="bg-aleph-deep">
      <Hero />
      <Philosophy />
      <Architecture />
      <Features />
      <QuickStart />
    </main>
  );
}
```

**Step 2: Add typecheck script to package.json**

Add to `scripts` in `package.json`:

```json
"typecheck": "tsc --noEmit"
```

**Step 3: Run type check**

```bash
pnpm typecheck
```

Expected: No errors.

**Step 4: Run lint**

```bash
pnpm lint
```

Expected: No errors (or only warnings).

**Step 5: Run production build**

```bash
pnpm build
```

Expected: Build succeeds, pages are statically generated.

**Step 6: Test production locally**

```bash
pnpm start
# Visit http://localhost:3000/en and /zh
# Verify all sections render, animations work, language switching works
```

**Step 7: Commit**

```bash
git add -A
git commit -m "home: complete homepage with all sections, build verified"
```

---

## Task Summary

| Task | Description | Estimated Complexity |
|------|-------------|---------------------|
| 1 | Project scaffold (Next.js + Tailwind v4.2 + fonts) | Medium |
| 2 | Internationalization setup (next-intl EN/ZH) | Medium |
| 3 | Shared components (AlephLogo, GlassCard, CodeBlock) | Low |
| 4 | Navbar + Footer layout | Medium |
| 5 | Hero section | Medium |
| 6 | Philosophy section (Five Layers) | Medium |
| 7 | Architecture section (1-2-3-4 Model) | Low |
| 8 | Features section (6 cards) | Low |
| 9 | Quick Start section (tabbed code) | Low |
| 10 | Final assembly, polish, build verification | Low |
