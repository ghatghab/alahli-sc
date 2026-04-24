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
    <footer className="relative mt-20">
      {/* Top: light area with partners + socials, centered */}
      <div className="bg-background text-foreground border-t border-border">
        <div className="container-club py-12">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {partners.map((p, i) => (
              <a
                key={i}
                href="#"
                aria-label={p.alt}
                className="opacity-70 hover:opacity-100 transition-smooth"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  className="h-10 md:h-12 w-auto object-contain dark:brightness-0 dark:invert"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="container-club pb-10 border-t border-border pt-8">
          <div className="flex items-center justify-center gap-6">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="text-foreground/80 hover:text-foreground transition-smooth"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: dark area with link columns + huge slogan */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-club pt-16 pb-8">
          <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] items-start">
            {columns.slice(0, 4).map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-bold text-base mb-5 text-gold">
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

            <div className="hidden lg:flex justify-end">
              <Link to="/" aria-label="Alahli SC" className="block">
                <img
                  src={logoCrest}
                  alt="Alahli SC crest"
                  className="h-28 w-28 object-contain rounded-full bg-primary-foreground/5 p-2"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Huge Arabic slogan */}
        <div className="container-club pb-2 pt-6 overflow-hidden">
          <h2
            dir="rtl"
            lang="ar"
            className="font-display font-black text-center text-primary-foreground leading-[0.9] tracking-tight whitespace-nowrap text-[18vw] sm:text-[14vw] lg:text-[11vw]"
          >
            زعيم الأندية الليبية
          </h2>
        </div>

        <div className="border-t border-primary-foreground/10">
          <div className="container-club py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/60">
            <p>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}</p>
            <p className="uppercase tracking-widest">alahli.ly</p>
          </div>
        </div>
      </div>
    </footer>
  );
};