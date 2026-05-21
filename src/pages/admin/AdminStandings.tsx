import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, Edit, X, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Standing = {
  id: string;
  competition_id: string;
  team_id: string;
  season: string | null;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  points: number;
  source: string;
};

type Comp = { id: string; name_en: string; sport: string };
type Team = { id: string; name_en: string; sport: string };

const EMPTY: Partial<Standing> = { rank: 1, played: 0, won: 0, drawn: 0, lost: 0, goals_for: 0, goals_against: 0, points: 0, source: "manual" };

const AdminStandings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Standing[]>([]);
  const [comps, setComps] = useState<Comp[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [compFilter, setCompFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Standing> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: st }, { data: cp }, { data: tm }] = await Promise.all([
      supabase.from("standings").select("*").order("rank"),
      supabase.from("competitions").select("id,name_en,sport").order("name_en"),
      supabase.from("sport_teams").select("id,name_en,sport").order("name_en"),
    ]);
    setItems((st as Standing[]) ?? []);
    setComps((cp as Comp[]) ?? []);
    setTeams((tm as Team[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const teamMap = useMemo(() => Object.fromEntries(teams.map(t => [t.id, t.name_en])), [teams]);
  const compMap = useMemo(() => Object.fromEntries(comps.map(c => [c.id, c.name_en])), [comps]);

  const onSave = async () => {
    if (!editing?.competition_id || !editing.team_id) {
      toast({ title: "Competition and team are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = { ...editing, source: editing.source ?? "manual" };
    delete (payload as any).id;
    const { error } = editing.id
      ? await supabase.from("standings").update(payload).eq("id", editing.id)
      : await supabase.from("standings").insert(payload as any);
    setSaving(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.saved") });
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await supabase.from("standings").delete().eq("id", id);
    load();
  };

  const filtered = compFilter ? items.filter(s => s.competition_id === compFilter) : items;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.standings.title")}</h1>
        <Button variant="gold" onClick={() => setEditing(EMPTY)}><Plus className="h-4 w-4" /> {t("admin.standings.new")}</Button>
      </div>

      <div className="mb-4">
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={compFilter} onChange={e => setCompFilter(e.target.value)}>
          <option value="">{t("admin.standings.allCompetitions")}</option>
          {comps.map(c => <option key={c.id} value={c.id}>{c.name_en} ({c.sport})</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">{t("admin.standings.empty")}</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">{t("admin.standings.team")}</th>
                <th className="p-3">{t("admin.standings.competition")}</th>
                <th className="p-3">P</th><th className="p-3">W</th><th className="p-3">D</th><th className="p-3">L</th>
                <th className="p-3">GF</th><th className="p-3">GA</th><th className="p-3">Pts</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3 font-bold">{s.rank}</td>
                  <td className="p-3">{teamMap[s.team_id] ?? "—"}</td>
                  <td className="p-3 text-center text-xs text-muted-foreground">{compMap[s.competition_id] ?? "—"}</td>
                  <td className="p-3 text-center">{s.played}</td>
                  <td className="p-3 text-center">{s.won}</td>
                  <td className="p-3 text-center">{s.drawn}</td>
                  <td className="p-3 text-center">{s.lost}</td>
                  <td className="p-3 text-center">{s.goals_for}</td>
                  <td className="p-3 text-center">{s.goals_against}</td>
                  <td className="p-3 text-center font-bold">{s.points}</td>
                  <td className="p-3 text-right">
                    {s.source === "api" && <Lock className="inline h-3.5 w-3.5 text-muted-foreground mr-2" />}
                    <Button variant="ghost" size="icon" onClick={() => setEditing(s)} disabled={s.source === "api"}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(s.id)} disabled={s.source === "api"}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">{editing.id ? t("admin.standings.edit") : t("admin.standings.new")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label={t("admin.standings.competition")} className="col-span-2">
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.competition_id ?? ""} onChange={e => setEditing({ ...editing, competition_id: e.target.value })}>
                  <option value="">—</option>
                  {comps.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                </select>
              </Field>
              <Field label={t("admin.standings.team")} className="col-span-2">
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.team_id ?? ""} onChange={e => setEditing({ ...editing, team_id: e.target.value })}>
                  <option value="">—</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name_en}</option>)}
                </select>
              </Field>
              {([
                ["rank", "Rank"], ["points", "Pts"],
                ["played", "P"], ["won", "W"], ["drawn", "D"], ["lost", "L"],
                ["goals_for", "GF"], ["goals_against", "GA"],
              ] as const).map(([k, label]) => (
                <Field key={k} label={label}>
                  <Input type="number" value={(editing as any)[k] ?? 0}
                    onChange={e => setEditing({ ...editing, [k]: Number(e.target.value) || 0 })} />
                </Field>
              ))}
              <Field label={t("admin.standings.season")} className="col-span-2">
                <Input value={editing.season ?? ""} onChange={e => setEditing({ ...editing, season: e.target.value })} placeholder="2025-2026" />
              </Field>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>{t("admin.cancel")}</Button>
              <Button variant="gold" onClick={onSave} disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />} {t("admin.save")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</label>
    {children}
  </div>
);

export default AdminStandings;