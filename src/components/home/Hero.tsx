"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { AlephLogo } from "@/components/shared/AlephLogo";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-aleph-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <AlephLogo size={128} />
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.3, 0, 0, 1] }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.3, 0, 0, 1] }}
          className="mt-6 text-lg md:text-xl text-aleph-muted max-w-2xl mx-auto"
        >
          {t("subtitle")}
        </motion.p>

        {/* Borges quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 text-sm text-aleph-muted/60 italic"
        >
          &ldquo;{t("borges")}&rdquo;
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.3, 0, 0, 1] }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <a
            href="#quickstart"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-aleph-blue to-aleph-purple text-white font-medium transition-all hover:shadow-[0_0_30px_rgba(10,132,255,0.3)] hover:-translate-y-0.5"
          >
            {t("cta_start")}
            <span aria-hidden>→</span>
          </a>
          <a
            href="https://github.com/rootazero/Aleph"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-aleph-border text-aleph-muted hover:text-white hover:border-aleph-blue/50 transition-all"
          >
            {t("cta_github")}
            <span aria-hidden>↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
