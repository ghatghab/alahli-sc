import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ComingSoon } from "@/components/ComingSoon";

type Sport = "football" | "basketball" | "handball" | "volleyball";

type Row = {
  team: string;
  played: number;
  won: number;
  drawn?: number;
  lost: number;
  gf?: number;
  ga?: number;
  gd?: number;
  pts: number;
  isUs?: boolean;
};

const US_KEYWORDS = ["al ahli tripoli", "al ahly tripoli", "alahli sc", "al ahli sc"];
const isUs = (name: string) => US_KEYWORDS.includes(name.trim().toLowerCase());

const FOOTBALL: Row[] = [
  { team: "Al Ahly Tripoli", played: 18, won: 15, drawn: 2, lost: 1, gf: 47, ga: 9, gd: 38, pts: 47 },
  { team: "Asswehly", played: 18, won: 13, drawn: 4, lost: 1, gf: 35, ga: 9, gd: 26, pts: 43 },
  { team: "Al Madina", played: 18, won: 8, drawn: 4, lost: 6, gf: 23, ga: 22, gd: 1, pts: 28 },
  { team: "Al Watan", played: 18, won: 6, drawn: 5, lost: 7, gf: 14, ga: 18, gd: -4, pts: 23 },
  { team: "Assabah", played: 18, won: 6, drawn: 4, lost: 8, gf: 12, ga: 18, gd: -6, pts: 22 },
  { team: "Al Malaab El Libby", played: 18, won: 5, drawn: 5, lost: 8, gf: 15, ga: 21, gd: -6, pts: 20 },
  { team: "Al-Khmes", played: 18, won: 5, drawn: 5, lost: 8, gf: 19, ga: 31, gd: -12, pts: 20 },
  { team: "Al Qadisiyah", played: 18, won: 6, drawn: 2, lost: 10, gf: 11, ga: 24, gd: -13, pts: 19 },
  { team: "Al Dahra", played: 18, won: 3, drawn: 5, lost: 10, gf: 20, ga: 27, gd: -7, pts: 14 },
  { team: "Abu Salim", played: 18, won: 3, drawn: 4, lost: 11, gf: 13, ga: 30, gd: -17, pts: 13 },
];

const HANDBALL: Row[] = [
  { team: "Al Ahli Tripoli", played: 3, won: 3, drawn: 0, lost: 0, gf: 93, ga: 58, gd: 35, pts: 9 },
  { team: "Al Hilal", played: 3, won: 3, drawn: 0, lost: 0, gf: 91, ga: 67, gd: 24, pts: 9 },
  { team: "Al Ittihad", played: 3, won: 1, drawn: 1, lost: 1, gf: 92, ga: 87, gd: 5, pts: 6 },
  { team: "Al Olomby", played: 3, won: 1, drawn: 0, lost: 2, gf: 68, ga: 78, gd: -10, pts: 5 },
  { team: "Al Ahli Benghazi", played: 3, won: 0, drawn: 1, lost: 2, gf: 80, ga: 101, gd: -21, pts: 4 },
  { team: "Al Najma", played: 3, won: 0, drawn: 0, lost: 3, gf: 81, ga: 114, gd: -23, pts: 3 },
];

const BASKETBALL: Row[] = [
  { team: "Al Ittihad", played: 5, won: 5, lost: 0, gf: 456, ga: 366, gd: 90, pts: 10 },
  { team: "Al Ahli Tripoli", played: 5, won: 4, lost: 1, gf: 483, ga: 391, gd: 92, pts: 9 },
  { team: "Al Ahli Benghazi", played: 5, won: 3, lost: 2, gf: 412, ga: 370, gd: 42, pts: 8 },
  { team: "Al Shabab Al Arabi", played: 5, won: 2, lost: 3, gf: 389, ga: 413, gd: -24, pts: 7 },
  { team: "Al Madina", played: 5, won: 1, lost: 4, gf: 292, ga: 397, gd: -105, pts: 6 },
  { team: "Al Nasr", played: 5, won: 0, lost: 5, gf: 340, ga: 435, gd: -95, pts: 5 },
];

