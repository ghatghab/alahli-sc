export type SportKey = "football" | "basketball" | "handball" | "volleyball";

export type RosterPlayer = {
  number: number;
  name: string;
  position: string;
  age: number;
  nationality: string;
};

export type StaffMember = {
  name: string;
  role: string;
  nationality: string;
};

const FIRST_NAMES = [
  "Mohamed", "Khaled", "Youssef", "Walid", "Sami", "Omar", "Karim", "Adel",
  "Hassan", "Tarek", "Nabil", "Rami", "Sofiane", "Anis", "Mehdi", "Bilel",
  "Riad", "Ayoub", "Houssem", "Zied", "Faouzi", "Nizar", "Achraf", "Idriss",
  "Slim", "Marwen", "Mounir", "Jalel",
];
const LAST_NAMES = [
  "Al-Tarhouni", "Bensalem", "Aboud", "Mansouri", "El-Karoui", "Zayed", "Ferchichi",
  "Mejri", "Driss", "Saleh", "Ben Romdhane", "Hamdi", "Trabelsi", "Bouzid",
  "Chaabane", "Khelifi", "Maamri", "Sassi", "Ouni", "Belhadj", "Gharbi",
  "Najjar", "Riahi", "Jebali", "Marzouki", "Slimani",
];

const NATIONS = ["LBY", "TUN", "EGY", "ALG", "MAR", "SEN", "CIV", "FRA", "BRA"];

const positionsBySport: Record<SportKey, string[]> = {
  football: ["GK", "RB", "CB", "CB", "LB", "CDM", "CM", "CM", "RW", "ST", "LW", "CB", "CM", "ST", "RB", "GK", "LW", "CDM", "ST", "LB", "CB", "CM"],
  basketball: ["PG", "SG", "SF", "PF", "C", "PG", "SG", "SF", "PF", "C", "SG", "SF"],
  handball: ["GK", "LW", "LB", "CB", "RB", "RW", "P", "GK", "LW", "LB", "CB", "RB", "RW", "P"],
  volleyball: ["S", "OH", "OH", "MB", "MB", "OPP", "L", "S", "OH", "MB", "OPP", "L"],
};

// Deterministic pseudo-random generator so rosters stay stable across renders.
const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const buildRoster = (sport: SportKey): RosterPlayer[] => {
  const seedMap: Record<SportKey, number> = { football: 17, basketball: 31, handball: 53, volleyball: 71 };
  const rand = seeded(seedMap[sport]);
  const positions = positionsBySport[sport];
  const used = new Set<number>();
  return positions.map((pos, i) => {
    let num = Math.floor(rand() * 30) + 1;
    while (used.has(num)) num = (num % 30) + 1;
    used.add(num);
    const fn = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const age = 18 + Math.floor(rand() * 18);
    const nat = NATIONS[Math.floor(rand() * NATIONS.length)];
    return { number: num, name: `${fn} ${ln}`, position: pos, age, nationality: nat };
  }).sort((a, b) => a.number - b.number);
};

const ROSTERS: Record<SportKey, RosterPlayer[]> = {
  football: buildRoster("football"),
  basketball: buildRoster("basketball"),
  handball: buildRoster("handball"),
  volleyball: buildRoster("volleyball"),
};

export const getSportRoster = (sport: SportKey) => ROSTERS[sport];

const STAFF: Record<SportKey, StaffMember[]> = {
  football: [
    { name: "Adel Ben Romdhane", role: "Head Coach", nationality: "TUN" },
    { name: "Mounir Khelifi", role: "Assistant Coach", nationality: "LBY" },
    { name: "Faouzi Riahi", role: "Goalkeeper Coach", nationality: "MAR" },
    { name: "Anis Sassi", role: "Fitness Coach", nationality: "TUN" },
    { name: "Houssem Najjar", role: "Performance Analyst", nationality: "LBY" },
    { name: "Dr. Slim Maamri", role: "Team Doctor", nationality: "TUN" },
    { name: "Bilel Trabelsi", role: "Physiotherapist", nationality: "LBY" },
    { name: "Karim Ferchichi", role: "Team Manager", nationality: "LBY" },
  ],
  basketball: [
    { name: "Sami El-Karoui", role: "Head Coach", nationality: "TUN" },
    { name: "Jalel Marzouki", role: "Assistant Coach", nationality: "LBY" },
    { name: "Marwen Slimani", role: "Skills & Shooting Coach", nationality: "ALG" },
    { name: "Achraf Gharbi", role: "Strength & Conditioning", nationality: "TUN" },
    { name: "Dr. Nizar Jebali", role: "Team Doctor", nationality: "TUN" },
    { name: "Mehdi Hamdi", role: "Team Manager", nationality: "LBY" },
  ],
  handball: [
    { name: "Walid Zayed", role: "Head Coach", nationality: "EGY" },
    { name: "Tarek Bouzid", role: "Assistant Coach", nationality: "LBY" },
    { name: "Riad Chaabane", role: "Goalkeeper Coach", nationality: "TUN" },
    { name: "Sofiane Ouni", role: "Fitness Coach", nationality: "TUN" },
    { name: "Dr. Ayoub Belhadj", role: "Team Doctor", nationality: "LBY" },
    { name: "Idriss Driss", role: "Team Manager", nationality: "LBY" },
  ],
  volleyball: [
    { name: "Karim Ferchichi", role: "Head Coach", nationality: "TUN" },
    { name: "Zied Saleh", role: "Assistant Coach", nationality: "LBY" },
    { name: "Rami Aboud", role: "Setter Coach", nationality: "EGY" },
    { name: "Nabil Mansouri", role: "S&C Coach", nationality: "LBY" },
    { name: "Dr. Hassan Mejri", role: "Team Doctor", nationality: "TUN" },
  ],
};

export const getSportStaff = (sport: SportKey) => STAFF[sport];