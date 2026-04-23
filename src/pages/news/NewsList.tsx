import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
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

export const NewsList = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const year = params.year ? Number(params.year) : null;
  const month = params.month ? Number(params.month) : null;
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      let q = supabase
        .from("news_articles")
        .select("*, news_translations(*), news_categories(*)")
        .eq("published", true)
        .order("published_at", { ascending: false });

      if (year && month) {
        const from = new Date(Date.UTC(year, month - 1, 1)).toISOString();
        const to = new Date(Date.UTC(year, month, 1)).toISOString();
        q = q.gte("published_at", from).lt("published_at", to);
      }

      const { data } = await q;
      if (!cancelled) {
        setItems((data as unknown as Row[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [year, month]);

  const archiveTitle =
    year && month
      ? new Date(year, month - 1, 1).toLocaleDateString(
          i18n.language === "fr" ? "fr-FR" : i18n.language === "ar" ? "ar-LY" : "en-US",
          { year: "numeric", month: "long" }
        )
      : null;

  return (
    <>
      <section className="container-club pt-28 md:pt-32 pb-16">
        <header className="mb-10">
          <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase">
            {archiveTitle ?? t("pages.news.title")}
          </h1>
          {!archiveTitle && (
            <p className="mt-3 max-w-2xl text-muted-foreground">{t("pages.news.intro")}</p>
          )}
        </header>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {t("news.empty")}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      {tr.excerpt && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {tr.excerpt}
                        </p>
                      )}
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                        {t("sections.cta")} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
};

const articleUrl = (a: NewsArticleRow): string => {
  if (!a.published_at) return `/news/${a.slug}`;
  const d = new Date(a.published_at);
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `/news/${d.getUTCFullYear()}/${m}/${a.slug}`;
};