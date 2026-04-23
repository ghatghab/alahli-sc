export type Team = "football" | "basketball" | "handball" | "volleyball";

export type Fixture = {
  id: string;
  competition: string;
  competitionColor: string; // tailwind bg-* class
  date: Date;
  team: Team;
  opponentName: { en: string; fr: string; ar: string };
  opponentShort: string;
  homeAway: "home" | "away";
  venue: { en: string; fr: string; ar: string };
  isNext?: boolean;
  status?: "upcoming" | "live" | "finished";
  score?: { home: number; away: number };
  events?: MatchEvent[];
  lineups?: { home: Player[]; away: Player[] };
  stats?: MatchStat[];
  gallery?: string[];
};

export type MatchEvent = {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub";
  team: "home" | "away";
  player: string;
  detail?: string;
};

export type Player = { number: number; name: string; position: string; isStarter: boolean };

export type MatchStat = { label: { en: string; fr: string; ar: string }; home: number; away: number };

import stadium1 from "@/assets/stadium-aerial.jpg";
import stadium2 from "@/assets/hero-stadium.jpg";

const mk = (offsetDays: number, h: number, m: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(h, m, 0, 0);
  return d;
};

const sampleEvents: MatchEvent[] = [
  { minute: 12, type: "goal", team: "home", player: "M. Al-Tarhouni", detail: "Right foot" },
  { minute: 27, type: "yellow", team: "away", player: "K. Saleh" },
  { minute: 41, type: "goal", team: "away", player: "Y. Ben Ali" },
  { minute: 58, type: "sub", team: "home", player: "A. Mansour", detail: "in for O. Khalil" },
  { minute: 73, type: "goal", team: "home", player: "F. Gheriani", detail: "Header" },
  { minute: 89, type: "red", team: "away", player: "H. Trabelsi" },
];

const samplePlayers = (prefix: string): Player[] => [
  { number: 1, name: `${prefix} Keeper`, position: "GK", isStarter: true },
  { number: 2, name: `${prefix} Right-back`, position: "DF", isStarter: true },
  { number: 4, name: `${prefix} Centre-back`, position: "DF", isStarter: true },
  { number: 5, name: `${prefix} Centre-back`, position: "DF", isStarter: true },
  { number: 3, name: `${prefix} Left-back`, position: "DF", isStarter: true },
  { number: 6, name: `${prefix} D-Mid`, position: "MF", isStarter: true },
  { number: 8, name: `${prefix} Mid`, position: "MF", isStarter: true },
  { number: 10, name: `${prefix} A-Mid`, position: "MF", isStarter: true },
  { number: 7, name: `${prefix} Winger`, position: "FW", isStarter: true },
  { number: 9, name: `${prefix} Striker`, position: "FW", isStarter: true },
  { number: 11, name: `${prefix} Winger`, position: "FW", isStarter: true },
  { number: 12, name: `${prefix} Sub GK`, position: "GK", isStarter: false },
  { number: 14, name: `${prefix} Sub DF`, position: "DF", isStarter: false },
  { number: 16, name: `${prefix} Sub MF`, position: "MF", isStarter: false },
  { number: 18, name: `${prefix} Sub FW`, position: "FW", isStarter: false },
];

const sampleStats: MatchStat[] = [
  { label: { en: "Possession (%)", fr: "Possession (%)", ar: "الاستحواذ (%)" }, home: 58, away: 42 },
  { label: { en: "Shots", fr: "Tirs", ar: "التسديدات" }, home: 14, away: 9 },
  { label: { en: "Shots on target", fr: "Cadrés", ar: "على المرمى" }, home: 6, away: 3 },
  { label: { en: "Corners", fr: "Corners", ar: "الركنيات" }, home: 7, away: 4 },
  { label: { en: "Fouls", fr: "Fautes", ar: "الأخطاء" }, home: 11, away: 14 },
  { label: { en: "Pass accuracy (%)", fr: "Précision passes (%)", ar: "دقة التمرير (%)" }, home: 87, away: 79 },
];

export const fixtures: Fixture[] = [
  {
    id: "f1",
    team: "football",
    competition: "Libyan Premier League",
    competitionColor: "bg-primary",
    date: mk(-3, 19, 0),
    opponentName: { en: "Al-Suwayhli", fr: "Al-Suwayhli", ar: "السويحلي" },
    opponentShort: "SUW",
    homeAway: "away",
    venue: { en: "Misrata Municipal Stadium", fr: "Stade Municipal de Misrata", ar: "ملعب مصراتة البلدي" },
    status: "finished",
    score: { home: 1, away: 2 },
    events: sampleEvents,
    lineups: { home: samplePlayers("Suwayhli"), away: samplePlayers("Alahli") },
    stats: sampleStats,
    gallery: [stadium1, stadium2, stadium1, stadium2],
  },
  {
    id: "f2",
    team: "football",
    competition: "Libyan Premier League",
    competitionColor: "bg-accent",
    date: mk(2, 17, 30),
    opponentName: { en: "Libyan Stadium", fr: "Stade Libyen", ar: "الملعب الليبي" },
    opponentShort: "LIB",
    homeAway: "home",
    venue: { en: "Tripoli International Stadium", fr: "Stade International de Tripoli", ar: "ملعب طرابلس الدولي" },
    isNext: true,
    status: "upcoming",
    lineups: { home: samplePlayers("Alahli"), away: samplePlayers("Libyan") },
    stats: sampleStats,
    gallery: [stadium2, stadium1],
  },
  {
    id: "f3",
    team: "football",
    competition: "Libyan Cup",
    competitionColor: "bg-gold",
    date: mk(8, 20, 0),
    opponentName: { en: "Al-Ittihad", fr: "Al-Ittihad", ar: "الاتحاد" },
    opponentShort: "ITT",
    homeAway: "away",
    venue: { en: "11 June Stadium", fr: "Stade du 11 juin", ar: "ملعب 11 يونيو" },
    status: "upcoming",
    lineups: { home: samplePlayers("Ittihad"), away: samplePlayers("Alahli") },
    stats: sampleStats,
    gallery: [stadium1],
  },
  {
    id: "f4",
    team: "basketball",
    competition: "Libyan Premier League",
    competitionColor: "bg-primary",
    date: mk(15, 19, 0),
    opponentName: { en: "Al-Madina", fr: "Al-Madina", ar: "المدينة" },
    opponentShort: "MAD",
    homeAway: "home",
    venue: { en: "Tripoli International Stadium", fr: "Stade International de Tripoli", ar: "ملعب طرابلس الدولي" },
    status: "upcoming",
    lineups: { home: samplePlayers("Alahli"), away: samplePlayers("Madina") },
    stats: sampleStats,
    gallery: [stadium2, stadium1],
  },
];

export const getFixtureById = (id: string) => fixtures.find(f => f.id === id);

export const nextFixtureIndex = (): number => {
  const now = Date.now();
  const idx = fixtures.findIndex(f => f.date.getTime() >= now);
  return idx === -1 ? Math.max(0, fixtures.length - 1) : idx;
};