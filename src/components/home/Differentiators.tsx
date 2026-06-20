import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { Link } from "@/i18n/navigation";

// Stable per-member avatar tones (mirrors Aleph's hash(agent_id) -> color rule:
// a member keeps the same color regardless of roster order).
const AV_TONE = ["var(--coral)", "var(--mustard)", "var(--sage)", "var(--ink)"];
// Trust tier -> supporting palette tone (keyed on the language-independent tier).
const TIER_TONE: Record<string, string> = {
  official: "var(--sage)",
  verified: "var(--mustard)",
  community: "var(--stone)",
};
// Linked-memory node tones + fixed graph coordinates (0..100, mapped to the box).
const NODE_TONE = ["var(--coral)", "var(--sage)", "var(--mustard)", "var(--ink)"];
const NODE_POS = [
  { x: 20, y: 24 },
  { x: 70, y: 18 },
  { x: 26, y: 74 },
  { x: 72, y: 66 },
];
const EDGES: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [0, 3]];

type RosterMember = { emoji: string; name: string; status: string };
type GcMsg = { who: string; emoji: string; text: string };
type StoreItem = { name: string; kind: string; trust: string; tier: string };

function MemGraph({ nodes }: { nodes: string[] }) {
  return (
    <div className="mem-graph">
      <svg className="mem-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODE_POS[a].x} y1={NODE_POS[a].y} x2={NODE_POS[b].x} y2={NODE_POS[b].y} />
        ))}
      </svg>
      {nodes.map((n, i) => (
        <span className="mem-node" key={n} style={{ left: `${NODE_POS[i].x}%`, top: `${NODE_POS[i].y}%` }}>
          <span className="mem-dot" style={{ background: NODE_TONE[i % NODE_TONE.length] }} />
          {n}
        </span>
      ))}
    </div>
  );
}

export function Differentiators() {
  const t = useTranslations("differentiators");
  const roster = t.raw("teams.roster") as RosterMember[];
  const msgs = t.raw("teams.msgs") as GcMsg[];
  const nodes = t.raw("memory.nodes") as string[];
  const items = t.raw("store.items") as StoreItem[];

  return (
    <section className="diff section" id="differentiators">
      <div className="wrap">
        <div className="diff-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18 }} html={t.raw("heading_html") as string} />
          </div>
          <p className="lede reveal" data-anim="right" style={{ justifySelf: "end" }}>{t("lede")}</p>
        </div>

        <div className="diff-bento">
          {/* Featured — Teams / Group chat */}
          <div className="diff-card feat reveal" data-anim="up">
            <div className="dc-copy">
              <span className="dc-tag">{t("teams.tag")}</span>
              <h3>{t("teams.title")}</h3>
              <p className="dc-desc">{t("teams.desc")}</p>
              <Link className="dc-more" href="/docs/concepts/group-chat">{t("more")} <span className="arr">{"→"}</span></Link>
            </div>
            <div className="dc-preview gc">
              <div className="gc-roster">
                {roster.map((m, i) => (
                  <span className="gc-mem" key={m.name}>
                    <i className="gc-av" style={{ background: AV_TONE[i % AV_TONE.length] }}>{m.emoji}</i>
                    <b>{m.name}</b>
                    <span className="gc-status">{m.status}</span>
                  </span>
                ))}
              </div>
              <div className="gc-flow">
                {msgs.map((m) => {
                  const idx = roster.findIndex((r) => r.name === m.who);
                  return (
                    <div className="gc-msg" key={m.who}>
                      <i className="gc-av" style={{ background: AV_TONE[idx % AV_TONE.length] }}>{m.emoji}</i>
                      <div className="gc-body">
                        <span className="gc-name">{m.who}</span>
                        <div className="gc-bubble">{m.text}</div>
                      </div>
                    </div>
                  );
                })}
                <div className="gc-task"><span className="gc-task-dot" />{t("teams.task")}</div>
              </div>
            </div>
          </div>

          <div className="diff-pair">
            {/* Memory Hub */}
            <div className="diff-card reveal" data-anim="up">
              <span className="dc-tag">{t("memory.tag")}</span>
              <h3>{t("memory.title")}</h3>
              <p className="dc-desc">{t("memory.desc")}</p>
              <div className="dc-preview mem">
                <MemGraph nodes={nodes} />
                <span className="mem-trace"><span className="mem-trace-dot" />{t("memory.trace")}</span>
              </div>
              <Link className="dc-more" href="/docs/concepts/memory">{t("more")} <span className="arr">{"→"}</span></Link>
            </div>

            {/* Extensions Store */}
            <div className="diff-card reveal" data-anim="up">
              <span className="dc-tag">{t("store.tag")}</span>
              <h3>{t("store.title")}</h3>
              <p className="dc-desc">{t("store.desc")}</p>
              <div className="dc-preview store">
                {items.map((it) => (
                  <div className="store-row" key={it.name}>
                    <span className="store-name">{it.name}</span>
                    <span className="store-kind">{it.kind}</span>
                    <span className="store-trust"><span className="store-dot" style={{ background: TIER_TONE[it.tier] }} />{it.trust}</span>
                  </div>
                ))}
                <span className="store-foot">{t("store.foot")}</span>
              </div>
              <Link className="dc-more" href="/docs/concepts/extensions-store">{t("more")} <span className="arr">{"→"}</span></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
