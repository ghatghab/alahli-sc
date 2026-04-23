import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import training from "@/assets/training.jpg";
import basket from "@/assets/basketball.jpg";
import handball from "@/assets/handball.jpg";
import volley from "@/assets/volleyball.jpg";

export const TeamsGrid = () => {
  const { t } = useTranslation();
  const teams = [
    { key: "football", img: training },
    { key: "basketball", img: basket },
    { key: "handball", img: handball },
    { key: "volleyball", img: volley },
  ] as const;

  return (
    <section className="section-dark py-16 lg:py-24">
      <div className="container-club relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow justify-center">{t("nav.teams")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-3 leading-[0.95]">{t("sections.teams")}</h2>
          <div className="mx-auto mt-4 h-[3px] w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="text-primary-foreground/70 mt-4">{t("sections.teamsSub")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map(team => (
            <Link
              key={team.key}
              to="/teams"
              className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-elegant transition-smooth ring-1 ring-white/5 hover:ring-gold/60 hover:-translate-y-1"
            >
              <img
                src={team.img}
                alt={team.key}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/10" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-gold scale-x-0 group-hover:scale-x-100 origin-left rtl:origin-right transition-transform duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <div className="font-display text-2xl font-bold uppercase tracking-wide text-shadow-elegant">
                  {t(`teamsList.${team.key}`)}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {t("teamsList.explore")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};