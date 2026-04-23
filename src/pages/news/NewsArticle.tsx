import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wider">
          {article.news_categories && (
            <span className="px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground font-bold">
              {categoryName(article.news_categories, i18n.language)}
            </span>
          )}
          <span className="text-muted-foreground">
            {formatDate(article.published_at, i18n.language)}
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase mt-4 leading-tight">
          {tr.title}
        </h1>
        {tr.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{tr.excerpt}</p>
        )}
      </header>

      {article.cover_image_url && (
        <div className="container-club max-w-5xl mt-10">
          <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-elegant">
            <img
              src={article.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
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