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
    <section className="bg-muted/40 py-20 lg:py-28">
      <div className="container-club">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("nav.teams")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-2">{t("sections.teams")}</h2>
          <p className="text-muted-foreground mt-2">{t("sections.teamsSub")}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map(team => (
            <Link
              key={team.key}
              to="/teams"
              className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-soft hover:shadow-elegant transition-smooth"
            >
              <img
                src={team.img}
                alt={team.key}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-smooth group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                <div className="font-display text-2xl font-bold uppercase tracking-wide">
                  {t(`teamsList.${team.key}`)}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-sm text-gold opacity-0 group-hover:opacity-100 transition-smooth">
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