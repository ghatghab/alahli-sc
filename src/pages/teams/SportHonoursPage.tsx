import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComingSoon } from "@/components/ComingSoon";
import trophiesImg from "@/assets/honours-trophies.jpg";

type Sport = "football" | "basketball" | "handball" | "volleyball";

type Trophy = {
  count: number;
  /** i18n key under honoursPage.competitions */
  competitionKey: string;
  /** Optional list of years won. Empty = not provided yet. */
  years?: (number | string)[];
};

type SportData = {
  total: number;
  /** Optional extra label shown after total (e.g., bronze medal) */
  extraKey?: string;
  trophies: Trophy[];
};

const DATA: Record<Sport, SportData> = {
  football: {
    total: 25,
    trophies: [
      { count: 14, competitionKey: "footballLeague" },
      { count: 8, competitionKey: "libyanCup" },
      { count: 3, competitionKey: "libyanSuperCup" },
    ],
  },
  basketball: {
    total: 18,
    extraKey: "bronzeFiba",
    trophies: [
      { count: 8, competitionKey: "basketballLeague" },
      { count: 5, competitionKey: "libyanCup" },
      { count: 4, competitionKey: "libyanSuperCup" },
      { count: 1, competitionKey: "bal" },
    ],
  },
  handball: {
    total: 24,
    trophies: [
      { count: 12, competitionKey: "handballLeague" },
      { count: 7, competitionKey: "libyanCup" },
      { count: 5, competitionKey: "libyanSuperCup" },
    ],
  },
  volleyball: {
    total: 14,
    trophies: [
      { count: 8, competitionKey: "volleyballLeague" },
      { count: 6, competitionKey: "libyanCup" },
    ],
  },
};

const SportHonoursPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const sport = (params.sport as Sport | undefined) ?? "football";
  const data = DATA[sport];

  if (!data) {
    return (
      <div className="container-club pt-10">
        <ComingSoon />
      </div>
    );
  }

  return (
    <section className="container-club pt-10 pb-16">
      {/* Header — total titles */}
      <header className="text-center max-w-2xl mx-auto">
        <div className="eyebrow justify-center">
          {t("teamsNav.honours")}
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black mt-3 leading-[0.95] text-foreground tabular-nums">
          {t("honoursPage.totalTitles", { count: data.total })}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {t(`honoursPage.intro.${sport}`, { count: data.total })}
        </p>
        {data.extraKey && (
          <p className="mt-2 text-sm font-semibold text-accent">
            {t(`honoursPage.${data.extraKey}`)}
          </p>
        )}
        <div className="mx-auto mt-5 h-[2px] w-16 bg-accent" />
      </header>

      {/* Centered hero image */}
      <div className="mt-10 mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-border shadow-elegant">
          <img
            src={trophiesImg}
            alt={t("teamsNav.honours")}
            width={1280}
            height={768}
            loading="lazy"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Palmares list */}
      <div className="mt-12 grid gap-6 max-w-3xl mx-auto">
        {data.trophies.map((tr, i) => {
          const compName = t(`honoursPage.competitions.${tr.competitionKey}`);
          return (
            <article
              key={i}
              className={cn(
                "rounded-2xl border border-border bg-card p-6 sm:p-8",
                "shadow-soft hover:shadow-elegant transition-shadow",
              )}
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 h-12 w-12 rounded-full bg-accent/10 ring-1 ring-accent/30 grid place-items-center">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">
                    <span className="text-accent tabular-nums">{tr.count}×</span>{" "}
                    {compName}
                  </h2>
                  {tr.years && tr.years.length > 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground tabular-nums">
                      {tr.years.join(" · ")}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground italic">
                      {t("honoursPage.yearsSoon")}
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default SportHonoursPage;
