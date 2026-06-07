import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { i18n } from "./docs-i18n";

// Fumadocs UI translations API. English is the framework default; only the
// Chinese overrides are provided. `displayName` labels the language toggle.
// Consumed via i18nProvider(translations, locale) in the docs layout.
export const translations = defineI18nUI(i18n, {
  translations: {
    en: { displayName: "English" },
    zh: {
      displayName: "中文",
      search: "搜索文档",
      searchNoResult: "没有找到结果",
      toc: "目录",
      lastUpdate: "最后更新",
      previousPage: "上一页",
      nextPage: "下一页",
      chooseLanguage: "选择语言",
    },
  },
});

// Build a locale-aware path prefix matching next-intl "as-needed":
// en -> "" (no prefix), zh -> "/zh".
function prefix(lang: string): string {
  return lang === "en" ? "" : `/${lang}`;
}

export function baseOptions(lang: string): BaseLayoutProps {
  const home = prefix(lang) || "/";

  return {
    nav: {
      title: <>ℵ&nbsp;Aleph</>,
      url: home,
    },
    // Dark-only site: hide the theme toggle.
    themeSwitch: {
      enabled: false,
    },
    links: [
      {
        text: lang === "zh" ? "首页" : "Home",
        url: home,
      },
      {
        text: lang === "zh" ? "文档" : "Documentation",
        url: `${prefix(lang)}/docs`,
        active: "nested-url",
      },
      {
        text: "GitHub",
        url: "https://github.com/rootazero/Aleph",
        external: true,
      },
    ],
  };
}
