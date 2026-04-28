import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getFixtureById, type Fixture, type MatchEvent, type Player } from "@/lib/fixtures";
import { competitionLabel } from "@/lib/competitionLabel";
import logo from "@/assets/logo-alahli.png";
import { LineupPitch } from "@/components/match/LineupPitch";
import { Seo } from "@/components/Seo";
import {
  getPeriodScores,
  getSportStats,
  startersTarget,
  supportsLineupPitch,
  supportsFormation,
  supportsEventsTab,
} from "@/lib/sportMatchData";

const EventIcon = ({ type }: { type: MatchEvent["type"] }) => {
  switch (type) {
    case "goal": return <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-accent" />;
    case "yellow": return <span aria-hidden className="inline-block h-3 w-2.5 bg-gold" />;
    case "red": return <span aria-hidden className="inline-block h-3 w-2.5 bg-destructive" />;
    case "sub": return <span aria-hidden className="inline-block h-3 w-3 rounded-full border-2 border-accent" />;
  }
};

const PlayerRow = ({ p }: { p: Player }) => (
  <li className="flex items-center gap-3 py-2 border-b border-border/60 last:border-b-0">
    <span className="w-7 text-center font-display font-bold text-accent tabular-nums">{p.number}</span>
    <span className="flex-1 text-sm">{p.name}</span>
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{p.position}</span>
  </li>
);

const StatBar = ({ label, home, away, suffix }: { label: string; home: number | string; away: number | string; suffix?: string }) => {
  const hN = typeof home === "number" ? home : 0;
  const aN = typeof away === "number" ? away : 0;
  const total = hN + aN || 1;
  const homePct = (hN / total) * 100;
  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm font-bold mb-1.5">
        <span className="tabular-nums">{home}{suffix ?? ""}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="tabular-nums">{away}{suffix ?? ""}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
        <div className="bg-accent" style={{ width: `${homePct}%` }} />
        <div className="bg-gold" style={{ width: `${100 - homePct}%` }} />
      </div>
    </div>
  );
};

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const fixture = id ? getFixtureById(id) : undefined;

  if (!fixture) {
    return (
      <div className="container-club pt-40 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase">{t("pages.notFound.title")}</h1>
        <Link to="/match-center" className="mt-4 inline-block text-accent">
          {t("nextMatch.schedule")}
        </Link>
      </div>
    );
  }

  return <MatchDetailContent fixture={fixture} lang={lang} t={t} />;
};

