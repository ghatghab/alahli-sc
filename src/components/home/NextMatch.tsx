import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-alahli.png";
import torchWatermark from "@/assets/torch-watermark.png";
import { fixtures, type Fixture, type Team } from "@/lib/fixtures";
import { NextMatchSkeleton } from "./NextMatchSkeleton";
import { competitionLabel } from "@/lib/competitionLabel";

// Sport icon emoji for the ticket stub. Sober, used as decorative glyph only.
const sportGlyph: Record<Team, string> = {
  football: "⚽",
  basketball: "🏀",
  handball: "🤾",
  volleyball: "🏐",
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
  const homeName = isHome ? clubName : opponent;
  const awayName = isHome ? opponent : clubName;
  const homeShort = isHome ? "AHL" : fixture.opponentShort;
  const awayShort = isHome ? fixture.opponentShort : "AHL";
  const venueLabel = isHome ? homeLabel : awayLabel;
  const venueName = fixture.venue[lang];
  const sportName = t(sportKey, { defaultValue: fixture.team });
  return (
    <div
      id={`fixture-slide-${fixture.id}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${homeName} ${vsLabel} ${awayName} — ${fmtDate(fixture.date)} ${fmtTime(fixture.date)}`}
      aria-hidden={!isActive}
      className="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[70%] md:basis-[55%] lg:basis-[44%] xl:basis-[40%] py-4"
    >
      <Link
        to={`/match/${fixture.id}`}
        aria-label={`${homeName} ${vsLabel} ${awayName}`}
        tabIndex={isActive ? 0 : -1}
        className={`group relative block transition-all duration-300 ${
          isActive ? "scale-100" : "scale-[0.96] opacity-75 hover:opacity-100"
        }`}
      >
        {/* Ticket container: stub on the left, body on the right.
            Perforated edges via radial-gradient masks; dashed separator inside. */}
        <div
          className={`ticket relative flex rounded-xl bg-card overflow-hidden ${
            isActive ? "shadow-elegant ring-2 ring-accent" : "shadow-soft ring-1 ring-border"
          }`}
        >
          {/* Top status pill — overlapping the ticket top edge */}
          {(isActive || isLive) && !showScore && (
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20">
              <span
                className={`inline-block rounded-sm px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] shadow-soft ${
                  isLive
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                {isLive ? t("schedule.live") : nextLabel}
              </span>
            </div>
          )}

          {/* ───── STUB (left side) ───── */}
          <div
            aria-hidden="true"
            className="relative shrink-0 w-12 sm:w-14 md:w-16 bg-accent text-accent-foreground flex flex-col items-center justify-between py-3 sm:py-4"
          >
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
              {sportName}
            </span>
            <span className="text-2xl sm:text-3xl leading-none select-none" aria-hidden="true">
              {sportGlyph[fixture.team]}
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono tabular-nums opacity-80 [writing-mode:vertical-rl] rotate-180">
              N° {fixture.id.slice(-4).toUpperCase()}
            </span>
          </div>

          {/* Dashed perforation between stub and body */}
          <div
            aria-hidden="true"
            className="relative w-px shrink-0 self-stretch border-l border-dashed border-border/80"
          >
            {/* Punch holes top/bottom */}
            <span className="absolute -top-1.5 -translate-x-1/2 left-1/2 h-3 w-3 rounded-full bg-background ring-1 ring-border" />
            <span className="absolute -bottom-1.5 -translate-x-1/2 left-1/2 h-3 w-3 rounded-full bg-background ring-1 ring-border" />
          </div>

          {/* ───── BODY (right side) ───── */}
          <div className="relative flex-1 min-w-0 px-3 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5">
            {/* Watermark torch */}
            <img
              src={torchWatermark}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute inset-0 m-auto h-[110%] w-auto object-contain opacity-[0.05] dark:opacity-[0.08] -rotate-12"
            />

            <div className="relative flex flex-col gap-2.5 sm:gap-3">
              {/* Header row: competition + edition */}
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-border pb-2">
                <span className={`text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] line-clamp-1 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {competitionLabel(t, fixture.competition, fixture.team)}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-muted-foreground tabular-nums shrink-0">
                  {fixture.date.getFullYear()}
                </span>
              </div>

              {/* Match: home — VS — away */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 py-1 sm:py-2">
                <TeamColumn
                  isLogo={isHome}
                  logoSrc={logo}
                  clubName={clubName}
                  short={homeShort}
                  fullName={homeName}
                  isActive={isActive}
                />
                <div className="flex flex-col items-center justify-center shrink-0">
                  {showScore ? (
                    <span className={`font-display font-black tabular-nums text-xl sm:text-2xl md:text-3xl leading-none ${isLive ? "text-destructive" : "text-foreground"}`}>
                      {fixture.score!.home}<span className="text-muted-foreground/60 mx-1">:</span>{fixture.score!.away}
                    </span>
                  ) : (
                    <span className={`font-display font-black uppercase text-sm sm:text-base md:text-lg tracking-widest ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {vsLabel}
                    </span>
                  )}
                  {halfScore && showScore && (
                    <span className="mt-0.5 text-[9px] font-medium text-muted-foreground tabular-nums">
                      ({halfScore.home}:{halfScore.away})
                    </span>
                  )}
                </div>
                <TeamColumn
                  isLogo={!isHome}
                  logoSrc={logo}
                  clubName={clubName}
                  short={awayShort}
                  fullName={awayName}
                  isActive={isActive}
                />
              </div>

              {/* Info row: date | time | venue label */}
              <div className="border-t border-dashed border-border pt-2 grid grid-cols-3 gap-1 sm:gap-2 text-[9px] sm:text-[10px] md:text-[11px]">
                <InfoCell icon={<CalendarDays className="h-3 w-3" />} value={fmtDate(fixture.date)} />
                <InfoCell icon={<Clock className="h-3 w-3" />} value={fmtTime(fixture.date)} />
                <InfoCell icon={<MapPin className="h-3 w-3" />} value={venueLabel} />
              </div>

              {/* Venue name (small, single line) */}
              <div className="text-center text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground/80 truncate">
                {venueName}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

const InfoCell = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <div className="flex items-center justify-center gap-1 text-foreground/80 min-w-0">
    <span className="shrink-0 text-muted-foreground">{icon}</span>
    <span className="font-semibold uppercase tracking-wider truncate tabular-nums">{value}</span>
  </div>
);

const TeamColumn = ({
  isLogo, logoSrc, clubName, short, fullName, isActive,
}: {
  isLogo: boolean;
  logoSrc: string;
  clubName: string;
  short: string;
  fullName: string;
  isActive: boolean;
}) => {
  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
      <div
        className={`shrink-0 grid place-items-center aspect-square rounded-full overflow-hidden bg-background border ${isActive ? "border-border" : "border-border/60"}`}
        style={{ width: "clamp(2.75rem, 11vw, 4.5rem)" }}
      >
        {isLogo ? (
          <img src={logoSrc} alt={clubName} className="w-[78%] h-[78%] object-contain" />
        ) : (
          <span className="font-display font-black text-foreground/70 text-[11px] sm:text-xs md:text-sm tracking-tight">
            {short}
          </span>
        )}
      </div>
      <span className={`text-center text-[10px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wide line-clamp-2 leading-tight max-w-full ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
        {fullName}
      </span>
    </div>
  );
};