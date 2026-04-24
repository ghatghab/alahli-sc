import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import training from "@/assets/team-football.jpg";
import basket from "@/assets/team-basketball.jpg";
import handball from "@/assets/team-handball.jpg";
import volley from "@/assets/team-volleyball.jpg";

export const TeamsGrid = () => {
  const { t } = useTranslation();
  const teams = [
    { key: "football", img: training },
    { key: "basketball", img: basket },
    { key: "handball", img: handball },
    { key: "volleyball", img: volley },
  ] as const;

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container-club relative">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="eyebrow justify-center">{t("nav.teams")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mt-3 leading-[0.95] text-foreground">{t("sections.teams")}</h2>
          <div className="mx-auto mt-4 h-[2px] w-16 bg-accent" />
          <p className="text-muted-foreground mt-4">{t("sections.teamsSub")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map(team => (
            <Link
              key={team.key}
              to={`/teams/${team.key}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-soft transition-smooth ring-1 ring-border hover:ring-accent/60 hover:-translate-y-1 hover:shadow-elegant bg-card"
            >
              <img
                src={team.img}
                alt={team.key}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 origin-left rtl:origin-right transition-transform duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-display text-2xl font-bold tracking-tight">
                  {t(`teamsList.${team.key}`)}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/95 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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