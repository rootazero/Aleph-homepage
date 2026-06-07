const REPO = "rootazero/Aleph";

/** Format a star count like GitHub does: 3400 -> "3.4k", 3000 -> "3k". */
export function formatStars(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

/**
 * Fetch the repo's star count on the server, formatted (e.g. "3", "3.4k").
 * Returns null on failure so callers can omit the count rather than show a
 * fake number. The upstream request is cached in Next.js' Data Cache for an
 * hour, so we hit GitHub at most ~once/hour regardless of visitor count —
 * this avoids GitHub's 60/hr-per-IP anonymous limit that a per-visitor client
 * fetch would hit (e.g. many users behind one shared NAT). Set GITHUB_TOKEN
 * to raise the limit further; it works unauthenticated too.
 */
export async function getStars(): Promise<string | null> {
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number" ? formatStars(data.stargazers_count) : null;
  } catch {
    return null;
  }
}
