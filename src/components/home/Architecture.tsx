"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/shared/GlassCard";

const cards = [
  { key: "core", number: "1" },
  { key: "faces", number: "2" },
  { key: "limbs", number: "3" },
  { key: "nerves", number: "4" },
];

export function Architecture() {
  const t = useTranslations("architecture");

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-16 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.3, 0, 0, 1],
              }}
            >
              <GlassCard className="text-center h-full">
                <div className="text-7xl md:text-8xl font-display font-bold bg-gradient-to-b from-aleph-blue to-aleph-purple bg-clip-text text-transparent leading-none mb-4">
                  {card.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {t(`${card.key}_title`)}
                </h3>
                <p className="text-sm text-aleph-cyan font-medium mb-3">
                  {t(`${card.key}_label`)}
                </p>
                <p className="text-sm text-aleph-muted">
                  {t(`${card.key}_desc`)}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
