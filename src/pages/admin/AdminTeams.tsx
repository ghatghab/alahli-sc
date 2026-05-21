import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, Edit, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Team = {
  id: string;
  sport: string;
  name_en: string;
  name_fr: string | null;
  name_ar: string | null;
  short_name: string | null;
  logo_url: string | null;
  is_alahli: boolean;
  source: string;
};

const SPORTS = ["football", "basketball", "handball", "volleyball"] as const;
const EMPTY: Partial<Team> = { sport: "football", name_en: "", is_alahli: false, source: "manual" };

const AdminTeams = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Team> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("sport_teams").select("*").order("sport").order("name_en");
    setItems((data as Team[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.name_en || !editing.sport) {
      toast({ title: "Name (EN) and sport are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = { ...editing, source: editing.source ?? "manual" };
    delete (payload as any).id;
    const { error } = editing.id
      ? await supabase.from("sport_teams").update(payload).eq("id", editing.id)
      : await supabase.from("sport_teams").insert(payload as any);
    setSaving(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.saved") });
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from("sport_teams").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.teams.title")}</h1>
        <Button variant="gold" onClick={() => setEditing(EMPTY)}><Plus className="h-4 w-4" /> {t("admin.teams.new")}</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">{t("admin.teams.empty")}</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {items.map(team => (
            <div key={team.id} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-muted overflow-hidden shrink-0">
                {team.logo_url && <img src={team.logo_url} alt="" className="h-full w-full object-contain" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">
                  {team.name_en} {team.is_alahli && <span className="text-[10px] uppercase ml-2 px-1.5 py-0.5 rounded bg-accent/15 text-accent">Al Ahli</span>}
                </div>
                <div className="text-xs text-muted-foreground">{team.sport} · {team.source}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(team)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(team.id)} disabled={team.source === "api"}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-xl border border-border max-w-xl w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">{editing.id ? t("admin.teams.edit") : t("admin.teams.new")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label={t("admin.teams.sport")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.sport ?? "football"} onChange={e => setEditing({ ...editing, sport: e.target.value })}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t("admin.teams.shortName")}>
                <Input value={editing.short_name ?? ""} onChange={e => setEditing({ ...editing, short_name: e.target.value })} />
              </Field>
              <Field label="Name (EN)">
                <Input value={editing.name_en ?? ""} onChange={e => setEditing({ ...editing, name_en: e.target.value })} />
              </Field>
              <Field label="Name (FR)">
                <Input value={editing.name_fr ?? ""} onChange={e => setEditing({ ...editing, name_fr: e.target.value })} />
              </Field>
              <Field label="Name (AR)" className="col-span-2">
                <Input dir="rtl" value={editing.name_ar ?? ""} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} />
              </Field>
              <Field label={t("admin.teams.logo")} className="col-span-2">
                <Input value={editing.logo_url ?? ""} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} placeholder="https://..." />
              </Field>
              <label className="flex items-center gap-2 text-sm col-span-2">
                <input type="checkbox" checked={editing.is_alahli ?? false} onChange={e => setEditing({ ...editing, is_alahli: e.target.checked })} />
                {t("admin.teams.isAlahli")}
              </label>
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

export default AdminTeams;