const VOLLEYBALL: Row[] = [
  { team: "Al Ittihad", played: 5, won: 5, lost: 0, pts: 15 },
  { team: "Al Ahli Tripoli", played: 5, won: 4, lost: 1, pts: 12 },
  { team: "Asswehly", played: 5, won: 3, lost: 2, pts: 8 },
  { team: "Al Ahli Benghazi", played: 5, won: 1, lost: 4, pts: 5 },
  { team: "Al Hilal", played: 5, won: 1, lost: 4, pts: 3 },
  { team: "Al Ittihad Misrata", played: 5, won: 1, lost: 4, pts: 2 },
];

type Config = {
  rows: Row[];
  showDraws: boolean;
  pointsHeaderKey: "standings.gf" | null; // we reuse gf/ga/gd headers; basketball relabels
  scoreLabelOverride?: { gf: string; ga: string };
  competitionKey: string;
};

const CONFIG: Record<Sport, Config> = {
  football: { rows: FOOTBALL, showDraws: true, pointsHeaderKey: null, competitionKey: "Libyan Premier League" },
  handball: { rows: HANDBALL, showDraws: true, pointsHeaderKey: null, competitionKey: "Libyan Handball League" },
  basketball: {
    rows: BASKETBALL,
    showDraws: false,
    pointsHeaderKey: null,
    scoreLabelOverride: { gf: "PP", ga: "PC" },
    competitionKey: "Libyan Basketball Finals",
  },
  volleyball: { rows: VOLLEYBALL, showDraws: false, pointsHeaderKey: null, competitionKey: "Libyan Volleyball League" },
};

const SportStandingsPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const sport = (params.sport as Sport | undefined) ?? "football";
  const cfg = CONFIG[sport];

  if (!cfg) {
    return (
      <div className="container-club pt-10">
        <ComingSoon />
      </div>
    );
  }

  const rows = cfg.rows.map(r => ({ ...r, isUs: isUs(r.team) }));
  const showScores = rows.some(r => r.gf !== undefined);

  return (
    <section className="container-club pt-10 pb-10">
      <header className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {t("teamsNav.standings")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(`schedule.competitions.${cfg.competitionKey}`, { defaultValue: cfg.competitionKey })}
        </p>
      </header>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="text-start">{t("standings.team")}</TableHead>
              <TableHead className="text-center">{t("standings.p")}</TableHead>
              <TableHead className="text-center">{t("standings.w")}</TableHead>
              {cfg.showDraws && <TableHead className="text-center">{t("standings.d")}</TableHead>}
              <TableHead className="text-center">{t("standings.l")}</TableHead>
              {showScores && (
                <>
                  <TableHead className="text-center hidden sm:table-cell">
                    {cfg.scoreLabelOverride?.gf ?? t("standings.gf")}
                  </TableHead>
                  <TableHead className="text-center hidden sm:table-cell">
                    {cfg.scoreLabelOverride?.ga ?? t("standings.ga")}
                  </TableHead>
                  <TableHead className="text-center">{t("standings.gd")}</TableHead>
                </>
              )}
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
                {cfg.showDraws && (
                  <TableCell className="text-center tabular-nums">{r.drawn ?? 0}</TableCell>
                )}
                <TableCell className="text-center tabular-nums">{r.lost}</TableCell>
                {showScores && (
                  <>
                    <TableCell className="text-center tabular-nums hidden sm:table-cell">
                      {r.gf ?? "—"}
                    </TableCell>
                    <TableCell className="text-center tabular-nums hidden sm:table-cell">
                      {r.ga ?? "—"}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {r.gd === undefined ? "—" : r.gd > 0 ? `+${r.gd}` : r.gd}
                    </TableCell>
                  </>
                )}
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
  );
};

export default SportStandingsPage;