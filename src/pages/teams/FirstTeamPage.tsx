import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Seo } from "@/components/Seo";
import teamFootball from "@/assets/team-football.jpg";
import stadiumAerial from "@/assets/stadium-aerial.jpg";
import heroStadium from "@/assets/hero-stadium.jpg";
import teamBasketball from "@/assets/team-basketball.jpg";
import teamHandball from "@/assets/team-handball.jpg";
import teamVolleyball from "@/assets/team-volleyball.jpg";

type Section = {
  titleKey: string;
  descKey: string;
  to: string;
  image: string;
};

const sections: Section[] = [
  { titleKey: "teamsNav.squad", descKey: "firstTeam.squadDesc", to: "/teams/football/first-team/squad", image: teamFootball },
  { titleKey: "teamsNav.staff", descKey: "firstTeam.staffDesc", to: "/teams/football/first-team/staff", image: teamBasketball },
  { titleKey: "teamsNav.schedule", descKey: "firstTeam.scheduleDesc", to: "/teams/football/first-team/schedule", image: heroStadium },
  { titleKey: "teamsNav.standings", descKey: "firstTeam.standingsDesc", to: "/teams/football/first-team/standings", image: stadiumAerial },
  { titleKey: "teamsNav.honours", descKey: "firstTeam.honoursDesc", to: "/teams/football/first-team/honours", image: teamHandball },
];

const FirstTeamPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Seo pageKey="teams" />
      <div className="container-club py-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground">
          {t("teamsNav.mensFirst")}
        </h1>
      </div>
      <div className="space-y-6 pb-16">
        {sections.map((s, i) => {
          const reverse = i % 2 === 1;
          return (
            <Link
              key={s.to}
              to={s.to}
              className={cn(
                "group relative block overflow-hidden bg-card transition-smooth hover:bg-card/80",
                "border-y border-border/60",
              )}
            >
              <div
                className={cn(
                  "container-club flex flex-col items-stretch gap-0 md:flex-row md:items-center md:gap-8",
                  reverse && "md:flex-row-reverse",
                )}
              >
                {/* Text */}
                <div className="flex-1 py-10 md:py-16">
                  <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl">
                    {t(s.titleKey)}
                  </h2>
                  <p className="mt-4 max-w-xl text-base text-muted-foreground">
                    {t(s.descKey)}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-[0.18em] text-accent transition-smooth group-hover:gap-2">
                    {t("firstTeam.discover")}
                    <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </div>
                {/* Image with diagonal cut */}
                <div
                  className={cn(
                    "relative h-56 w-full md:h-80 md:w-[55%] md:flex-shrink-0",
                  )}
                  style={{
                    clipPath: reverse
                      ? "polygon(0 0, 100% 0, 100% 100%, 8% 100%)"
                      : "polygon(8% 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                >
                  <img
                    src={s.image}
                    alt={t(s.titleKey)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-smooth duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default FirstTeamPage;