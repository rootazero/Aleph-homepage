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
          locale === "en" ? "text-heading" : "text-muted hover:text-heading"
        }`}
      >
        EN
      </button>
      <span className="text-edge">/</span>
      <button
        onClick={() => switchLocale("zh")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "zh" ? "text-heading" : "text-muted hover:text-heading"
        }`}
      >
        中
      </button>
    </div>
  );
}
