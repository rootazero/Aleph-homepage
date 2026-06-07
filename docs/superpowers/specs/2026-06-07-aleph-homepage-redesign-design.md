# Aleph 首页改版 + docs 视觉统一 — 设计文档

- 日期：2026-06-07
- 状态：已确认（待 spec review）
- 来源设计：`AlephHome/`（`Aleph.html` + `assets/styles.css` + `assets/app.js` + `assets/nav.js`，静态 HTML/CSS/JS）

## 目标

1. 用 `AlephHome/` 的新设计**全量替换**现有 React 首页。
2. 接好 docs（沿用现有 Fumadocs 路由）。
3. 把 docs 所有页面的设计元素改为与新首页一致，保持统一亮色编辑风视觉。

## 已确认决策

- **内容保真度**：忠实搬运 mockup 文案与板块结构；明显占位项（GitHub 星数 `3.4k`、虚构评价人 `Mira Adelstein`、虚构 agent 名 `guzang/kami/atlas`、`Sign in` 按钮、能力区聊天 demo 文案）照搬但加 `TODO(placeholder)` 标记，单列清单待确认/替换。
- **语言范围**：仅 `en` / `zh`（对齐项目）；丢弃 mockup 的 `ja` 与 localStorage 三语下拉。
- **docs 主题**：亮色 only，无亮/暗切换。
- **动画实现**：沿用 mockup 的 CSS（`animation-timeline: view()`）+ 轻量交互逻辑改写为 React hooks/state；不保留原生 JS DOM 注入。

## 硬约束

- **Vercel 部署不变**：单个 Next.js App Router 应用；字体改用 `next/font/google`（构建期自托管，替代 mockup 的 CSS `@import`）；动画纯 CSS + IntersectionObserver 回退，SSR/SSG 安全；交互组件用 `"use client"`，不破坏静态化；Fumadocs `.source/` 仍由 `postinstall`/`next build` 生成。
- **React 技术栈不变**：Next 16 / React 19 / next-intl 4 / Fumadocs 16 / Tailwind v4；命令式 DOM 注入一律改为 React 数据数组 `.map()` + hooks；Motion 保留为依赖，动画以 CSS 为主，必要处可用。

## 设计系统：暗 → 亮编辑风

### 调色板（`src/app/globals.css`）

替换现有暗色 token 为纸张暖色系：

- `--paper #f0ead9` / `--paper-deep #e8e0cc` / `--panel #f6f1e4`
- `--ink #1b1712` / `--ink-2 #4d4639` / `--ink-3 #847a64`
- 强调：`--coral #df4f26` / `--coral-deep #bf3d1a` / `--coral-soft #ec6a44`
- 辅助：`--mustard #d4a23c` / `--stone #c8b99c` / `--stone-deep #ab9b78` / `--sage #5c6f52`
- 暗色区块：`--night #15120d` / `--night-2 #211c15`
- 细线：`--line rgba(27,23,18,.16)` / `--line-soft rgba(27,23,18,.09)`

附加：`body::before` 纸张颗粒噪点叠层；`::selection` 改珊瑚色；移除 `:root/body` 的 `#050508` 暗底。

### 去暗色强制

- `src/app/layout.tsx`：移除 `<html className="dark">`。
- `src/app/[locale]/layout.tsx`：移除 `<div className="dark contents">` 包裹与未使用的 `Navbar`/`Footer`/`ThemeProvider` import，仅保留 `NextIntlClientProvider`。

### 字体（`next/font/google` → CSS 变量 → `@theme`）

- `Instrument Serif`（衬线大标题/斜体强调，含 italic）
- `Space Grotesk`（display）
- `Archivo`（正文 sans）
- `Space Mono`（mono：标签、规格行、代码）

替换现有 `Geist` / `Geist Mono`。在 `app/layout.tsx` 注入 4 个 font variable 到 `<body>`，`globals.css @theme` 引用。

### 样式落点

- 将 `AlephHome/assets/styles.css` 忠实移植为 `src/app/home.css`（类名制：`.hero/.btn/.cap-card/.marquee/.reveal/.dark`(showcase) 等），仅把字体 `var(--serif/--display/--sans/--mono)` 对接 next/font 变量。
- 由 `globals.css` 在 Tailwind 入口后 `@import "./home.css"`。
- 保留滚动驱动动画 `@supports (animation-timeline: view())` 区块 + `.reveal` IO 回退。

## 首页组件化（全量替换）

删除旧：`components/home/{Hero,Philosophy,Architecture,Features,QuickStart}.tsx`、旧 `components/layout/{Navbar,Footer}.tsx` 的当前实现与 `ThemeToggle` 用法、`[locale]/page.tsx` 内联实现。

新建 `src/components/home/`，由 `[locale]/page.tsx` 组合（页面自带 Topbar + Footer；docs 用 Fumadocs 自身 chrome，互不影响）：

