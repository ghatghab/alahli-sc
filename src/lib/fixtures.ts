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
  liveMinute?: number;
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

// ---------- Helpers ----------
const CLUB = "Al Ahly Tripoli";

const D = (iso: string, h = 19, m = 0) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d;
};

const compColor = (c: string) => {
  if (/Premier|League|Championnat|الدوري/.test(c)) return "bg-primary";
  if (/Cup|Coupe|كأس/.test(c) && /Super|Supercoupe|السوبر/.test(c)) return "bg-accent";
  if (/Cup|Coupe|كأس/.test(c)) return "bg-gold";
  return "bg-primary";
};

// Opponent name dictionary (en, fr, ar) — keep keys aligned with i18n schedule.teams
const OPP: Record<string, { en: string; fr: string; ar: string; short: string }> = {
  "Asswehly":               { en: "Asswehly",            fr: "Asswehly",            ar: "السويحلي",          short: "SUW" },
  "Al-Khmes":               { en: "Al-Khoms",            fr: "Al-Khoms",            ar: "الخمس",            short: "KHM" },
  "Abu Salim":              { en: "Abu Salim",           fr: "Abou Salim",          ar: "أبو سليم",          short: "ABS" },
  "Al Dahra":               { en: "Al Dahra",            fr: "Al Dahra",            ar: "الظهرة",            short: "DAH" },
  "Al Watan":               { en: "Al Watan",            fr: "Al Watan",            ar: "الوطن",             short: "WAT" },
  "Assabah":                { en: "Assabah",             fr: "Assabah",             ar: "الصباح",            short: "SAB" },
  "Al Malaab El Libby":     { en: "Libyan Stadium",      fr: "Le Stade Libyen",     ar: "الملعب الليبي",      short: "LIB" },
  "Al Madina":              { en: "Al Madina",           fr: "Al Madina",           ar: "المدينة",           short: "MAD" },
  "Al Qadisiyah":           { en: "Al Qadisiyah",        fr: "Al Qadisiyah",        ar: "القادسية",          short: "QAD" },
  "Al Qadisiyah Bani Walid":{ en: "Al Qadisiyah Bani Walid", fr: "Al Qadisiyah Bani Walid", ar: "قادسية بني وليد", short: "QBW" },
  "Al Olympi":              { en: "Al Olympi",           fr: "Al Olympi",           ar: "الأولمبي",          short: "OLY" },
  "Al Ahly Benghazi":       { en: "Al Ahli Benghazi",    fr: "Al Ahli Benghazi",    ar: "الأهلي بنغازي",     short: "AHB" },
  "Al Ahli Benghazi":       { en: "Al Ahli Benghazi",    fr: "Al Ahli Benghazi",    ar: "الأهلي بنغازي",     short: "AHB" },
  "Al Ittihad":             { en: "Al Ittihad",          fr: "Al Ittihad",          ar: "الاتحاد",           short: "ITT" },
  "Al Ittihad Misurata":    { en: "Al Ittihad Misrata",  fr: "Al Ittihad Misrata",  ar: "اتحاد مصراتة",      short: "IMS" },
  "Al Hilal":               { en: "Al Hilal",            fr: "Al Hilal",            ar: "الهلال",            short: "HIL" },
  "Al Najma":               { en: "Al Najma",            fr: "Al Najma",            ar: "النجمة",            short: "NJM" },
  "Al Swehly":              { en: "Asswehly",            fr: "Asswehly",            ar: "السويحلي",          short: "SWH" },
};

OPP["Al Shabab Al Arabi"] = { en: "Al Shabab Al Arabi", fr: "Al Shabab Al Arabi", ar: "الشباب العربي", short: "SHB" };
OPP["Al Nasr"] = { en: "Al Nasr", fr: "Al Nasr", ar: "النصر", short: "NSR" };

const opp = (name: string) => {
  const o = OPP[name];
  if (o) return { name: { en: o.en, fr: o.fr, ar: o.ar }, short: o.short };
  return { name: { en: name, fr: name, ar: name }, short: name.slice(0, 3).toUpperCase() };
};

// Common venues
const VENUE_TRIPOLI = { en: "Tripoli International Stadium", fr: "Stade International de Tripoli", ar: "ملعب طرابلس الدولي" };
const VENUE_AHMED_MOUSA = { en: "Ahmed Mousa Hall", fr: "Salle Ahmed Mousa", ar: "قاعة أحمد موسى" };
const VENUE_MISRATA = { en: "Misrata International Hall", fr: "Salle Internationale de Misrata", ar: "قاعة مصراتة الدولية" };
const VENUE_AKHDAR = { en: "Al-Akhdar Club Hall — Al-Bayda", fr: "Salle du Club Al-Akhdar — Al-Bayda", ar: "قاعة نادي الأخضر - مدينة البيضاء" };
const VENUE_DERNA = { en: "Sports Hall — Derna", fr: "Salle des sports — Derna", ar: "قاعة الرياضة - درنة" };
const VENUE_DERNA_HALL = { en: "Derna Hall", fr: "Salle de Derna", ar: "قاعة درنة" };
const VENUE_SIRTE = { en: "Sirte Stadium", fr: "Stade de Syrte", ar: "ملعب سرت" };
const VENUE_AWAY = { en: "Away venue", fr: "Stade adverse", ar: "ملعب الفريق المضيف" };

