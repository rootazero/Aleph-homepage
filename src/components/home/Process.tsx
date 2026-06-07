import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { Figure } from "./figures";
import { PROCESS } from "./data";

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { t: string; d: string }[];
  return (
    <section className="process section ruled" id="process">
      <div className="wrap">
        <div className="process-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18 }} html={t.raw("heading_html") as string} />
          </div>
          <p className="lede reveal" data-anim="right" style={{ maxWidth: "34ch" }}>{t("lede")}</p>
        </div>
        <div className="steps">
          {PROCESS.map((p, i) => (
            <div className="step reveal" key={p.id}>
              <div className="topline"><span className="num">{p.num}</span><span className="ln" /></div>
              <div className="frame">
                <span className="coral-disc" style={{ width: "50%", aspectRatio: 1, left: "25%", top: "14%" }} />
                <Figure kind={p.fig} className={p.fig === "plant" ? undefined : "grain-fig"} style={{ position: "absolute", width: p.fig === "plant" ? "42%" : "64%", left: p.fig === "plant" ? "29%" : "18%", bottom: p.fig === "plant" ? "8%" : 0, color: "var(--ink)" }} />
              </div>
              <h4>{steps[i].t}</h4>
              <p>{steps[i].d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
