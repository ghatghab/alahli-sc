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
          <NewsLayout items={items} lang={i18n.language} ctaLabel={t("sections.cta")} />
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