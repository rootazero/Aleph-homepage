"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { RichText } from "./RichText";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];
  const [open, setOpen] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="faq section" id="faq">
      <div className="wrap">
        <div className="faq-grid">
          <div className="reveal" data-anim="left">
            <span className="eyebrow"><span className="dot" />{t("eyebrow")}</span>
            <RichText as="h3" className="faq-title" style={{ marginTop: 18 }} html={t.raw("title_html") as string} />
            <a className="btn btn-ghost" href="#" style={{ marginTop: 40 }}>{t("talk")} <span className="arr">{"→"}</span></a>
          </div>
          <div className="acc reveal" data-anim="right">
            {items.map((f, i) => {
              const isOpen = open === i;
              return (
                <div className={`acc-item${isOpen ? " open" : ""}`} key={i}>
                  <button className="acc-q" onClick={() => setOpen(isOpen ? -1 : i)}>
                    <span>{f.q}</span><span className="pm">+</span>
                  </button>
                  <div
                    className="acc-a"
                    ref={(el) => { refs.current[i] = el; }}
                    style={{ maxHeight: isOpen ? refs.current[i]?.scrollHeight ?? 600 : 0 }}
                  >
                    <p>{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
