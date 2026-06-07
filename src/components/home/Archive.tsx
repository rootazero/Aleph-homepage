import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { Figure } from "./figures";
import { GALLERY, TONE_VAR } from "./data";

export function Archive() {
  const t = useTranslations("archive");
  const items = t.raw("items") as { t: string; n: string; d: string }[];
  return (
    <section className="archive section" id="archive">
      <div className="wrap">
        <div className="archive-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18, maxWidth: "18ch" }} html={t.raw("heading_html") as string} />
          </div>
          <a className="btn btn-ghost reveal" href="#">{t("browse")} <span className="arr">{"→"}</span></a>
        </div>
        <div className="gallery">
          {GALLERY.map((g, i) => {
            const item = items[i];
            const bustCol = g.tone === "ink" ? "var(--stone)" : "var(--ink)";
            return (
              <div className="tile" data-anim={g.anim} key={g.id}>
                <div className="frame">
                  <span className="coral-disc" style={{ width: "54%", aspectRatio: 1, left: "23%", top: "12%", background: TONE_VAR[g.tone] }} />
                  <Figure kind={g.fig} className={g.fig === "plant" ? undefined : "grain-fig"} style={{ position: "absolute", width: g.fig === "plant" ? "40%" : "62%", left: g.fig === "plant" ? "30%" : g.fig === "wing" ? "20%" : "19%", bottom: g.fig === "plant" ? "6%" : 0, color: g.fig === "wing" ? bustCol : "var(--ink)" }} />
                  <span className="label" style={{ position: "absolute", top: 10, left: 10 }}>{item.n}</span>
                </div>
                <div className="meta"><span className="t">{item.t}</span><span className="n">{"↗"}</span></div>
                <div className="desc">{item.d}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
