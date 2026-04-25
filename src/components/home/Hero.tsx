import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Pause, Play, ArrowRight } from "lucide-react";
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
  const isRtl = i18n.dir() === "rtl";
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(true);
  const autoplay = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, direction: isRtl ? "rtl" : "ltr" },
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

  const formatDate = (iso: string | null) => {
    if (!iso) return null;
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(iso));
    } catch {
      return null;
    }
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
    <section className="relative bg-background overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {newsSlides.map(slide => (
            <div key={slide.key} className="relative min-w-0 shrink-0 grow-0 basis-full">
              <Link
                to={slide.href}
                aria-label={slide.title}
                className="relative block h-[88vh] min-h-[640px] w-full overflow-hidden group bg-primary"
              >
                {/* Blurred background fill so full image can show without cropping */}
                <img
                  src={slide.image}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover scale-110 blur-2xl opacity-50"
                />
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain transition-transform duration-[1500ms] ease-out group-hover:scale-[1.03]"
                  loading="eager"
                />
                {/* Layered gradients for depth + readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

                {/* Text over image */}
                <div className="absolute inset-x-0 bottom-0 pt-24 lg:pt-32">
                  <div className="container-club pb-16 lg:pb-24">
                    <div className="max-w-4xl animate-fade-in">
                      {/* Category badge + date */}
                      <div className="flex items-center gap-3 mb-5">
                        <span className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                          {slide.category}
                        </span>
                        {formatDate(slide.publishedAt) && (
                          <span className="text-white/70 text-xs uppercase tracking-wider font-medium">
                            {formatDate(slide.publishedAt)}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-white text-shadow-elegant">
                        {slide.title}
                      </h1>

                      {/* Accent underline */}
                      <div className="mt-6 h-[3px] w-16 bg-accent" />

                      {/* CTA */}
                      <div className="mt-8">
                        <span className="group/cta inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all hover:bg-accent/90 hover:gap-4">
                          {slide.cta}
                          <ArrowRight className={`h-4 w-4 transition-transform group-hover/cta:translate-x-1 ${isRtl ? "rotate-180" : ""}`} />
                        </span>
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
        <>
          {/* Bottom controls overlay */}
          <div className="absolute inset-x-0 bottom-5 lg:bottom-7 z-10 pointer-events-none">
            <div className="container-club flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 pointer-events-auto">
                {newsSlides.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => embla?.scrollTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-[3px] transition-all ${
                      i === selected ? "w-10 bg-accent" : "w-6 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pointer-events-auto">
                <span className="text-white/80 text-xs font-mono tabular-nums tracking-wider">
                  <span className="text-white font-bold">{String(selected + 1).padStart(2, "0")}</span>
                  <span className="mx-1.5 text-white/40">/</span>
                  {String(newsSlides.length).padStart(2, "0")}
                </span>
                <button
                  onClick={togglePlay}
                  aria-label={playing ? "Pause" : "Play"}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white transition hover:bg-accent hover:border-accent"
                >
                  {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};