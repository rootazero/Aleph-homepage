import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-aleph-border bg-aleph-navy">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-aleph-blue to-aleph-purple bg-clip-text text-transparent">
                &#x2135;
              </span>
              <span className="font-display font-semibold text-white">Aleph</span>
            </div>
            <p className="text-sm text-aleph-muted">{t("description")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t("project")}</h3>
            <ul className="space-y-2 text-sm text-aleph-muted">
              <li><a href="https://github.com/rootazero/Aleph" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t("roadmap")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t("resources")}</h3>
            <ul className="space-y-2 text-sm text-aleph-muted">
              <li><a href="#" className="hover:text-white transition-colors">{t("architecture_link")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-aleph-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-aleph-muted">{t("license")}</p>
          <p className="text-xs text-aleph-muted italic">
            &ldquo;{t("borges_closing")}&rdquo; &mdash; Jorge Luis Borges
          </p>
        </div>
      </div>
    </footer>
  );
}
