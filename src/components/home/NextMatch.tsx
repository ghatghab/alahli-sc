import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-alahli.png";
import { fixtures, type Fixture, type Team } from "@/lib/fixtures";
import { NextMatchSkeleton } from "./NextMatchSkeleton";
import { competitionLabel } from "@/lib/competitionLabel";

// Pastel-green palette per sport for the ticket header band.
// `bg`/`text` use HSL via Tailwind arbitrary values so the design system stays consistent.
const sportTicketTheme: Record<Team, { band: string; accent: string; soft: string }> = {
  football:   { band: "bg-[hsl(145,45%,72%)]", accent: "text-[hsl(145,55%,22%)]", soft: "bg-[hsl(145,55%,94%)]" },
  basketball: { band: "bg-[hsl(95,40%,72%)]",  accent: "text-[hsl(95,55%,22%)]",  soft: "bg-[hsl(95,55%,94%)]"  },
  handball:   { band: "bg-[hsl(170,40%,72%)]", accent: "text-[hsl(170,55%,22%)]", soft: "bg-[hsl(170,55%,94%)]" },
  volleyball: { band: "bg-[hsl(120,38%,75%)]", accent: "text-[hsl(120,55%,22%)]", soft: "bg-[hsl(120,55%,94%)]" },
};

// Solid sport-tinted backgrounds for the "Upcoming" status badge.
const sportBadgeBg: Record<Team, string> = {
  football:   "bg-[hsl(145,55%,40%)]",
  basketball: "bg-[hsl(95,50%,38%)]",
  handball:   "bg-[hsl(170,55%,35%)]",
  volleyball: "bg-[hsl(120,50%,38%)]",
};

const useCountdown = (target: Date) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
};

const pad = (n: number) => n.toString().padStart(2, "0");

