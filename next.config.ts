import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX();

// docs.heyaleph.com is an alias that redirects to the canonical /docs path on
// the main domain. redirects() runs before middleware, so it doesn't entangle
// with next-intl's locale routing.
const DOCS_HOST = "docs.heyaleph.com";
const onDocsHost = [{ type: "host" as const, value: DOCS_HOST }];
// Keep this false (307) while verifying — browsers cache 301s aggressively and
// they're painful to undo. Flip to true (308) once the redirect is confirmed.
const REDIRECT_PERMANENT = false;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // zh entry: keep the locale prefix, insert /docs after it.
      {
        source: "/zh/:path*",
        has: onDocsHost,
        destination: "https://heyaleph.com/zh/docs/:path*",
        permanent: REDIRECT_PERMANENT,
      },
      {
        source: "/zh",
        has: onDocsHost,
        destination: "https://heyaleph.com/zh/docs",
        permanent: REDIRECT_PERMANENT,
      },
      // Everything else on the docs subdomain -> en docs.
      {
        source: "/:path*",
        has: onDocsHost,
        destination: "https://heyaleph.com/docs/:path*",
        permanent: REDIRECT_PERMANENT,
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));
