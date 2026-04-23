import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImg from "@/assets/hero-stadium.jpg";

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Alahli SC stadium at night"
          className="h-full w-full object-cover scale-105"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="container-club relative z-10 pb-20 pt-32 lg:pb-32">
        <div className="max-w-3xl space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {t("hero.eyebrow")}
          </div>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-[0.95] text-white drop-shadow-2xl">
            {t("hero.title")}
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="gold" size="lg">
              <Link to="/match-center">
                {t("hero.ctaPrimary")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/news">
                <Play className="h-4 w-4" /> {t("hero.ctaSecondary")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};