"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

export type OS = "mac" | "windows" | "linux";

export type DownloadUrls = Record<OS, string>;

const RELEASES_PAGE = "https://github.com/rootazero/Aleph/releases";

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

/** Pick the preferred installer asset for an OS from a release's asset list. */
function pickAsset(assets: ReleaseAsset[], os: OS): string | undefined {
  const find = (pred: (name: string) => boolean) =>
    assets.find((a) => pred(a.name.toLowerCase()))?.browser_download_url;
  if (os === "mac") return find((n) => n.endsWith(".dmg"));
  if (os === "windows")
    return find((n) => n.endsWith("-setup.exe")) ?? find((n) => n.endsWith(".exe")) ?? find((n) => n.endsWith(".msi"));
  return find((n) => n.endsWith(".appimage")) ?? find((n) => n.endsWith(".deb"));
}

/**
 * Resolve direct download URLs for the latest release, per OS. Release assets
 * are version-stamped, so GitHub's static /releases/latest/download/<name> path
 * can't match them; we fetch the latest release and pick each platform's
 * installer. Starts as (and falls back to) the releases page so clicks always
 * work before the request resolves or if it fails. Client-only fetch (same IP
 * as the visitor), so the 60/hr anonymous limit is not a practical concern.
 */
export function useLatestRelease(repo: string): DownloadUrls {
  const [urls, setUrls] = useState<DownloadUrls>({
    mac: RELEASES_PAGE,
    windows: RELEASES_PAGE,
    linux: RELEASES_PAGE,
  });
  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json() as Promise<{ assets: ReleaseAsset[] }>;
      })
      .then((data) => {
        if (cancelled) return;
        const assets = data.assets ?? [];
        setUrls({
          mac: pickAsset(assets, "mac") ?? RELEASES_PAGE,
          windows: pickAsset(assets, "windows") ?? RELEASES_PAGE,
          linux: pickAsset(assets, "linux") ?? RELEASES_PAGE,
        });
      })
      .catch(() => {
        // Keep the releases-page fallback; nothing else to do.
      });
    return () => {
      cancelled = true;
    };
  }, [repo]);
  return urls;
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