| 组件 | mockup 板块 | 交互 |
|---|---|---|
| `Topbar.tsx` | 顶栏 | 语言切换(next-intl)、GitHub、Sign in(占位) |
| `Hero.tsx` | 巨型衬线 Aleph + 侧翼剪影 | 载入动画、视差 hook |
| `Marquee.tsx` | 跑马灯 | 纯 CSS 滚动 |
| `Manifesto.tsx` | 理念拼贴 | reveal |
| `Capabilities.tsx` (+ `CapabilityPreview.tsx`) | 能力 tab + 聊天/步骤/日历预览 | tab state + 进入视口重播 |
| `Archive.tsx` | 技能画廊 | reveal |
| `Process.tsx` | 四步 | reveal |
| `AgentsShowcase.tsx` | 暗色 agents | reveal |
| `Testimonial.tsx` | 评价(占位) | reveal |
| `Models.tsx` | 模型芯片 | — |
| `Faq.tsx` | 手风琴 | 展开/收起 state |
| `Footer.tsx` | 暗色页脚 | — |

- 拼贴图元（半身像/植物/翅膀 SVG、`coral-disc`、`tape`、`halftone`、`stone-block`）→ `home/figures.tsx` 复用。
- 数据驱动内容（CAPS / GALLERY / STEPS / AGENTS / MODELS / FAQ）→ React 数据数组 `.map()`；结构性字段（tone/figure/key）放 `home/data.ts`，可译文案进 messages。
- 下载按钮 OS 检测 → `useOS` 客户端 hook；视差 → `useParallax`；reveal 回退 → `useScrollReveal`（或纯 CSS）。
- 语言切换沿用 next-intl（en/zh），下拉样式照搬 mockup 但仅留 EN/中文，丢弃 localStorage。

### 占位清单（实现时输出，待确认）

- GitHub 星数 `3.4k`（Topbar + Hero 两处）
- 评价：`Mira Adelstein / Independent researcher` + logos 行 `Helix/Northbeam/Kerná/BYVÖK/Atlas&Co`
- agent 名：`guzang/kami/atlas/concierge`、画廊条目名
- `Sign in` CTA（无后端，建议确认去留）
- 能力区聊天 demo 文案（research/inbox/schedule/life/write/code）

## i18n 文案

整体替换 `messages/en.json` / `zh.json` 为新命名空间：
`topbar / hero / marquee / manifesto / capabilities / archive / process / agents / testimonial / models / faq / footer / download`。

- en 照搬 mockup 英文（含 `nav.js` 的 i18n 表）。
- zh 复用 `nav.js` 已有中文（nav + hero），其余翻译补全。

## docs 统一为亮色编辑风

- `globals.css` 把 `--color-fd-*` 重映射到新亮色 token；`docs/layout.tsx` 的 `RootProvider theme` 维持 `{ enabled: false }`（亮色 only）。
- 新增 docs 覆盖样式（并入 `globals.css` 或 `docs.css`）：纸张底色、珊瑚强调、链接/行内代码/代码块/callout/侧栏选中态配色；标题 Space Grotesk、正文 Archivo、代码 Space Mono、衬线点缀。
- Fumadocs 顶栏视觉对齐首页 Topbar（纸色 + blur + mono 链接 + 珊瑚 hover）；侧栏/TOC 保留并改色。
- `layout.shared.tsx` 的 `baseOptions` 链接/标题保留，按需微调文案。
- 验证 `/api/search`（Orama）仍可用（zh 仍走英文 tokenizer 回退，行为不变）。

## 清理与验证

- 删除被替换的旧组件与未使用 import；`ThemeToggle` 退场（`next-themes` 保留为依赖但不再使用）。
- 更新 Playwright「brand validation」断言到新亮色调色板（原断言暗色 `#050508`/青色 `#22d3ee`，需改为 paper/coral）。
- 更新 `CLAUDE.md` 中「dark-only」相关描述为新亮色设计与新字体/调色板。
- `pnpm typecheck && pnpm lint && pnpm build` 全绿；`pnpm dev` 本地核对首页与 docs 视觉。

## 实施阶段（交由 writing-plans 细化）

1. **基础**：tokens / 字体 / `globals.css` / `home.css` / 移除暗色强制。
2. **首页组件**：figures + data + 全部 section 组件 + messages（en/zh）。
3. **交互/动画**：tab、手风琴、视差、reveal、OS 检测 hooks。
4. **docs 重新配色**：`--color-fd-*` 映射 + docs 覆盖层 + Fumadocs 顶栏对齐 + 搜索验证。
5. **清理与测试**：删旧组件、更新 Playwright、更新 CLAUDE.md、typecheck/lint/build/dev 验证。

## 非目标（YAGNI）

- 不新增 `ja` 或第三语言。
- 不为 docs 设计暗色主题或亮/暗切换。
- 不引入新的动画库或状态管理；不改动 docs 内容本身（仅改外观）。
- 不实现真实下载分发/登录后端（占位保留）。
