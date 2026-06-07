"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

export type OS = "mac" | "windows" | "linux";

function detectOS(): OS {
  if (typeof navigator === "undefined") return "mac";
  const n = navigator as Navigator & { userAgentData?: { platform?: string } };
  const p = (n.userAgentData?.platform || n.platform || n.userAgent || "").toLowerCase();
  const ua = (n.userAgent || "").toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return "mac";
  if (/android/.test(ua)) return "linux";
  if (/mac/.test(p) || /mac os/.test(ua)) return "mac";
  if (/win/.test(p) || /windows/.test(ua)) return "windows";
  if (/linux|x11|cros/.test(p) || /linux/.test(ua)) return "linux";
  return "mac";
}

const subscribeOS = () => () => {};

export function useOS(): OS {
  // useSyncExternalStore: server snapshot ("mac") matches the initial client
  // render, then React re-renders with the real OS — hydration-safe + lint-clean.
  return useSyncExternalStore(subscribeOS, () => detectOS(), () => "mac");
}

/** Continuous parallax driven by scrollY; rate e.g. 0.18 / -0.18. */
export function useParallax(rate: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * rate}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rate]);
  return ref;
}

/** IO fallback for .reveal -> .in (CSS scroll-timeline handles modern browsers). */
export function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
}
