import { useTranslations } from "next-intl";

export function Marquee() {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {row.map((it, i) => (
          <span className="item" key={i}>{it}</span>
        ))}
      </div>
    </div>
  );
}
