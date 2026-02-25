"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";

const layers = [
  { key: "l1", symbol: "", number: "L1" },
  { key: "l2", symbol: "\u2135\u2080", number: "L2" },
  { key: "l3", symbol: "\u2135\u2081", number: "L3" },
  { key: "l4", symbol: "\u2135\u2082", number: "L4" },
  { key: "l5", symbol: "\u2135\u2083", number: "L5" },
];

export function Philosophy() {
  const t = useTranslations("philosophy");

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-4xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <div className="flex flex-col gap-3">
          {layers.map((layer, i) => {
            const isL5 = i === 4;
            return (
              <motion.div
                key={layer.key}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.15,
                  ease: [0.3, 0, 0, 1],
                }}
                className={`relative flex items-center gap-4 rounded-xl px-6 py-4 border transition-all ${
                  isL5
                    ? "bg-gradient-to-r from-aleph-blue/20 to-aleph-purple/20 border-aleph-blue/40 shadow-[0_0_30px_rgba(10,132,255,0.15)]"
                    : "bg-aleph-surface border-aleph-border"
                }`}
                style={{ marginLeft: `${(4 - i) * 16}px`, marginRight: `${(4 - i) * 16}px` }}
              >
                <span className="shrink-0 w-10 text-center font-mono text-sm text-aleph-cyan">
                  {layer.number}
                </span>
                {layer.symbol && (
                  <span className="shrink-0 w-8 text-center font-display text-aleph-blue">
                    {layer.symbol}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-white">
                    {t(`${layer.key}_name`)}
                  </span>
                  <span className="ml-3 text-sm text-aleph-muted hidden sm:inline">
                    {t(`${layer.key}_desc`)}
                  </span>
                  <p className="text-sm text-aleph-muted sm:hidden mt-1">
                    {t(`${layer.key}_desc`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center text-lg font-display text-aleph-muted italic"
        >
          {t("closing")}
        </motion.p>
      </div>
    </section>
  );
}
