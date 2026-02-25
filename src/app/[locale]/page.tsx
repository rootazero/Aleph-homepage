import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("hero");
  return (
    <main className="min-h-screen bg-aleph-deep text-white flex items-center justify-center">
      <h1 className="text-5xl font-display font-bold">{t("title")}</h1>
    </main>
  );
}
