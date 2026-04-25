"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/shared/GlassCard";
import { 
  Infinity as InfinityIcon, 
  Brain, 
  Database, 
  Wrench, 
  Layers, 
  ShieldCheck 
} from "lucide-react";

const features = [
  { key: "polymorphic", icon: InfinityIcon },
  { key: "learning", icon: Brain },
  { key: "memory", icon: Database },
  { key: "tools", icon: Wrench },
  { key: "provider", icon: Layers },
  { key: "privacy", icon: ShieldCheck },
];

export function Features() {
  const t = useTranslations("features");

  return (
    <section className="relative py-32 bg-[#08080c] border-t border-edge">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-[10px] tracking-[0.4em] text-accent mb-4 uppercase font-mono">{t("title")}</h2>
          <div className="h-px w-12 bg-accent/30 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.3, 0, 0, 1],
              }}
            >
              <GlassCard className="h-full group hover:border-accent/30 transition-all duration-500 bg-surface/50">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent/5 text-accent mb-6 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                  <feature.icon className="w-6 h-6 stroke-[1.5px]" />
                </div>
                <h3 className="text-xl font-light tracking-wide text-heading mb-3">
                  {t(`${feature.key}_title`)}
                </h3>
                <p className="text-sm text-faint leading-relaxed font-light">
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
