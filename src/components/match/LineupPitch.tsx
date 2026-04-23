import jerseyImg from "@/assets/lineup-jersey.png";
import type { Player } from "@/lib/fixtures";

/**
 * Full-pitch lineup. Both teams share one horizontal football field.
 * Home occupies left half (GK far left → FW near centre).
 * Away occupies right half (FW near centre → GK far right).
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
}: {
  player: Player;
  tone: "home" | "away";
}) => (
  <div className="flex flex-col items-center text-center w-14 sm:w-16">
    <div className="relative">
      <img
        src={jerseyImg}
        alt=""
        aria-hidden
        className={`h-9 sm:h-11 w-auto object-contain drop-shadow ${
          tone === "away" ? "grayscale opacity-70" : ""
        }`}
      />
      <span className="absolute inset-0 grid place-items-center font-display font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] tabular-nums pt-1">
        {player.number}
      </span>
    </div>
    <span className="mt-1 text-[10px] sm:text-[11px] font-semibold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-1">
      {player.name}
    </span>
  </div>
);

const Line = ({
  players,
  tone,
}: {
  players: Player[];
  tone: Side;
}) => (
  <div className="flex flex-col items-center justify-around h-full gap-1">
    {players.map((p) => (
      <Jersey key={p.number} player={p} tone={tone} />
    ))}
  </div>
);

/** Pure SVG pitch markings drawn at full size, lines in white. */
const PitchMarkings = () => (
  <svg
    aria-hidden
    viewBox="0 0 1000 600"
    preserveAspectRatio="none"
    className="absolute inset-0 h-full w-full"
  >
    {/* Outer boundary */}
    <rect
      x="10"
      y="10"
      width="980"
      height="580"
      fill="none"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="2"
    />
    {/* Halfway line */}
    <line x1="500" y1="10" x2="500" y2="590" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Centre circle + spot */}
    <circle cx="500" cy="300" r="70" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="500" cy="300" r="3" fill="white" fillOpacity="0.7" />
    {/* Left penalty area */}
    <rect x="10" y="150" width="130" height="300" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Left goal area */}
    <rect x="10" y="220" width="50" height="160" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Left penalty spot */}
    <circle cx="100" cy="300" r="3" fill="white" fillOpacity="0.7" />
    {/* Left penalty arc */}
    <path
      d="M 140 240 A 60 60 0 0 1 140 360"
      fill="none"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="2"
    />
    {/* Right penalty area */}
    <rect x="860" y="150" width="130" height="300" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Right goal area */}
    <rect x="940" y="220" width="50" height="160" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    {/* Right penalty spot */}
    <circle cx="900" cy="300" r="3" fill="white" fillOpacity="0.7" />
    {/* Right penalty arc */}
    <path
      d="M 860 240 A 60 60 0 0 0 860 360"
      fill="none"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth="2"
    />
  </svg>
);

export const LineupPitch = ({
  home,
  away,
}: {
  home: Player[];
  away: Player[];
}) => {
  const h = groupByPosition(home);
  const a = groupByPosition(away);
  // Home columns: GK → DF → MF → FW (left to right)
  // Away columns: FW → MF → DF → GK (continuing left to right)
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
        <PitchMarkings />
        <div className="relative z-10 grid h-full grid-cols-8 gap-0 px-2 py-3 sm:px-4 sm:py-5">
          {columns.map((col, i) => (
            <Line key={i} players={col.players} tone={col.tone} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineupPitch;