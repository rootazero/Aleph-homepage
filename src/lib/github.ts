import type { OS } from "@/components/home/hooks";

const REPO = "rootazero/Aleph";
const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

export type DownloadUrls = Record<OS, string>;

/**
 * Server-side GitHub API request. Cached in Next.js' Data Cache for an hour, so
 * we hit GitHub at most ~once/hour regardless of visitor count — this avoids
 * GitHub's 60/hr-per-IP anonymous limit that a per-visitor client fetch would
 * hit (e.g. many users behind one shared NAT). Set GITHUB_TOKEN to raise the
 * limit further; it works unauthenticated too. Returns null on any failure.
 */
async function ghFetch<T>(path: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Format a star count like GitHub does: 3400 -> "3.4k", 3000 -> "3k". */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

/**
 * The repo's star count, formatted (e.g. "3", "3.4k"). Returns null when the
 * API is unavailable so callers can omit the count rather than show a fake one.
 */
export async function getStars(): Promise<string | null> {
  const data = await ghFetch<{ stargazers_count?: number }>("");
  return typeof data?.stargazers_count === "number" ? formatStars(data.stargazers_count) : null;
}

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
 * Direct download URLs for the latest release, per OS. Release assets are
 * version-stamped, so GitHub's static /releases/latest/download/<name> path
 * can't match them; we resolve each platform's installer from the latest
 * release. Falls back to the releases page so links always work.
 */
export async function getDownloadUrls(): Promise<DownloadUrls> {
  const fallback: DownloadUrls = { mac: RELEASES_PAGE, windows: RELEASES_PAGE, linux: RELEASES_PAGE };
  const data = await ghFetch<{ assets?: ReleaseAsset[] }>("/releases/latest");
  if (!data) return fallback;
  const assets = data.assets ?? [];
  return {
    mac: pickAsset(assets, "mac") ?? RELEASES_PAGE,
    windows: pickAsset(assets, "windows") ?? RELEASES_PAGE,
    linux: pickAsset(assets, "linux") ?? RELEASES_PAGE,
  };
}
