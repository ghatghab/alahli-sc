import type { Fixture, Team } from "@/lib/fixtures";

/**
 * Sport-specific helpers to adapt the match detail page (stats, period-by-period
 * score, roster format, terminology) to the sport in question. Currently we
 * generate deterministic sample data from the final score so existing fixtures
 * surface plausible information without having to back-fill every entry.
 */

export type PeriodScore = { label: string; home: number; away: number };
export type SportStat = { labelKey: string; home: number; away: number; suffix?: string };
export type RosterFormat = "football" | "basketball" | "handball" | "volleyball";

// --- Tiny seeded pseudo-random helpers --------------------------------------
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const splitInto = (total: number, parts: number, rng: () => number): number[] => {
  if (parts <= 1) return [total];
  const weights = Array.from({ length: parts }, () => 0.6 + rng());
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map(w => (w / sum) * total);
  const floored = raw.map(Math.floor);
  let remainder = total - floored.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => [v - Math.floor(v), i] as const)
    .sort((a, b) => b[0] - a[0]);
  for (let i = 0; i < remainder; i++) floored[order[i][1]] += 1;
  return floored;
};

// --- Period split per sport --------------------------------------------------
export const getPeriodScores = (fx: Fixture): PeriodScore[] | null => {
  if (!fx.score) return null;
  const seed = hash(fx.id);
  const rng = mulberry32(seed);
  const { home, away } = fx.score;

  switch (fx.team) {
    case "basketball": {
      const h = splitInto(home, 4, rng);
      const a = splitInto(away, 4, rng);
      return [1, 2, 3, 4].map((q, i) => ({ label: `Q${q}`, home: h[i], away: a[i] }));
    }
    case "handball":
    case "football": {
      const h = splitInto(home, 2, rng);
      const a = splitInto(away, 2, rng);
      return [
        { label: "1H", home: h[0], away: a[0] },
        { label: "2H", home: h[1], away: a[1] },
      ];
    }
    case "volleyball": {
      // Volleyball: scores like 3-0 represent sets won. Generate per-set points.
      const sets = home + away;
      const out: PeriodScore[] = [];
      let hs = home, as = away;
      for (let i = 0; i < sets; i++) {
        const homeWon = hs > 0 && (as === 0 || rng() < hs / (hs + as));
        if (homeWon) {
          hs -= 1;
          out.push({ label: `S${i + 1}`, home: 25, away: 18 + Math.floor(rng() * 6) });
        } else {
          as -= 1;
          out.push({ label: `S${i + 1}`, home: 18 + Math.floor(rng() * 6), away: 25 });
        }
      }
      return out;
    }
  }
};

// --- Stats per sport ---------------------------------------------------------
export const getSportStats = (fx: Fixture): SportStat[] => {
  const seed = hash(fx.id + ":stats");
  const rng = mulberry32(seed);
  const r = (min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

  switch (fx.team) {
    case "basketball": {
      return [
        { labelKey: "fg", home: r(38, 55), away: r(35, 52), suffix: "%" },
        { labelKey: "threePt", home: r(28, 45), away: r(25, 42), suffix: "%" },
        { labelKey: "ft", home: r(65, 88), away: r(60, 85), suffix: "%" },
        { labelKey: "rebounds", home: r(28, 44), away: r(26, 42) },
        { labelKey: "assists", home: r(14, 26), away: r(12, 24) },
        { labelKey: "steals", home: r(4, 11), away: r(3, 10) },
        { labelKey: "blocks", home: r(2, 7), away: r(1, 6) },
        { labelKey: "turnovers", home: r(8, 16), away: r(9, 17) },
      ];
    }
    case "handball": {
      return [
        { labelKey: "shots", home: r(38, 55), away: r(36, 53) },
        { labelKey: "shotEfficiency", home: r(50, 72), away: r(48, 70), suffix: "%" },
        { labelKey: "saves", home: r(10, 20), away: r(9, 18) },
        { labelKey: "savePct", home: r(28, 42), away: r(26, 40), suffix: "%" },
        { labelKey: "sevenM", home: `${r(2, 6)}/${r(3, 7)}` as unknown as number, away: `${r(2, 6)}/${r(3, 7)}` as unknown as number },
        { labelKey: "suspensions", home: r(1, 5), away: r(2, 6) },
        { labelKey: "fastBreaks", home: r(3, 9), away: r(2, 8) },
      ] as SportStat[];
    }
    case "volleyball": {
      return [
        { labelKey: "aces", home: r(3, 10), away: r(2, 9) },
        { labelKey: "blocks", home: r(6, 14), away: r(5, 12) },
        { labelKey: "attackPct", home: r(38, 56), away: r(35, 52), suffix: "%" },
        { labelKey: "receptionPct", home: r(55, 75), away: r(50, 72), suffix: "%" },
        { labelKey: "errors", home: r(8, 18), away: r(10, 20) },
      ];
    }
    case "football":
    default: {
      return [
        { labelKey: "possession", home: r(45, 60), away: 0, suffix: "%" },
        { labelKey: "shots", home: r(8, 18), away: r(6, 15) },
        { labelKey: "shotsOnTarget", home: r(3, 8), away: r(2, 7) },
        { labelKey: "corners", home: r(3, 9), away: r(2, 8) },
        { labelKey: "fouls", home: r(8, 16), away: r(9, 17) },
        { labelKey: "passAccuracy", home: r(78, 92), away: r(72, 88), suffix: "%" },
      ].map((s, i) => (i === 0 ? { ...s, away: 100 - s.home } : s));
    }
  }
};

export const rosterFormat = (team: Team): RosterFormat => team;

export const startersTarget = (team: Team) => {
  switch (team) {
    case "basketball": return 5;
    case "volleyball": return 6;
    case "handball": return 7;
    case "football": default: return 11;
  }
};

export const supportsLineupPitch = (team: Team) => team === "football";
export const supportsFormation = (team: Team) => team === "football";
export const supportsEventsTab = (team: Team) => team === "football";