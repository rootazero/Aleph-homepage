"use client";

import { useTranslations } from "next-intl";
import { useOS, useParallax } from "./hooks";
import { RichText } from "./RichText";
import { BustFigure, PlantFigure, WingFigure } from "./figures";
import { OS_ICON } from "./data";

const OS_NAME = { mac: "macOS", windows: "Windows", linux: "Linux" } as const;

export function Hero() {
  const t = useTranslations("hero");
  const os = useOS();
  const leftRef = useParallax(0.18);
  const rightRef = useParallax(-0.18);

  return (
    <section className="hero section ruled" id="top">
      <div className="wrap">
        <div className="hero-spec">
          <div className="col">
            <span className="label">{t("index_label")}</span>
            <span className="label">{t("tag_label")}</span>
          </div>
          <div className="col r">
            <span className="label">{t("est_label")}</span>
            <span className="label">{t("geo_label")}</span>
          </div>
        </div>

        <div className="hero-stage">
          <div className="hero-fig left" ref={leftRef}>
            <div style={{ position: "relative" }}>
              <span className="coral-disc" style={{ width: "62%", aspectRatio: 1, left: "18%", top: "6%" }} />
              <BustFigure className="grain-fig" style={{ position: "relative", width: "100%", color: "var(--stone)" }} />
              <PlantFigure style={{ position: "absolute", width: "34%", right: "-6%", top: "-12%", color: "var(--sage)" }} />
            </div>
          </div>
          <div className="hero-fig right" ref={rightRef}>
            <div style={{ position: "relative", transform: "scaleX(-1)" }}>
              <span className="coral-disc" style={{ width: "58%", aspectRatio: 1, left: "22%", top: "10%", background: "var(--ink)" }} />
              <WingFigure className="grain-fig" style={{ position: "relative", width: "100%", color: "var(--stone-deep)" }} />
            </div>
          </div>

          <div className="hero-title-wrap">
            <div className="hero-eyebrow"><span className="eyebrow"><span className="dot" />{t("eyebrow")}</span></div>
            <h1 className="display-xl">{t("title")}</h1>
            <RichText as="div" className="hero-sub" html={t("sub_html")} />
            <p className="hero-desc">{t("desc")}</p>
            <div className="hero-cta">
              <a className="btn btn-ghost btn-star" href="https://github.com/rootazero/Aleph" target="_blank" rel="noopener">
                <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {/* GitHub icon: copied from Aleph.html line 119 */}
                  <path d="M12 1.5A10.5 10.5 0 0 0 8.7 22c.5.1.72-.22.72-.49v-1.9c-2.92.64-3.54-1.25-3.54-1.25-.48-1.21-1.17-1.53-1.17-1.53-.95-.65.07-.64.07-.64 1.06.07 1.61 1.09 1.61 1.09.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.66-1.4-2.33-.27-4.78-1.17-4.78-5.2 0-1.15.41-2.09 1.08-2.83-.11-.27-.47-1.34.1-2.79 0 0 .88-.28 2.88 1.08a9.9 9.9 0 0 1 5.24 0c2-1.36 2.88-1.08 2.88-1.08.57 1.45.21 2.52.1 2.79.67.74 1.08 1.68 1.08 2.83 0 4.04-2.46 4.93-4.8 5.19.38.33.71.97.71 1.96v2.9c0 .27.19.6.72.49A10.5 10.5 0 0 0 12 1.5Z" />
                </svg>
                <span>{t("star")}</span>
                {/* TODO(placeholder): real star count */}
                <span className="star-count">{t("star_count")}</span>
              </a>
              <a className="btn btn-dl" href="https://github.com/rootazero/Aleph/releases">
                <span className="os-ico lg" aria-hidden="true" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: OS_ICON[os] }} />
                <span className="dl-stack">
                  <b>{t("dl_for", { os: OS_NAME[os] })}</b>
                  <small>{t(`dl_sub_${os}`)}</small>
                </span>
              </a>
            </div>
            <div className="dl-alts">
              <span>{t("dl_also")}</span>{" "}
              <a href="https://github.com/rootazero/Aleph/releases" style={os === "mac" ? { color: "var(--coral)", borderColor: "var(--coral)" } : undefined}>macOS</a> {"·"}{" "}
              <a href="https://github.com/rootazero/Aleph/releases" style={os === "windows" ? { color: "var(--coral)", borderColor: "var(--coral)" } : undefined}>Windows</a> {"·"}{" "}
              <a href="https://github.com/rootazero/Aleph/releases" style={os === "linux" ? { color: "var(--coral)", borderColor: "var(--coral)" } : undefined}>Linux</a>
            </div>
          </div>
        </div>

        <div className="hero-foot">
          <div className="spec-row">
            <span className="spec"><span className="n">01</span> <b>{t("spec1_b")}</b> {t("spec1")}</span>
            <span className="spec"><span className="n">02</span> <b>{t("spec2_b")}</b> {t("spec2")}</span>
            <span className="spec"><span className="n">03</span> <b>{t("spec3_b")}</b> {t("spec3")}</span>
          </div>
          <span className="label">{t("scroll")}</span>
        </div>
      </div>
    </section>
  );
}
