import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { BustFigure, PlantFigure } from "./figures";

export function Manifesto() {
  const t = useTranslations("manifesto");
  return (
    <section className="manifesto section ruled" id="manifesto">
      <div className="wrap">
        <div className="hero-spec" style={{ marginBottom: 36 }}>
          <span className="label">{t("eyebrow_label")}</span>
          <span className="label">{t("sub_label")}</span>
        </div>
        <div className="manifesto-grid">
          <div className="reveal" data-anim="left">
            <RichText as="h2" className="h-statement" html={t("statement_html")} />
            <p className="body">{t("body")}</p>
            <div className="spec-row mt-l">
              <span className="spec"><b>{t("s1_b")}</b> {"—"} {t("s1")}</span>
              <span className="spec"><b>{t("s2_b")}</b> {"—"} {t("s2")}</span>
              <span className="spec"><b>{t("s3_b")}</b> {"—"} {t("s3")}</span>
            </div>
          </div>
          <div className="collage-card reveal" data-anim="right">
            <div style={{ position: "relative", background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 6, aspectRatio: "3/3.4", overflow: "hidden" }}>
              <span className="coral-disc" style={{ width: "55%", aspectRatio: 1, left: "24%", top: "14%" }} />
              <span className="stone-block halftone" style={{ left: 0, bottom: 0, width: "46%", height: "30%", opacity: 0.5, backgroundImage: "radial-gradient(var(--ink) 26%,transparent 28%)", backgroundSize: "8px 8px" }} />
              <BustFigure className="grain-fig" data-drift="" style={{ position: "absolute", width: "62%", left: "20%", bottom: 0, color: "var(--ink)" }} />
              <PlantFigure style={{ position: "absolute", width: "26%", right: "14%", top: "8%", color: "var(--sage)" }} />
              <span className="tape rot-r" style={{ top: 10, left: 14 }} />
              <span className="label" style={{ position: "absolute", bottom: 12, left: 14 }}>{t("fig_caption")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
