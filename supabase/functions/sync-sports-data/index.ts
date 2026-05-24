// Sports data sync edge function.
// Pulls competitions, fixtures and standings from an external sports API
// and upserts them into Supabase, leaving manually-created rows untouched.
//
// The function uses a pluggable provider interface so the data source can
// later be swapped (API-Football, API-Sports, etc.) without touching the
// schema or the front-end. When no SPORTS_API_KEY secret is configured it
// falls back to a deterministic MOCK provider so the whole pipeline can be
// tested end-to-end.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type SportKey = "football" | "basketball" | "handball" | "volleyball";

type CompetitionPayload = {
  ext_id: string;
  sport: SportKey;
  name_en: string;
  name_fr?: string;
  name_ar?: string;
  season?: string;
  country?: string;
  logo_url?: string;
};

type TeamPayload = {
  ext_id: string;
  sport: SportKey;
  name_en: string;
  name_fr?: string;
  name_ar?: string;
  short_name?: string;
  logo_url?: string;
  is_alahli?: boolean;
};

type FixturePayload = {
  ext_id: string;
  sport: SportKey;
  competition_ext_id: string;
  home_team_ext_id: string;
  away_team_ext_id: string;
  kickoff_at: string;
  venue?: string;
  status: "scheduled" | "live" | "finished" | "postponed";
  home_score?: number | null;
  away_score?: number | null;
  raw?: unknown;
};

type StandingPayload = {
  competition_ext_id: string;
  season?: string;
  team_ext_id: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
};

interface SportsProvider {
  name: string;
  fetchAll(): Promise<{
    competitions: CompetitionPayload[];
    teams: TeamPayload[];
    fixtures: FixturePayload[];
    standings: StandingPayload[];
  }>;
}

// ---------- MOCK PROVIDER (used when no API key is configured) ----------
const MockProvider: SportsProvider = {
  name: "mock",
  async fetchAll() {
    const now = Date.now();
    const day = 86400000;
    return {
      competitions: [
        { ext_id: "LPL-2025", sport: "football", name_en: "Libyan Premier League", name_fr: "Championnat de Libye", name_ar: "الدوري الليبي الممتاز", season: "2025" },
      ],
      teams: [
        { ext_id: "ahli-tripoli", sport: "football", name_en: "Al Ahli Tripoli", name_fr: "Al Ahli Tripoli", name_ar: "الأهلي طرابلس", short_name: "AHL", is_alahli: true },
        { ext_id: "ittihad", sport: "football", name_en: "Al Ittihad", name_fr: "Al Ittihad", name_ar: "الاتحاد", short_name: "ITT" },
        { ext_id: "swehli", sport: "football", name_en: "Al Swehli", name_fr: "Al Swehli", name_ar: "السويحلي", short_name: "SWH" },
        { ext_id: "nasr", sport: "football", name_en: "Al Nasr", name_fr: "Al Nasr", name_ar: "النصر", short_name: "NSR" },
      ],
      fixtures: [
        { ext_id: "f1", sport: "football", competition_ext_id: "LPL-2025", home_team_ext_id: "ahli-tripoli", away_team_ext_id: "ittihad", kickoff_at: new Date(now + 3 * day).toISOString(), venue: "Tripoli International Stadium", status: "scheduled" },
        { ext_id: "f2", sport: "football", competition_ext_id: "LPL-2025", home_team_ext_id: "swehli", away_team_ext_id: "ahli-tripoli", kickoff_at: new Date(now + 10 * day).toISOString(), venue: "Misrata Stadium", status: "scheduled" },
        { ext_id: "f3", sport: "football", competition_ext_id: "LPL-2025", home_team_ext_id: "ahli-tripoli", away_team_ext_id: "nasr", kickoff_at: new Date(now - 5 * day).toISOString(), venue: "Tripoli International Stadium", status: "finished", home_score: 2, away_score: 1 },
      ],
      standings: [
        { competition_ext_id: "LPL-2025", season: "2025", team_ext_id: "ahli-tripoli", rank: 1, played: 8, won: 6, drawn: 1, lost: 1, goals_for: 17, goals_against: 6, points: 19 },
        { competition_ext_id: "LPL-2025", season: "2025", team_ext_id: "ittihad", rank: 2, played: 8, won: 5, drawn: 2, lost: 1, goals_for: 14, goals_against: 7, points: 17 },
        { competition_ext_id: "LPL-2025", season: "2025", team_ext_id: "swehli", rank: 3, played: 8, won: 4, drawn: 2, lost: 2, goals_for: 11, goals_against: 8, points: 14 },
        { competition_ext_id: "LPL-2025", season: "2025", team_ext_id: "nasr", rank: 4, played: 8, won: 3, drawn: 2, lost: 3, goals_for: 9, goals_against: 10, points: 11 },
      ],
    };
  },
};

