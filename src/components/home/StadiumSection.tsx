import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import stadium from "@/assets/stadium-aerial.jpg";

export const StadiumSection = () => {
  const { t } = useTranslation();
  return (
    <section className="container-club py-14 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-elegant order-2 lg:order-1">
          <img src={stadium} alt="Stadium" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent" />
        </div>
        <div className="order-1 lg:order-2 space-y-5">
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("sections.stadium")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase leading-tight">
            {t("sections.stadiumSub")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border">
            <div>
              <div className="font-display text-3xl font-bold text-accent">45,000</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Capacity</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-accent">1965</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Opened</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-accent">100%</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Pride</div>
            </div>
          </div>
          <Button asChild variant="default">
            <Link to="/club">
              {t("sections.cta")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};