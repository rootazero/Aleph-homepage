"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { CodeBlock } from "@/components/shared/CodeBlock";

const tabs = [
  {
    key: "tab_gateway",
    code: `# Start the Gateway server
cargo run -p alephcore --features gateway \\
  --bin aleph-gateway -- start`,
  },
  {
    key: "tab_cli",
    code: `# Use the CLI client
cargo run -p aleph-cli -- "Hello, Aleph!"`,
  },
  {
    key: "tab_desktop",
    code: `# Launch the Desktop app (Tauri)
cd apps/desktop
pnpm install
pnpm tauri dev`,
  },
];

export function QuickStart() {
  const t = useTranslations("quickstart");
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="quickstart" className="relative py-32 bg-[#050508] border-t border-edge/10">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[10px] tracking-[0.4em] text-accent mb-4 uppercase font-mono">{t("title")}</h2>
          <div className="h-px w-12 bg-accent/30 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.3, 0, 0, 1] }}
          className="relative"
        >
          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-edge/10 px-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={`pb-4 text-[10px] tracking-[0.2em] font-mono uppercase transition-all relative ${
                  activeTab === i
                    ? "text-accent"
                    : "text-faint hover:text-muted"
                }`}
              >
                {t(tab.key)}
                {activeTab === i && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-px bg-accent" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code block area */}
          <div className="rounded-xl overflow-hidden border border-edge/10 bg-surface/30 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CodeBlock code={tabs[activeTab].code} language="bash" />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-8 text-[10px] tracking-[0.1em] text-faint font-mono text-center uppercase">
            {t("requires")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
