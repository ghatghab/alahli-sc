import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { fixtures, type Fixture, type Team } from "@/lib/fixtures";
import logo from "@/assets/logo-alahli.jpg";
import { cn } from "@/lib/utils";

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

  const [q, setQ] = useState("");
  const [team, setTeam] = useState<string>("all");
  const [comp, setComp] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const competitions = useMemo(
    () => Array.from(new Set(fixtures.map(f => f.competition))).sort(),
    [],
  );

  const list = useMemo(() => {
    const filtered = fixtures.filter(f => {
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
  }, [q, team, comp, status, sort]);

  // Group by month-year
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

  return (
    <>
      <PageHeader title={t("pages.matchCenter.title")} intro={t("pages.matchCenter.intro")} />

      <section className="container-club py-10">
        {/* Filters */}
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-soft">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-4 relative">
              <Search className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={t("schedule.search")}
                aria-label={t("schedule.search")}
                className="pl-9 rtl:pl-3 rtl:pr-9"
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
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="Status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("schedule.all")}</SelectItem>
                  <SelectItem value="upcoming">{t("schedule.upcoming")}</SelectItem>
                  <SelectItem value="finished">{t("schedule.finished")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <button
                type="button"
                onClick={() => setSort(s => (s === "asc" ? "desc" : "asc"))}
                aria-label={t("schedule.sort")}
                title={sort === "asc" ? t("schedule.sortDateAsc") : t("schedule.sortDateDesc")}
                className="w-full inline-flex items-center justify-center gap-1 rounded-md border border-border bg-background px-3 h-10 text-sm hover:border-accent hover:text-accent transition"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="font-bold">{sort === "asc" ? "↑" : "↓"}</span>
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
                    <MatchRow key={f.id} fixture={f} lang={lang} fmtDayDate={fmtDayDate} t={t} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
};

const MatchRow = ({
  fixture, lang, fmtDayDate, t,
}: {
  fixture: Fixture;
  lang: "en" | "fr" | "ar";
  fmtDayDate: (d: Date) => string;
  t: (k: string) => string;
}) => {
  const opp = fixture.opponentName[lang];
  const isHome = fixture.homeAway === "home";
  const finished = fixture.status === "finished";
  const homeName = isHome ? "Alahli SC" : opp;
  const awayName = isHome ? opp : "Alahli SC";
  const homeLogo = isHome ? logo : null;
  const awayLogo = isHome ? null : logo;

  const matchdayLabel = `${fixture.competition}`;

  return (
    <li>
      <Link
        to={`/match/${fixture.id}`}
        className="block py-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
      >
        {/* Top meta line: date left, competition right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-2 md:px-4 mb-2 text-xs md:text-sm text-muted-foreground">
          <div className="md:col-start-1">{fmtDayDate(fixture.date)}</div>
          <div className="md:col-start-3 md:text-right font-medium">{matchdayLabel}</div>
        </div>

        {/* Main row: home name | center score/time | away name */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6 px-2 md:px-4">
          {/* Home */}
          <div className="font-display font-bold text-base md:text-xl text-foreground group-hover:text-accent transition-colors text-right md:text-left">
            {homeName}
          </div>

          {/* Center: badges + score */}
          <div className="flex items-center gap-2 md:gap-4">
            <Crest src={homeLogo} alt={homeName} color={fixture.competitionColor} />
            <div className="flex flex-col items-center min-w-[72px] md:min-w-[110px]">
              {finished && fixture.score ? (
                <div className="font-display font-black text-xl md:text-3xl tabular-nums tracking-tight">
                  {fixture.score.home} : {fixture.score.away}
                </div>
              ) : (
                <div className={cn(
                  "font-display font-black text-lg md:text-2xl tabular-nums",
                  "text-accent",
                )}>
                  {new Intl.DateTimeFormat(lang === "ar" ? "ar-LY" : lang === "fr" ? "fr-FR" : "en-GB", {
                    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: userTZ,
                  }).format(fixture.date)}
                </div>
              )}
              <div className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mt-0.5">
                {finished ? t("schedule.finished") : isHome ? t("nextMatch.home") : t("nextMatch.away")}
              </div>
            </div>
            <Crest src={awayLogo} alt={awayName} color={fixture.competitionColor} />
          </div>

          {/* Away */}
          <div className="font-display font-bold text-base md:text-xl text-foreground group-hover:text-accent transition-colors text-left md:text-right">
            {awayName}
          </div>
        </div>
      </Link>
    </li>
  );
};

const Crest = ({ src, alt, color }: { src: string | null; alt: string; color: string }) => {
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
      {alt.slice(0, 3).toUpperCase()}
    </div>
  );
};

export default MatchCenter;