"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

const levels = [5, 4, 3, 2, 1];

export function Philosophy() {
  const t = useTranslations("philosophy");
  const [activeLayer, setActiveLayer] = useState(5);

  return (
    <section className="relative py-32 bg-page border-t border-edge overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Content */}
        <div className="z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-[10px] tracking-[0.4em] text-accent mb-4 uppercase font-mono">{t("title")}</h2>
            <h3 className="text-3xl md:text-4xl font-display font-light tracking-wide text-heading mb-8">
              {t("subtitle")}
            </h3>
            
            <div className="space-y-3">
              {levels.map((level) => (
                <div 
                  key={level}
                  onMouseEnter={() => setActiveLayer(level)}
                  className={`p-5 border-l-2 cursor-pointer transition-all duration-300 ${
                    activeLayer === level 
                      ? 'border-accent bg-accent/5 shadow-[inset_0_0_20px_rgba(var(--accent),0.05)]' 
                      : 'border-edge hover:border-muted'
                  }`}
                >
                  <div className={`flex items-center justify-between transition-colors ${activeLayer === level ? 'text-accent' : 'text-faint'}`}>
                    <span className="font-mono text-sm tracking-widest">{t(`l${level}_name`)}</span>
                    {activeLayer === level && <Sparkles className="w-4 h-4 animate-pulse" />}
                  </div>
                  <AnimatePresence mode="wait">
                    {activeLayer === level && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-3 text-sm text-muted leading-relaxed">
                          {t(`l${level}_detail`)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-sm text-faint italic font-light tracking-wide"
            >
              &ldquo;{t("closing")}&rdquo;
            </motion.p>
          </motion.div>
        </div>

        {/* Right: Interactive Pyramid SVG */}
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Animated background rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[400px] h-[400px] border border-edge/30 rounded-full animate-spin-slow" />
            <div className="absolute w-[500px] h-[500px] border border-edge/20 rounded-full animate-spin-slow direction-reverse" />
          </div>

          <svg viewBox="0 0 300 300" className="w-full h-full max-w-[450px] relative z-10 drop-shadow-2xl">
            <defs>
              <linearGradient id="pyramidGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {[1, 2, 3, 4, 5].map((level) => {
              const totalHeight = 240;
              const baseY = 270;
              const topY = 30;
              const apexX = 150;
              const baseWidth = 260;
              
              const levelHeight = totalHeight / 5;
              const yBottom = baseY - (level - 1) * levelHeight;
              const yTop = baseY - level * levelHeight;
              
              const widthBottom = baseWidth * ((yBottom - topY) / totalHeight);
              const widthTop = baseWidth * ((yTop - topY) / totalHeight);
              
              const xBottomLeft = apexX - widthBottom / 2;
              const xBottomRight = apexX + widthBottom / 2;
              const xTopLeft = apexX - widthTop / 2;
              const xTopRight = apexX + widthTop / 2;

              const isActive = activeLayer === level;
              const isBelow = level < activeLayer;

              return (
                <motion.g 
                  key={`poly-${level}`} 
                  initial={false}
                  animate={{
                    opacity: isActive || isBelow ? 1 : 0.4,
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveLayer(level)}
                >
                  <polygon 
                    points={`${xBottomLeft},${yBottom} ${xBottomRight},${yBottom} ${xTopRight},${yTop} ${xTopLeft},${yTop}`}
                    fill={isActive ? 'url(#pyramidGlow)' : (isBelow ? 'rgba(var(--accent), 0.05)' : 'transparent')}
                    stroke={isActive ? 'var(--accent)' : 'var(--edge)'}
                    strokeWidth={isActive ? "2" : "1"}
                    className="transition-all duration-500"
                  />
                  
                  {level !== 5 ? (
                    <text 
                      x="150" 
                      y={yBottom - levelHeight/2 + 5} 
                      textAnchor="middle" 
                      className={`text-[10px] font-mono transition-colors duration-300 ${isActive ? 'fill-heading' : 'fill-faint'}`}
                      letterSpacing="0.1em"
                    >
                      L{level}
                    </text>
                  ) : (
                    <text 
                      x="150" 
                      y={yBottom - levelHeight/2 + 12} 
                      textAnchor="middle" 
                      className={`text-3xl font-serif transition-colors duration-300 ${isActive ? 'fill-heading' : 'fill-faint'}`}
                    >
                      א
                    </text>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
