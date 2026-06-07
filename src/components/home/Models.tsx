import { useTranslations } from "next-intl";
import { RichText } from "./RichText";

export function Models() {
  const t = useTranslations("models");
  const chips = t.raw("chips") as string[];
  return (
    <section className="models section" id="models">
      <div className="wrap">
        <span className="eyebrow reveal" style={{ justifyContent: "center", display: "flex" }}><span className="dot" />{t("eyebrow")}</span>
        <RichText as="h2" className="h-section reveal" style={{ marginTop: 18 }} html={t("heading_html")} />
        <p className="lede reveal" style={{ margin: "18px auto 0", textAlign: "center" }}>{t("lede")}</p>
        <div className="model-chips reveal">
          {chips.map((c, i) => (
            <span className="chip" key={i}><span className="d" />{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