// ---------- PLACEHOLDER FOR THE REAL PROVIDER ----------
// When the user provides a SPORTS_API_KEY, swap this implementation with a
// real API-Football / API-Sports adapter that maps their response to the
// shapes above. Schema and downstream code do not need to change.
function buildProvider(): SportsProvider {
  const apiKey = Deno.env.get("SPORTS_API_KEY");
  if (!apiKey) return MockProvider;
  // TODO: implement ApiFootballProvider using `apiKey`.
  return MockProvider;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Auth check: only admins may trigger the sync.
  // pg_cron / scheduled invocations can bypass by sending the SYNC_ADMIN_KEY.
  const adminKey = Deno.env.get("SYNC_ADMIN_KEY");
  const headerKey = req.headers.get("x-admin-key");
  const isCronCall = !!adminKey && headerKey === adminKey;

  if (!isCronCall) {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ ok: false, error: "Forbidden: admin role required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const startedAt = new Date().toISOString();
  let runId: string | null = null;
  try {
    const { data: runRow } = await supabase
      .from("sync_runs")
      .insert({ source: "sports", started_at: startedAt })
      .select("id")
      .single();
    runId = runRow?.id ?? null;

    const provider = buildProvider();
    const { competitions, teams, fixtures, standings } = await provider.fetchAll();

    // 1. Upsert competitions
    for (const c of competitions) {
      await supabase
        .from("competitions")
        .upsert(
          { ext_id: c.ext_id, sport: c.sport, name_en: c.name_en, name_fr: c.name_fr, name_ar: c.name_ar, season: c.season, country: c.country, logo_url: c.logo_url, source: "api" },
          { onConflict: "sport,ext_id" },
        );
    }

    // 2. Upsert teams
    for (const team of teams) {
      await supabase
        .from("sport_teams")
        .upsert(
          { ext_id: team.ext_id, sport: team.sport, name_en: team.name_en, name_fr: team.name_fr, name_ar: team.name_ar, short_name: team.short_name, logo_url: team.logo_url, is_alahli: team.is_alahli ?? false, source: "api" },
          { onConflict: "sport,ext_id" },
        );
    }

    // Resolve internal ids for fk lookups
    const compMap = new Map<string, string>();
    const { data: compRows } = await supabase.from("competitions").select("id, ext_id, sport");
    compRows?.forEach((r) => compMap.set(`${r.sport}:${r.ext_id}`, r.id));

    const teamMap = new Map<string, string>();
    const { data: teamRows } = await supabase.from("sport_teams").select("id, ext_id, sport");
    teamRows?.forEach((r) => teamMap.set(`${r.sport}:${r.ext_id}`, r.id));

    let upserted = competitions.length + teams.length;

    // 3. Upsert fixtures (never overwrite manual rows)
    for (const f of fixtures) {
      const compId = compMap.get(`${f.sport}:${f.competition_ext_id}`);
      const homeId = teamMap.get(`${f.sport}:${f.home_team_ext_id}`);
      const awayId = teamMap.get(`${f.sport}:${f.away_team_ext_id}`);
      if (!compId || !homeId || !awayId) continue;

      const { data: existing } = await supabase
        .from("fixtures")
        .select("id, source")
        .eq("sport", f.sport)
        .eq("ext_id", f.ext_id)
        .maybeSingle();
      if (existing && existing.source === "manual") continue;

      await supabase
        .from("fixtures")
        .upsert(
          {
            ext_id: f.ext_id,
            sport: f.sport,
            competition_id: compId,
            home_team_id: homeId,
            away_team_id: awayId,
            kickoff_at: f.kickoff_at,
            venue: f.venue,
            status: f.status,
            home_score: f.home_score ?? null,
            away_score: f.away_score ?? null,
            source: "api",
            raw: f.raw ?? null,
          },
          { onConflict: "sport,ext_id" },
        );
      upserted++;
    }

    // 4. Upsert standings
    for (const s of standings) {
      const compId = compMap.get(`football:${s.competition_ext_id}`)
        ?? compMap.get(`basketball:${s.competition_ext_id}`)
        ?? compMap.get(`handball:${s.competition_ext_id}`)
        ?? compMap.get(`volleyball:${s.competition_ext_id}`);
      // Most providers tie standings to a sport via the competition, so look up
      // the competition's sport once we have the id.
      const teamSport = teamRows?.find((r) => r.ext_id === s.team_ext_id)?.sport;
      const teamId = teamSport ? teamMap.get(`${teamSport}:${s.team_ext_id}`) : undefined;
      if (!compId || !teamId) continue;
      await supabase
        .from("standings")
        .upsert(
          {
            competition_id: compId,
            season: s.season ?? null,
            team_id: teamId,
            rank: s.rank,
            played: s.played,
            won: s.won,
            drawn: s.drawn,
            lost: s.lost,
            goals_for: s.goals_for,
            goals_against: s.goals_against,
            points: s.points,
            source: "api",
          },
          { onConflict: "competition_id,season,team_id" },
        );
      upserted++;
    }

    if (runId) {
      await supabase
        .from("sync_runs")
        .update({
          finished_at: new Date().toISOString(),
          success: true,
          items_upserted: upserted,
          details: { provider: provider.name },
        })
        .eq("id", runId);
    }

    return new Response(
      JSON.stringify({ ok: true, provider: provider.name, items_upserted: upserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (runId) {
      await supabase
        .from("sync_runs")
        .update({ finished_at: new Date().toISOString(), success: false, error: message })
        .eq("id", runId);
    }
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
