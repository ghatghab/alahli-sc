import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  NewsArticleRow,
  NewsCategoryRow,
  NewsTranslationRow,
  categoryName,
  formatDate,
  pickTranslation,
  timeAgo,
} from "@/lib/news";

type Row = NewsArticleRow & {
  news_translations: NewsTranslationRow[];
  news_categories: NewsCategoryRow | null;
};

export const NewsArticle = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [article, setArticle] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("news_articles")
        .select("*, news_translations(*), news_categories(*)")
        .eq("slug", slug ?? "")
        .eq("published", true)
        .maybeSingle();
      if (!cancelled) {
        setArticle((data as unknown as Row) ?? null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center pt-32">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container-club pt-40 pb-20 text-center">
        <h1 className="font-display text-3xl font-bold uppercase">{t("pages.notFound.title")}</h1>
        <Link to="/news" className="mt-4 inline-block text-accent">{t("news.backToList")}</Link>
      </div>
    );
  }

  const tr = pickTranslation(article.news_translations, i18n.language);
  if (!tr) return null;

  return (
    <article className="pt-32">
      <header className="container-club max-w-4xl">
        <Link
          to="/news"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent transition-smooth"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("news.backToList")}
        </Link>
        <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase mt-6 leading-tight">
          {tr.title}
        </h1>
        {tr.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{tr.excerpt}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-wider">
          {article.news_categories && (
            <span className="inline-flex items-center gap-2 text-gold">
              <span className="inline-block h-2.5 w-2.5 bg-gold" />
              {categoryName(article.news_categories, i18n.language)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(article.published_at, i18n.language)}
          </span>
          <span className="text-muted-foreground/70">
            · {formatDate(article.published_at, i18n.language)}
          </span>
        </div>
      </header>

      {article.cover_image_url && (
        <div className="container-club max-w-5xl mt-10">
          <div className="overflow-hidden rounded-xl shadow-elegant bg-primary flex items-center justify-center">
            <img
              src={article.cover_image_url}
              alt={tr.title}
              className="max-h-[80vh] w-full object-contain"
            />
          </div>
        </div>
      )}

      <div className="container-club max-w-3xl py-12">
        {tr.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
            {tr.content}
          </div>
        )}
      </div>
    </article>
  );
};