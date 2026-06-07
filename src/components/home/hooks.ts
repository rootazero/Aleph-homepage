"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type OS = "mac" | "windows" | "linux";

/** Format a star count like GitHub does: 3400 -> "3.4k", 3000 -> "3k". */
function formatStars(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

/**
 * Fetch a repo's live star count, formatted (e.g. "3.4k"). Returns null until
 * the request resolves; callers fall back to a static string while null or on
 * error. Client-only: null on the server and the first client render, so the
 * hydrated markup matches and no suppressHydrationWarning is needed.
 */
export function useGitHubStars(repo: string): string | null {
  const [stars, setStars] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json() as Promise<{ stargazers_count: number }>;
      })
      .then((data) => {
        if (!cancelled) setStars(formatStars(data.stargazers_count));
      })
      .catch(() => {
        // Keep the static fallback; nothing else to do.
      });
    return () => {
      cancelled = true;
    };
  }, [repo]);
  return stars;
}

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
