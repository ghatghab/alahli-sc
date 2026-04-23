import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
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
      <div className="container-club py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm text-primary-foreground/70 max-w-xs">
            {t("brand.tagline")} — Tripoli, Libya.
          </p>
          <div className="flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="h-9 w-9 rounded-full grid place-items-center bg-primary-foreground/10 hover:bg-gold hover:text-gold-foreground transition-smooth"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4 text-gold">{t("footer.explore")}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/club" className="hover:text-gold transition-smooth">{t("nav.club")}</Link></li>
            <li><Link to="/teams" className="hover:text-gold transition-smooth">{t("nav.teams")}</Link></li>
            <li><Link to="/news" className="hover:text-gold transition-smooth">{t("nav.news")}</Link></li>
            <li><Link to="/match-center" className="hover:text-gold transition-smooth">{t("nav.matchCenter")}</Link></li>
            <li><Link to="/tickets" className="hover:text-gold transition-smooth">{t("nav.tickets")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4 text-gold">{t("footer.legal")}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><a href="#" className="hover:text-gold transition-smooth">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-gold transition-smooth">{t("footer.terms")}</a></li>
            <li><a href="#" className="hover:text-gold transition-smooth">{t("footer.accessibility")}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wider text-sm mb-4 text-gold">{t("nav.contact")}</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" />{t("footer.address")}</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent" />contact@alahli.ly</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent" />+218 21 000 0000</li>
          </ul>
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