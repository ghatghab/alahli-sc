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
    <section className="relative bg-background pt-20 lg:pt-24">
      <div className="container-club">
        <div ref={emblaRef} className="overflow-hidden rounded-2xl">
          <div className="flex">
            {newsSlides.map(slide => (
              <div key={slide.key} className="relative min-w-0 shrink-0 grow-0 basis-full">
                <div className="grid lg:grid-cols-[1.6fr_1fr] bg-secondary rounded-2xl overflow-hidden">
                  {/* Image */}
                  <Link
                    to={slide.href}
                    aria-label={slide.title}
                    className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[460px] overflow-hidden group"
                  >
                    <img
                      src={slide.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="eager"
                    />
                    {/* Mobile readable overlay */}
                    <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
                    <div className="absolute bottom-4 start-4 lg:hidden">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-accent text-[10px] font-bold uppercase tracking-[0.2em]">
                        {slide.category}
                      </span>
                    </div>
                  </Link>

                  {/* Editorial panel */}
                  <div className="flex flex-col justify-center p-8 lg:p-12 bg-secondary">
                    <div className="hidden lg:flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-accent mb-5">
                      <span className="inline-block h-px w-8 bg-accent" />
                      {slide.category}
                    </div>
                    <Link to={slide.href} className="group">
                      <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-[1.1] text-foreground group-hover:text-accent transition-colors">
                        {slide.title}
                      </h1>
                    </Link>
                    {slide.publishedAt && (
                      <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Clock className="h-3.5 w-3.5" />
                        {timeAgo(slide.publishedAt, i18n.language)}
                      </div>
                    )}
                    <div className="mt-6">
                      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
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
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {newsSlides.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => embla?.scrollTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === selected ? "w-10 bg-accent" : "w-5 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/80 transition hover:text-accent hover:border-accent"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};