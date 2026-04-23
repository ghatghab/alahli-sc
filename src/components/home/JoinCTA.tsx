import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "@/assets/hero-stadium.jpg";

export const JoinCTA = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      <img src={hero} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" />
      <div className="relative container-club py-14 lg:py-20 text-center text-primary-foreground">
        <h2 className="font-display text-4xl sm:text-6xl font-bold uppercase">{t("sections.join")}</h2>
        <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">{t("sections.joinSub")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="gold" size="lg">
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