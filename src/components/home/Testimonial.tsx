import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { BustFigure, PlantFigure } from "./figures";

export function Testimonial() {
  const t = useTranslations("testimonial");
  const logos = t.raw("logos") as string[];
  return (
    <section className="quote section ruled">
      <div className="wrap">
        <div className="hero-spec" style={{ marginBottom: 40 }}>
          <span className="label">{t("notes_label")}</span>
          <span className="label">{t("access_label")}</span>
        </div>
        <div className="quote-grid">
          <div className="reveal" data-anim="left">
            <RichText as="p" className="quote-text" html={t("quote_html")} />
            <div className="quote-by">
              <span className="av"><BustFigure style={{ position: "absolute", width: "130%", left: "-12%", top: "18%", color: "var(--ink)" }} /></span>
              <div>
                {/* TODO(placeholder): fictional testimonial */}
                <div className="nm">{t("name")}</div>
                <div className="rl">{t("role")}</div>
              </div>
            </div>
            <div className="logos-row">
              {logos.map((l, i) => <span key={i}>{l}</span>)}
            </div>
          </div>
          <div className="reveal" data-anim="clip" style={{ position: "relative" }}>
            <div style={{ position: "relative", aspectRatio: "1/1", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
              <span className="coral-disc" style={{ width: "48%", aspectRatio: 1, right: "12%", top: "12%" }} />
              <BustFigure className="grain-fig" data-drift="strong" style={{ position: "absolute", width: "58%", right: "8%", bottom: 0, color: "var(--ink)", transform: "scaleX(-1)" }} />
              <span className="stone-block" style={{ left: "10%", bottom: "14%", width: "22%", height: "22%", background: "var(--mustard)" }} />
              <PlantFigure style={{ position: "absolute", width: "24%", left: "12%", top: "14%", color: "var(--sage)" }} />
              <span className="label" style={{ position: "absolute", bottom: 12, left: 14 }}>{t("fig_caption")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
