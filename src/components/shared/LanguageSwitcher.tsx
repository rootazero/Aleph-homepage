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