type MatchInput = {
  date: string;
  time?: [number, number];
  home: string;
  away: string;
  score?: string | null;
  status?: "scheduled";
  venue?: { en: string; fr: string; ar: string };
};

const parseScore = (s?: string | null): { home: number; away: number } | undefined => {
  if (!s) return undefined;
  const m = s.match(/^(\d+)\s*-\s*(\d+)/);
  if (!m) return undefined;
  return { home: parseInt(m[1], 10), away: parseInt(m[2], 10) };
};

let counter = 0;
const build = (
  team: Team,
  competition: string,
  matches: MatchInput[],
  defaultHomeVenue: { en: string; fr: string; ar: string } = VENUE_TRIPOLI,
): Fixture[] => {
  const color = compColor(competition);
  return matches
    .filter(m => m.date) // skip null-date entries
    .map(m => {
      const isHome = m.home === CLUB;
      const opponentName = isHome ? m.away : m.home;
      const o = opp(opponentName);
      const [h, mi] = m.time ?? [19, 0];
      const date = D(m.date, h, mi);
      const score = parseScore(m.score);
      const isFinished = !!score && m.status !== "scheduled";
      const venue = m.venue ?? (isHome ? defaultHomeVenue : VENUE_AWAY);
      counter += 1;
      const f: Fixture = {
        id: `${team}-${counter}`,
        team,
        competition,
        competitionColor: color,
        date,
        opponentName: o.name,
        opponentShort: o.short,
        homeAway: isHome ? "home" : "away",
        venue,
        status: isFinished ? "finished" : "upcoming",
        score: isFinished ? score : undefined,
        lineups: { home: samplePlayers(isHome ? "Alahli" : opponentName), away: samplePlayers(isHome ? opponentName : "Alahli") },
        stats: sampleStats,
        gallery: isFinished ? [stadium1, stadium2] : [stadium2],
      };
      if (isFinished) f.events = sampleEvents.slice(0, 4);
      return f;
    });
};

// ---------- FOOTBALL ----------
const footballLeague: MatchInput[] = [
  { date: "2025-12-18", home: CLUB,                away: "Al Qadisiyah",         score: "4-0" },
  { date: "2025-12-25", home: "Al Madina",         away: CLUB,                   score: "1-1" },
  { date: "2025-12-31", home: CLUB,                away: "Al Malaab El Libby",   score: "3-1" },
  { date: "2026-01-05", home: "Assabah",           away: CLUB,                   score: "0-3" },
  { date: "2026-01-15", home: CLUB,                away: "Al Watan",             score: "2-0" },
  { date: "2026-01-20", home: "Al Dahra",          away: CLUB,                   score: "1-3" },
  { date: "2026-01-27", home: "Abu Salim",         away: CLUB,                   score: "0-1" },
  { date: "2026-02-02", home: CLUB,                away: "Al-Khmes",             score: "5-2" },
  { date: "2026-02-07", home: "Asswehly",          away: CLUB,                   score: "0-0" },
  { date: "2026-02-21", home: "Al Qadisiyah",     away: CLUB,                   score: "0-1" },
  { date: "2026-02-25", home: CLUB,                away: "Al Madina",            score: "4-0" },
  { date: "2026-03-03", home: "Al Malaab El Libby",away: CLUB,                   score: "0-3" },
  { date: "2026-03-09", home: CLUB,                away: "Assabah",              score: "2-0" },
  { date: "2026-03-14", home: "Al Watan",          away: CLUB,                   score: "0-3" },
  { date: "2026-04-09", home: CLUB,                away: "Al Dahra",             score: "1-0" },
  { date: "2026-04-13", home: CLUB,                away: "Abu Salim",            score: "7-1" },
  { date: "2026-04-18", home: "Al-Khmes",          away: CLUB,                   score: "1-3" },
  { date: "2026-04-23", home: CLUB,                away: "Asswehly",             score: "1-2" },
];

const footballCup: MatchInput[] = [
  { date: "2026-02-13", home: CLUB, away: "Al Qadisiyah Bani Walid", score: "3-1" },
  { date: "2026-04-05", home: CLUB, away: "Al Olympi",                score: "1-0" },
  { date: "2026-04-30", home: CLUB, away: "Asswehly", status: "scheduled", time: [17, 0], venue: VENUE_SIRTE },
];

const footballSuper: MatchInput[] = [
  { date: "2025-12-07", home: CLUB, away: "Al Ahly Benghazi", score: "0-0", time: [20, 0] },
  // Note: score "0-0 (4-3 tab)" — store base score, indicate via competition only
];

