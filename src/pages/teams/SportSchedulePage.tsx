import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { fixtures, type Fixture, type Team } from "@/lib/fixtures";
import { LiveBadge } from "@/components/match/LiveBadge";
import logo from "@/assets/logo-alahli.png";
import { cn } from "@/lib/utils";
import { competitionLabel } from "@/lib/competitionLabel";

const SPORTS: Team[] = ["football", "basketball", "handball", "volleyball"];
const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Per-sport schedule rubric: lists all fixtures for the current sport, grouped
 * by month, including past results and upcoming games.
 */
const SportSchedulePage = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  // Football has nested route /teams/football/first-team/schedule (no :sport param)
  const rawSport = (params.sport as Team | undefined) ?? "football";
  const sport: Team = SPORTS.includes(rawSport as Team) ? (rawSport as Team) : "football";

  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const locale = lang === "ar" ? "ar-LY" : lang === "fr" ? "fr-FR" : "en-GB";

  const list = useMemo(
    () => fixtures.filter(f => f.team === sport).slice().sort((a, b) => a.date.getTime() - b.date.getTime()),
    [sport],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; items: Fixture[] }>();
    for (const f of list) {
      const key = `${f.date.getFullYear()}-${f.date.getMonth()}`;
      const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: userTZ }).format(f.date);
      if (!map.has(key)) map.set(key, { label, items: [] });
      map.get(key)!.items.push(f);
    }
    return Array.from(map.entries()).map(([k, v]) => ({ key: k, ...v }));
  }, [list, locale]);

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "2-digit", year: "2-digit", timeZone: userTZ }).format(d);
  const fmtTime = (d: Date) =>
    new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: userTZ }).format(d);

  return (
    <div className="container-club pt-10 pb-16">
      <h1 className="font-display text-3xl font-bold text-foreground">
        {t("teamsNav.schedule")} — {t(`teamsList.${sport}`)}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("schedule.intro")}</p>

      {grouped.length === 0 ? (
        <p className="text-center py-16 text-muted-foreground">{t("schedule.empty")}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map(group => (
            <div key={group.key}>
              <h2 className="font-display font-black uppercase text-lg md:text-xl tracking-wider mb-3">
                {group.label}
              </h2>
              <ul className="divide-y divide-border border-y border-border">
                {group.items.map(f => (
                  <Row key={f.id} fixture={f} lang={lang} fmtDate={fmtDate} fmtTime={fmtTime} t={t} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Row = ({
  fixture, lang, fmtDate, fmtTime, t,
}: {
  fixture: Fixture;
  lang: "en" | "fr" | "ar";
  fmtDate: (d: Date) => string;
  fmtTime: (d: Date) => string;
  t: (k: string, opts?: Record<string, unknown>) => string;
}) => {
  const opp = fixture.opponentName[lang];
  const isHome = fixture.homeAway === "home";
  const finished = fixture.status === "finished";
  const isLive = fixture.status === "live";
  const clubName = t("brand.name");
  const homeName = isHome ? clubName : opp;
  const awayName = isHome ? opp : clubName;

  return (
    <li>
      <Link
        to={`/match/${fixture.id}`}
        className={cn(
          "block py-4 group rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          isLive && "bg-destructive/5 hover:bg-destructive/10",
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 md:px-4 mb-2 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{fmtDate(fixture.date)} · {fmtTime(fixture.date)}</span>
            {isLive && <LiveBadge minute={fixture.liveMinute} />}
            {fixture.isNext && !isLive && (
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                {t("nextMatch.label")}
              </span>
            )}
          </div>
          <span className="font-medium text-end">
            {competitionLabel(t, fixture.competition, fixture.team)}
          </span>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 px-2 md:px-4">
          <div className="font-display font-bold text-sm md:text-lg text-foreground group-hover:text-accent transition-colors text-end md:text-start">
            {homeName}
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Crest isAlahli={isHome} short={fixture.opponentShort} color={fixture.competitionColor} alt={homeName} />
            <div className="flex flex-col items-center min-w-[72px] md:min-w-[100px]">
              {(finished || isLive) && fixture.score ? (
                <div className={cn("font-display font-black tabular-nums tracking-tight text-xl md:text-2xl", isLive && "text-destructive")}>
                  {fixture.score.home} : {fixture.score.away}
                </div>
              ) : (
                <div className="font-display font-black text-base md:text-xl tabular-nums text-accent">
                  {fmtTime(fixture.date)}
                </div>
              )}
              <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                {isLive ? `${fixture.liveMinute ?? ""}'` : finished ? t("schedule.finished") : ""}
              </div>
            </div>
            <Crest isAlahli={!isHome} short={fixture.opponentShort} color={fixture.competitionColor} alt={awayName} />
          </div>
          <div className="font-display font-bold text-sm md:text-lg text-foreground group-hover:text-accent transition-colors text-start md:text-end">
            {awayName}
          </div>
        </div>
      </Link>
    </li>
  );
};

const Crest = ({
  isAlahli, short, color, alt,
}: { isAlahli: boolean; short: string; color: string; alt: string }) => {
  if (isAlahli) {
    return (
      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden bg-background border border-border shrink-0">
        <img src={logo} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div className={cn("h-10 w-10 md:h-12 md:w-12 rounded-full grid place-items-center text-primary-foreground font-display font-black text-xs shrink-0", color)} aria-label={alt}>
      {short}
    </div>
  );
};

export default SportSchedulePage;