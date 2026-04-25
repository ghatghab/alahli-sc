import { useState } from "react";
import jerseyImg from "@/assets/lineup-jersey.png";
import type { Player } from "@/lib/fixtures";

/**
 * Lineup pitch with two layouts:
 * - Desktop (md+): horizontal full pitch with both teams sharing the field.
 * - Mobile (< md): vertical full pitch showing ONE team. A tab selector lets
 *   the user switch between the home and away team compositions.
 */

type Side = "home" | "away";

const groupByPosition = (players: Player[]) => {
  const starters = players.filter((p) => p.isStarter);
  return {
    GK: starters.filter((p) => p.position === "GK"),
    DF: starters.filter((p) => p.position === "DF"),
    MF: starters.filter((p) => p.position === "MF"),
    FW: starters.filter((p) => p.position === "FW"),
  };
};

const Jersey = ({
  player,
  tone,
  size = "md",
}: {
  player: Player;
  tone: Side;
  size?: "sm" | "md";
}) => (
  <div className={`flex flex-col items-center text-center shrink-0 ${size === "sm" ? "w-20 sm:w-24 md:w-28" : "w-28 md:w-32"}`}>
    <div className="relative">
      <img
        src={jerseyImg}
        alt=""
        aria-hidden
        className={`${size === "sm" ? "h-16 sm:h-20 md:h-24" : "h-20 md:h-24"} w-auto object-contain drop-shadow-lg ${
          tone === "away" ? "grayscale opacity-70" : ""
        }`}
      />
      <span className="absolute inset-0 grid place-items-center font-display font-black text-base sm:text-lg md:text-xl text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] tabular-nums pt-1.5">
        {player.number}
      </span>
    </div>
    <span className="mt-1.5 text-[11px] sm:text-xs md:text-sm font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] break-words">
      {player.name}
    </span>
  </div>
);

/* ---------- Horizontal pitch (desktop) ---------- */

const HorizontalLine = ({ players, tone }: { players: Player[]; tone: Side }) => (
  <div className="flex flex-col items-center justify-around h-full gap-1">
    {players.map((p) => (
      <Jersey key={p.number} player={p} tone={tone} size="sm" />
    ))}
  </div>
);

const HorizontalMarkings = () => (
  <svg
    aria-hidden
    viewBox="0 0 1000 600"
    preserveAspectRatio="none"
    className="absolute inset-0 h-full w-full"
  >
    <rect x="10" y="10" width="980" height="580" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <line x1="500" y1="10" x2="500" y2="590" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="500" cy="300" r="70" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="500" cy="300" r="3" fill="white" fillOpacity="0.7" />
    <rect x="10" y="150" width="130" height="300" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <rect x="10" y="220" width="50" height="160" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="100" cy="300" r="3" fill="white" fillOpacity="0.7" />
    <path d="M 140 240 A 60 60 0 0 1 140 360" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <rect x="860" y="150" width="130" height="300" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <rect x="940" y="220" width="50" height="160" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="900" cy="300" r="3" fill="white" fillOpacity="0.7" />
    <path d="M 860 240 A 60 60 0 0 0 860 360" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
  </svg>
);

