import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logoCrest from "@/assets/logo-alahli.jpg";
import partner1 from "@/assets/partners/partner-1.jpg";
import partner2 from "@/assets/partners/partner-2.jpg";
import partner3 from "@/assets/partners/partner-3.jpg";

export const Footer = () => {
  const { t } = useTranslation();
  const partners = [
    { src: partner1, alt: "Partner 1" },
    { src: partner2, alt: "Partner 2" },
    { src: partner3, alt: "Partner 3" },
  ];
  const columns: { title: string; links: { label: string; to: string }[] }[] = [
    {
      title: t("footer.cols.news"),
      links: [
        { label: t("footer.links.alahliTv"), to: "/tv" },
        { label: t("footer.links.tvPlus"), to: "/tv" },
      ],
    },
    {
      title: t("footer.cols.matches"),
      links: [
        { label: t("footer.links.standings"), to: "/standings" },
        { label: t("footer.links.tickets"), to: "/tickets" },
      ],
    },
    {
      title: t("footer.cols.teams"),
      links: [
        { label: t("footer.links.mensFirst"), to: "/teams" },
        { label: t("footer.links.legends"), to: "/teams" },
      ],
    },
    {
      title: t("footer.cols.store"),
      links: [
        { label: t("footer.links.kits"), to: "/store" },
        { label: t("footer.links.clothing"), to: "/store" },
        { label: t("footer.links.shopByPlayer"), to: "/store" },
        { label: t("footer.links.newArrivals"), to: "/store" },
        { label: t("footer.links.sale"), to: "/store" },
        { label: t("footer.links.accessories"), to: "/store" },
      ],
    },
    {
      title: t("footer.cols.club"),
      links: [
        { label: t("footer.links.history"), to: "/club" },
        { label: t("footer.links.honours"), to: "/club" },
        { label: t("footer.links.apps"), to: "/club" },
        { label: t("footer.links.autographed"), to: "/club" },
      ],
    },
  ];
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="border-b border-primary-foreground/10">
        <div className="container-club py-10">
          <h4 className="text-center font-display uppercase tracking-[0.3em] text-sm mb-8 text-gold">
            {t("footer.partners")}
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {partners.map((p, i) => (
              <a
                key={i}
                href="#"
                aria-label={p.alt}
                className="opacity-80 hover:opacity-100 transition-smooth"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-12 md:h-16 w-auto object-contain brightness-0 invert"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container-club py-16">
        <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold uppercase text-base mb-5 text-primary-foreground">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm text-primary-foreground/90">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="hover:text-gold transition-smooth">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6">
          <Link to="/" aria-label="Alahli SC" className="block">
            <img
              src={logoCrest}
              alt="Alahli SC crest"
              className="h-24 w-24 object-contain"
            />
          </Link>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="h-10 w-10 rounded-full grid place-items-center bg-primary-foreground/10 hover:bg-gold hover:text-gold-foreground transition-smooth"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-club py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}</p>
          <p className="uppercase tracking-widest">alahli.ly</p>
        </div>
      </div>
    </footer>
  );
};