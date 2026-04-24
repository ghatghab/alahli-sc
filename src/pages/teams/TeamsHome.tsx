import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SPORTS = ["football", "basketball", "handball", "volleyball"] as const;

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
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SPORTS.map((s) => (
          <li key={s}>
            <Link
              to={`/teams/${s}`}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-6 transition-smooth hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-elegant"
            >
              <span className="font-display text-xl font-bold text-foreground">
                {t(`teamsNav.${s}`)}
              </span>
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsHome;