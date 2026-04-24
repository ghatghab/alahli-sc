import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Users, ClipboardList, Calendar, BarChart3, Trophy } from "lucide-react";

const RUBRICS = [
  { slug: "squad", key: "teamsNav.squad", Icon: Users },
  { slug: "staff", key: "teamsNav.staff", Icon: ClipboardList },
  { slug: "schedule", key: "teamsNav.schedule", Icon: Calendar },
  { slug: "standings", key: "teamsNav.standings", Icon: BarChart3 },
  { slug: "honours", key: "teamsNav.honours", Icon: Trophy },
] as const;

/**
 * Landing card grid for a sport (or sub-section). Each card opens a rubric.
 * `basePath` should not have a trailing slash, e.g. "/teams/basketball".
 */
const RubricCards = ({ basePath, title }: { basePath: string; title?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="container-club py-12">
      {title && (
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-8">
          {title}
        </h1>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {RUBRICS.map(({ slug, key, Icon }) => (
          <li key={slug}>
            <Link
              to={`${basePath}/${slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-6 transition-smooth hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-elegant"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1 font-display text-lg font-bold text-foreground">
                {t(key)}
              </span>
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RubricCards;