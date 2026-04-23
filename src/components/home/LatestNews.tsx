import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

type Row = NewsArticleRow & {
  news_translations: NewsTranslationRow[];
  news_categories: NewsCategoryRow | null;
};

const articleUrl = (a: NewsArticleRow): string => {
  if (!a.published_at) return `/news/${a.slug}`;
  const d = new Date(a.published_at);
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `/news/${d.getUTCFullYear()}/${m}/${a.slug}`;
};

export const LatestNews = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("news_articles")
        .select("*, news_translations(*), news_categories(*)")
        .eq("published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (!cancelled) setItems((data as unknown as Row[]) ?? []);
    })();
    return () => { cancelled = true; };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="container-club py-14 lg:py-20">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">{t("nav.news")}</div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-2">{t("sections.latestNews")}</h2>
          <p className="text-muted-foreground mt-2">{t("sections.latestNewsSub")}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/news">{t("sections.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map(item => {
          const tr = pickTranslation(item.news_translations, i18n.language);
          if (!tr) return null;
          const url = articleUrl(item);
          return (
            <article
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-soft hover:shadow-elegant transition-smooth"
            >
              <Link to={url} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.cover_image_url ?? fallback}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-smooth group-hover:scale-110"
                  />
                </div>
                {item.news_categories && (
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3">
                    <span className="px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider">
                      {categoryName(item.news_categories, i18n.language)}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(item.published_at, i18n.language)}
                  </div>
                  <h3 className="font-display text-lg font-bold mt-2 leading-tight group-hover:text-accent transition-smooth">
                    {tr.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    {t("sections.cta")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};