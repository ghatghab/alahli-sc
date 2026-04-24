import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pause, Play } from "lucide-react";
import { NewsTag } from "@/components/news/NewsTag";
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
    <section className="relative bg-background">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {newsSlides.map(slide => (
            <div key={slide.key} className="relative min-w-0 shrink-0 grow-0 basis-full">
              <Link
                to={slide.href}
                aria-label={slide.title}
                className="relative block h-[70vh] min-h-[500px] lg:h-[85vh] w-full overflow-hidden group"
              >
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="eager"
                />
                {/* Readability overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/10" />

                {/* Text over image */}
                <div className="absolute inset-x-0 bottom-0">
                  <div className="container-club pb-10 lg:pb-16">
                    <div className="max-w-3xl">
                      <div className="mb-4">
                        <NewsTag
                          category={slide.category}
                          timeText={slide.publishedAt ? timeAgo(slide.publishedAt, i18n.language) : null}
                        />
                      </div>
                      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] text-white text-shadow-elegant">
                        {slide.title}
                      </h1>
                      <div className="mt-6">
                        <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                          <span className="inline-flex items-center">
                            {slide.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180 ms-2" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {newsSlides.length > 1 && (
        <div className="container-club">
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
        </div>
      )}
    </section>
  );
};