const MatchDetailContent = ({
  fixture, lang, t,
}: { fixture: Fixture; lang: "en" | "fr" | "ar"; t: (k: string, opts?: Record<string, unknown>) => string }) => {
  const isHome = fixture.homeAway === "home";
  const opponent = fixture.opponentName[lang];
  const clubName = t("brand.name");
  const homeName = isHome ? clubName : opponent;
  const awayName = isHome ? opponent : clubName;
  const venue = fixture.venue[lang];
  const finished = fixture.status === "finished";

  const matchTitle = `${homeName} vs ${awayName} | ${t("seo.siteName")}`;
  const competitionName = competitionLabel(t, fixture.competition, fixture.team);
  const matchDesc = `${competitionName} — ${homeName} vs ${awayName} · ${venue}.`;

  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localeTag = lang === "ar" ? "ar-LY" : lang === "fr" ? "fr-FR" : "en-GB";
  const fmt = new Intl.DateTimeFormat(localeTag, {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: userTZ,
  }).format(fixture.date);
  const time = new Intl.DateTimeFormat(localeTag, {
    hour: "2-digit", minute: "2-digit", timeZone: userTZ,
  }).format(fixture.date);
  const tzParts = new Intl.DateTimeFormat(localeTag, {
    timeZone: userTZ, timeZoneName: "short",
  }).formatToParts(fixture.date);
  const tzName = tzParts.find(p => p.type === "timeZoneName")?.value ?? "";

  const sport = fixture.team;
  const showEvents = supportsEventsTab(sport);
  const showPitch = supportsLineupPitch(sport);
  const showFormation = supportsFormation(sport);
  const startersN = startersTarget(sport);
  const periods = finished ? getPeriodScores(fixture) : null;
  const sportStats = finished ? getSportStats(fixture) : [];

  const startersLabelKey =
    startersN === 5 ? "matchDetail.starters5"
      : startersN === 6 ? "matchDetail.starters6"
      : startersN === 7 ? "matchDetail.starters7"
      : "matchDetail.starters";

  const tabs = [
    finished ? { v: "summary", l: t("matchDetail.summary") } : null,
    showEvents ? { v: "events", l: t("matchDetail.events") } : null,
    { v: "lineups", l: t("matchDetail.lineups") },
    { v: "stats", l: t("matchDetail.stats") },
    { v: "gallery", l: t("matchDetail.gallery") },
  ].filter(Boolean) as { v: string; l: string }[];

  const defaultTab = finished ? "summary" : "lineups";

  return (
    <article className="pb-20">
      <Seo pageKey="matchCenter" title={matchTitle} description={matchDesc} type="article" />
      {/* Hero */}
      <header className="relative bg-gradient-primary text-primary-foreground pt-32 pb-12">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, hsl(var(--gold) / 0.4) 0%, transparent 60%)" }}
        />
        <div className="container-club relative">
          <Link to="/match-center" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-smooth">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("nextMatch.schedule")}
          </Link>

          <div className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-gold text-center">
            {competitionName} · {t(`teamsList.${sport}`)}
          </div>

          <div dir="ltr" className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-10">
            {/* Home */}
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-2 ring-gold/40 bg-card grid place-items-center">
                {isHome ? (
                  <img src={logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display font-black text-2xl text-foreground">{fixture.opponentShort}</span>
                )}
              </div>
              <div className="mt-3 font-display font-bold uppercase text-base sm:text-lg">{homeName}</div>
            </div>

            {/* Score / time */}
            <div className="text-center">
              {finished && fixture.score ? (
                <div className="font-display font-black text-5xl sm:text-7xl tabular-nums leading-none">
                  {fixture.score.home} <span className="text-gold/70 mx-2">:</span> {fixture.score.away}
                </div>
              ) : (
                <div className="leading-none">
                  <div className="font-display font-black text-3xl sm:text-5xl tabular-nums text-gold">
                    {time}
                  </div>
                  {tzName && (
                    <div className="mt-1 text-[10px] sm:text-xs font-medium text-primary-foreground/70 tracking-wide">
                      {tzName}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 inline-flex flex-col gap-1 text-xs text-primary-foreground/80">
                <span className="inline-flex items-center justify-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {fmt}</span>
                <span className="inline-flex items-center justify-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {venue}</span>
              </div>
            </div>

            {/* Away */}
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full overflow-hidden ring-2 ring-border bg-card grid place-items-center">
                {isHome ? (
                  <span className="font-display font-black text-2xl text-foreground">{fixture.opponentShort}</span>
                ) : (
                  <img src={logo} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="mt-3 font-display font-bold uppercase text-base sm:text-lg">{awayName}</div>
            </div>
          </div>

          {!finished && (
            <div className="mt-8 flex justify-center">
              <Button asChild variant="gold">
                <Link to="/tickets">
                  <Clock className="h-4 w-4" /> {t("nav.tickets")}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="container-club mt-10">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full h-auto flex-wrap justify-center overflow-x-auto bg-transparent p-0 gap-2 rounded-none">
            {tabs.map(tab => (
              <TabsTrigger
                key={tab.v}
                value={tab.v}
                className="rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground shadow-none hover:border-foreground/40 data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground data-[state=active]:shadow-none transition-colors"
              >
                {tab.l}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Summary (sport-specific period scores) */}
          {finished && (
            <TabsContent value="summary" className="mt-8">
              {periods && periods.length > 0 ? (
                <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-4">
                    {t("matchDetail.periodScore")}
                  </div>
                  <div dir="ltr" className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          <th className="text-left py-2 font-semibold">{t("schedule.headers.team", { defaultValue: "Team" })}</th>
                          {periods.map(p => (
                            <th key={p.label} className="px-2 py-2 text-center font-semibold tabular-nums">{p.label}</th>
                          ))}
                          <th className="px-2 py-2 text-center font-semibold">{t("matchDetail.total")}</th>
                        </tr>
                      </thead>
                      <tbody className="font-display">
                        <tr className="border-t border-border">
                          <td className="py-3 pr-2 font-bold uppercase truncate">{homeName}</td>
                          {periods.map(p => (
                            <td key={p.label} className="px-2 py-3 text-center tabular-nums">{p.home}</td>
                          ))}
                          <td className="px-2 py-3 text-center font-black text-accent tabular-nums">{fixture.score?.home}</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="py-3 pr-2 font-bold uppercase truncate">{awayName}</td>
                          {periods.map(p => (
                            <td key={p.label} className="px-2 py-3 text-center tabular-nums">{p.away}</td>
                          ))}
                          <td className="px-2 py-3 text-center font-black text-accent tabular-nums">{fixture.score?.away}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">{t("matchDetail.noStats")}</p>
              )}
            </TabsContent>
          )}

          {/* Events (football only) */}
          {showEvents && (
            <TabsContent value="events" className="mt-8">
              <p className="text-center text-muted-foreground max-w-2xl mx-auto py-8">
                {t("matchDetail.eventsComingSoon")}
              </p>
            </TabsContent>
          )}

          {/* Lineups — pitch (football) or roster cards (other sports) */}
          <TabsContent value="lineups" className="mt-8">
            {fixture.lineups ? (
              <div className="space-y-10">
                {showPitch && (
                  <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    {showFormation && (() => {
                      const formation = (players: Player[]) => {
                        const s = players.filter(p => p.isStarter);
                        const df = s.filter(p => p.position === "DF").length;
                        const mf = s.filter(p => p.position === "MF").length;
                        const fw = s.filter(p => p.position === "FW").length;
                        return `${df}-${mf}-${fw}`;
                      };
                      const homeF = formation(fixture.lineups!.home);
                      const awayF = formation(fixture.lineups!.away);
                      return (
                        <div className="flex items-center justify-between mb-4 text-sm font-display font-bold uppercase gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-accent truncate">{homeName}</span>
                            <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-bold text-accent tabular-nums">
                              {homeF}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground tabular-nums">
                              {awayF}
                            </span>
                            <span className="text-muted-foreground truncate">{awayName}</span>
                          </div>
                        </div>
                      );
                    })()}
                    <LineupPitch
                      home={fixture.lineups.home}
                      away={fixture.lineups.away}
                      homeName={homeName}
                      awayName={awayName}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  {(["home", "away"] as const).map(side => {
                    const players = fixture.lineups![side];
                    const name = side === "home" ? homeName : awayName;
                    const starters = players.filter(p => p.isStarter).slice(0, startersN);
                    const subs = players.filter(p => !p.isStarter);
                    return (
                      <div key={side} className="rounded-xl border border-border bg-card p-5">
                        <h3 className="font-display font-bold uppercase text-sm mb-3 text-accent text-center">{name}</h3>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 text-center">{t(startersLabelKey)}</div>
                        <ul dir={lang === "ar" ? "rtl" : "ltr"}>{starters.map(p => <PlayerRow key={p.number} p={p} />)}</ul>
                        {subs.length > 0 && (
                          <>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-4 mb-1 text-center">{t("matchDetail.bench")}</div>
                            <ul dir={lang === "ar" ? "rtl" : "ltr"}>{subs.slice(0, sport === "football" ? 4 : 6).map(p => <PlayerRow key={p.number} p={p} />)}</ul>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">{t("matchDetail.noLineups")}</p>
            )}
          </TabsContent>

          {/* Stats — sport-specific */}
          <TabsContent value="stats" className="mt-8">
            {sportStats.length > 0 ? (
              <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4 text-sm font-display font-bold uppercase">
                  <span>{homeName}</span>
                  <span>{awayName}</span>
                </div>
                {sportStats.map((s, i) => (
                  <StatBar
                    key={i}
                    label={t(`matchDetail.stat.${s.labelKey}`)}
                    home={s.home as number | string}
                    away={s.away as number | string}
                    suffix={s.suffix}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">{t("matchDetail.noStats")}</p>
            )}
          </TabsContent>

          {/* Gallery */}
          <TabsContent value="gallery" className="mt-8">
            {fixture.gallery && fixture.gallery.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {fixture.gallery.map((src, i) => (
                  <div key={i} className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    <img
                      src={src}
                      alt={`${homeName} vs ${awayName} — ${i + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover hover:scale-105 transition-smooth"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">{t("matchDetail.noGallery")}</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </article>
  );
};

export default MatchDetail;
