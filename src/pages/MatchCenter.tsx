import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown, RefreshCw, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LiveBadge } from "@/components/match/LiveBadge";
import { fixtures, type Fixture, type Team } from "@/lib/fixtures";
import logo from "@/assets/logo-alahli.png";
import { cn } from "@/lib/utils";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { Seo } from "@/components/Seo";
import { competitionLabel } from "@/lib/competitionLabel";

const TEAMS: Team[] = ["football", "basketball", "handball", "volleyball"];
const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
const tzShort = (() => {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: userTZ, timeZoneName: "short" }).formatToParts(new Date());
    return parts.find(p => p.type === "timeZoneName")?.value ?? "";
  } catch { return ""; }
})();

const MatchCenter = () => {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language as "en" | "fr" | "ar") || "en";
  const locale = lang === "ar" ? "ar-LY" : lang === "fr" ? "fr-FR" : "en-GB";

  // Filters — persisted across language changes & reloads
  const [q, setQ] = useLocalStorageState<string>("mc.search", "");
  const [team, setTeam] = useLocalStorageState<string>("mc.team", "all");
  const [comp, setComp] = useLocalStorageState<string>("mc.comp", "all");
  const [status, setStatus] = useLocalStorageState<string>("mc.status", "all");
  const [sort, setSort] = useLocalStorageState<"asc" | "desc">("mc.sort", "asc");
  const [liveOnly, setLiveOnly] = useLocalStorageState<boolean>("mc.liveOnly", false);

  // Live mode auto-refresh: re-renders every 30s so live minutes/counters can update.
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick(n => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const competitions = useMemo(
    () => Array.from(new Set(fixtures.map(f => f.competition))).sort(),
    [],
  );

  const liveFixtures = useMemo(
    () => fixtures.filter(f => f.status === "live"),
    [],
  );

  const list = useMemo(() => {
    const filtered = fixtures.filter(f => {
      if (liveOnly && f.status !== "live") return false;
      if (team !== "all" && f.team !== team) return false;
      if (comp !== "all" && f.competition !== comp) return false;
      if (status !== "all" && f.status !== status) return false;
      if (q.trim()) {
        const needle = q.trim().toLowerCase();
        const names = Object.values(f.opponentName).join(" ").toLowerCase();
        if (!names.includes(needle)) return false;
      }
      return true;
    });
    filtered.sort((a, b) =>
      sort === "asc" ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime(),
    );
    return filtered;
  }, [q, team, comp, status, sort, liveOnly]);

  // Group all results by month-year
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; items: Fixture[] }>();
    for (const f of list) {
      const key = `${f.date.getFullYear()}-${f.date.getMonth()}`;
      const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: userTZ })
        .format(f.date);
      if (!map.has(key)) map.set(key, { label, items: [] });
      map.get(key)!.items.push(f);
    }
    return Array.from(map.entries()).map(([key, v]) => ({ key, ...v }));
  }, [list, locale]);

  // Find the fixture closest to "now" (today or next upcoming, fallback to last past)
  const todayAnchorId = useMemo(() => {
    if (!list.length) return null;
    const now = Date.now();
    const future = list.find(f => f.date.getTime() >= now);
    return (future ?? list[list.length - 1]).id;
  }, [list]);

  const todayRef = useRef<HTMLLIElement | null>(null);
  const [showBackToToday, setShowBackToToday] = useState(false);

  // Auto-scroll to today's anchor on mount / when anchor changes
  useEffect(() => {
    if (!todayAnchorId) return;
    const id = window.setTimeout(() => {
      todayRef.current?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "center" });
    }, 50);
    return () => window.clearTimeout(id);
  }, [todayAnchorId]);

  // Toggle floating button when the anchor is off-screen
  useEffect(() => {
    const el = todayRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowBackToToday(!entry.isIntersecting),
      { rootMargin: "-30% 0px -30% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [todayAnchorId, grouped]);

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const fmtDayDate = (d: Date) => {
    const wk = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: userTZ }).format(d);
    const dt = new Intl.DateTimeFormat(locale, {
      day: "2-digit", month: "2-digit", year: "2-digit", timeZone: userTZ,
    }).format(d);
    const tm = new Intl.DateTimeFormat(locale, {
      hour: "2-digit", minute: "2-digit", hour12: false, timeZone: userTZ,
    }).format(d);
    return `${wk} | ${dt} | ${tm}${tzShort ? " " + tzShort : ""}`;
  };

  const resetFilters = () => {
    setQ(""); setTeam("all"); setComp("all"); setStatus("all"); setSort("asc"); setLiveOnly(false);
  };

  return (
    <>
      <Seo pageKey="matchCenter" />
      <h1 className="sr-only">{t("pages.matchCenter.title")}</h1>
      <section className="container-club pt-28 md:pt-32 pb-10">
        {/* Live now */}
        {liveFixtures.length > 0 && (
          <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 md:p-5">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <LiveBadge size="md" />
                <h2 className="font-display font-black uppercase text-lg md:text-xl tracking-wider">
                  {t("live.now")}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="h-3 w-3 animate-[spin_4s_linear_infinite]" />
                {t("live.autoRefresh")}
              </span>
            </div>
            <ul className="divide-y divide-border">
              {liveFixtures.map(f => (
                <MatchRow
                  key={f.id}
                  fixture={f}
                  lang={lang}
                  locale={locale}
                  fmtDayDate={fmtDayDate}
                  t={t}
                />
              ))}
            </ul>
          </div>
        )}

        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-soft">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-4 relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={t("schedule.search")}
                aria-label={t("schedule.search")}
                className="ps-9"
              />
            </div>
            <div className="md:col-span-2">
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger aria-label={t("schedule.team")}>
                  <SelectValue placeholder={t("schedule.team")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("schedule.all")}</SelectItem>
                  {TEAMS.map(tm => (
                    <SelectItem key={tm} value={tm}>{t(`teamsList.${tm}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Select value={comp} onValueChange={setComp}>
                <SelectTrigger aria-label={t("schedule.competition")}>
                  <SelectValue placeholder={t("schedule.competition")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("schedule.all")}</SelectItem>
                  {competitions.map(c => (
                    <SelectItem key={c} value={c}>{t(`schedule.competitions.${c}`, { defaultValue: c })}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label={t("schedule.status")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("schedule.all")}</SelectItem>
                  <SelectItem value="upcoming">{t("schedule.upcoming")}</SelectItem>
                  <SelectItem value="live">{t("schedule.live")}</SelectItem>
                  <SelectItem value="finished">{t("schedule.finished")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
                aria-label={t("schedule.sort")}
                title={sort === "asc" ? t("schedule.sortDateAsc") : t("schedule.sortDateDesc")}
                className="w-full inline-flex items-center justify-center gap-1 rounded-md border border-border bg-background px-3 h-10 text-sm hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="font-bold">{sort === "asc" ? "↑" : "↓"}</span>
              </button>
            </div>
          </div>

          {/* Toggles row */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setLiveOnly(!liveOnly)}
              aria-pressed={liveOnly}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                liveOnly
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : "border-border text-foreground/80 hover:border-destructive hover:text-destructive",
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  liveOnly ? "bg-current animate-ping" : "bg-destructive",
                )} />
                <span className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  liveOnly ? "bg-current" : "bg-destructive",
                )} />
              </span>
              {t("live.only")}
            </button>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {t("schedule.results", { n: list.length })}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs underline-offset-4 hover:underline text-muted-foreground hover:text-foreground"
              >
                {t("schedule.reset")}
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {t("schedule.yourTimezone")} · <span className="font-mono">{userTZ}</span>
          </p>
        </div>

        {/* Grouped list */}
        <div className="mt-8 space-y-10" aria-live="polite">
          {grouped.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground">{t("schedule.empty")}</p>
          ) : (
            grouped.map(group => (
              <div key={group.key}>
                <h2 className="font-display font-black uppercase text-xl md:text-2xl tracking-wider mb-4">
                  {group.label}
                </h2>
                <ul className="divide-y divide-border border-y border-border">
                  {group.items.map(f => (
                    <MatchRow
                      key={f.id}
                      fixture={f}
                      lang={lang}
                      locale={locale}
                      fmtDayDate={fmtDayDate}
                      t={t}
                      rowRef={f.id === todayAnchorId ? todayRef : undefined}
                    />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

      </section>

      {/* Floating back-to-today badge */}
      {showBackToToday && todayAnchorId && (
        <button
          type="button"
          onClick={scrollToToday}
          className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-40",
            "inline-flex items-center gap-2 rounded-full px-4 py-2.5",
            "bg-accent text-accent-foreground shadow-lg shadow-black/20",
            "text-xs font-bold uppercase tracking-wider",
            "hover:scale-105 transition-transform",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          )}
          aria-label={t("schedule.backToToday")}
        >
          <CalendarDays className="h-4 w-4" />
          {t("schedule.backToToday")}
        </button>
      )}
    </>
  );
};

const MatchRow = ({
  fixture, lang, locale, fmtDayDate, t, rowRef,
}: {
  fixture: Fixture;
  lang: "en" | "fr" | "ar";
  locale: string;
  fmtDayDate: (d: Date) => string;
  t: (k: string, opts?: Record<string, unknown>) => string;
  rowRef?: React.Ref<HTMLLIElement>;
}) => {
  const opp = fixture.opponentName[lang];
  const isHome = fixture.homeAway === "home";
  const finished = fixture.status === "finished";
  const isLive = fixture.status === "live";
  const clubName = t("brand.name");
  const homeName = isHome ? clubName : opp;
  const awayName = isHome ? opp : clubName;
  const homeLogo = isHome ? logo : null;
  const awayLogo = isHome ? null : logo;

  return (
    <li ref={rowRef}>
      <Link
        to={`/match/${fixture.id}`}
        className={cn(
          "block py-5 group rounded-md transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          isLive && "bg-destructive/5 hover:bg-destructive/10",
        )}
        aria-label={`${homeName} vs ${awayName}`}
      >
        {/* Top meta line: date | competition */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-2 md:px-4 mb-2 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{fmtDayDate(fixture.date)}</span>
            {isLive && <LiveBadge minute={fixture.liveMinute} />}
          </div>
          <span className="font-medium text-end">{competitionLabel(t, fixture.competition, fixture.team)}</span>
        </div>

        {/* Main row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 px-2 md:px-4">
          <div className="font-display font-bold text-sm md:text-xl text-foreground group-hover:text-accent transition-colors text-end md:text-start">
            {homeName}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Crest src={homeLogo} alt={homeName} color={fixture.competitionColor} short={fixture.opponentShort} isAlahli={isHome} />
            <div className="flex flex-col items-center min-w-[72px] md:min-w-[110px]">
              {(finished || isLive) && fixture.score ? (
                <div className={cn(
                  "font-display font-black tabular-nums tracking-tight",
                  "text-xl md:text-3xl",
                  isLive && "text-destructive",
                )}>
                  {fixture.score.home} : {fixture.score.away}
                </div>
              ) : (
                <div className="font-display font-black text-lg md:text-2xl tabular-nums text-accent">
                  {new Intl.DateTimeFormat(locale, {
                    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: userTZ,
                  }).format(fixture.date)}
                </div>
              )}
              <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                {isLive ? `${fixture.liveMinute ?? ""}'` : finished ? t("schedule.finished") : ""}
              </div>
            </div>
            <Crest src={awayLogo} alt={awayName} color={fixture.competitionColor} short={fixture.opponentShort} isAlahli={!isHome} />
          </div>

          <div className="font-display font-bold text-sm md:text-xl text-foreground group-hover:text-accent transition-colors text-start md:text-end">
            {awayName}
          </div>
        </div>
      </Link>
    </li>
  );
};

const Crest = ({
  src, alt, color, short, isAlahli,
}: { src: string | null; alt: string; color: string; short: string; isAlahli: boolean }) => {
  if (src) {
    return (
      <div className="h-10 w-10 md:h-14 md:w-14 rounded-full overflow-hidden bg-background border border-border shrink-0">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "h-10 w-10 md:h-14 md:w-14 rounded-full grid place-items-center text-primary-foreground font-display font-black text-xs md:text-sm shrink-0",
        color,
      )}
      aria-label={alt}
    >
      {isAlahli ? "AHL" : short}
    </div>
  );
};

export default MatchCenter;