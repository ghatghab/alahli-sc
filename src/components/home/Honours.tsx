import { useTranslation } from "react-i18next";
import { Trophy, Award, Star, Globe2 } from "lucide-react";

export const Honours = () => {
  const { t } = useTranslation();
  const items = [
    { icon: Trophy, num: "12", labelKey: "honours.league" },
    { icon: Award, num: "8", labelKey: "honours.cup" },
    { icon: Star, num: "5", labelKey: "honours.super" },
    { icon: Globe2, num: "20+", labelKey: "honours.continental" },
  ];
  return (
    <section className="relative py-14 lg:py-20 bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: "radial-gradient(circle at 25% 25%, hsl(var(--gold)) 0%, transparent 40%), radial-gradient(circle at 75% 75%, hsl(var(--accent)) 0%, transparent 40%)"
      }} />
      <div className="container-club relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">{t("sections.honours")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-2">{t("sections.honoursSub")}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center group">
              <div className="mx-auto h-16 w-16 rounded-full bg-gold/10 grid place-items-center ring-1 ring-gold/30 group-hover:bg-gold group-hover:text-gold-foreground transition-smooth">
                <it.icon className="h-7 w-7 text-gold group-hover:text-gold-foreground" />
              </div>
              <div className="mt-4 font-display text-5xl font-bold text-gradient-gold">{it.num}</div>
              <div className="mt-1 text-sm uppercase tracking-wider text-primary-foreground/70">{t(it.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};