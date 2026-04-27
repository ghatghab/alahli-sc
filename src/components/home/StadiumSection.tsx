import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import stadium from "@/assets/stadium-aerial.jpg";

export const StadiumSection = () => {
  const { t } = useTranslation();
  return (
    <section className="container-club py-16 lg:py-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-soft order-2 lg:order-1 group">
          <img src={stadium} alt="Stadium" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-tr from-foreground/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 start-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-[0.25em] shadow-soft">
            <MapPin className="h-3 w-3" strokeWidth={2} />
            {t("sections.stadium")}
          </div>
        </div>
        <div className="order-1 lg:order-2 space-y-6">
          <div className="eyebrow">{t("sections.stadium")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold leading-[0.95] text-foreground">
            {t("sections.stadiumSub")}
          </h2>
          <div className="h-[2px] w-16 bg-accent" />
          <p className="text-muted-foreground leading-relaxed">
            {t("sections.stadiumSub")}
          </p>
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
            {[
              { num: "45,000", label: "Capacity" },
              { num: "1965", label: "Opened" },
              { num: "100%", label: "Pride" },
            ].map((s, i) => (
              <div key={i} className="relative">
                {i > 0 && <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-10 w-px bg-border rtl:left-auto rtl:-right-2" />}
                <div className="font-display text-3xl lg:text-4xl font-bold text-foreground tabular-nums">{s.num}</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
            <Link to="/club">
              {t("sections.cta")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};