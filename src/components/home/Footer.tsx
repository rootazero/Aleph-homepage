import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const product = t.raw("product") as string[];
  const company = t.raw("company") as string[];
  const start = t.raw("start") as string[];
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <div className="big-mark">Aleph</div>
            <p style={{ color: "#9c917a", maxWidth: "30ch", marginTop: 14, fontSize: 14 }}>{t("tagline")}</p>
          </div>
          <div>
            <h5>{t("h_product")}</h5>
            <ul>{product.map((x, i) => <li key={i}><a href="#">{x}</a></li>)}</ul>
          </div>
          <div>
            <h5>{t("h_company")}</h5>
            <ul>{company.map((x, i) => <li key={i}><a href="#">{x}</a></li>)}</ul>
          </div>
          <div>
            <h5>{t("h_start")}</h5>
            <ul>{start.map((x, i) => <li key={i}><a href="#">{x}</a></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="label">{t("copyright")}</span>
          <span className="label">{t("motto")}</span>
        </div>
      </div>
    </footer>
  );
}
