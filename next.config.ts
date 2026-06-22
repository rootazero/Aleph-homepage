import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Docs moved to the standalone site at docs.heyaleph.com. Redirect the old
// bundled /docs URLs there so existing links and SEO carry over. redirects()
// runs before middleware, so it doesn't entangle with next-intl's routing.
const DOCS_SITE = "https://docs.heyaleph.com";
// Verified single-hop to docs.heyaleph.com with all targets returning 200, so
// the redirect is permanent (308). Set back to false (307) to re-test changes.
const REDIRECT_PERMANENT = true;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Exact index paths first (no trailing slash -> single hop); zh keeps
      // its locale prefix. The docs site serves these at its root.
      {
        source: "/docs",
        destination: DOCS_SITE,
        permanent: REDIRECT_PERMANENT,
      },
      {
        source: "/zh/docs",
        destination: `${DOCS_SITE}/zh`,
        permanent: REDIRECT_PERMANENT,
      },
      {
        source: "/zh/docs/:path*",
        destination: `${DOCS_SITE}/zh/:path*`,
        permanent: REDIRECT_PERMANENT,
      },
      {
        source: "/docs/:path*",
        destination: `${DOCS_SITE}/:path*`,
        permanent: REDIRECT_PERMANENT,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
