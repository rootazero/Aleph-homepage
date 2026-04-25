# AlephDocs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a standalone Fumadocs-powered documentation site for Aleph with bilingual support (EN/ZH), deployed to a separate subdomain.

**Architecture:** Next.js 15 App Router + Fumadocs (core/mdx/ui) + Tailwind CSS v4.2 CSS-first. Content copied from Aleph's `docs/book/src/` into the project. Fumadocs i18n with `[lang]` route param and per-language content directories.

**Tech Stack:** Next.js 15, fumadocs-core, fumadocs-mdx, fumadocs-ui, Tailwind CSS 4.2, next-themes, TypeScript, pnpm

---

## Task 1: Scaffold the Project

**Files:**
- Create: `/Volumes/TBU4/Workspace/AlephDocs/package.json`
- Create: `/Volumes/TBU4/Workspace/AlephDocs/tsconfig.json`
- Create: `/Volumes/TBU4/Workspace/AlephDocs/postcss.config.mjs`
- Create: `/Volumes/TBU4/Workspace/AlephDocs/next.config.ts`
- Create: `/Volumes/TBU4/Workspace/AlephDocs/source.config.ts`
- Create: `/Volumes/TBU4/Workspace/AlephDocs/.gitignore`

**Step 1: Create project directory and package.json**

```bash
mkdir -p /Volumes/TBU4/Workspace/AlephDocs
```

Create `/Volumes/TBU4/Workspace/AlephDocs/package.json`:

```json
{
  "name": "alephdocs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "fumadocs-core": "latest",
    "fumadocs-mdx": "latest",
    "fumadocs-ui": "latest",
    "next": "^15.3.3",
    "next-themes": "^0.4.6",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.1",
    "@types/mdx": "^2.0.13",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^15.3.3",
    "tailwindcss": "^4.2.1",
    "typescript": "^5"
  }
}
```

**Step 2: Create tsconfig.json**

Create `/Volumes/TBU4/Workspace/AlephDocs/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/.source": ["./.source"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts",
    ".source/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 3: Create postcss.config.mjs**

Create `/Volumes/TBU4/Workspace/AlephDocs/postcss.config.mjs`:

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

**Step 4: Create source.config.ts**

This is the Fumadocs MDX content configuration file. It defines the docs source with i18n support.

Create `/Volumes/TBU4/Workspace/AlephDocs/source.config.ts`:

```typescript
import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig();
```

**Step 5: Create next.config.ts**

Create `/Volumes/TBU4/Workspace/AlephDocs/next.config.ts`:

```typescript
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

export default withMDX(config);
```

**Step 6: Create .gitignore**

Create `/Volumes/TBU4/Workspace/AlephDocs/.gitignore`:

```
node_modules/
.next/
.source/
out/
*.tsbuildinfo
next-env.d.ts
.env*.local
```

**Step 7: Install dependencies**

```bash
cd /Volumes/TBU4/Workspace/AlephDocs && pnpm install
```

**Step 8: Initialize git**

```bash
cd /Volumes/TBU4/Workspace/AlephDocs && git init && git add -A && git commit -m "init: scaffold AlephDocs project"
```

---

## Task 2: Core App Structure (Root Layout + Globals CSS)

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/lib/i18n.ts`
- Create: `src/lib/source.ts`

**Step 1: Create i18n config**

Create `src/lib/i18n.ts`:

```typescript
import type { I18nConfig } from "fumadocs-core/i18n";

export const i18n: I18nConfig = {
  defaultLanguage: "en",
  languages: ["en", "zh"],
};
```

**Step 2: Create source loader**

Create `src/lib/source.ts`:

```typescript
import { docs } from "@/.source";
import { loader } from "fumadocs-core/source";
import { i18n } from "./i18n";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
});
```

**Step 3: Create globals.css**

Create `src/app/globals.css` — reuse the AlephHomepage design tokens:

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-page: var(--page);
  --color-panel: var(--panel);
  --color-surface: var(--surface);
  --color-edge: var(--edge);
  --color-heading: var(--heading);
  --color-muted: var(--muted);
  --color-faint: var(--faint);
  --color-accent: var(--accent);
  --color-accent-purple: var(--accent-purple);
  --color-accent-cyan: var(--accent-cyan);
  --color-codeblock: var(--codeblock);

  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;

  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);

  --animate-fade-in: fade-in 0.6s var(--ease-fluid) both;
  --animate-slide-up: slide-up 0.6s var(--ease-fluid) both;
}

