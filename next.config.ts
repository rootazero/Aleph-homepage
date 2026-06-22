import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Docs moved to the standalone site at docs.heyaleph.com. Redirect the old
// bundled /docs URLs there so existing links and SEO carry over. redirects()
// runs before middleware, so it doesn't entangle with next-intl's routing.
const DOCS_SITE = "https://docs.heyaleph.com";
// 307 while verifying — browsers cache 308s aggressively. Flip to true (308)
// once confirmed.
const REDIRECT_PERMANENT = false;

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
