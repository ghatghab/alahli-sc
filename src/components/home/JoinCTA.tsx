import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "@/assets/hero-stadium.jpg";

export const JoinCTA = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      <img src={hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover scale-110" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-accent/70" />
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="relative container-club py-20 lg:py-28 text-center text-primary-foreground">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/90 mb-6">
          <span className="inline-block h-px w-8 bg-white/70" />
          {t("nav.tickets")}
        </div>
        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] text-shadow-elegant">{t("sections.join")}</h2>
        <div className="mx-auto mt-6 h-[2px] w-20 bg-white/80" />
        <p className="mt-6 text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">{t("sections.joinSub")}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full">
            <Link to="/tickets">{t("nav.tickets")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </Button>
          <Button asChild variant="outlineLight" size="lg">
            <Link to="/contact">{t("nav.contact")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};