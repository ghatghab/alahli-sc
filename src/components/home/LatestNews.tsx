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
import { NewsTag } from "@/components/news/NewsTag";

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
    <section className="container-club py-16 lg:py-24">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="eyebrow">{t("nav.news")}</div>
          <h2 className="font-impact text-4xl sm:text-6xl mt-3 leading-[0.95] uppercase text-accent">{t("sections.latestNews")}</h2>
          <div className="mt-3 h-[2px] w-16 bg-accent" />
          <p className="text-muted-foreground mt-4 max-w-md">{t("sections.latestNewsSub")}</p>
        </div>
        <Button asChild variant="outline" className="rounded-full border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent">
          <Link to="/news">{t("sections.viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </Button>
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/news?category=${cat.slug}`}
              className="px-4 py-1.5 rounded-full border border-border text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent transition-smooth"
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
    <article className="group card-premium mb-10">
      <Link to={url} className="grid md:grid-cols-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl">
        <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
          <img
            src={item.cover_image_url ?? fallback}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
          {item.news_categories && (
            <div className="absolute top-4 start-4">
              <NewsTag category={categoryName(item.news_categories, lang)} />
            </div>
          )}
        </div>
        <div className="p-6 md:p-10 flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-semibold mb-3">
            {formatDate(item.published_at, lang)}
          </div>
          <h3 className="font-display text-2xl md:text-3xl font-bold leading-[1.05] uppercase text-foreground group-hover:text-accent transition-colors duration-300">
            {tr.title}
          </h3>
          {tr.excerpt && (
            <p className="mt-4 text-sm text-muted-foreground line-clamp-3 leading-relaxed">{tr.excerpt}</p>
          )}
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {ctaLabel} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
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
                className="group card-premium flex flex-col min-w-0 shrink-0 grow-0 basis-[85%] sm:basis-[45%] lg:basis-[30%]"
              >
                <Link to={url} className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-xl">
                  <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                    <img
                      src={item.cover_image_url ?? fallback}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-80" />
                    {item.news_categories && (
                      <div className="absolute top-3 start-3">
                        <NewsTag category={categoryName(item.news_categories, lang)} />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                      {formatDate(item.published_at, lang)}
                    </div>
                    <h3 className="font-display text-base font-bold mt-2 leading-tight uppercase text-foreground group-hover:text-accent transition-colors">
                      {tr.title}
                    </h3>
                    <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                      {ctaLabel} <ArrowRight className="h-3 w-3 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
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
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-foreground/70 hover:text-gold-foreground hover:bg-gold hover:border-gold transition-smooth"
        >
          <ChevronLeft className="h-5 w-5 rtl:hidden" />
          <ChevronRight className="h-5 w-5 hidden rtl:block" />
        </button>
        <button
          onClick={() => embla?.scrollNext()}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-foreground/70 hover:text-gold-foreground hover:bg-gold hover:border-gold transition-smooth"
        >
          <ChevronRight className="h-5 w-5 rtl:hidden" />
          <ChevronLeft className="h-5 w-5 hidden rtl:block" />
        </button>
      </div>
    </div>
  );
};