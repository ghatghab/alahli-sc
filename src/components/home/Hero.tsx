import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pause, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  NewsArticleRow,
  NewsCategoryRow,
  NewsTranslationRow,
  categoryName,
  pickTranslation,
} from "@/lib/news";
import heroImg from "@/assets/hero-stadium.jpg";

type Row = NewsArticleRow & {
  news_translations: NewsTranslationRow[];
  news_categories: NewsCategoryRow | null;
};

type Slide = {
  key: string;
  image: string;
  eyebrow: string;
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
      if (!cancelled) setItems((data as unknown as Row[]) ?? []);
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
        eyebrow: cat || t("nav.news"),
        title: tr.title,
        href: articleUrl(item),
        cta: t("sections.cta"),
      } as Slide;
    })
    .filter((s): s is Slide => s !== null);

  const fallbackSlide: Slide = {
    key: "fallback",
    image: heroImg,
    eyebrow: t("hero.eyebrow"),
    title: t("hero.title"),
    href: "/news",
    cta: t("hero.ctaSecondary"),
  };

  const slides: Slide[] = newsSlides.length > 0 ? newsSlides : [fallbackSlide];

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-background">
      <div ref={emblaRef} className="h-[100svh] overflow-hidden">
        <div className="flex h-full">
          {slides.map(slide => (
            <div key={slide.key} className="relative h-full min-w-0 shrink-0 grow-0 basis-full">
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent rtl:bg-gradient-to-l" />

              <div className="container-club relative z-10 flex h-full flex-col justify-end pb-20 pt-32 lg:pb-32">
                <div className="max-w-3xl space-y-5 animate-slide-up">
                  <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                    {slide.eyebrow}
                  </div>
                  <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] text-white drop-shadow-2xl">
                    {slide.title}
                  </h1>
                  <div className="pt-2">
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

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20">
          <div className="container-club flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
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