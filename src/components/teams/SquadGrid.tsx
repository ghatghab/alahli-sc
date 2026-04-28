import { useTranslation } from "react-i18next";
import { type RosterPlayer } from "@/lib/roster";

const POSITION_GROUPS: Array<{ label: string; codes: string[] }> = [
  { label: "Goalkeepers", codes: ["GK"] },
  { label: "Defenders", codes: ["CB", "RB", "LB"] },
  { label: "Midfielders", codes: ["CDM", "CM", "CAM"] },
  { label: "Forwards", codes: ["RW", "LW", "ST"] },
  { label: "Guards", codes: ["PG", "SG"] },
  { label: "Forwards / Center", codes: ["SF", "PF", "C"] },
  { label: "Wings", codes: ["LW", "RW"] },
  { label: "Backs", codes: ["LB", "CB", "RB"] },
  { label: "Pivot", codes: ["P"] },
  { label: "Setters & Liberos", codes: ["S", "L"] },
  { label: "Hitters", codes: ["OH", "OPP"] },
  { label: "Middle Blockers", codes: ["MB"] },
];

const PlayerCard = ({ p, yearsLabel }: { p: RosterPlayer; yearsLabel: string }) => (
  <div className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-smooth hover:border-accent hover:shadow-elegant">
    <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 via-muted to-card relative">
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-7xl font-black text-foreground/10 select-none">
          {p.number}
        </span>
      </div>
      <div className="absolute top-3 left-3 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
        {p.position}
      </div>
      <div className="absolute top-3 right-3 rounded-md bg-background/80 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-foreground border border-border">
        {p.nationality}
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display font-bold text-foreground truncate">{p.name}</h3>
        <span className="font-display text-2xl font-black text-accent leading-none">{p.number}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{p.age} {yearsLabel}</div>
    </div>
  </div>
);

export const SquadGrid = ({ players }: { players: RosterPlayer[] }) => {
  const { t } = useTranslation();
  const yearsLabel = t("pagesContent.squad.years");
  // Group players by their position prefix using POSITION_GROUPS, falling back to "Other".
  const seen = new Set<number>();
  const groups = POSITION_GROUPS.map(g => ({
    label: g.label,
    items: players.filter(p => g.codes.includes(p.position) && !seen.has(p.number)).map(p => {
      seen.add(p.number);
      return p;
    }),
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-12">
      {groups.map(g => (
        <section key={g.label}>
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-accent">
              {t(`pagesContent.squad.groups.${g.label}`, { defaultValue: g.label })}
            </h2>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{g.items.length}</span>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {g.items.map(p => <PlayerCard key={p.number} p={p} yearsLabel={yearsLabel} />)}
          </div>
        </section>
      ))}
    </div>
  );
};