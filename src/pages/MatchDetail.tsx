import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getFixtureById, type Fixture, type MatchEvent, type Player } from "@/lib/fixtures";
import logo from "@/assets/logo-alahli.jpg";

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

const StatBar = ({ label, home, away }: { label: string; home: number; away: number }) => {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div className="py-3">
      <div className="flex items-center justify-between text-sm font-bold mb-1.5">
        <span className="tabular-nums">{home}</span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="tabular-nums">{away}</span>
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
        <Link to="/schedule" className="mt-4 inline-block text-accent">
          {t("nextMatch.schedule")}
        </Link>
      </div>
    );
  }

  return <MatchDetailContent fixture={fixture} lang={lang} t={t} />;
};

const MatchDetailContent = ({
  fixture, lang, t,
}: { fixture: Fixture; lang: "en" | "fr" | "ar"; t: (k: string) => string }) => {
  const isHome = fixture.homeAway === "home";
  const opponent = fixture.opponentName[lang];
  const homeName = isHome ? "Alahli SC" : opponent;
  const awayName = isHome ? opponent : "Alahli SC";
  const venue = fixture.venue[lang];
  const finished = fixture.status === "finished";

  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localeTag = lang === "ar" ? "ar-LY" : lang === "fr" ? "fr-FR" : "en-GB";
  const fmt = new Intl.DateTimeFormat(localeTag, {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", timeZone: userTZ,
  }).format(fixture.date);
  const time = new Intl.DateTimeFormat(localeTag, {
    hour: "2-digit", minute: "2-digit", timeZone: userTZ, timeZoneName: "short",
  }).format(fixture.date);

  return (
    <article className="pb-20">
      {/* Hero */}
      <header className="relative bg-gradient-primary text-primary-foreground pt-32 pb-12">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, hsl(var(--gold) / 0.4) 0%, transparent 60%)" }}
        />
        <div className="container-club relative">
          <Link to="/schedule" className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold transition-smooth">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("nextMatch.schedule")}
          </Link>

          <div className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-gold">
            {fixture.competition}
          </div>

          <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-6 sm:gap-10">
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
                <div className="font-display font-black text-3xl sm:text-5xl tabular-nums leading-none text-gold">
                  {time}
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
        <Tabs defaultValue={finished ? "events" : "lineups"} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="events">{t("matchDetail.events")}</TabsTrigger>
            <TabsTrigger value="lineups">{t("matchDetail.lineups")}</TabsTrigger>
            <TabsTrigger value="stats">{t("matchDetail.stats")}</TabsTrigger>
            <TabsTrigger value="gallery">{t("matchDetail.gallery")}</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-8">
            {fixture.events && fixture.events.length > 0 ? (
              <ol className="max-w-2xl mx-auto space-y-2">
                {fixture.events.map((e, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg bg-card border border-border ${
                      e.team === "away" ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    <span className="w-10 font-display font-bold tabular-nums text-accent">{e.minute}'</span>
                    <EventIcon type={e.type} />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{e.player}</div>
                      {e.detail && <div className="text-xs text-muted-foreground">{e.detail}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-center text-muted-foreground">{t("matchDetail.noEvents")}</p>
            )}
          </TabsContent>

          <TabsContent value="lineups" className="mt-8">
            {fixture.lineups ? (
              <div className="grid md:grid-cols-2 gap-8">
                {(["home", "away"] as const).map(side => {
                  const players = fixture.lineups![side];
                  const name = side === "home" ? homeName : awayName;
                  return (
                    <div key={side} className="rounded-xl border border-border bg-card p-5">
                      <h3 className="font-display font-bold uppercase text-sm mb-3 text-accent">{name}</h3>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("matchDetail.starters")}</div>
                      <ul>{players.filter(p => p.isStarter).map(p => <PlayerRow key={p.number} p={p} />)}</ul>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-4 mb-1">{t("matchDetail.subs")}</div>
                      <ul>{players.filter(p => !p.isStarter).map(p => <PlayerRow key={p.number} p={p} />)}</ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">{t("matchDetail.noLineups")}</p>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-8">
            {fixture.stats ? (
              <div className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-4 text-sm font-display font-bold uppercase">
                  <span>{homeName}</span>
                  <span>{awayName}</span>
                </div>
                {fixture.stats.map((s, i) => (
                  <StatBar key={i} label={s.label[lang]} home={s.home} away={s.away} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">{t("matchDetail.noStats")}</p>
            )}
          </TabsContent>

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