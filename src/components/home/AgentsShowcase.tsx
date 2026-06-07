import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { BustFigure } from "./figures";
import { AGENTS, TONE_VAR } from "./data";

export function AgentsShowcase() {
  const t = useTranslations("agents");
  const items = t.raw("items") as { name: string; tag: string; d: string }[];
  return (
    <section className="dark section">
      <div className="wrap">
        <div className="dark-grid">
          <div className="reveal" data-anim="left">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-statement" style={{ marginTop: 20 }} html={t.raw("statement_html") as string} />
            <p style={{ color: "#b3a98f", marginTop: 22, maxWidth: "40ch" }}>{t("body")}</p>
            <div className="spec-row mt-l">
              <span className="spec"><b style={{ color: "#fff" }}>{t("stat1_b")}</b> {t("stat1")}</span>
              <span className="spec"><b style={{ color: "#fff" }}>{t("stat2_b")}</b> {t("stat2")}</span>
            </div>
          </div>
          <div className="agent-cards reveal" data-anim="right">
            {AGENTS.map((a, i) => {
              const item = items[i];
              return (
                <div className="agent-card" key={a.id}>
                  <div className="ac-head">
                    {/* TODO(placeholder): invented agent name */}
                    <span className="ac-name"><b>aleph/</b>{item.name}</span>
                    <span className="ac-tag">{item.tag}</span>
                  </div>
                  <div className="ac-art">
                    <span className="coral-disc" style={{ width: "46%", aspectRatio: 1, left: "10%", top: "14%", background: TONE_VAR[a.tone] }} />
                    <BustFigure className="grain-fig" style={{ position: "absolute", width: "42%", right: "8%", bottom: 0, color: "#3a3326" }} />
                    <span className="label" style={{ position: "absolute", bottom: 8, left: 10, color: "#7d745c" }}>live</span>
                  </div>
                  <p>{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
