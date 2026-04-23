import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Search, Calendar, MapPin, ArrowUpDown } from "lucide-react";
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

const TEAMS: Team[] = ["football", "basketball", "handball", "volleyball"];
const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

const Schedule = () => {
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

  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      weekday: "short", day: "2-digit", month: "short", year: "numeric", timeZone: userTZ,
    }).format(d);
  const fmtTime = (d: Date) =>
    new Intl.DateTimeFormat(locale, {
      hour: "2-digit", minute: "2-digit", timeZone: userTZ,
    }).format(d);

  return (
    <>
      <PageHeader title={t("schedule.title")} intro={t("schedule.intro")} />

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
                    <SelectItem key={tm} value={tm}>
                      {t(`teamsList.${tm}`)}
                    </SelectItem>
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

        {/* List */}
        <ul className="mt-6 space-y-3" aria-live="polite">
          {list.length === 0 ? (
            <li className="text-center py-16 text-muted-foreground">{t("schedule.empty")}</li>
          ) : (
            list.map(f => (
              <ScheduleRow key={f.id} fixture={f} lang={lang} fmtDate={fmtDate} fmtTime={fmtTime} t={t} />
            ))
          )}
        </ul>
      </section>
    </>
  );
};

const ScheduleRow = ({
  fixture, lang, fmtDate, fmtTime, t,
}: {
  fixture: Fixture;
  lang: "en" | "fr" | "ar";
  fmtDate: (d: Date) => string;
  fmtTime: (d: Date) => string;
  t: (k: string) => string;
}) => {
  const opp = fixture.opponentName[lang];
  const isHome = fixture.homeAway === "home";
  const finished = fixture.status === "finished";
  return (
    <li>
      <Link
        to={`/match/${fixture.id}`}
        className="grid grid-cols-[6px_1fr] rounded-xl overflow-hidden border border-border bg-card shadow-soft hover:shadow-elegant hover:border-accent/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className={fixture.competitionColor} aria-hidden />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-4 px-4 py-3 md:px-5 md:py-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
              {fixture.competition} · {t(`teamsList.${fixture.team}`)}
            </div>
            <div className="font-display font-bold text-sm sm:text-base mt-0.5">
              {isHome ? "Alahli SC" : opp}{" "}
              <span className="text-muted-foreground/60 mx-1">{t("nextMatch.vs")}</span>{" "}
              {isHome ? opp : "Alahli SC"}
            </div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {fixture.venue[lang]}
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center text-center">
            {finished && fixture.score ? (
              <div className="font-display font-black text-xl tabular-nums">
                {fixture.score.home}–{fixture.score.away}
              </div>
            ) : (
              <div className="font-display font-bold text-lg tabular-nums text-accent">
                {fmtTime(fixture.date)}
              </div>
            )}
          </div>
          <div className="text-sm">
            <div className="inline-flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> {fmtDate(fixture.date)}
            </div>
            <div className="md:hidden font-display font-bold text-accent mt-1 tabular-nums">
              {finished && fixture.score
                ? `${fixture.score.home}–${fixture.score.away}`
                : fmtTime(fixture.date)}
            </div>
          </div>
          <div className="hidden md:block text-xs uppercase tracking-wider font-bold">
            {finished ? (
              <span className="text-muted-foreground">{t("schedule.finished")}</span>
            ) : (
              <span className="text-accent">{t("schedule.upcoming")}</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Schedule;