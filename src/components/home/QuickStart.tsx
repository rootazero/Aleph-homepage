"use client";

import { useState } from "react";
import { motion } from "motion/react";
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
    <section id="quickstart" className="relative py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.3, 0, 0, 1] }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-12 bg-gradient-to-r from-white to-aleph-muted bg-clip-text text-transparent"
        >
          {t("title")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.3, 0, 0, 1] }}
        >
          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-xl bg-aleph-surface border border-aleph-border w-fit">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === i
                    ? "bg-aleph-blue/20 text-white"
                    : "text-aleph-muted hover:text-white"
                }`}
              >
                {t(tab.key)}
              </button>
            ))}
          </div>

          {/* Code block */}
          <CodeBlock code={tabs[activeTab].code} language="bash" />

          <p className="mt-4 text-sm text-aleph-muted text-center">
            {t("requires")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
