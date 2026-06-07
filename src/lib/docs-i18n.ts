import { defineI18n } from "fumadocs-core/i18n";

// Fumadocs i18n config for the /docs subtree.
// hideLocale: "default-locale" keeps the URLs aligned with next-intl's
// localePrefix "as-needed" — English has no prefix ("/docs"), Chinese is
// prefixed ("/zh/docs"). Locale routing itself is driven by the next-intl
// middleware; Fumadocs only consumes the resolved locale for content lookup.
export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "zh"],
  hideLocale: "default-locale",
  parser: "dir",
});
