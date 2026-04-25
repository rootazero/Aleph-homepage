import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-edge bg-panel">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-accent to-accent-purple bg-clip-text text-transparent">
                &#x2135;
              </span>
              <span className="font-display font-semibold text-heading">Aleph</span>
            </div>
            <p className="text-sm text-muted">{t("description")}</p>
          </div>
          <div>
            <h3 className="font-semibold text-heading mb-4">{t("project")}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="https://github.com/rootazero/Aleph" className="hover:text-heading transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-heading transition-colors">{t("roadmap")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-heading mb-4">{t("resources")}</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-heading transition-colors">{t("architecture_link")}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-edge flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">{t("license")}</p>
          <p className="text-xs text-muted italic">
            &ldquo;{t("borges_closing")}&rdquo; &mdash; Jorge Luis Borges
          </p>
        </div>
      </div>
    </footer>
  );
}
