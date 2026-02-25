"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/shared/GlassCard";

const features = [
  { key: "polymorphic", icon: "◇" },
  { key: "learning", icon: "⬡" },
  { key: "memory", icon: "◈" },
  { key: "tools", icon: "⚙" },
  { key: "provider", icon: "⊞" },
  { key: "privacy", icon: "⛊" },
];

export function Features() {
  const t = useTranslations("features");

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.3, 0, 0, 1],
              }}
            >
              <GlassCard className="h-full">
                <div className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-aleph-blue/20 to-aleph-purple/20 text-aleph-cyan">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(`${feature.key}_title`)}
                </h3>
                <p className="text-sm text-aleph-muted leading-relaxed">
                  {t(`${feature.key}_desc`)}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