export const NextMatch = () => {
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 350);
    return () => clearTimeout(id);
  }, []);

  // Build the carousel list: one fixture per sport, prioritising
  // live > next upcoming > most recent finished. Cap at 10 cards.
  // Final order: live first, then by date ascending.
  const carouselFixtures = useMemo<Fixture[]>(() => {
    const SPORTS: Team[] = ["football", "basketball", "handball", "volleyball"];
    const now = Date.now();
    const picked: Fixture[] = [];
    for (const s of SPORTS) {
      const ofSport = fixtures.filter(f => f.team === s);
      if (ofSport.length === 0) continue;
      const live = ofSport.find(f => f.status === "live");
      if (live) { picked.push(live); continue; }
      const upcoming = ofSport
        .filter(f => f.status !== "finished" && f.date.getTime() >= now)
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0];
      if (upcoming) { picked.push(upcoming); continue; }
      const recent = ofSport
        .filter(f => f.status === "finished")
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      if (recent) picked.push(recent);
    }
    picked.sort((a, b) => {
      const aLive = a.status === "live" ? 0 : 1;
      const bLive = b.status === "live" ? 0 : 1;
      if (aLive !== bLive) return aLive - bLive;
      return a.date.getTime() - b.date.getTime();
    });
    return picked.slice(0, 10);
  }, []);

  // Initial active card: first live, otherwise first upcoming, otherwise 0.
  const initialIdx = useMemo(() => {
    const live = carouselFixtures.findIndex(f => f.status === "live");
    if (live >= 0) return live;
    const upcoming = carouselFixtures.findIndex(f => f.status !== "finished");
    return upcoming >= 0 ? upcoming : 0;
  }, [carouselFixtures]);

  const next = carouselFixtures[initialIdx] ?? carouselFixtures[0];
  const { days, hours, minutes, seconds } = useCountdown(next?.date ?? new Date());

  const lang = i18n.language as "en" | "fr" | "ar";
  const isRtl = i18n.dir() === "rtl";

  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: "center",
    startIndex: initialIdx,
    direction: isRtl ? "rtl" : "ltr",
  });
  const [selected, setSelected] = useState(initialIdx);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    // Auto-scroll to priority match (handles late init / RTL re-init)
    embla.scrollTo(initialIdx, true);
    return () => { embla.off("select", onSelect); };
  }, [embla, initialIdx]);

  if (!mounted) return <NextMatchSkeleton />;
  if (carouselFixtures.length === 0) return null;

  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localeTag = lang === "ar" ? "ar-LY" : lang === "fr" ? "fr-FR" : "en-GB";
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat(localeTag, {
      weekday: "short", day: "2-digit", month: "2-digit", timeZone: userTZ,
    }).format(d);
  const fmtTime = (d: Date) =>
    new Intl.DateTimeFormat(localeTag, {
      hour: "2-digit", minute: "2-digit", timeZone: userTZ,
    }).format(d);

  const onCarouselKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!embla) return;
    // Logical prev/next: in RTL, ArrowLeft = next visually, but Embla in RTL mode
    // already inverts; so just call prev/next directly based on intent.
    if (e.key === "ArrowRight") {
      e.preventDefault();
      isRtl ? embla.scrollPrev() : embla.scrollNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      isRtl ? embla.scrollNext() : embla.scrollPrev();
    } else if (e.key === "Home") {
      e.preventDefault(); embla.scrollTo(0);
    } else if (e.key === "End") {
      e.preventDefault(); embla.scrollTo(carouselFixtures.length - 1);
    }
  };

  return (
    <section className="relative bg-background py-14 lg:py-20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 0% 0%, hsl(var(--accent) / 0.08) 0%, transparent 60%), radial-gradient(60% 60% at 100% 100%, hsl(var(--gold) / 0.08) 0%, transparent 60%)",
        }}
      />
      <div className="container-club relative">
        {/* Header: NEXT MATCH + countdown + CTA */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="hidden lg:block w-32" />
          <div className="flex flex-col items-center text-center">
            <div className="text-sm font-bold uppercase tracking-[0.3em] text-foreground/80 mb-4">
              {t("nextMatch.label")}
            </div>
            <div className="flex items-end gap-3 sm:gap-5 font-display font-black tabular-nums">
              {[
                { v: pad(days), l: t("nextMatch.days") },
                { v: pad(hours), l: t("nextMatch.hours") },
                { v: pad(minutes), l: t("nextMatch.minutes") },
                { v: pad(seconds), l: t("nextMatch.seconds") },
              ].map((unit, i, arr) => (
                <div key={unit.l} className="flex items-end gap-3 sm:gap-5">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-6xl leading-none text-accent">{unit.v}</span>
                    <span className="mt-2 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      {unit.l}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-3xl sm:text-5xl leading-none text-accent/60 pb-6 sm:pb-7">:</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-40 flex lg:justify-end">
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link to="/match-center" aria-label={t("nextMatch.schedule")}>
                {t("nextMatch.schedule")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Fixtures carousel */}
        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label={t("a11y.matchesCarousel")}
        >
          <div
            ref={emblaRef}
            className="overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
            tabIndex={0}
            onKeyDown={onCarouselKey}
            aria-live="polite"
          >
            <div className="flex gap-4 sm:gap-6">
              {carouselFixtures.map((f, idx) => (
                <FixtureCard
                  key={f.id}
                  fixture={f}
                  isActive={idx === selected}
                  lang={lang}
                  homeLabel={t("nextMatch.home")}
                  awayLabel={t("nextMatch.away")}
                  nextLabel={t("nextMatch.label")}
                  vsLabel={t("nextMatch.vs")}
                  fmtDate={fmtDate}
                  fmtTime={fmtTime}
                />
              ))}
            </div>
          </div>

          {/* Nav controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              aria-label={t("a11y.prevMatch")}
              aria-controls="matches-carousel"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:text-accent hover:border-accent transition"
            >
              <ChevronLeft className="h-5 w-5 rtl:hidden" />
              <ChevronRight className="h-5 w-5 hidden rtl:block" />
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label={t("a11y.matchesCarousel")}>
              {carouselFixtures.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={i === selected}
                  aria-controls={`fixture-slide-${f.id}`}
                  onClick={() => embla?.scrollTo(i)}
                  aria-label={t("a11y.goToMatch", { n: i + 1 })}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selected ? "w-10 bg-accent" : "w-5 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              aria-label={t("a11y.nextMatchBtn")}
              aria-controls="matches-carousel"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:text-accent hover:border-accent transition"
            >
              <ChevronRight className="h-5 w-5 rtl:hidden" />
              <ChevronLeft className="h-5 w-5 hidden rtl:block" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

type FixtureCardProps = {
  fixture: Fixture;
  isActive: boolean;
  lang: "en" | "fr" | "ar";
  homeLabel: string;
  awayLabel: string;
  nextLabel: string;
  vsLabel: string;
  fmtDate: (d: Date) => string;
  fmtTime: (d: Date) => string;
};

const FixtureCard = ({
  fixture, isActive, lang, homeLabel, awayLabel, nextLabel, vsLabel, fmtDate, fmtTime,
}: FixtureCardProps) => {
  const { t } = useTranslation();
  const clubName = t("brand.name");
  const opponent = fixture.opponentName[lang];
  const isHome = fixture.homeAway === "home";
  const isLive = fixture.status === "live";
  const finished = fixture.status === "finished";
  const showScore = (finished || isLive) && !!fixture.score;
  const sportKey = `teamsList.${fixture.team}` as const;
  const halfScore = (fixture as any).halfScore as { home: number; away: number } | undefined;
  return (
    <div
      id={`fixture-slide-${fixture.id}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${isHome ? clubName : opponent} vs ${isHome ? opponent : clubName} — ${fmtDate(fixture.date)} ${fmtTime(fixture.date)}`}
      aria-hidden={!isActive}
      className="min-w-0 shrink-0 grow-0 basis-full sm:basis-[80%] md:basis-[55%] lg:basis-[42%] xl:basis-[38%]"
    >
      <Link
        to={`/match/${fixture.id}`}
        aria-label={`${isHome ? clubName : opponent} vs ${isHome ? opponent : clubName}`}
        tabIndex={isActive ? 0 : -1}
        className={`flex relative h-32 sm:h-36 md:h-40 rounded-lg overflow-hidden bg-card border transition-all duration-300 hover:shadow-elegant hover:border-accent/60 ${
          isActive
            ? "border-border shadow-elegant scale-100"
            : "border-border shadow-soft scale-[0.95] opacity-70 hover:opacity-100"
        }`}
      >
        {/* Left colored stripe with vertical sport name */}
        <div
          className={`w-10 sm:w-12 shrink-0 flex items-center justify-center ${sportTicketTheme[fixture.team].band}`}
        >
          <span
            className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap ${sportTicketTheme[fixture.team].accent}`}
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {t(sportKey)}
          </span>
        </div>

        {/* Main section */}
        <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-2 min-w-0">
          {/* Competition name on top */}
          <span className="text-accent font-bold text-[9px] sm:text-[11px] uppercase tracking-[0.18em] line-clamp-1 mb-2 sm:mb-3 text-center max-w-full">
            {competitionLabel(t, fixture.competition, fixture.team)}
          </span>

          {/* Row: logo — score/date — logo */}
          <div className="w-full flex items-center justify-between gap-2 sm:gap-4">
            {/* Home logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 grid place-items-center rounded-full overflow-hidden bg-muted">
              {isHome ? (
                <img src={logo} alt={clubName} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="font-display font-black text-muted-foreground text-xs sm:text-sm">
                  {fixture.opponentShort}
                </span>
              )}
            </div>

            {/* Center: score or date */}
            <div className="flex flex-col items-center justify-center min-w-0 flex-1">
              {showScore ? (
                <>
                  <span className={`font-display font-black tabular-nums tracking-tight text-2xl sm:text-3xl md:text-4xl leading-none whitespace-nowrap ${isLive ? "text-destructive" : "text-foreground"}`}>
                    {fixture.score!.home} <span className="text-muted-foreground/60">:</span> {fixture.score!.away}
                  </span>
                  {halfScore ? (
                    <span className="mt-1 text-[10px] sm:text-xs text-muted-foreground font-medium tabular-nums">
                      ({halfScore.home}:{halfScore.away})
                    </span>
                  ) : isLive && typeof fixture.liveMinute === "number" ? (
                    <span className="mt-1 text-[10px] sm:text-xs text-destructive font-bold uppercase tracking-wider tabular-nums">
                      {fixture.liveMinute}'
                    </span>
                  ) : finished ? (
                    <span className="mt-1 text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      {t("schedule.finished")}
                    </span>
                  ) : null}
                </>
              ) : (
                <>
                  <span className="font-display font-black text-base sm:text-lg md:text-xl text-foreground whitespace-nowrap leading-tight">
                    {fmtDate(fixture.date)}
                  </span>
                  <span className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground font-medium tabular-nums">
                    {fmtTime(fixture.date)}
                  </span>
                </>
              )}
            </div>

            {/* Away logo */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 grid place-items-center rounded-full overflow-hidden bg-muted">
              {isHome ? (
                <span className="font-display font-black text-muted-foreground text-xs sm:text-sm">
                  {fixture.opponentShort}
                </span>
              ) : (
                <img src={logo} alt={clubName} className="max-w-full max-h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};