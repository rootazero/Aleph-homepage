import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

// docs.heyaleph.com is an alias that redirects to the canonical /docs path on
// the main site. redirects() runs before middleware, so it doesn't entangle
// with next-intl's locale routing.
const DOCS_HOST = "docs.heyaleph.com";
const onDocsHost = [{ type: "host" as const, value: DOCS_HOST }];
// The apex (heyaleph.com) 308-redirects to www, so target www directly to keep
// docs.* a single hop instead of docs.* -> apex -> www.
const CANONICAL = "https://www.heyaleph.com";
// Verified single-hop to www with every target returning 200, so the redirect
// is permanent (308). Set back to false (307) if you need to re-test changes.
const REDIRECT_PERMANENT = true;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Index pages: map to the docs index with NO trailing slash, so they
      // resolve in a single hop. A trailing slash (from an empty :path*) would
      // trigger an extra normalization redirect on www. Order matters: these
      // exact matches must precede the :path* catch-alls below.
      {
        source: "/",
        has: onDocsHost,
        destination: `${CANONICAL}/docs`,
        permanent: REDIRECT_PERMANENT,
      },
      {
        source: "/zh",
        has: onDocsHost,
        destination: `${CANONICAL}/zh/docs`,
        permanent: REDIRECT_PERMANENT,
      },
      // Sub-pages: keep the locale prefix (zh) and insert /docs.
      {
        source: "/zh/:path*",
        has: onDocsHost,
        destination: `${CANONICAL}/zh/docs/:path*`,
        permanent: REDIRECT_PERMANENT,
      },
      {
        source: "/:path*",
        has: onDocsHost,
        destination: `${CANONICAL}/docs/:path*`,
        permanent: REDIRECT_PERMANENT,
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
