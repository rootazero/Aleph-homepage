"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { AlephLogo } from "@/components/shared/AlephLogo";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-page">
      {/* Background radial gradient */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] animate-pulse-soft" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-5xl px-6">
        {/* Logo */}
        <AlephLogo size={320} className="mb-12" />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.3, 0, 0, 1] }}
          className="text-4xl md:text-6xl font-display font-light tracking-[0.1em] text-center text-heading mb-6"
        >
          {t("title")}
        </motion.h1>

        {/* Subtitle / Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-lg md:text-xl text-muted font-light tracking-wide text-center max-w-2xl italic opacity-80"
        >
          &ldquo;{t("borges")}&rdquo;
        </motion.p>

        {/* Interactive Line */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: 48 }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="w-px bg-gradient-to-b from-accent to-transparent mt-12 mb-8 opacity-50"
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="flex items-center gap-8"
        >
          <a
            href="#quickstart"
            className="group relative px-8 py-3 overflow-hidden transition-all"
          >
            <span className="relative z-10 text-sm tracking-[0.3em] font-mono text-heading group-hover:text-accent transition-colors">
              {t("cta_start")}
            </span>
            <div className="absolute bottom-0 left-0 w-full h-px bg-edge group-hover:bg-accent transition-colors" />
          </a>
          <a
            href="https://github.com/rootazero/Aleph"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-3 overflow-hidden transition-all"
          >
            <span className="relative z-10 text-sm tracking-[0.3em] font-mono text-faint group-hover:text-heading transition-colors">
              GITHUB
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
