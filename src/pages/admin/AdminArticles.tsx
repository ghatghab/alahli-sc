import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  NewsArticleRow,
  NewsCategoryRow,
  NewsTranslationRow,
  categoryName,
  formatDate,
  pickTranslation,
} from "@/lib/news";

type Row = NewsArticleRow & {
  news_translations: NewsTranslationRow[];
  news_categories: NewsCategoryRow | null;
};

const AdminArticles = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("news_articles")
      .select("*, news_translations(*), news_categories(*)")
      .order("created_at", { ascending: false });
    setItems((data as unknown as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    const { error } = await supabase.from("news_articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: t("admin.deleted") });
      load();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="font-display text-3xl font-bold uppercase">{t("admin.articles")}</h1>
        <Button asChild variant="gold">
          <Link to="/admin/articles/new"><Plus className="h-4 w-4" /> {t("admin.newArticle")}</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border text-muted-foreground">
          {t("admin.noArticles")}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-soft">
          <div className="divide-y divide-border">
            {items.map(item => {
              const tr = pickTranslation(item.news_translations, i18n.language);
              return (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-muted/40 transition-smooth">
                  <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.cover_image_url && (
                      <img src={item.cover_image_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        item.published
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}>
                        {item.published ? t("admin.published") : t("admin.draft")}
                      </span>
                      {item.news_categories && (
                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                          {categoryName(item.news_categories, i18n.language)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.published_at ?? item.created_at, i18n.language)}
                      </span>
                    </div>
                    <div className="font-semibold truncate mt-1">{tr?.title ?? item.slug}</div>
                    <div className="text-xs text-muted-foreground truncate">/{item.slug}</div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button asChild variant="ghost" size="icon">
                      <Link to={`/admin/articles/${item.id}`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;