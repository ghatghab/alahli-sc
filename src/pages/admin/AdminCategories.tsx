import { FormEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { NewsCategoryRow, slugify } from "@/lib/news";

const AdminCategories = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<NewsCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name_en, setEn] = useState("");
  const [name_fr, setFr] = useState("");
  const [name_ar, setAr] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("news_categories").select("*").order("sort_order");
    setItems((data as NewsCategoryRow[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (!name_en.trim()) return;
    const slug = slugify(name_en);
    const { error } = await supabase.from("news_categories").insert({
      slug,
      name_en: name_en.trim(),
      name_fr: name_fr.trim() || name_en.trim(),
      name_ar: name_ar.trim() || name_en.trim(),
      sort_order: items.length + 1,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEn(""); setFr(""); setAr("");
      load();
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from("news_categories").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl font-bold uppercase mb-6">{t("admin.categories")}</h1>

      <form onSubmit={onAdd} className="bg-card border border-border rounded-xl p-6 shadow-soft mb-6 grid gap-4 sm:grid-cols-3 items-end">
        <div>
          <Label>EN</Label>
          <Input value={name_en} onChange={e => setEn(e.target.value)} placeholder="Football" required />
        </div>
        <div>
          <Label>FR</Label>
          <Input value={name_fr} onChange={e => setFr(e.target.value)} placeholder="Football" />
        </div>
        <div>
          <Label>AR</Label>
          <Input value={name_ar} onChange={e => setAr(e.target.value)} placeholder="كرة القدم" dir="rtl" />
        </div>
        <Button type="submit" variant="gold" className="sm:col-span-3 sm:w-auto sm:justify-self-end">
          <Plus className="h-4 w-4" /> {t("admin.add")}
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-soft divide-y divide-border">
          {items.map(c => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{c.name_en}</div>
                <div className="text-xs text-muted-foreground">FR: {c.name_fr} · AR: {c.name_ar} · /{c.slug}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => onDelete(c.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;