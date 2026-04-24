import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import football from "@/assets/team-football.jpg";
import basketball from "@/assets/team-basketball.jpg";
import handball from "@/assets/team-handball.jpg";
import volleyball from "@/assets/team-volleyball.jpg";

const SPORTS = [
  { key: "football", img: football },
  { key: "basketball", img: basketball },
  { key: "handball", img: handball },
  { key: "volleyball", img: volleyball },
] as const;

/**
 * Default /teams view — invites the visitor to pick a sport before
 * any rubric subnav is shown.
 */
const TeamsHome = () => {
  const { t } = useTranslation();
  return (
    <div className="container-club py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="eyebrow justify-center">{t("nav.teams")}</div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold mt-3 leading-[0.95] text-foreground">
          {t("sections.teams")}
        </h1>
        <div className="mx-auto mt-4 h-[2px] w-16 bg-accent" />
        <p className="text-muted-foreground mt-4">{t("sections.teamsSub")}</p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SPORTS.map((s) => (
          <li key={s.key}>
            <Link
              to={`/teams/${s.key}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-soft transition-smooth ring-1 ring-border hover:ring-accent/60 hover:-translate-y-1 hover:shadow-elegant bg-card"
            >
              <img
                src={s.img}
                alt={t(`teamsNav.${s.key}`)}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-accent scale-x-0 group-hover:scale-x-100 origin-left rtl:origin-right transition-transform duration-500" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="font-display text-2xl font-bold tracking-tight">
                  {t(`teamsNav.${s.key}`)}
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/95 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {t("teamsList.explore")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsHome;