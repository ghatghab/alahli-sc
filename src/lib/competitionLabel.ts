import type { TFunction } from "i18next";
import type { Team } from "@/lib/fixtures";

/**
 * Generic competition names that exist for several sports. For these, we append
 * the sport name so users can tell e.g. "Coupe de Libye (Handball)" apart from
 * "Coupe de Libye (Football)".
 */
const GENERIC = new Set<string>([
  "Libyan Cup",
  "Libyan Super Cup",
]);

export const competitionLabel = (
  t: TFunction | ((k: string, opts?: Record<string, unknown>) => string),
  competition: string,
  sport?: Team,
): string => {
  const base = (t as (k: string, opts?: Record<string, unknown>) => string)(
    `schedule.competitions.${competition}`,
    { defaultValue: competition },
  );
  if (!sport || !GENERIC.has(competition)) return base;
  const sportName = (t as (k: string, opts?: Record<string, unknown>) => string)(
    `teamsList.${sport}`,
    { defaultValue: sport },
  );
  return `${base} — ${sportName}`;
};