import jerseyImg from "@/assets/lineup-jersey.png";
import type { Player } from "@/lib/fixtures";

/**
 * Half-pitch lineup. Renders a 4-3-3 (or close) formation grouped by position.
 * Home side mirrors so both teams attack toward the centre line.
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
  <div className="flex flex-col items-center text-center w-16 sm:w-20">
    <div className="relative">
      <img
        src={jerseyImg}
        alt=""
        aria-hidden
        className={`h-10 sm:h-12 w-auto object-contain ${
          tone === "away" ? "grayscale opacity-70" : ""
        }`}
      />
      <span className="absolute inset-0 grid place-items-center font-display font-black text-[11px] sm:text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] tabular-nums pt-1">
        {player.number}
      </span>
    </div>
    <span className="mt-1 text-[10px] sm:text-[11px] font-semibold leading-tight text-foreground line-clamp-1">
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
  <div className="flex flex-col items-center justify-around h-full gap-2">
    {players.map((p) => (
      <Jersey key={p.number} player={p} tone={tone} />
    ))}
  </div>
);

const HalfPitch = ({
  players,
  side,
}: {
  players: Player[];
  side: Side;
}) => {
  const { GK, DF, MF, FW } = groupByPosition(players);
  // Each formation line is a vertical column on the pitch.
  // Home: GK far left → FW near centre. Away: mirror (FW near centre → GK far right).
  const order = side === "home" ? [GK, DF, MF, FW] : [FW, MF, DF, GK];

  return (
    <div className="relative w-full">
      {/* Pitch background */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-lg border border-border bg-muted/30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 40px, hsl(var(--muted) / 0.35) 40px 80px)",
        }}
      />
      {/* Centre line on the inner edge */}
      <div
        aria-hidden
        className={`absolute top-0 bottom-0 w-px bg-border ${
          side === "home" ? "right-0" : "left-0"
        }`}
      />
      {/* Centre circle (half) */}
      <div
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-border ${
          side === "home" ? "-right-12" : "-left-12"
        }`}
      />
      {/* Penalty box */}
      <div
        aria-hidden
        className={`absolute top-1/2 -translate-y-1/2 h-2/3 w-16 border border-border ${
          side === "home" ? "left-0 border-r-0" : "right-0 border-l-0"
        }`}
      />

      <div className="relative grid grid-cols-4 gap-1 py-6 min-h-[460px] items-stretch">
        {order.map((group, i) => (
          <Line key={i} players={group} tone={side} />
        ))}
      </div>
    </div>
  );
};

export const LineupPitch = ({
  home,
  away,
}: {
  home: Player[];
  away: Player[];
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <HalfPitch players={home} side="home" />
    <HalfPitch players={away} side="away" />
  </div>
);

export default LineupPitch;