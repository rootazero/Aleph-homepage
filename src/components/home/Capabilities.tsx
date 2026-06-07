"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";
import { CAP_IDS, type CapId } from "./data";
import { CapabilityPreview } from "./CapabilityPreview";

function CapIcon({ id }: { id: CapId }) {
  // Copy the matching <svg> inner markup from Aleph.html (research L205, inbox L211,
  // schedule L217, life L223, write L229, code L235). Keep className="ico".
  switch (id) {
    case "research": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><path d="M16 16l5 5" /></svg>;
    case "inbox": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
    case "schedule": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>;
    case "life": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 8h16l-1.5 11H5.5L4 8z" /><path d="M8 8a4 4 0 018 0" /></svg>;
    case "write": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 20l4-1L20 7l-3-3L5 16l-1 4z" /></svg>;
    case "code": return <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" /></svg>;
  }
}

export function Capabilities() {
  const t = useTranslations("capabilities");
  const [active, setActive] = useState<CapId>("research");
  // remount key forces preview animation replay on tab change / first view
  const [replay, setReplay] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { setReplay((n) => n + 1); io.disconnect(); } });
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const select = (id: CapId) => { setActive(id); setReplay((n) => n + 1); };

  return (
    <section className="caps section" id="capabilities" ref={sectionRef}>
      <div className="wrap">
        <div className="caps-head">
          <div className="reveal">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h2" className="h-section" style={{ marginTop: 18 }} html={t.raw("heading_html") as string} />
          </div>
          <p className="lede reveal" data-anim="right" style={{ justifySelf: "end" }}>{t("lede")}</p>
        </div>

        <div className="caps-layout">
          <div className="cap-tabs reveal">
            {CAP_IDS.map((id) => (
              <button key={id} className={`cap-card${active === id ? " active" : ""}`} onClick={() => select(id)}>
                <div className="ix"><span>{t(`items.${id}.ix`)}</span><span>{"↳"}</span></div>
                <CapIcon id={id} />
                <h4>{t(`items.${id}.title`)}</h4>
                <p>{t(`items.${id}.desc`)}</p>
              </button>
            ))}
          </div>

          <div className="cap-preview reveal" data-anim="scale">
            <div className="cap-preview-top">
              <div className="cap-preview-dots"><i /><i /><i /></div>
              <span className="label">{t(`items.${active}.label`)}</span>
            </div>
            <div className="cap-body" key={replay}>
              <CapabilityPreview id={active} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
