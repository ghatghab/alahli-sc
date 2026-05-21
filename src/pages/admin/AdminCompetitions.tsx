import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, Edit, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Comp = {
  id: string;
  sport: string;
  name_en: string;
  name_fr: string | null;
  name_ar: string | null;
  season: string | null;
  country: string | null;
  logo_url: string | null;
  source: string;
};

const SPORTS = ["football", "basketball", "handball", "volleyball"] as const;
const EMPTY: Partial<Comp> = { sport: "football", name_en: "", source: "manual" };

const AdminCompetitions = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Comp[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Comp> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("competitions").select("*").order("sport").order("name_en");
    setItems((data as Comp[]) ?? []);
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
      ? await supabase.from("competitions").update(payload).eq("id", editing.id)
      : await supabase.from("competitions").insert(payload as any);
    setSaving(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.saved") });
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await supabase.from("competitions").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.competitions.title")}</h1>
        <Button variant="gold" onClick={() => setEditing(EMPTY)}><Plus className="h-4 w-4" /> {t("admin.competitions.new")}</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">{t("admin.competitions.empty")}</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {items.map(c => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{c.name_en}</div>
                <div className="text-xs text-muted-foreground">{c.sport} · {c.season ?? "—"} · {c.country ?? "—"} · {c.source}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(c)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)} disabled={c.source === "api"}>
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
              <h2 className="font-display text-xl font-bold uppercase">{editing.id ? t("admin.competitions.edit") : t("admin.competitions.new")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("admin.competitions.sport")}</label>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.sport ?? "football"} onChange={e => setEditing({ ...editing, sport: e.target.value })}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("admin.competitions.season")}</label>
                <Input value={editing.season ?? ""} onChange={e => setEditing({ ...editing, season: e.target.value })} placeholder="2025-2026" />
              </div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name (EN)</label>
                <Input value={editing.name_en ?? ""} onChange={e => setEditing({ ...editing, name_en: e.target.value })} /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name (FR)</label>
                <Input value={editing.name_fr ?? ""} onChange={e => setEditing({ ...editing, name_fr: e.target.value })} /></div>
              <div className="col-span-2"><label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Name (AR)</label>
                <Input dir="rtl" value={editing.name_ar ?? ""} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("admin.competitions.country")}</label>
                <Input value={editing.country ?? ""} onChange={e => setEditing({ ...editing, country: e.target.value })} /></div>
              <div><label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("admin.competitions.logo")}</label>
                <Input value={editing.logo_url ?? ""} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} placeholder="https://..." /></div>
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

export default AdminCompetitions;