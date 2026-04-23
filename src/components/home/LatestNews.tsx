import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
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
import { LatestNewsSkeleton } from "./LatestNewsSkeleton";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("news_articles")
        .select("*, news_translations(*), news_categories(*)")
        .eq("published", true)
        .order("published_at", { ascending: false })
  .limit(10);
      if (!cancelled) {
        setItems((data as unknown as Row[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LatestNewsSkeleton />;
  if (items.length === 0) return null;

  const featured = items[0];
  const rest = items.slice(1);

  const categories = Array.from(
    new Map(
      items
        .filter(i => i.news_categories)
        .map(i => [i.news_categories!.id, i.news_categories!])
    ).values()
  );

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

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/news?category=${cat.slug}`}
              className="px-4 py-1.5 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-smooth"
            >
              {categoryName(cat, i18n.language)}
            </Link>
          ))}
        </div>
      )}

      {/* Featured article */}
      <FeaturedArticle item={featured} lang={i18n.language} ctaLabel={t("sections.cta")} />

      {/* Rest as carousel */}
      {rest.length > 0 && (
        <NewsCarousel items={rest} lang={i18n.language} ctaLabel={t("sections.cta")} dir={i18n.dir()} />
      )}
    </section>
  );
};

/* ── Featured (first article) ── */
const FeaturedArticle = ({ item, lang, ctaLabel }: { item: Row; lang: string; ctaLabel: string }) => {
  const tr = pickTranslation(item.news_translations, lang);
  if (!tr) return null;
  const url = articleUrl(item);
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-soft hover:shadow-elegant hover:border-accent/40 transition-smooth mb-8">
      <Link to={url} className="grid md:grid-cols-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
        <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
          <img
            src={item.cover_image_url ?? fallback}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center">
          {item.news_categories && (
            <span className="inline-block self-start px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider mb-3">
              {categoryName(item.news_categories, lang)}
            </span>
          )}
          <div className="text-xs text-muted-foreground mb-2">
            {formatDate(item.published_at, lang)}
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold leading-tight group-hover:text-accent transition-smooth">
            {tr.title}
          </h3>
          {tr.excerpt && (
            <p className="mt-3 text-xs md:text-sm text-muted-foreground line-clamp-3">{tr.excerpt}</p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent">
            {ctaLabel} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
          </span>
        </div>
      </Link>
    </article>
  );
};

/* ── Carousel for remaining articles ── */
const NewsCarousel = ({ items, lang, ctaLabel, dir }: { items: Row[]; lang: string; ctaLabel: string; dir: string }) => {
  const [emblaRef, embla] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    direction: dir === "rtl" ? "rtl" : "ltr",
  });

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex gap-6">
          {items.map(item => {
            const tr = pickTranslation(item.news_translations, lang);
            if (!tr) return null;
            const url = articleUrl(item);
            return (
              <article
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft hover:shadow-elegant hover:border-accent/40 transition-smooth min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[45%] lg:basis-[30%]"
              >
                <Link to={url} className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl">
                  <div className="aspect-[4/3] overflow-hidden shrink-0">
                    <img
                      src={item.cover_image_url ?? fallback}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {item.news_categories && (
                    <div className="absolute top-3 start-3">
                      <span className="px-3 py-1 rounded-full bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-wider">
                        {categoryName(item.news_categories, lang)}
                      </span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(item.published_at, lang)}
                    </div>
                    <h3 className="font-display text-base font-bold mt-2 leading-tight group-hover:text-accent transition-smooth">
                      {tr.title}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                      {ctaLabel} <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
      {/* Nav arrows */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={() => embla?.scrollPrev()}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:text-accent hover:border-accent transition"
        >
          <ChevronLeft className="h-5 w-5 rtl:hidden" />
          <ChevronRight className="h-5 w-5 hidden rtl:block" />
        </button>
        <button
          onClick={() => embla?.scrollNext()}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/70 hover:text-accent hover:border-accent transition"
        >
          <ChevronRight className="h-5 w-5 rtl:hidden" />
          <ChevronLeft className="h-5 w-5 hidden rtl:block" />
        </button>
      </div>
    </div>
  );
};