// ---------- BASKETBALL ----------
const basketSuper: MatchInput[] = [
  { date: "2025-12-20", home: CLUB, away: "Al Ahly Benghazi", score: "87-65", time: [19, 0], venue: VENUE_AHMED_MOUSA },
];
const basketCup: MatchInput[] = [
  { date: "2026-03-13", home: CLUB,              away: "Al Madina",        score: "80-36" },
  { date: "2026-04-11", home: CLUB,              away: "Al Ittihad",       score: "59-79" },
  { date: "2026-04-25", home: "Al Ahly Benghazi", away: CLUB,              score: "94-90" },
];

const basketFinals: MatchInput[] = [
  { date: "2026-04-16", home: "Al Shabab Al Arabi", away: CLUB, score: "69-101" },
  { date: "2026-04-17", home: "Al Madina",          away: CLUB, score: "55-94" },
  { date: "2026-04-18", home: CLUB, away: "Al Ittihad",         score: "93-94" },
  { date: "2026-04-20", home: CLUB, away: "Al Ahly Benghazi",   score: "95-87" },
  { date: "2026-04-21", home: CLUB, away: "Al Nasr",            score: "99-86" },
  { date: "2026-04-27", home: CLUB, away: "Al Shabab Al Arabi", score: "91-60" },
  { date: "2026-04-28", time: [16, 0], home: "Al Madina",       away: CLUB, status: "scheduled", venue: VENUE_DERNA_HALL },
  { date: "2026-04-29", time: [19, 0], home: CLUB, away: "Al Ittihad",       status: "scheduled", venue: VENUE_DERNA_HALL },
  { date: "2026-05-01", time: [18, 0], home: CLUB, away: "Al Ahly Benghazi", status: "scheduled", venue: VENUE_DERNA_HALL },
  { date: "2026-05-02", home: CLUB, away: "Al Nasr",            status: "scheduled", venue: VENUE_DERNA_HALL },
];

// ---------- VOLLEYBALL ----------
const volleyLeague: MatchInput[] = [
  { date: "2026-04-04", home: CLUB,             away: "Al Ahly Benghazi",     score: "3-0", venue: VENUE_MISRATA },
  { date: "2026-04-05", home: "Al Ittihad",     away: CLUB,                   score: "3-0", venue: VENUE_MISRATA },
  { date: "2026-04-06", home: CLUB,             away: "Al Hilal",             score: "3-0", venue: VENUE_MISRATA },
  { date: "2026-04-08", home: CLUB,             away: "Al Ittihad Misurata", score: "3-0", venue: VENUE_MISRATA },
  { date: "2026-04-09", home: CLUB,             away: "Al Swehly",            score: "3-0", venue: VENUE_MISRATA },
];

// ---------- HANDBALL ----------
const handballLeague: MatchInput[] = [
  { date: "2026-04-23", home: CLUB, away: "Al Olympi",        score: "28-19", venue: VENUE_AKHDAR },
  { date: "2026-04-24", home: CLUB, away: "Al Najma",         score: "38-23", venue: VENUE_AKHDAR },
  { date: "2026-04-26", home: CLUB, away: "Al Ittihad",       score: "27-26", venue: VENUE_AKHDAR },
  { date: "2026-04-27", home: CLUB, away: "Al Hilal",         score: "24-21", venue: VENUE_AKHDAR },
  { date: "2026-04-28", home: CLUB, away: "Al Ahly Benghazi", score: null, status: "scheduled", time: [17, 0], venue: VENUE_AKHDAR },
];
const handballSuper: MatchInput[] = [
  { date: "2025-10-17", home: "Al Ahly Benghazi", away: CLUB, score: "10-0", venue: VENUE_DERNA },
];

// ---------- ASSEMBLE ----------
const all: Fixture[] = [
  ...build("football", "Libyan Premier League", footballLeague),
  ...build("football", "Libyan Cup", footballCup),
  ...build("football", "Libyan Super Cup", footballSuper),
  ...build("basketball", "Libyan Super Cup", basketSuper),
  ...build("basketball", "Libyan Cup", basketCup),
  ...build("basketball", "Libyan League Finals", basketFinals, VENUE_AHMED_MOUSA),
  ...build("volleyball", "Libyan Volleyball League", volleyLeague, VENUE_MISRATA),
  ...build("handball", "Libyan Handball League", handballLeague, VENUE_AKHDAR),
  ...build("handball", "Libyan Super Cup", handballSuper),
];

// Sort chronologically (asc)
all.sort((a, b) => a.date.getTime() - b.date.getTime());

// Mark "next" — first upcoming fixture relative to now
const nowTs = Date.now();
const nextIdx = all.findIndex(f => f.date.getTime() >= nowTs && f.status !== "finished");
if (nextIdx >= 0) all[nextIdx].isNext = true;

export const fixtures: Fixture[] = all;

export const getFixtureById = (id: string) => fixtures.find(f => f.id === id);

export const nextFixtureIndex = (): number => {
  const idx = fixtures.findIndex(f => f.date.getTime() >= Date.now() && f.status !== "finished");
  return idx === -1 ? Math.max(0, fixtures.length - 1) : idx;
};
