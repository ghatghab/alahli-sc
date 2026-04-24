import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logoCrest from "@/assets/logo-alahli.png";
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
      {/* Partners + socials */}
      <div className="bg-secondary text-foreground border-t border-border">
        <div className="container-club py-12">
          <div className="text-center mb-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent">
              {t("footer.cols.partners", "Nos partenaires")}
            </div>
            <div className="mt-2 mx-auto h-[2px] w-12 bg-gold" />
          </div>
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
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="bg-primary text-primary-foreground chevrons-overlay relative">
        <div className="container-club pt-16 pb-8">
          <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] items-start">
            {columns.slice(0, 4).map((col) => (
              <div key={col.title}>
                <h4 className="font-display font-bold text-sm uppercase tracking-[0.18em] mb-5 text-gold">
                  {col.title}
                </h4>
                <ul className="space-y-3 text-sm text-white/70">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-white transition-smooth">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="hidden lg:flex justify-end">
              <Link to="/" aria-label="Al Ahli Sports Club" className="block">
                <img
                  src={logoCrest}
                  alt="Alahli SC crest"
                  className="h-28 w-28 object-contain"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 relative">
          <div className="container-club py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
            <p>© {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}</p>
            <div className="flex items-center gap-5">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="text-white/70 hover:text-gold transition-smooth"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};