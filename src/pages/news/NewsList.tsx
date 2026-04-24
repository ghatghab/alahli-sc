import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  NewsArticleRow,
  NewsCategoryRow,
  NewsTranslationRow,
  categoryName,
  formatDate,
  pickTranslation,
} from "@/lib/news";
import fallback from "@/assets/stadium-aerial.jpg";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Seo } from "@/components/Seo";

type Row = NewsArticleRow & {
  news_translations: NewsTranslationRow[];
  news_categories: NewsCategoryRow | null;
};

export const NewsList = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const year = params.year ? Number(params.year) : null;
  const month = params.month ? Number(params.month) : null;
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<NewsCategoryRow[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [articlesRes, catsRes] = await Promise.all([
        supabase
        .from("news_articles")
        .select("*, news_translations(*), news_categories(*)")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .then(r => {
          if (year && month) {
            // client-side filter for archive
          }
          return r;
        }),
        supabase.from("news_categories").select("*").order("sort_order"),
      ]);
      if (!cancelled) {
        let articles = (articlesRes.data as unknown as Row[]) ?? [];
        if (year && month) {
          const from = new Date(Date.UTC(year, month - 1, 1));
          const to = new Date(Date.UTC(year, month, 1));
          articles = articles.filter(a => {
            if (!a.published_at) return false;
            const d = new Date(a.published_at);
            return d >= from && d < to;
          });
        }
        setItems(articles);
        setCategories((catsRes.data as NewsCategoryRow[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [year, month]);

  const filtered = useMemo(() => {
    let result = items;
    if (activeCategory) {
      result = result.filter(i => i.category_id === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => {
        const tr = pickTranslation(i.news_translations, i18n.language);
        if (!tr) return false;
        return tr.title.toLowerCase().includes(q) || (tr.excerpt ?? "").toLowerCase().includes(q);
      });
    }
    return result;
  }, [items, activeCategory, searchQuery, i18n.language]);

  const archiveTitle =
    year && month
      ? new Date(year, month - 1, 1).toLocaleDateString(
          i18n.language === "fr" ? "fr-FR" : i18n.language === "ar" ? "ar-LY" : "en-US",
          { year: "numeric", month: "long" }
        )
      : null;

  return (
    <>
      <Seo pageKey="news" />
      <Breadcrumbs className="pt-20" />
      <section className="container-club pt-8 pb-16">
        <header className="mb-12">
          <div className="eyebrow mb-3">{t("nav.news")}</div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase leading-[0.95]">
            {archiveTitle ?? t("pages.news.title")}
          </h1>
          <div className="mt-4 h-[3px] w-20 bg-gradient-to-r from-gold to-transparent rtl:bg-gradient-to-l" />
          {!archiveTitle && (
            <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">{t("pages.news.intro")}</p>
          )}
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "px-4 py-2 rounded-md text-xs font-bold uppercase tracking-[0.15em] border transition-smooth",
                !activeCategory
                  ? "bg-gold text-gold-foreground border-gold shadow-gold"
                  : "bg-background text-foreground border-border hover:border-gold hover:text-gold"
              )}
            >
              {t("news.allCategories")}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-xs font-bold uppercase tracking-[0.15em] border transition-smooth",
                  activeCategory === cat.id
                    ? "bg-gold text-gold-foreground border-gold shadow-gold"
                    : "bg-background text-foreground border-border hover:border-gold hover:text-gold"
                )}
              >
                {categoryName(cat, i18n.language)}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("news.search")}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {t("news.empty")}
          </div>
        ) : (
          <NewsLayout items={filtered} lang={i18n.language} ctaLabel={t("sections.cta")} />
        )}
      </section>
    </>
  );
};

const NewsLayout = ({
  items,
  lang,
  ctaLabel,
}: {
  items: Row[];
  lang: string;
  ctaLabel: string;
}) => {
  const [featured, ...rest] = items;
  const featuredTr = pickTranslation(featured.news_translations, lang);
  const featuredUrl = articleUrl(featured);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {featuredTr && (
        <article className="group lg:col-span-2 relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-elegant hover:border-accent/40 transition-smooth">
          <Link
            to={featuredUrl}
            className="grid md:grid-cols-2 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
          >
            <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
              <img
                src={featured.cover_image_url ?? fallback}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              {featured.news_categories && (
                <span className="self-start px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
                  {categoryName(featured.news_categories, lang)}
                </span>
              )}
              <div className="text-xs text-muted-foreground">
                {formatDate(featured.published_at, lang)}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mt-2 leading-tight group-hover:text-accent transition-smooth">
                {featuredTr.title}
              </h2>
              {featuredTr.excerpt && (
                <p className="text-muted-foreground mt-3 line-clamp-4">
                  {featuredTr.excerpt}
                </p>
              )}
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                {ctaLabel} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </span>
            </div>
          </Link>
        </article>
      )}

      <ul className="flex flex-col gap-4">
        {rest.map(item => {
          const tr = pickTranslation(item.news_translations, lang);
          if (!tr) return null;
          const url = articleUrl(item);
          return (
            <li key={item.id}>
              <Link
                to={url}
                className="group flex gap-4 rounded-xl border border-border bg-card p-3 shadow-soft hover:shadow-elegant hover:border-accent/40 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="w-28 h-24 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item.cover_image_url ?? fallback}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-muted-foreground">
                    {formatDate(item.published_at, lang)}
                  </div>
                  <h3 className="font-display text-sm md:text-base font-bold mt-1 leading-snug line-clamp-3 group-hover:text-accent transition-smooth">
                    {tr.title}
                  </h3>
                  {tr.excerpt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
                      {tr.excerpt}
                    </p>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {ctaLabel} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const articleUrl = (a: NewsArticleRow): string => {
  if (!a.published_at) return `/news/${a.slug}`;
  const d = new Date(a.published_at);
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `/news/${d.getUTCFullYear()}/${m}/${a.slug}`;
};