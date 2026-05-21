import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, Edit, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Player = {
  id: string;
  sport: string;
  team: string | null;
  jersey_number: number | null;
  name_en: string;
  name_fr: string | null;
  name_ar: string | null;
  position: string | null;
  nationality: string | null;
  date_of_birth: string | null;
  photo_url: string | null;
  is_staff: boolean;
  staff_role: string | null;
  active: boolean;
  sort_order: number;
};

const SPORTS = ["football", "basketball", "handball", "volleyball"] as const;
const EMPTY: Partial<Player> = { sport: "football", name_en: "", is_staff: false, active: true, sort_order: 0 };

const AdminPlayers = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Player> | null>(null);
  const [saving, setSaving] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("players")
      .select("*")
      .order("sport").order("is_staff").order("sort_order").order("name_en");
    setItems((data as Player[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onSave = async () => {
    if (!editing?.name_en || !editing.sport) {
      toast({ title: "Name (EN) and sport are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = { ...editing };
    delete (payload as any).id;
    const { error } = editing.id
      ? await supabase.from("players").update(payload).eq("id", editing.id)
      : await supabase.from("players").insert(payload as any);
    setSaving(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.saved") });
    setEditing(null);
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from("players").delete().eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.deleted") });
    load();
  };

  const onUploadPhoto = async (file: File) => {
    const name = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]+/gi, "_")}`;
    const { error } = await supabase.storage.from("players").upload(name, file, { upsert: false });
    if (error) return toast({ title: "Upload error", description: error.message, variant: "destructive" });
    const { data } = supabase.storage.from("players").getPublicUrl(name);
    setEditing(e => ({ ...e, photo_url: data.publicUrl }));
  };

  const filtered = sportFilter === "all" ? items : items.filter(p => p.sport === sportFilter);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.players.title")}</h1>
        <Button variant="gold" onClick={() => setEditing(EMPTY)}><Plus className="h-4 w-4" /> {t("admin.players.new")}</Button>
      </div>

      <div className="mb-4 flex gap-2 flex-wrap">
        {(["all", ...SPORTS] as const).map(s => (
          <button key={s} onClick={() => setSportFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${sportFilter === s ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
            {s === "all" ? t("admin.players.all") : t(`teamsList.${s}`, { defaultValue: s })}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">{t("admin.players.empty")}</div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {filtered.map(p => (
            <div key={p.id} className="p-4 flex items-center gap-4 border-b border-border last:border-0">
              <div className="h-12 w-12 rounded-full bg-muted overflow-hidden shrink-0">
                {p.photo_url && <img src={p.photo_url} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{p.name_en} {p.jersey_number && <span className="text-muted-foreground text-xs">#{p.jersey_number}</span>}</div>
                <div className="text-xs text-muted-foreground">
                  {p.sport} · {p.is_staff ? (p.staff_role ?? "Staff") : (p.position ?? "-")} · {p.nationality ?? ""}
                  {!p.active && ` · ${t("admin.players.inactive")}`}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(p)}><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">{editing.id ? t("admin.players.edit") : t("admin.players.new")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              <Field label={t("admin.players.sport")}>
                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={editing.sport ?? "football"} onChange={e => setEditing({ ...editing, sport: e.target.value })}>
                  {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t("admin.players.team")}>
                <Input value={editing.team ?? ""} onChange={e => setEditing({ ...editing, team: e.target.value })} />
              </Field>
              <Field label={t("admin.players.nameEn")}>
                <Input value={editing.name_en ?? ""} onChange={e => setEditing({ ...editing, name_en: e.target.value })} />
              </Field>
              <Field label={t("admin.players.nameFr")}>
                <Input value={editing.name_fr ?? ""} onChange={e => setEditing({ ...editing, name_fr: e.target.value })} />
              </Field>
              <Field label={t("admin.players.nameAr")}>
                <Input dir="rtl" value={editing.name_ar ?? ""} onChange={e => setEditing({ ...editing, name_ar: e.target.value })} />
              </Field>
              <Field label={t("admin.players.jersey")}>
                <Input type="number" value={editing.jersey_number ?? ""} onChange={e => setEditing({ ...editing, jersey_number: e.target.value ? Number(e.target.value) : null })} />
              </Field>
              <Field label={t("admin.players.position")}>
                <Input value={editing.position ?? ""} onChange={e => setEditing({ ...editing, position: e.target.value })} />
              </Field>
              <Field label={t("admin.players.nationality")}>
                <Input value={editing.nationality ?? ""} onChange={e => setEditing({ ...editing, nationality: e.target.value })} />
              </Field>
              <Field label={t("admin.players.dob")}>
                <Input type="date" value={editing.date_of_birth ?? ""} onChange={e => setEditing({ ...editing, date_of_birth: e.target.value || null })} />
              </Field>
              <Field label={t("admin.players.staffRole")}>
                <Input value={editing.staff_role ?? ""} onChange={e => setEditing({ ...editing, staff_role: e.target.value })} />
              </Field>
              <Field label={t("admin.players.photo")} className="col-span-2">
                <div className="flex items-center gap-3">
                  {editing.photo_url && <img src={editing.photo_url} alt="" className="h-12 w-12 rounded-full object-cover" />}
                  <Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onUploadPhoto(e.target.files[0])} />
                </div>
              </Field>
              <label className="flex items-center gap-2 text-sm col-span-1">
                <input type="checkbox" checked={editing.is_staff ?? false} onChange={e => setEditing({ ...editing, is_staff: e.target.checked })} />
                {t("admin.players.isStaff")}
              </label>
              <label className="flex items-center gap-2 text-sm col-span-1">
                <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing({ ...editing, active: e.target.checked })} />
                {t("admin.players.activeFlag")}
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

export default AdminPlayers;