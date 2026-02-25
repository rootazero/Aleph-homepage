"use client";

import { motion } from "motion/react";

export function AlephLogo({ size = 128 }: { size?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.3, 0, 0, 1] }}
      className="relative"
    >
      <div className="absolute inset-0 animate-glow-pulse rounded-full" />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <defs>
          <linearGradient id="heroMainGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0A84FF" />
            <stop offset="1" stopColor="#5E5CE6" />
          </linearGradient>
          <linearGradient id="heroSatGrad" x1="30" y1="15" x2="45" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#80E0FF" />
            <stop offset="1" stopColor="#0A84FF" />
          </linearGradient>
        </defs>
        <path
          d="M55 15 C59 40 70 51 95 55 C70 59 59 70 55 95 C51 70 40 59 15 55 C40 51 51 40 55 15Z"
          fill="url(#heroMainGrad)"
        />
        <path
          d="M35 14 C35.8 19 37 21 43 22 C37 23 35.8 25 35 30 C34.2 25 33 23 27 22 C33 21 34.2 19 35 14Z"
          fill="url(#heroSatGrad)"
        />
      </svg>
    </motion.div>
  );
}