const HorizontalPitch = ({ home, away }: { home: Player[]; away: Player[] }) => {
  const h = groupByPosition(home);
  const a = groupByPosition(away);
  const columns: { players: Player[]; tone: Side }[] = [
    { players: h.GK, tone: "home" },
    { players: h.DF, tone: "home" },
    { players: h.MF, tone: "home" },
    { players: h.FW, tone: "home" },
    { players: a.FW, tone: "away" },
    { players: a.MF, tone: "away" },
    { players: a.DF, tone: "away" },
    { players: a.GK, tone: "away" },
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border"
      style={{
        background:
          "linear-gradient(90deg, hsl(140 45% 32%) 0%, hsl(140 50% 28%) 12.5%, hsl(140 45% 32%) 25%, hsl(140 50% 28%) 37.5%, hsl(140 45% 32%) 50%, hsl(140 50% 28%) 62.5%, hsl(140 45% 32%) 75%, hsl(140 50% 28%) 87.5%, hsl(140 45% 32%) 100%)",
      }}
    >
      <div className="relative aspect-[5/3] min-h-[360px] w-full">
        <HorizontalMarkings />
        <div className="relative z-10 grid h-full grid-cols-8 gap-0 px-2 py-3 sm:px-4 sm:py-5">
          {columns.map((col, i) => (
            <HorizontalLine key={i} players={col.players} tone={col.tone} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Vertical pitch (mobile, single team) ---------- */

const VerticalMarkings = () => (
  <svg
    aria-hidden
    viewBox="0 0 600 1000"
    preserveAspectRatio="none"
    className="absolute inset-0 h-full w-full"
  >
    {/* Outer */}
    <rect x="10" y="10" width="580" height="980" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Halfway */}
    <line x1="10" y1="500" x2="590" y2="500" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Centre circle */}
    <circle cx="300" cy="500" r="70" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="300" cy="500" r="3" fill="white" fillOpacity="0.7" />
    {/* Bottom (own goal) penalty area */}
    <rect x="150" y="860" width="300" height="130" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <rect x="220" y="940" width="160" height="50" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="300" cy="900" r="3" fill="white" fillOpacity="0.7" />
    <path d="M 240 860 A 60 60 0 0 0 360 860" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Top (attacking) penalty area */}
    <rect x="150" y="10" width="300" height="130" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <rect x="220" y="10" width="160" height="50" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="300" cy="100" r="3" fill="white" fillOpacity="0.7" />
    <path d="M 240 140 A 60 60 0 0 1 360 140" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
  </svg>
);

const VerticalPitch = ({ players, tone }: { players: Player[]; tone: Side }) => {
  const g = groupByPosition(players);
  // Y position (top %) per line. Bottom = own goal, top = attacking.
  // GK very close to own goal, FW near halfway line.
  const lines: { players: Player[]; top: number }[] = [
    { players: g.GK, top: 12 },
    { players: g.DF, top: 35 },
    { players: g.MF, top: 55 },
    { players: g.FW, top: 72 },
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-border"
      style={{
        background:
          "linear-gradient(180deg, hsl(140 45% 32%) 0%, hsl(140 50% 28%) 12.5%, hsl(140 45% 32%) 25%, hsl(140 50% 28%) 37.5%, hsl(140 45% 32%) 50%, hsl(140 50% 28%) 62.5%, hsl(140 45% 32%) 75%, hsl(140 50% 28%) 87.5%, hsl(140 45% 32%) 100%)",
      }}
    >
      <div className="relative aspect-[3/5] w-full">
        <VerticalMarkings />
        {lines.map((line, i) => {
          const count = line.players.length;
          if (count === 0) return null;
          return (
            <div
              key={i}
              className="absolute left-0 right-0 px-1 flex items-center justify-around"
              style={{ top: `${line.top}%`, transform: "translateY(-50%)" }}
            >
              {line.players.map((p) => (
                <Jersey key={p.number} player={p} tone={tone} size="sm" />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Public component ---------- */

export const LineupPitch = ({
  home,
  away,
  homeName = "Home",
  awayName = "Away",
}: {
  home: Player[];
  away: Player[];
  homeName?: string;
  awayName?: string;
}) => {
  const [activeSide, setActiveSide] = useState<Side>("home");
  const activePlayers = activeSide === "home" ? home : away;

  return (
    <>
      {/* Mobile: team selector + vertical pitch (one team) */}
      <div className="md:hidden">
        <div
          role="tablist"
          aria-label="Team selector"
          className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1"
        >
          {(["home", "away"] as const).map((side) => {
            const label = side === "home" ? homeName : awayName;
            const selected = activeSide === side;
            return (
              <button
                key={side}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveSide(side)}
                className={`px-3 py-2 rounded-md text-xs font-display font-bold uppercase tracking-wide truncate transition-colors ${
                  selected
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <VerticalPitch players={activePlayers} tone={activeSide} />
      </div>

      {/* Desktop: horizontal pitch (both teams) */}
      <div className="hidden md:block">
        <HorizontalPitch home={home} away={away} />
      </div>
    </>
  );
};

export default LineupPitch;
