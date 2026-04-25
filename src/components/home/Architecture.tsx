"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/shared/GlassCard";

const cards = [
  { key: "core", number: "01" },
  { key: "faces", number: "02" },
  { key: "limbs", number: "03" },
  { key: "nerves", number: "04" },
];

export function Architecture() {
  const t = useTranslations("architecture");

  return (
    <section className="relative py-32 bg-page">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-[10px] tracking-[0.4em] text-accent mb-4 uppercase font-mono">{t("title")}</h2>
          <div className="h-px w-12 bg-accent/30 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-edge/20 border border-edge/20">
          {cards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
              }}
              className="bg-page group"
            >
              <div className="p-8 h-full flex flex-col items-start transition-all duration-500 hover:bg-accent/[0.02]">
                <div className="text-4xl font-mono font-light text-edge mb-8 group-hover:text-accent transition-colors">
                  {card.number}
                </div>
                <div className="mt-auto">
                  <h3 className="text-xl font-light tracking-wide text-heading mb-2">
                    {t(`${card.key}_title`)}
                  </h3>
                  <p className="text-[10px] tracking-[0.2em] text-accent uppercase font-mono mb-4">
                    {t(`${card.key}_label`)}
                  </p>
                  <p className="text-sm text-faint leading-relaxed font-light">
                    {t(`${card.key}_desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
