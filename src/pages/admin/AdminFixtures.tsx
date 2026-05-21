import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, Edit, X, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Fixture = {
  id: string;
  sport: string;
  competition_id: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  kickoff_at: string;
  venue: string | null;
  status: string;
  home_score: number | null;
  away_score: number | null;
  source: string;
};

type Team = { id: string; name_en: string; sport: string };
type Comp = { id: string; name_en: string; sport: string };

const SPORTS = ["football", "basketball", "handball", "volleyball"] as const;
const STATUSES = ["scheduled", "live", "finished", "postponed", "cancelled"] as const;
const EMPTY: Partial<Fixture> = { sport: "football", status: "scheduled", source: "manual" };

const AdminFixtures = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Fixture[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [comps, setComps] = useState<Comp[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Fixture> | null>(null);
  const [saving, setSaving] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const [{ data: fx }, { data: tm }, { data: cp }] = await Promise.all([
      supabase.from("fixtures").select("*").order("kickoff_at", { ascending: false }),
      supabase.from("sport_teams").select("id,name_en,sport").order("name_en"),
      supabase.from("competitions").select("id,name_en,sport").order("name_en"),
    ]);
    setItems((fx as Fixture[]) ?? []);
    setTeams((tm as Team[]) ?? []);
    setComps((cp as Comp[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const teamMap = useMemo(() => Object.fromEntries(teams.map(t => [t.id, t.name_en])), [teams]);
  const compMap = useMemo(() => Object.fromEntries(comps.map(c => [c.id, c.name_en])), [comps]);

  const onSave = async () => {
    if (!editing?.sport || !editing.kickoff_at) {
      toast({ title: "Sport and kickoff are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = { ...editing, source: editing.source ?? "manual" };
    delete (payload as any).id;
    const { error } = editing.id
      ? await supabase.from("fixtures").update(payload).eq("id", editing.id)
      : await supabase.from("fixtures").insert(payload as any);
    setSaving(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.saved") });
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await supabase.from("fixtures").delete().eq("id", id);
    load();
  };

  const filtered = sportFilter === "all" ? items : items.filter(f => f.sport === sportFilter);
  const teamOptions = editing?.sport ? teams.filter(t => t.sport === editing.sport) : teams;
  const compOptions = editing?.sport ? comps.filter(c => c.sport === editing.sport) : comps;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.fixtures.title")}</h1>
        <Button variant="gold" onClick={() => setEditing(EMPTY)}><Plus className="h-4 w-4" /> {t("admin.fixtures.new")}</Button>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        {(["all", ...SPORTS] as const).map(s => (
          <button key={s} onClick={() => setSportFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${sportFilter === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
            {s === "all" ? t("admin.players.all") : s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">{t("admin.fixtures.empty")}</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {filtered.map(f => {
            const ro = f.source === "api";
            return (
              <div key={f.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {ro && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                    {teamMap[f.home_team_id ?? ""] ?? "—"} vs {teamMap[f.away_team_id ?? ""] ?? "—"}
                    {(f.home_score !== null || f.away_score !== null) && (
                      <span className="text-xs text-accent">{f.home_score ?? 0}-{f.away_score ?? 0}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {f.sport} · {new Date(f.kickoff_at).toLocaleString(i18n.language)} · {f.status} · {compMap[f.competition_id ?? ""] ?? "—"} · {f.source}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditing(f)} disabled={ro}><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(f.id)} disabled={ro}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">{editing.id ? t("admin.fixtures.edit") : t("admin.fixtures.new")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label={t("admin.fixtures.sport")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.sport ?? "football"} onChange={e => setEditing({ ...editing, sport: e.target.value, home_team_id: null, away_team_id: null, competition_id: null })}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t("admin.fixtures.kickoff")}>
                <Input type="datetime-local"
                  value={editing.kickoff_at ? new Date(editing.kickoff_at).toISOString().slice(0, 16) : ""}
                  onChange={e => setEditing({ ...editing, kickoff_at: e.target.value ? new Date(e.target.value).toISOString() : "" })} />
              </Field>
              <Field label={t("admin.fixtures.competition")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.competition_id ?? ""} onChange={e => setEditing({ ...editing, competition_id: e.target.value || null })}>
                  <option value="">—</option>
                  {compOptions.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                </select>
              </Field>
              <Field label={t("admin.fixtures.status")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.status ?? "scheduled"} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t("admin.fixtures.home")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.home_team_id ?? ""} onChange={e => setEditing({ ...editing, home_team_id: e.target.value || null })}>
                  <option value="">—</option>
                  {teamOptions.map(t => <option key={t.id} value={t.id}>{t.name_en}</option>)}
                </select>
              </Field>
              <Field label={t("admin.fixtures.away")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.away_team_id ?? ""} onChange={e => setEditing({ ...editing, away_team_id: e.target.value || null })}>
                  <option value="">—</option>
                  {teamOptions.map(t => <option key={t.id} value={t.id}>{t.name_en}</option>)}
                </select>
              </Field>
              <Field label={t("admin.fixtures.homeScore")}>
                <Input type="number" value={editing.home_score ?? ""} onChange={e => setEditing({ ...editing, home_score: e.target.value ? Number(e.target.value) : null })} />
              </Field>
              <Field label={t("admin.fixtures.awayScore")}>
                <Input type="number" value={editing.away_score ?? ""} onChange={e => setEditing({ ...editing, away_score: e.target.value ? Number(e.target.value) : null })} />
              </Field>
              <Field label={t("admin.fixtures.venue")} className="col-span-2">
                <Input value={editing.venue ?? ""} onChange={e => setEditing({ ...editing, venue: e.target.value })} />
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

export default AdminFixtures;