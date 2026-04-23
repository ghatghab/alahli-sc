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
    <section className="section-dark py-16 lg:py-24 border-y border-gold/10">
      <div className="container-club relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow justify-center">{t("sections.honours")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-3 leading-[0.95]">{t("sections.honoursSub")}</h2>
          <div className="mx-auto mt-4 h-[3px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center group relative">
              {i < items.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent rtl:right-auto rtl:left-0" />
              )}
              <div className="mx-auto h-16 w-16 rounded-full bg-gold/10 grid place-items-center ring-1 ring-gold/40 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                <it.icon className="h-7 w-7 text-gold group-hover:text-gold-foreground transition-colors" />
              </div>
              <div className="mt-5 font-display text-5xl lg:text-6xl font-bold text-gradient-gold tabular-nums">{it.num}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-primary-foreground/70 font-semibold">{t(it.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};