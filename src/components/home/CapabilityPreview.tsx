"use client";

import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { CAP_KIND, type CapId } from "./data";

function Step({ text, done }: { text: string; done: boolean }) {
  return (
    <div className="agent-step">
      <div className={`tick${done ? "" : " pending"}`}>
        {done ? (
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 6" /></svg>
        ) : (
          <span className="typing" style={{ transform: "scale(.6)" }}><i /><i /><i /></span>
        )}
      </div>
      <span><b>{text}</b></span>
    </div>
  );
}

export function CapabilityPreview({ id }: { id: CapId }) {
  const t = useTranslations("capabilities");
  const item = t.raw(`items.${id}`) as Record<string, unknown>;
  const kind = CAP_KIND[id];

  if (kind === "chat") {
    const steps = (item.steps as string[]) ?? [];
    return (
      <div className="chat">
        <div className="bubble user">{item.user as string}</div>
        <div className="bubble bot" style={{ width: "88%" }}>
          <span className="who">Aleph · working</span>
          <div className="agent-steps">
            {steps.map((s, i) => <Step key={i} text={s} done={i < steps.length - 1} />)}
          </div>
        </div>
        <div className="bubble bot">
          <span className="who">Aleph</span>
          <RichText html={item.reply_html as string} />
        </div>
      </div>
    );
  }

  if (kind === "cal") {
    const slots = t.raw("cal_slots") as { t: string; label: string; kind: "block" | "soft" }[];
    return (
      <div className="chat">
        <div className="bubble user" style={{ alignSelf: "flex-start", background: "var(--coral)", color: "#fff", whiteSpace: "nowrap" }}>{item.head as string}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 4 }}>
          {slots.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", opacity: 0, transform: "translateX(-8px)", animation: "stepin .5s forwards", animationDelay: `${i * 0.12}s` }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)", width: 42, flex: "none" }}>{s.t}</span>
              <div style={s.kind === "block"
                ? { flex: 1, padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500, background: "var(--ink)", color: "var(--paper)" }
                : { flex: 1, padding: "8px 12px", borderRadius: 7, fontSize: 13, fontWeight: 500, background: "var(--paper-deep)", border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 8 }}>{item.footer as string}</p>
      </div>
    );
  }

  // kind === "steps"
  const steps = (item.steps as string[]) ?? [];
  return (
    <div className="chat">
      <div className="bubble user" style={{ alignSelf: "flex-start", background: "var(--coral)", color: "#fff", whiteSpace: "nowrap" }}>{item.head as string}</div>
      <div className="agent-steps" style={{ marginTop: 4 }}>
        {steps.map((s, i) => <Step key={i} text={s} done={i < steps.length - 1} />)}
      </div>
      <p className="small" style={{ marginTop: 6 }}>{item.footer as string}</p>
    </div>
  );
}
