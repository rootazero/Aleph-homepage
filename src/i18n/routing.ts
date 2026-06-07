import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  // Default locale (en) has no prefix: "/" and "/docs".
  // Other locales are prefixed: "/zh" and "/zh/docs".
  localePrefix: "as-needed",
});
