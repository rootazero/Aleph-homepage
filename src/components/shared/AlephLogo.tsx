"use client";

import { motion } from "motion/react";

export function AlephLogo({ size = 256, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.3, 0, 0, 1] }}
      className={`relative group cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div 
          className="w-full h-full bg-accent rounded-full blur-[100px] transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60"
          style={{ width: size, height: size }}
        />
      </div>

      <svg 
        viewBox="0 0 200 200" 
        width={size}
        height={size}
        className="relative z-10 drop-shadow-[0_0_15px_rgba(var(--accent),0.3)] transition-all duration-700 group-hover:drop-shadow-[0_0_30px_rgba(var(--accent),0.6)]"
      >
        <defs>
          <filter id="glow-logo" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Pyramid outline */}
        <polygon 
          points="100,20 180,160 20,160" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="text-muted group-hover:text-accent transition-colors duration-500"
        />
        
        {/* Aleph symbol */}
        <text 
          x="100" y="115" 
          fontSize="64" 
          fontFamily="serif"
          textAnchor="middle" 
          className="fill-heading transition-all duration-500 group-hover:scale-110 origin-center"
        >
          א
        </text>

        {/* Separation line */}
        <line 
          x1="45" y1="130" 
          x2="155" y2="130" 
          stroke="currentColor" 
          strokeWidth="1.5"
          className="text-edge"
        />

        {/* ALEPH text */}
        <text 
          x="100" y="150" 
          fontSize="14" 
          fontFamily="var(--font-display)"
          letterSpacing="0.4em"
          textAnchor="middle" 
          className="fill-muted font-light"
        >
          ALEPH
        </text>
      </svg>
    </motion.div>
  );
}
