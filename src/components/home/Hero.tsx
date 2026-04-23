import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Pause, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  NewsArticleRow,
  NewsCategoryRow,
  NewsTranslationRow,
  categoryName,
  pickTranslation,
  timeAgo,
} from "@/lib/news";
import { HeroSkeleton } from "./HeroSkeleton";

type Row = NewsArticleRow & {
  news_translations: NewsTranslationRow[];
  news_categories: NewsCategoryRow | null;
};

type Slide = {
  key: string;
  image: string;
  category: string;
  publishedAt: string | null;
  title: string;
  href: string;
  cta: string;
};

const articleUrl = (a: NewsArticleRow): string => {
  if (!a.published_at) return `/news/${a.slug}`;
  const d = new Date(a.published_at);
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `/news/${d.getUTCFullYear()}/${m}/${a.slug}`;
};

export const Hero = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const autoplay = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, direction: i18n.dir() === "rtl" ? "rtl" : "ltr" },
    [autoplay.current]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("news_articles")
        .select("*, news_translations(*), news_categories(*)")
        .eq("published", true)
        .not("cover_image_url", "is", null)
        .order("published_at", { ascending: false })
        .limit(3);
      if (!cancelled) {
        setItems((data as unknown as Row[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla]);

  const togglePlay = () => {
    const ap = autoplay.current;
    if (playing) ap.stop();
    else ap.play();
    setPlaying(!playing);
  };

  const newsSlides: Slide[] = items
    .map(item => {
      const tr = pickTranslation(item.news_translations, i18n.language);
      if (!tr || !item.cover_image_url) return null;
      const cat = categoryName(item.news_categories, i18n.language);
      return {
        key: item.id,
        image: item.cover_image_url,
        category: cat || t("nav.news"),
        publishedAt: item.published_at,
        title: tr.title,
        href: articleUrl(item),
        cta: t("sections.cta"),
      } as Slide;
    })
    .filter((s): s is Slide => s !== null);

  if (loading) return <HeroSkeleton />;
  if (newsSlides.length === 0) return <HeroSkeleton empty />;

  return (
    <section className="relative overflow-hidden bg-background">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {newsSlides.map(slide => (
            <div key={slide.key} className="relative min-w-0 shrink-0 grow-0 basis-full">
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent rtl:bg-gradient-to-l" />

              <Link
                to={slide.href}
                className="absolute inset-0 z-10"
                aria-label={slide.title}
              />
              <div className="container-club pointer-events-none relative z-20 flex flex-col justify-end min-h-[80svh] pb-20 pt-32 lg:min-h-[88svh] lg:pb-28 lg:pt-40">
                <div className="max-w-4xl space-y-4 animate-slide-up">
                  <Link to={slide.href} className="pointer-events-auto inline-block group">
                    <h1 className="font-display text-4xl lg:text-7xl font-bold uppercase leading-[1.1] sm:leading-[0.95] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:underline sm:decoration-white/90 sm:decoration-[3px] sm:underline-offset-[10px] sm:group-hover:decoration-gold transition-colors sm:text-5xl">
                      {slide.title}
                    </h1>
                    <span className="mt-3 block h-[3px] w-24 bg-white/90 group-hover:bg-gold transition-colors sm:hidden" />
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold uppercase tracking-wider">
                    <span className="inline-flex items-center gap-2 text-gold">
                      <span className="inline-block h-2.5 w-2.5 bg-gold" />
                      {slide.category}
                    </span>
                    {slide.publishedAt && (
                      <span className="inline-flex items-center gap-1.5 text-white/85">
                        <Clock className="h-3.5 w-3.5" />
                        {timeAgo(slide.publishedAt, i18n.language)}
                      </span>
                    )}
                  </div>
                  <div className="pt-3 pointer-events-auto">
                    <Button asChild variant="gold" size="lg">
                      <Link to={slide.href}>
                        {slide.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {newsSlides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="container-club flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {newsSlides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => embla?.scrollTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selected ? "w-10 bg-gold" : "w-5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};