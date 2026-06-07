import type { ReactNode } from "react";
import { RootProvider } from "fumadocs-ui/provider/next";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { source } from "@/lib/source";
import { baseOptions, translations } from "@/lib/layout.shared";

export default async function DocsRootLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  const { locale } = await params;

  return (
    // theme is disabled (dark-only site); the .dark class is set on <html>.
    <RootProvider
      theme={{ enabled: false }}
      i18n={translations.provider(locale)}
    >
      <DocsLayout {...baseOptions(locale)} tree={source.getPageTree(locale)}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
