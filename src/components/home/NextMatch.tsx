import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-alahli.png";
import { fixtures, nextFixtureIndex, type Fixture } from "@/lib/fixtures";
import { LiveBadge } from "@/components/match/LiveBadge";
import { NextMatchSkeleton } from "./NextMatchSkeleton";
import { competitionLabel } from "@/lib/competitionLabel";

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
  // Prefer the live fixture if any; otherwise next upcoming.
  const liveIdx = fixtures.findIndex(f => f.status === "live");
  const nextIdx = liveIdx >= 0 ? liveIdx : nextFixtureIndex();
  const next = fixtures[nextIdx];
  const { days, hours, minutes, seconds } = useCountdown(next.date);

  const lang = i18n.language as "en" | "fr" | "ar";
  const isRtl = i18n.dir() === "rtl";

  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: "center",
    startIndex: nextIdx,
    direction: isRtl ? "rtl" : "ltr",
  });
  const [selected, setSelected] = useState(nextIdx);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    // Auto-scroll to upcoming match (handles late init / RTL re-init)
    embla.scrollTo(nextIdx, true);
    return () => { embla.off("select", onSelect); };
  }, [embla, nextIdx]);

  if (!mounted) return <NextMatchSkeleton />;

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
      e.preventDefault(); embla.scrollTo(fixtures.length - 1);
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
              {fixtures.map((f, idx) => (
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
              {fixtures.map((f, i) => (
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
  return (
    <div
      id={`fixture-slide-${fixture.id}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`${isHome ? clubName : opponent} vs ${isHome ? opponent : clubName} — ${fmtDate(fixture.date)} ${fmtTime(fixture.date)}`}
      aria-hidden={!isActive}
      className="min-w-0 shrink-0 grow-0 basis-full sm:basis-[80%] md:basis-[55%] lg:basis-[42%]"
    >
      <Link
        to={`/match/${fixture.id}`}
        aria-label={`${isHome ? clubName : opponent} vs ${isHome ? opponent : clubName}`}
        tabIndex={isActive ? 0 : -1}
        className={`block relative rounded-xl overflow-hidden bg-card border transition-all hover:shadow-elegant hover:border-accent/60 ${
          isActive
            ? "border-accent shadow-elegant scale-100"
            : "border-border shadow-soft scale-[0.97] opacity-70 hover:opacity-100"
        }`}
      >
        {isActive && isLive && (
          <div className="absolute start-3 top-3 z-10">
            <LiveBadge minute={fixture.liveMinute} size="md" />
          </div>
        )}
        {isActive && !isLive && fixture.isNext && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-px z-10">
            <span className="block px-4 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-[0.25em] rounded-b-md">
              {nextLabel}
            </span>
          </div>
        )}
        <div className="grid grid-cols-[10px_1fr_10px]">
          {/* Left stripe = competition color */}
          <div className={`${fixture.competitionColor}`} />
          <div className="px-4 py-6 sm:px-6">
            <div className="text-center">
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">
                {competitionLabel(t, fixture.competition, fixture.team)}
              </div>
              <div className="mt-1 text-sm sm:text-base font-display font-bold text-foreground">
                {fmtDate(fixture.date)} · {fmtTime(fixture.date)}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              {/* Home side */}
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden ring-2 ring-gold/30 bg-muted grid place-items-center">
                  {isHome ? (
                    <img src={logo} alt="Alahli" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display font-bold text-muted-foreground">
                      {fixture.opponentShort}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs sm:text-sm font-display font-bold uppercase text-foreground line-clamp-1">
                  {isHome ? clubName : opponent}
                </div>
              </div>

              {showScore ? (
                <div className="flex flex-col items-center min-w-[72px]">
                  <div className={`font-display font-black tabular-nums tracking-tight text-2xl sm:text-3xl ${isLive ? "text-destructive" : "text-foreground"}`}>
                    {fixture.score!.home} <span className="text-muted-foreground/60 mx-1">:</span> {fixture.score!.away}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">
                    {isLive ? `${fixture.liveMinute ?? ""}'` : t("schedule.finished")}
                  </div>
                </div>
              ) : (
                <div className="font-display text-2xl font-black text-muted-foreground/50">
                  {vsLabel}
                </div>
              )}

              {/* Away side */}
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden ring-2 ring-border bg-muted grid place-items-center">
                  {isHome ? (
                    <span className="font-display font-bold text-muted-foreground">
                      {fixture.opponentShort}
                    </span>
                  ) : (
                    <img src={logo} alt="Alahli" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="mt-2 text-xs sm:text-sm font-display font-bold uppercase text-foreground line-clamp-1">
                  {isHome ? opponent : clubName}
                </div>
              </div>
            </div>

          </div>
          <div className={`${fixture.competitionColor}`} />
        </div>
      </Link>
    </div>
  );
};