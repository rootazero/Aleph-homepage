"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { 
  Triangle, 
  Infinity as InfinityIcon, 
  Sparkles, 
  Brain, 
  Database, 
  Wrench, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  Terminal,
  Copy,
  Check
} from 'lucide-react';
import { CodeBlock } from "@/components/shared/CodeBlock";
import { Link } from "@/i18n/navigation";

export default function HomePage() {
  const [activeLayer, setActiveLayer] = useState(5);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const t_hero = useTranslations("hero");
  const t_phi = useTranslations("philosophy");
  const t_arch = useTranslations("architecture");
  const t_feat = useTranslations("features");
  const t_qs = useTranslations("quickstart");

  const layers = [
    { id: 1, name: t_phi("l1_name"), detail: t_phi("l1_detail") },
    { id: 2, name: t_phi("l2_name"), detail: t_phi("l2_detail") },
    { id: 3, name: t_phi("l3_name"), detail: t_phi("l3_detail") },
    { id: 4, name: t_phi("l4_name"), detail: t_phi("l4_detail") },
    { id: 5, name: t_phi("l5_name"), detail: t_phi("l5_detail") }
  ];

  const archCards = [
    { key: "core", number: "01" },
    { key: "faces", number: "02" },
    { key: "limbs", number: "03" },
    { key: "nerves", number: "04" },
  ];

  const features = [
    { key: "polymorphic", icon: InfinityIcon },
    { key: "learning", icon: Brain },
    { key: "memory", icon: Database },
    { key: "tools", icon: Wrench },
    { key: "provider", icon: Layers },
    { key: "privacy", icon: ShieldCheck },
  ];

  const qsTabs = [
    {
      key: "tab_gateway",
      code: `# Start the Gateway server\ncargo run -p alephcore --features gateway \\\n  --bin aleph-gateway -- start`,
    },
    {
      key: "tab_cli",
      code: `# Use the CLI client\ncargo run -p aleph-cli -- "Hello, Aleph!"`,
    },
    {
      key: "tab_desktop",
      code: `# Launch the Desktop app (Tauri)\ncd apps/desktop\npnpm install\npnpm tauri dev`,
    },
  ];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(qsTabs[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-gray-300 font-sans selection:bg-cyan-900 selection:text-cyan-50">
      
      {/* Header */}
      <header className="fixed top-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference pointer-events-none">
        <div className="text-[10px] tracking-[0.4em] text-gray-400 uppercase font-mono">PROJECT: ALEPH</div>
        <div className="flex items-center gap-8">
          <Link
            href="/docs"
            className="pointer-events-auto text-[10px] tracking-[0.4em] text-gray-400 hover:text-cyan-400 uppercase font-mono transition-colors"
          >
            DOCS
          </Link>
          <div className="text-[10px] tracking-[0.2em] text-cyan-400 font-mono animate-pulse">STATUS: EMERGING</div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <motion.div 
            animate={{ scale: isHoveringLogo ? 1.1 : 1.0, opacity: isHoveringLogo ? 0.6 : 0.3 }}
            transition={{ duration: 1 }}
            className="w-[600px] h-[600px] bg-cyan-900/40 rounded-full blur-[150px]" 
          />
        </div>

        <motion.div 
          className="relative z-10 flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => setIsHoveringLogo(true)}
          onMouseLeave={() => setIsHoveringLogo(false)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <svg viewBox="0 0 200 200" className="w-64 h-64 md:w-80 md:h-80 transition-all duration-700 group-hover:drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            <polygon points="100,20 180,160 20,160" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 group-hover:text-cyan-400 transition-colors" />
            <text x="100" y="115" fontSize="64" fontFamily="serif" textAnchor="middle" className="fill-white group-hover:scale-110 origin-center transition-all">א</text>
            <line x1="45" y1="130" x2="155" y2="130" stroke="currentColor" strokeWidth="1.5" className="text-gray-700" />
            <text x="100" y="150" fontSize="14" fontFamily="var(--font-display)" letterSpacing="0.4em" textAnchor="middle" className="fill-gray-300">ALEPH</text>
          </svg>
        </motion.div>

        <div className="absolute bottom-24 text-center z-10 px-6 max-w-2xl">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-2xl md:text-4xl font-light tracking-[0.2em] text-white mb-4 uppercase">
            {t_hero("title")}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-gray-300 font-light tracking-widest mb-8">
            {t_hero("subtitle")}
          </motion.p>
          <motion.div initial={{ height: 0 }} animate={{ height: 40 }} transition={{ delay: 1.2 }} className="w-px bg-gradient-to-b from-cyan-400 to-transparent mx-auto opacity-50" />
        </div>
      </section>

      {/* 2. Philosophy Pyramid */}
      <section className="py-48 bg-[#07070a] relative overflow-hidden border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-[10px] tracking-[0.4em] text-cyan-400 mb-4 uppercase font-mono">EVOLUTIONARY LOGIC</h2>
            <h3 className="text-3xl font-light tracking-wide text-white mb-10">{t_phi("title")}</h3>
            <p className="text-gray-300 mb-16 text-sm leading-relaxed max-w-md font-light">{t_phi("subtitle")}</p>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((level) => (
                <div 
                  key={level} 
                  onMouseEnter={() => setActiveLayer(level)}
                  className={`p-5 border-l border-gray-800 cursor-pointer transition-all duration-500 ${activeLayer === level ? 'border-cyan-400 bg-cyan-950/20' : 'hover:border-gray-600'}`}
                >
                  <div className={`flex items-center justify-between ${activeLayer === level ? 'text-cyan-300' : 'text-gray-400'}`}>
                    <span className="font-mono text-xs tracking-[0.2em]">{layers.find(l => l.id === level)!.name}</span>
                    {activeLayer === level && <Sparkles className="w-4 h-4 animate-pulse" />}
                  </div>
                  <AnimatePresence mode="wait">
                    {activeLayer === level && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 text-xs text-gray-300 font-light leading-relaxed">
                        {layers.find(l => l.id === level)!.detail}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 border border-gray-900/30 rounded-full scale-150 border-dashed animate-spin-slow" />
            <svg viewBox="0 0 300 300" className="w-full h-full max-w-[450px] relative z-10">
              <defs><linearGradient id="glowBrand" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" /><stop offset="100%" stopColor="#22d3ee" stopOpacity="0.05" /></linearGradient></defs>
              {[1, 2, 3, 4, 5].map((level) => {
                const totalHeight = 240, baseY = 270, topY = 30, apexX = 150, baseWidth = 260;
                const levelHeight = totalHeight / 5;
                const yBottom = baseY - (level - 1) * levelHeight, yTop = baseY - level * levelHeight;
                const widthBottom = baseWidth * ((yBottom - topY) / totalHeight), widthTop = baseWidth * ((yTop - topY) / totalHeight);
                const xBottomLeft = apexX - widthBottom / 2, xBottomRight = apexX + widthBottom / 2, xTopLeft = apexX - widthTop / 2, xTopRight = apexX + widthTop / 2;
                return (
                  <motion.g key={`poly-brand-${level}`} onMouseEnter={() => setActiveLayer(level)} className="cursor-pointer">
                    <polygon points={`${xBottomLeft},${yBottom} ${xBottomRight},${yBottom} ${xTopRight},${yTop} ${xTopLeft},${yTop}`} fill={activeLayer === level ? 'url(#glowBrand)' : (level < activeLayer ? 'rgba(34,211,238,0.05)' : 'transparent')} stroke={activeLayer === level ? '#22d3ee' : '#374151'} strokeWidth={activeLayer === level ? "2" : "1"} className="transition-all duration-500" />
                    {level !== 5 ? <text x="150" y={yBottom - levelHeight/2 + 5} textAnchor="middle" className={`text-[8px] font-mono ${activeLayer === level ? 'fill-cyan-100' : 'fill-gray-500'}`} letterSpacing="0.2em">L{level}</text>
                               : <text x="150" y={yBottom - levelHeight/2 + 12} textAnchor="middle" className={`text-2xl font-serif ${activeLayer === level ? 'fill-white' : 'fill-gray-500'}`}>א</text>}
                  </motion.g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* 3. Technical Architecture (1-2-3-4 Model) */}
      <section className="py-48 bg-[#050508]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-24">
            <h2 className="text-[10px] tracking-[0.4em] text-cyan-400 mb-4 uppercase font-mono">{t_arch("title")}</h2>
            <h3 className="text-3xl font-light tracking-wide text-white">架构驱动的智能形态</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 items-start">
            {archCards.map((card, i) => (
              <motion.div 
                key={card.key} 
                whileHover={{ y: -5 }}
                className="group border-l border-gray-800 pl-8 pb-8 transition-all duration-500 hover:border-cyan-400 min-h-[180px]"
              >
                <div className="text-4xl font-mono font-light text-gray-700 mb-6 group-hover:text-cyan-400/50 transition-colors leading-none">{card.number}</div>
                <div>
                  <h3 className="text-xl font-light tracking-wide text-white mb-2">{t_arch(`${card.key}_title`)}</h3>
                  <p className="text-[10px] tracking-[0.2em] text-cyan-400 uppercase font-mono mb-4">{t_arch(`${card.key}_label`)}</p>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{t_arch(`${card.key}_desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Grid - Grouped Design with Top-Alignment */}
      <section className="py-48 bg-[#07070a] border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-24">
            <h2 className="text-[10px] tracking-[0.4em] text-cyan-400 mb-4 uppercase font-mono">{t_feat("title")}</h2>
            <h3 className="text-3xl font-light tracking-wide text-white">核心能力矩阵</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 items-start">
            {features.slice(0, 3).map((feature) => (
              <div key={feature.key} className="py-2">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group border-l border-gray-800 pl-8 transition-all duration-500 hover:border-cyan-400 min-h-[160px]"
                >
                  <div className="text-gray-500 mb-6 group-hover:text-cyan-400 transition-colors duration-500 h-8 flex items-center">
                    <feature.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light tracking-wide text-white mb-2">{t_feat(`${feature.key}_title`)}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                      {t_feat(`${feature.key}_desc`)}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="h-4"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 items-start">
            {features.slice(3, 6).map((feature) => (
              <div key={feature.key} className="py-2">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group border-l border-gray-800 pl-8 transition-all duration-500 hover:border-cyan-400 min-h-[160px]"
                >
                  <div className="text-gray-500 mb-6 group-hover:text-cyan-400 transition-colors duration-500 h-8 flex items-center">
                    <feature.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light tracking-wide text-white mb-2">{t_feat(`${feature.key}_title`)}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                      {t_feat(`${feature.key}_desc`)}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Quick Start */}
      <section id="quickstart" className="py-48 bg-[#050508] border-t border-gray-900/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="text-[10px] tracking-[0.4em] text-cyan-400 mb-4 uppercase font-mono">{t_qs("title")}</h2>
            <h3 className="text-3xl font-light tracking-wide text-white mb-8">即刻部署</h3>
            <p className="text-sm text-gray-300 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
              Aleph 的核心完全由 Rust 驱动，旨在提供极致的性能与安全性。选择你的部署场景，开始探索智能的下一维度。
            </p>
          </div>

          <div className="relative group border border-gray-900 bg-gray-950/80 rounded-lg overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
            <div className="bg-gray-900/40 border-b border-gray-900 flex items-stretch h-12">
              <div className="px-6 flex items-center gap-2 border-r border-gray-900 hidden md:flex">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-800" />
              </div>
              <div className="flex flex-1 overflow-x-auto no-scrollbar">
                {qsTabs.map((tab, i) => (
                  <button key={tab.key} onClick={() => setActiveTab(i)} className={`px-8 py-0 flex items-center h-full text-[10px] tracking-[0.2em] font-mono uppercase transition-all whitespace-nowrap border-r border-gray-900 relative ${activeTab === i ? "text-cyan-400 bg-black/40 shadow-[inset_0_2px_0_rgba(34,211,238,1)]" : "text-gray-500 hover:text-gray-400 hover:bg-gray-900/20"}`}>
                    {t_qs(tab.key)}
                  </button>
                ))}
              </div>
              <div className="border-l border-gray-900">
                <button onClick={handleCopy} className="px-8 h-full flex items-center gap-3 text-gray-500 hover:text-cyan-400 font-mono text-[8px] tracking-[0.2em] uppercase transition-colors">
                  {copied ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="min-h-[160px]">
                  <CodeBlock code={qsTabs[activeTab].code} language="bash" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="px-8 py-4 bg-black/60 border-t border-gray-900 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-[0.1em] text-gray-500 font-mono uppercase">{t_qs("requires")}</span>
                <span className="w-1 h-1 rounded-full bg-gray-800" />
                <span className="text-[10px] tracking-[0.1em] text-cyan-900 font-mono uppercase">Status: Ready</span>
              </div>
              <div className="text-[10px] text-gray-700 font-mono uppercase">1.92.0_stable</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 text-center border-t border-gray-900 text-[10px] text-gray-500 tracking-[0.5em] font-mono uppercase">
        © {new Date().getFullYear()} PROJECT ALEPH. {t_phi("closing")}
      </footer>
    </div>
  );
}
