import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Locale, NewsCategoryRow, NewsTranslationRow, slugify } from "@/lib/news";

const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

const emptyTr = (): Record<Locale, { title: string; excerpt: string; content: string }> => ({
  en: { title: "", excerpt: "", content: "" },
  fr: { title: "", excerpt: "", content: "" },
  ar: { title: "", excerpt: "", content: "" },
});

const AdminArticleEdit = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<NewsCategoryRow[]>([]);
  const [activeLocale, setActiveLocale] = useState<Locale>("en");

  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [coverPath, setCoverPath] = useState<string>("");
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString().slice(0, 16));
  const [tr, setTr] = useState(emptyTr());

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from("news_categories").select("*").order("sort_order");
      setCategories((cats as NewsCategoryRow[] | null) ?? []);

      if (!isNew && id) {
        const { data } = await supabase
          .from("news_articles")
          .select("*, news_translations(*)")
          .eq("id", id)
          .maybeSingle();
        if (data) {
          const a = data as { slug: string; category_id: string | null; cover_image_url: string | null; cover_image_path: string | null; published: boolean; published_at: string | null; news_translations: NewsTranslationRow[] };
          setSlug(a.slug);
          setCategoryId(a.category_id ?? "");
          setCoverUrl(a.cover_image_url ?? "");
          setCoverPath(a.cover_image_path ?? "");
          setPublished(a.published);
          if (a.published_at) setPublishedAt(new Date(a.published_at).toISOString().slice(0, 16));
          const next = emptyTr();
          a.news_translations.forEach(row => {
            next[row.locale] = {
              title: row.title ?? "",
              excerpt: row.excerpt ?? "",
              content: row.content ?? "",
            };
          });
          setTr(next);
        }
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user?.id ?? "anon"}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("news-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    setUploading(false);
    if (error) {
      toast({ title: "Upload error", description: error.message, variant: "destructive" });
      return;
    }
    const { data: pub } = supabase.storage.from("news-images").getPublicUrl(path);
    setCoverUrl(pub.publicUrl);
    setCoverPath(path);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!tr.en.title && !tr.fr.title && !tr.ar.title) {
      toast({ title: t("admin.titleRequired"), variant: "destructive" });
      return;
    }
    setSaving(true);
    const finalSlug = slug.trim() || slugify(tr.en.title || tr.fr.title || tr.ar.title);
    const payload = {
      slug: finalSlug,
      category_id: categoryId || null,
      cover_image_url: coverUrl || null,
      cover_image_path: coverPath || null,
      published,
      published_at: published ? new Date(publishedAt).toISOString() : null,
      author_id: user?.id ?? null,
    };

    let articleId = id ?? "";
    if (isNew) {
      const { data, error } = await supabase.from("news_articles").insert(payload).select("id").single();
      if (error) { setSaving(false); toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      articleId = (data as { id: string }).id;
    } else {
      const { error } = await supabase.from("news_articles").update(payload).eq("id", articleId);
      if (error) { setSaving(false); toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }

    const rows = LOCALES
      .filter(l => tr[l.code].title.trim())
      .map(l => ({
        article_id: articleId,
        locale: l.code,
        title: tr[l.code].title.trim(),
        excerpt: tr[l.code].excerpt.trim() || null,
        content: tr[l.code].content.trim() || null,
      }));

    if (rows.length > 0) {
      const { error } = await supabase
        .from("news_translations")
        .upsert(rows, { onConflict: "article_id,locale" });
      if (error) { setSaving(false); toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }

    setSaving(false);
    toast({ title: t("admin.saved") });
    navigate("/admin/articles");
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <Link to="/admin/articles" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("admin.backToArticles")}
      </Link>
      <h1 className="font-display text-3xl font-bold uppercase mt-3 mb-6">
        {isNew ? t("admin.newArticle") : t("admin.editArticle")}
      </h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-soft space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">{t("admin.slug")}</Label>
              <Input
                id="slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
            <div>
              <Label htmlFor="category">{t("admin.category")}</Label>
              <select
                id="category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="">—</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_en}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>{t("admin.cover")}</Label>
            <div className="flex items-center gap-4 mt-1">
              <div className="h-24 w-32 rounded-md border border-border bg-muted overflow-hidden flex-shrink-0">
                {coverUrl && <img src={coverUrl} alt="" className="h-full w-full object-cover" />}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
                <span className="inline-flex items-center gap-2 h-10 px-4 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted transition-smooth">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {t("admin.uploadImage")}
                </span>
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <Label htmlFor="publishedAt">{t("admin.publishDate")}</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={e => setPublishedAt(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 h-10">
              <Switch id="published" checked={published} onCheckedChange={setPublished} />
              <Label htmlFor="published" className="cursor-pointer">{t("admin.publish")}</Label>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-soft">
          <div className="flex gap-2 mb-4 border-b border-border">
            {LOCALES.map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setActiveLocale(l.code)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-smooth ${
                  activeLocale === l.code ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="space-y-4" dir={activeLocale === "ar" ? "rtl" : "ltr"}>
            <div>
              <Label>{t("admin.title")}</Label>
              <Input
                value={tr[activeLocale].title}
                onChange={e => setTr(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], title: e.target.value } }))}
              />
            </div>
            <div>
              <Label>{t("admin.excerpt")}</Label>
              <Textarea
                rows={2}
                value={tr[activeLocale].excerpt}
                onChange={e => setTr(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], excerpt: e.target.value } }))}
              />
            </div>
            <div>
              <Label>{t("admin.content")}</Label>
              <Textarea
                rows={12}
                value={tr[activeLocale].content}
                onChange={e => setTr(prev => ({ ...prev, [activeLocale]: { ...prev[activeLocale], content: e.target.value } }))}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/articles")}>
            {t("admin.cancel")}
          </Button>
          <Button type="submit" variant="gold" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("admin.save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminArticleEdit;