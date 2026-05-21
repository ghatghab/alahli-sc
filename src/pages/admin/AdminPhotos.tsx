import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Photo = {
  id: string;
  album: string;
  title_en: string | null;
  title_fr: string | null;
  title_ar: string | null;
  image_url: string;
  taken_at: string | null;
  sort_order: number;
};

const AdminPhotos = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Partial<Photo>>({ album: "general", sort_order: 0 });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("photos").select("*").order("sort_order").order("created_at", { ascending: false });
    setItems((data as Photo[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onUpload = async (file: File) => {
    const name = `${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]+/gi, "_")}`;
    const { error } = await supabase.storage.from("gallery").upload(name, file);
    if (error) return toast({ title: "Upload error", description: error.message, variant: "destructive" });
    const { data } = supabase.storage.from("gallery").getPublicUrl(name);
    setDraft(d => ({ ...d, image_url: data.publicUrl }));
  };

  const onSave = async () => {
    if (!draft.image_url) return toast({ title: t("admin.photos.imageRequired"), variant: "destructive" });
    const { error } = await supabase.from("photos").insert(draft as any);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: t("admin.saved") });
    setAdding(false); setDraft({ album: "general", sort_order: 0 });
    load();
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await supabase.from("photos").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.photos.title")}</h1>
        <Button variant="gold" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> {t("admin.photos.add")}</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">{t("admin.photos.empty")}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(p => (
            <div key={p.id} className="group relative rounded-lg overflow-hidden border border-border bg-card">
              <img src={p.image_url} alt={p.title_en ?? ""} className="aspect-square w-full object-cover" />
              <div className="p-2 text-xs">
                <div className="font-semibold truncate">{p.title_en ?? "—"}</div>
                <div className="text-muted-foreground">{p.album}</div>
              </div>
              <button onClick={() => onDelete(p.id)} className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 opacity-0 group-hover:opacity-100 transition">
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}

      {adding && (
        <div className="fixed inset-0 bg-black/60 z-50 grid place-items-center p-4" onClick={() => setAdding(false)}>
          <div className="bg-card rounded-xl border border-border max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-xl font-bold uppercase">{t("admin.photos.add")}</h2>
              <Button variant="ghost" size="icon" onClick={() => setAdding(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("admin.photos.file")}</label>
                <Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
                {draft.image_url && <img src={draft.image_url} alt="" className="mt-2 max-h-40 rounded" />}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("admin.photos.album")}</label>
                <Input value={draft.album ?? ""} onChange={e => setDraft({ ...draft, album: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">EN</label>
                  <Input value={draft.title_en ?? ""} onChange={e => setDraft({ ...draft, title_en: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">FR</label>
                  <Input value={draft.title_fr ?? ""} onChange={e => setDraft({ ...draft, title_fr: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-muted-foreground mb-1">AR</label>
                  <Input dir="rtl" value={draft.title_ar ?? ""} onChange={e => setDraft({ ...draft, title_ar: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAdding(false)}>{t("admin.cancel")}</Button>
              <Button variant="gold" onClick={onSave}>{t("admin.save")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPhotos;