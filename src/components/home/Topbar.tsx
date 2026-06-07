"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

interface TopbarProps {
  stars: string | null;
}

export function Topbar({ stars }: TopbarProps) {
  const t = useTranslations("topbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const switchLocale = (l: string) => {
    router.replace(pathname, { locale: l });
    setOpen(false);
  };

  // Nav links shared by the desktop bar and the mobile menu. `internal` items
  // are locale-aware routes (next-intl Link); the rest are in-page anchors.
  const navLinks = [
    { href: "#manifesto", label: t("philosophy") },
    { href: "#capabilities", label: t("capabilities") },
    { href: "#archive", label: t("skills") },
    { href: "#process", label: t("how") },
    { href: "#models", label: t("models") },
    { href: "/docs", label: t("docs"), internal: true },
    { href: "#faq", label: t("faq") },
  ];

  return (
    <header className="topbar">
      <div className="wrap">
        <a className="brand" href="#top">
          <span className="mark" aria-hidden="true" />
          <span className="name">Aleph<sup>&trade;</sup></span>
        </a>
        <nav className="nav">
          {navLinks.map((l) =>
            l.internal ? (
              <Link key={l.href} href={l.href}>{l.label}</Link>
            ) : (
              <a key={l.href} href={l.href}>{l.label}</a>
            ),
          )}
        </nav>
        <div className="topbar-right">
          <a
            className="icon-link"
            href="https://github.com/rootazero/Aleph"
            target="_blank"
            rel="noopener"
            aria-label="Aleph on GitHub"
          >
            {/* GitHub icon: copied from Aleph.html line 60 */}
            <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1.5A10.5 10.5 0 0 0 8.7 22c.5.1.72-.22.72-.49v-1.9c-2.92.64-3.54-1.25-3.54-1.25-.48-1.21-1.17-1.53-1.17-1.53-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.08a9.9 9.9 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.67.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.71.97.71 1.96v2.9c0 .27.19.6.72.49A10.5 10.5 0 0 0 12 1.5Z" />
            </svg>
            {stars && <span className="gh-count">{stars}</span>}
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
          {/* Mobile-only menu toggle (desktop .nav is hidden below 900px) */}
          <button
            className="nav-toggle"
            aria-label={t("menu")}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {navOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <nav className={`mobile-menu${navOpen ? " open" : ""}`}>
        {navLinks.map((l) =>
          l.internal ? (
            <Link key={l.href} href={l.href} onClick={() => setNavOpen(false)}>{l.label}</Link>
          ) : (
            <a key={l.href} href={l.href} onClick={() => setNavOpen(false)}>{l.label}</a>
          ),
        )}
      </nav>
    </header>
  );
}
