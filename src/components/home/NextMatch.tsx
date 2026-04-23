import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-alahli.jpg";

export const NextMatch = () => {
  const { t, i18n } = useTranslation();
  const date = new Date();
  date.setDate(date.getDate() + 5);
  const dateStr = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(date);

  return (
    <section className="relative -mt-16 z-20 container-club">
      <div className="rounded-2xl bg-card border border-border shadow-elegant overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_auto_1fr_auto]">
          <div className="bg-gradient-primary text-primary-foreground p-6 lg:p-8 flex items-center gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-gold/90 font-semibold">{t("nextMatch.label")}</div>
              <div className="mt-1 text-sm text-primary-foreground/80">{t("nextMatch.competition")}</div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-accent" /> {dateStr}
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-accent" /> {t("nextMatch.venue")}
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px bg-border" />

          <div className="p-6 lg:p-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-gold/30 bg-muted">
                <img src={logo} alt="Alahli" className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 font-display font-bold uppercase text-sm">Alahli SC</div>
            </div>
            <div className="font-display text-3xl font-bold text-muted-foreground/60">{t("nextMatch.vs")}</div>
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-muted ring-2 ring-border grid place-items-center font-display font-bold text-muted-foreground">
                ?
              </div>
              <div className="mt-2 font-display font-bold uppercase text-sm">Al-Ittihad</div>
            </div>
          </div>

          <div className="p-6 lg:p-8 flex items-center justify-end bg-muted/30">
            <Button asChild variant="gold">
              <Link to="/match-center">
                {t("nextMatch.cta")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};