/* Light theme */
:root {
  --page: oklch(98.5% 0.004 265);
  --panel: oklch(96% 0.006 265);
  --surface: oklch(100% 0 0 / 0.8);
  --edge: oklch(88% 0.008 265);
  --heading: oklch(15% 0.015 265);
  --muted: oklch(45% 0.012 265);
  --faint: oklch(62% 0.008 265);
  --accent: oklch(52% 0.24 264);
  --accent-purple: oklch(45% 0.22 295);
  --accent-cyan: oklch(42% 0.12 200);
  --codeblock: oklch(96.5% 0.005 265);
  --glow: oklch(52% 0.24 264 / 0.08);
}

/* Dark theme */
.dark {
  --page: oklch(9% 0.015 265);
  --panel: oklch(7% 0.015 265);
  --surface: oklch(100% 0 0 / 0.04);
  --edge: oklch(100% 0 0 / 0.08);
  --heading: oklch(96% 0.005 265);
  --muted: oklch(62% 0.012 265);
  --faint: oklch(45% 0.01 265);
  --accent: oklch(65% 0.24 264);
  --accent-purple: oklch(55% 0.22 295);
  --accent-cyan: oklch(78% 0.12 200);
  --codeblock: oklch(11% 0.015 265);
  --glow: oklch(65% 0.24 264 / 0.15);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Step 4: Create root layout**

Create `src/app/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

**Step 5: Commit**

```bash
git add -A && git commit -m "core: add root layout, globals CSS, i18n config, source loader"
```

---

## Task 3: Middleware + [lang] Layout

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/[lang]/layout.tsx`
- Create: `src/lib/layout.shared.tsx`

**Step 1: Create i18n middleware**

Create `src/middleware.ts`:

```typescript
import { createI18nMiddleware } from "fumadocs-core/i18n/middleware";
import { i18n } from "@/lib/i18n";

export default createI18nMiddleware(i18n);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
```

**Step 2: Create shared layout options**

Create `src/lib/layout.shared.tsx`:

```tsx
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(lang: string): BaseLayoutProps {
  return {
    nav: {
      title: "ℵ Aleph Docs",
      url: `/${lang}`,
    },
    links: [
      {
        text: "Documentation",
        url: `/${lang}/docs`,
        active: "nested-url",
      },
      {
        text: "GitHub",
        url: "https://github.com/rootazero/Aleph",
        external: true,
      },
    ],
    i18n: true,
  };
}
```

**Step 3: Create [lang] layout**

Create `src/app/[lang]/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider";
import { I18nProvider } from "fumadocs-ui/i18n";
import { i18n } from "@/lib/i18n";

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <I18nProvider
      locale={lang}
      locales={i18n.languages?.map((l) => ({
        name: l === "en" ? "English" : "中文",
        locale: l,
      }))}
      translations={
        lang === "zh"
          ? {
              search: "搜索文档",
              toc: "目录",
              lastUpdate: "最后更新",
              searchNoResult: "没有找到结果",
              previousPage: "上一页",
              nextPage: "下一页",
            }
          : undefined
      }
    >
      <RootProvider
        theme={{
          defaultTheme: "dark",
          attribute: "class",
        }}
      >
        {children}
      </RootProvider>
    </I18nProvider>
  );
}
```

**Step 4: Commit**

```bash
git add -A && git commit -m "core: add i18n middleware and [lang] layout with RootProvider"
```

---

## Task 4: Docs Layout + Docs Page

**Files:**
- Create: `src/app/[lang]/docs/layout.tsx`
- Create: `src/app/[lang]/docs/[[...slug]]/page.tsx`
- Create: `src/app/api/search/route.ts`

**Step 1: Create docs layout (sidebar + header)**

Create `src/app/[lang]/docs/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;

  return (
    <DocsLayout
      {...baseOptions(lang)}
      tree={source.pageTree[lang]}
      sidebar={{ enabled: true }}
    >
      {children}
    </DocsLayout>
  );
}
```

**Step 2: Create docs page (content renderer)**

Create `src/app/[lang]/docs/[[...slug]]/page.tsx`:

```tsx
import { source } from "@/lib/source";
import { notFound } from "next/navigation";
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from "fumadocs-ui/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { Metadata } from "next";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);
  if (!page) return {};

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
```

**Step 3: Create search API route**

Create `src/app/api/search/route.ts`:

```typescript
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";

export const { GET } = createFromSource(source);
```

**Step 4: Commit**

```bash
git add -A && git commit -m "docs: add DocsLayout, DocsPage, and search API route"
```

---

## Task 5: Docs Landing Page

**Files:**
- Create: `src/app/[lang]/page.tsx`

**Step 1: Create the docs landing/index page**

This is the card-based navigation page at `/en` and `/zh` that links into `/en/docs/*`.

Create `src/app/[lang]/page.tsx`:

```tsx
import Link from "next/link";
import type { Metadata } from "next";

const sections = [
  {
    title: { en: "Getting Started", zh: "快速开始" },
    description: {
      en: "Installation, quick start, and configuration",
      zh: "安装、快速开始和配置",
    },
    href: "/docs/getting-started/installation",
    icon: "🚀",
  },
  {
    title: { en: "Architecture", zh: "架构" },
    description: {
      en: "System design, gateway, agent loop, sessions",
      zh: "系统设计、网关、Agent 循环、会话管理",
    },
    href: "/docs/architecture/overview",
    icon: "🏗️",
  },
  {
    title: { en: "Gateway RPC", zh: "网关 RPC" },
    description: {
      en: "WebSocket protocol, authentication, RPC methods",
      zh: "WebSocket 协议、认证、RPC 方法",
    },
    href: "/docs/gateway/protocol",
    icon: "🔌",
  },
  {
    title: { en: "Interfaces", zh: "接口" },
    description: {
      en: "Telegram, Discord, iMessage, WebChat integrations",
      zh: "Telegram、Discord、iMessage、WebChat 集成",
    },
    href: "/docs/interfaces/overview",
    icon: "💬",
  },
  {
    title: { en: "Tools & Extensions", zh: "工具与扩展" },
    description: {
      en: "Built-in tools, MCP integration, creating custom tools",
      zh: "内置工具、MCP 集成、创建自定义工具",
    },
    href: "/docs/tools/overview",
    icon: "🔧",
  },
  {
    title: { en: "Security", zh: "安全" },
    description: {
      en: "Execution approval, IPC protocol, device pairing",
      zh: "执行审批、IPC 协议、设备配对",
    },
    href: "/docs/security/exec-approval",
    icon: "🔒",
  },
  {
    title: { en: "CLI Reference", zh: "CLI 参考" },
    description: {
      en: "Commands, gateway management, agent interaction",
      zh: "命令、网关管理、Agent 交互",
    },
    href: "/docs/cli/commands",
    icon: "⌨️",
  },
  {
    title: { en: "Development", zh: "开发" },
    description: {
      en: "Building, testing, and contributing",
      zh: "构建、测试和贡献",
    },
    href: "/docs/development/building",
    icon: "🛠️",
  },
  {
    title: { en: "API Reference", zh: "API 参考" },
    description: {
      en: "Rust API and JSON-RPC API documentation",
      zh: "Rust API 和 JSON-RPC API 文档",
    },
    href: "/docs/api/rust",
    icon: "📡",
  },
];

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = lang as "en" | "zh";

  return (
    <main className="min-h-screen bg-page">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-5xl">
          <span className="bg-gradient-to-r from-accent to-accent-purple bg-clip-text text-transparent">
            ℵ
          </span>{" "}
          {t === "zh" ? "Aleph 文档" : "Aleph Documentation"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          {t === "zh"
            ? "构建你的多态个人 AI 助手"
            : "Build your polymorphic personal AI assistant"}
        </p>
      </section>

      {/* Section Cards */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={`/${lang}${section.href}`}
              className="group rounded-xl border border-edge bg-surface p-6 transition-all hover:border-accent hover:shadow-lg hover:shadow-[var(--glow)]"
            >
              <div className="mb-3 text-2xl">{section.icon}</div>
              <h2 className="text-lg font-semibold text-heading group-hover:text-accent">
                {section.title[t]}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {section.description[t]}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "zh"
        ? "Aleph (ℵ) 文档 — 多态个人 AI 助手"
        : "Aleph (ℵ) Docs — Polymorphic Personal AI Assistant",
    description:
      lang === "zh"
        ? "Aleph 技术文档 — 用 Rust 构建的自托管多态 AI 助手"
        : "Technical documentation for Aleph — a self-hosted polymorphic AI assistant built in Rust",
  };
}

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "zh" }];
}
```

**Step 2: Commit**

```bash
git add -A && git commit -m "home: add docs landing page with card navigation"
```

---

## Task 6: Migrate Content (EN)

**Files:**
- Create: `content/docs/en/` — all 42 `.mdx` files from Aleph book/src/
- Create: `content/docs/en/meta.json` + sub-directory `meta.json` files

This is the largest task. It involves:
1. Copying all `.md` files from Aleph's `docs/book/src/` to `content/docs/en/`
2. Renaming `.md` → `.mdx`
3. Adding frontmatter to each file
4. Creating `meta.json` files for navigation order
5. Renaming `README.md` → `index.mdx` for directory index pages

**Step 1: Copy and rename files**

```bash
cd /Volumes/TBU4/Workspace/AlephDocs

# Create content directory structure
mkdir -p content/docs/en/{getting-started,architecture,gateway/methods,interfaces,tools,security,cli,development,api}

# Copy the book README as docs index
cp /Volumes/TBU4/Workspace/Aleph/docs/book/src/README.md content/docs/en/index.mdx

# Copy all section files
for dir in getting-started architecture interfaces tools security cli development api; do
  for f in /Volumes/TBU4/Workspace/Aleph/docs/book/src/$dir/*.md; do
    name=$(basename "$f" .md)
    cp "$f" "content/docs/en/$dir/$name.mdx"
  done
done

# Copy gateway files (top level)
cp /Volumes/TBU4/Workspace/Aleph/docs/book/src/gateway/protocol.md content/docs/en/gateway/protocol.mdx
cp /Volumes/TBU4/Workspace/Aleph/docs/book/src/gateway/auth.md content/docs/en/gateway/auth.mdx

# Copy gateway methods (nested)
for f in /Volumes/TBU4/Workspace/Aleph/docs/book/src/gateway/methods/*.md; do
  name=$(basename "$f" .md)
  if [ "$name" = "README" ]; then
    cp "$f" "content/docs/en/gateway/methods/index.mdx"
  else
    cp "$f" "content/docs/en/gateway/methods/$name.mdx"
  fi
done

# Copy CHANGELOG
cp /Volumes/TBU4/Workspace/Aleph/docs/book/src/CHANGELOG.md content/docs/en/changelog.mdx
```

**Step 2: Add frontmatter to all MDX files**

Each `.mdx` file needs a YAML frontmatter block. Use a script or manually add to each file. The frontmatter format:

```yaml
---
title: Page Title
description: Brief one-line description
---
```

For the index page (`content/docs/en/index.mdx`):
```yaml
---
title: Aleph Documentation
description: Technical documentation for Aleph — a self-hosted polymorphic AI assistant built in Rust
---
```

For each section, extract the title from the first `# Heading` in the file. Examples:

- `getting-started/installation.mdx`: `title: Installation`, `description: Install Aleph on your system`
- `getting-started/quick-start.mdx`: `title: Quick Start`, `description: Get up and running with Aleph`
- `getting-started/configuration.mdx`: `title: Configuration`, `description: Configure your Aleph setup`
- `architecture/overview.mdx`: `title: Architecture Overview`, `description: System design and components`
- `gateway/protocol.mdx`: `title: Protocol`, `description: WebSocket JSON-RPC protocol`
- `gateway/auth.mdx`: `title: Authentication`, `description: Gateway authentication`
- `interfaces/overview.mdx`: `title: Interfaces Overview`, `description: Messaging platform integrations`
- `tools/overview.mdx`: `title: Tool System`, `description: Built-in tools and extensions`
- `security/exec-approval.mdx`: `title: Execution Approval`, `description: Three-tier security model`
- `cli/commands.mdx`: `title: Commands`, `description: CLI command reference`
- `development/building.mdx`: `title: Building`, `description: Build Aleph from source`
- `api/rust.mdx`: `title: Rust API`, `description: Rust API documentation`
- `api/jsonrpc.mdx`: `title: JSON-RPC API`, `description: JSON-RPC API reference`

After adding frontmatter, remove the first `# Title` line from the body (Fumadocs renders the title from frontmatter via DocsTitle).

**Step 3: Fix internal links**

Replace relative markdown links like `[Quick Start](./quick-start.md)` with Fumadocs-style links: `[Quick Start](/docs/getting-started/quick-start)`. Remove `.md` extensions and adjust paths to be absolute from `/docs/`.

**Step 4: Create meta.json files for navigation**

Root `content/docs/en/meta.json`:
```json
{
  "title": "Aleph Docs",
  "pages": [
    "---Getting Started---",
    "getting-started",
    "---Architecture---",
    "architecture",
    "---Gateway---",
    "gateway",
    "---Interfaces---",
    "interfaces",
    "---Tools---",
    "tools",
    "---Security---",
    "security",
    "---CLI---",
    "cli",
    "---Development---",
    "development",
    "---API---",
    "api",
    "---",
    "changelog"
  ]
}
```

`content/docs/en/getting-started/meta.json`:
```json
{
  "title": "Getting Started",
  "pages": ["installation", "quick-start", "configuration"]
}
```

`content/docs/en/architecture/meta.json`:
```json
{
  "title": "Architecture",
  "pages": ["overview", "gateway", "agent-loop", "sessions", "tools"]
}
```

`content/docs/en/gateway/meta.json`:
```json
{
  "title": "Gateway RPC",
  "pages": ["protocol", "auth", "methods"]
}
```

`content/docs/en/gateway/methods/meta.json`:
```json
{
  "title": "Methods Reference",
  "pages": ["index", "agent", "session", "config", "exec", "wizard", "cron", "events", "browser"]
}
```

`content/docs/en/interfaces/meta.json`:
```json
{
  "title": "Interfaces",
  "pages": ["overview", "telegram", "discord", "imessage", "webchat"]
}
```

`content/docs/en/tools/meta.json`:
```json
{
  "title": "Tools & Extensions",
  "pages": ["overview", "builtin", "mcp", "creating"]
}
```

`content/docs/en/security/meta.json`:
```json
{
  "title": "Security",
  "pages": ["exec-approval", "ipc", "pairing"]
}
```

`content/docs/en/cli/meta.json`:
```json
{
  "title": "CLI Reference",
  "pages": ["commands", "gateway", "agent"]
}
```

`content/docs/en/development/meta.json`:
```json
{
  "title": "Development",
  "pages": ["building", "testing", "contributing"]
}
```

`content/docs/en/api/meta.json`:
```json
{
  "title": "API Reference",
  "pages": ["rust", "jsonrpc"]
}
```

**Step 5: Commit**

```bash
git add -A && git commit -m "content: migrate EN docs from Aleph book/src with frontmatter and meta.json"
```

---

## Task 7: Chinese Skeleton Content (ZH)

**Files:**
- Create: `content/docs/zh/meta.json`
- Create: `content/docs/zh/index.mdx`

Create a minimal Chinese content directory. Initially just the index page and meta.json — other pages will fall back to English via Fumadocs i18n.

**Step 1: Create zh meta.json**

Create `content/docs/zh/meta.json` — same structure as en:
```json
{
  "title": "Aleph 文档",
  "pages": [
    "---快速开始---",
    "getting-started",
    "---架构---",
    "architecture",
    "---网关---",
    "gateway",
    "---接口---",
    "interfaces",
    "---工具---",
    "tools",
    "---安全---",
    "security",
    "---CLI---",
    "cli",
    "---开发---",
    "development",
    "---API---",
    "api",
    "---",
    "changelog"
  ]
}
```

**Step 2: Create zh index page**

Create `content/docs/zh/index.mdx`:
```yaml
---
title: Aleph 文档
description: Aleph 技术文档 — 用 Rust 构建的自托管多态 AI 助手
---

> *"这是人类历史上第一次，机器的灵魂被赋予了身体。"*
> — 攻壳机动队

**Aleph** 是一个强大的个人 AI 助手，使用 Rust 构建，旨在赋予 AI 与世界交互的能力。

## 文档章节

| 章节 | 说明 |
|------|------|
| [快速开始](/zh/docs/getting-started/installation) | 安装和初始配置 |
| [架构](/zh/docs/architecture/overview) | 系统设计和组件 |
| [网关 RPC](/zh/docs/gateway/protocol) | WebSocket API 参考 |
| [接口](/zh/docs/interfaces/overview) | 消息平台集成 |
| [安全](/zh/docs/security/exec-approval) | 安全模型和审批 |
| [CLI 参考](/zh/docs/cli/commands) | 命令行界面 |
| [开发](/zh/docs/development/building) | 构建和贡献 |
```

**Step 3: Commit**

```bash
git add -A && git commit -m "content: add ZH skeleton with index page and meta.json"
```

---

## Task 8: Build & Verify

**Step 1: Run the dev server**

```bash
cd /Volumes/TBU4/Workspace/AlephDocs && pnpm dev
```

Expected: Dev server starts on http://localhost:3001

**Step 2: Verify key routes work**

Open in browser and verify:
- `http://localhost:3001/en` — Landing page with 9 cards
- `http://localhost:3001/zh` — Chinese landing page
- `http://localhost:3001/en/docs` — Docs index page with sidebar
- `http://localhost:3001/en/docs/getting-started/installation` — Content page
- `http://localhost:3001/zh/docs` — Chinese docs (falls back to EN where ZH missing)

**Step 3: Run build**

```bash
cd /Volumes/TBU4/Workspace/AlephDocs && pnpm build
```

Expected: Build completes successfully with no errors.

**Step 4: Fix any issues discovered during build/test**

Common issues to watch for:
- Missing frontmatter on MDX files (build error)
- Broken internal links (console warnings)
- Import path issues with `@/.source` (tsconfig paths)
- Fumadocs CSS conflicts with custom theme

**Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix: resolve build issues from initial verification"
```

---

## Task 9: Theme Polish & Fumadocs UI Customization

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Customize Fumadocs UI to match Aleph brand**

After verifying the basic build works, fine-tune the Fumadocs UI theme. The main customization is through CSS variables that Fumadocs respects. Add/adjust in `globals.css`:

```css
/* Fumadocs theme overrides for Aleph brand */
:root {
  --fd-background: var(--page);
  --fd-foreground: var(--heading);
  --fd-muted: var(--muted);
  --fd-muted-foreground: var(--faint);
  --fd-card: var(--panel);
  --fd-border: var(--edge);
  --fd-primary: var(--accent);
  --fd-ring: var(--accent);
}
```

The exact variable names depend on the Fumadocs version. Inspect the rendered page and adjust CSS variables as needed to ensure:
- Dark background matches aleph-deep
- Sidebar, header, and TOC have correct colors
- Code blocks use the codeblock background color
- Links and hover states use accent colors

**Step 2: Commit**

```bash
git add -A && git commit -m "style: customize Fumadocs UI theme to match Aleph brand"
```

---

## Task 10: Final CLAUDE.md + README

**Files:**
- Create: `/Volumes/TBU4/Workspace/AlephDocs/CLAUDE.md`

**Step 1: Create CLAUDE.md**

Create `/Volumes/TBU4/Workspace/AlephDocs/CLAUDE.md`:

```markdown
# CLAUDE.md

## Project Overview

**AlephDocs** is the documentation site for Aleph (ℵ), a self-hosted polymorphic personal AI assistant built in Rust.

Deployed independently at `docs.aleph.xxx`, separate from the main homepage.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Docs Engine | Fumadocs (core + mdx + ui) |
| Styling | Tailwind CSS 4.2 (CSS-first @theme) |
| i18n | fumadocs-core/i18n (EN/ZH) |
| Deployment | Vercel |

## Commands

```bash
pnpm dev          # Dev server (port 3001)
pnpm build        # Production build
pnpm start        # Preview production
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check
```

## Content

All documentation lives in `content/docs/`. English content in `en/`, Chinese in `zh/`.

Each directory has a `meta.json` controlling sidebar navigation order.

Each `.mdx` file needs `title` and `description` frontmatter.

## Language Conventions

- UI text: English (with ZH translations via i18n)
- Code comments: English
- Conversation with developer: 中文
- Commit messages: English
```

**Step 2: Commit**

```bash
git add -A && git commit -m "docs: add CLAUDE.md project guide"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Scaffold project | package.json, tsconfig, next.config, source.config |
| 2 | Root layout + globals CSS | layout.tsx, globals.css, i18n.ts, source.ts |
| 3 | Middleware + [lang] layout | middleware.ts, [lang]/layout.tsx |
| 4 | Docs layout + page | docs/layout.tsx, docs/[[...slug]]/page.tsx, search route |
| 5 | Landing page | [lang]/page.tsx (card navigation) |
| 6 | Migrate EN content | 42 MDX files + 10 meta.json files |
| 7 | ZH skeleton | zh/meta.json + zh/index.mdx |
| 8 | Build & verify | Test all routes, fix issues |
| 9 | Theme polish | CSS variable overrides for Fumadocs UI |
| 10 | CLAUDE.md | Project documentation |
