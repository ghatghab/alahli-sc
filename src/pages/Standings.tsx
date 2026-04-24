import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fixtures } from "@/lib/fixtures";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Row = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
  isUs?: boolean;
};

// Build a mock standings table per competition using existing fixtures + filler clubs
const FILLER_CLUBS: Record<string, string[]> = {
  "Libyan Premier League": [
    "Al-Ittihad", "Al-Suwayhli", "Al-Madina", "Al-Hilal Benghazi",
    "Al-Nasr", "Olympic Azzaweya", "Akhdar SC", "Asswehly SC",
  ],
  "Libyan Cup": [
    "Al-Ittihad", "Al-Suwayhli", "Al-Hilal Benghazi", "Al-Nasr", "Akhdar SC",
  ],
};

const buildStandings = (competition: string): Row[] => {
  const opponents = Array.from(
    new Set(
      fixtures
        .filter(f => f.competition === competition)
        .map(f => f.opponentName.en),
    ),
  );
  const fillers = FILLER_CLUBS[competition] ?? [];
  const allTeams = Array.from(new Set(["Alahli SC", ...opponents, ...fillers]));

  // Deterministic pseudo-stats based on team name hash
  const hash = (s: string) =>
    s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 1000, 7);

  return allTeams
    .map((name, i) => {
      const h = hash(name + competition);
      const played = 10;
      const won = name === "Alahli SC" ? 7 : (h % 7);
      const drawn = name === "Alahli SC" ? 2 : ((h >> 2) % 4);
      const lost = Math.max(0, played - won - drawn);
      const gf = won * 2 + drawn + ((h >> 3) % 5);
      const ga = lost * 2 + ((h >> 4) % 4);
      return {
        team: name,
        played,
        won,
        drawn,
        lost,
        gf,
        ga,
        gd: gf - ga,
        pts: won * 3 + drawn,
        isUs: name === "Alahli SC",
      };
    })
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
};

const Standings = () => {
  const { t } = useTranslation();

  const competitions = useMemo(
    () =>
      Array.from(new Set(fixtures.map(f => f.competition))).sort(),
    [],
  );
  const [comp, setComp] = useState(competitions[0] ?? "");
  const rows = useMemo(() => buildStandings(comp), [comp]);

  return (
    <>
      <h1 className="sr-only">{t("standings.title")}</h1>
      <section className="container-club pt-28 md:pt-32 pb-10">
        <div className="rounded-xl border border-border bg-card p-4 md:p-5 shadow-soft mb-6">
          <div className="grid gap-3 md:grid-cols-12 items-end">
            <div className="md:col-span-5">
              <label htmlFor="standings-comp" className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 text-start">
                {t("schedule.competition")}
              </label>
              <Select value={comp} onValueChange={setComp}>
                <SelectTrigger id="standings-comp" aria-label={t("schedule.competition")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {competitions.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead className="text-start">{t("standings.team")}</TableHead>
                <TableHead className="text-center">{t("standings.p")}</TableHead>
                <TableHead className="text-center">{t("standings.w")}</TableHead>
                <TableHead className="text-center">{t("standings.d")}</TableHead>
                <TableHead className="text-center">{t("standings.l")}</TableHead>
                <TableHead className="text-center hidden sm:table-cell">{t("standings.gf")}</TableHead>
                <TableHead className="text-center hidden sm:table-cell">{t("standings.ga")}</TableHead>
                <TableHead className="text-center">{t("standings.gd")}</TableHead>
                <TableHead className="text-center font-black">{t("standings.pts")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <TableRow
                  key={r.team}
                  className={cn(
                    "focus-within:ring-2 focus-within:ring-accent",
                    r.isUs && "bg-accent/10 font-semibold",
                  )}
                >
                  <TableCell className="text-center font-bold tabular-nums">{i + 1}</TableCell>
                  <TableCell className="text-start">
                    <span className={cn(r.isUs && "text-accent")}>
                      {r.isUs ? t("brand.name") : r.team}
                    </span>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{r.played}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.won}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.drawn}</TableCell>
                  <TableCell className="text-center tabular-nums">{r.lost}</TableCell>
                  <TableCell className="text-center tabular-nums hidden sm:table-cell">{r.gf}</TableCell>
                  <TableCell className="text-center tabular-nums hidden sm:table-cell">{r.ga}</TableCell>
                  <TableCell className="text-center tabular-nums">
                    {r.gd > 0 ? `+${r.gd}` : r.gd}
                  </TableCell>
                  <TableCell className="text-center font-black tabular-nums">{r.pts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {t("standings.note")}
        </p>
      </section>
    </>
  );
};

export default Standings;