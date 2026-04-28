import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import featured from "@/assets/news-coach-aoun.jpg";
import thumb1 from "@/assets/team-football.jpg";
import thumb2 from "@/assets/news-jaziri.png";
import thumb3 from "@/assets/player-celebration.jpg";
import thumb4 from "@/assets/training.jpg";

type Video = {
  id: string;
  titleKey: string;
  thumb: string;
  date: string;
  categoryKey: "highlights" | "press" | "interview" | "behind";
  duration: string;
};

const SIDE_VIDEOS: Video[] = [
  { id: "v1", titleKey: "ahliTv.items.v1", thumb: thumb1, date: "28.10.2025", categoryKey: "highlights", duration: "4:12" },
  { id: "v2", titleKey: "ahliTv.items.v2", thumb: thumb2, date: "24.10.2025", categoryKey: "press",      duration: "12:48" },
  { id: "v3", titleKey: "ahliTv.items.v3", thumb: thumb3, date: "20.10.2025", categoryKey: "highlights", duration: "5:02" },
  { id: "v4", titleKey: "ahliTv.items.v4", thumb: thumb4, date: "16.10.2025", categoryKey: "behind",     duration: "3:36" },
];

export const AhliTV = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<Video | null>(null);

  const main = active ?? {
    id: "featured",
    titleKey: "ahliTv.items.featuredTitle",
    thumb: featured,
    date: "30.10.2025",
    categoryKey: "press" as const,
    duration: "18:24",
  };

  return (
    <section className="container-club py-16 lg:py-24">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-5">
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-foreground leading-none">
            {t("ahliTv.title")}
          </h2>
          <div className="hidden sm:block h-[3px] w-40 lg:w-56 bg-gradient-to-r from-accent via-accent/60 to-destructive rtl:bg-gradient-to-l" />
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="grid lg:grid-cols-[1.6fr_1fr]">
          {/* Featured player */}
          <div className="p-4 lg:p-6 flex flex-col">
            <button
              type="button"
              className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-primary"
              aria-label={t(main.titleKey) as string}
            >
              <ImageWithSkeleton
                src={main.thumb}
                alt={t(main.titleKey) as string}
                wrapperClassName="absolute inset-0 h-full w-full"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
              {/* Play button */}
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-20 w-20 lg:h-24 lg:w-24 place-items-center rounded-full border-2 border-white/90 bg-white/10 backdrop-blur-sm shadow-elegant transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:border-accent">
                  <Play className="h-8 w-8 lg:h-10 lg:w-10 text-white fill-white ms-1" strokeWidth={1.5} />
                </span>
              </span>
              {/* Featured chip */}
              <span className="absolute top-4 start-4 inline-flex items-center gap-2 rounded-md bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-foreground shadow-soft">
                {t("ahliTv.featuredBadge")}
              </span>
              {/* Duration chip */}
              <span className="absolute bottom-4 end-4 rounded-md bg-primary/85 px-2 py-1 text-[11px] font-semibold text-primary-foreground tabular-nums">
                {main.duration}
              </span>
            </button>

            <div className="mt-5">
              <h3 className="font-display text-xl lg:text-2xl font-bold leading-tight text-foreground">
                {t(main.titleKey)}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {t("ahliTv.items.featuredDesc")}
              </p>
            </div>
          </div>

          {/* Sidebar list */}
          <div className="border-t lg:border-t-0 lg:border-s border-border bg-secondary/40">
            <ul className="divide-y divide-border">
              {SIDE_VIDEOS.map((v) => {
                const isActive = (active?.id ?? "featured") === v.id;
                return (
                  <li key={v.id}>
                    <button
                      type="button"
                      onClick={() => setActive(v)}
                      className={`group flex w-full items-stretch gap-3 p-3 text-start transition-colors ${
                        isActive ? "bg-background" : "hover:bg-background/70"
                      }`}
                    >
                      <div className="relative shrink-0 w-28 sm:w-32 aspect-video overflow-hidden rounded-md bg-primary">
                        <ImageWithSkeleton
                          src={v.thumb}
                          alt={t(v.titleKey) as string}
                          wrapperClassName="absolute inset-0 h-full w-full"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-primary shadow-soft transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                            <Play className="h-4 w-4 fill-current ms-0.5" strokeWidth={1.5} />
                          </span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center rounded-sm bg-accent px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
                            {t(`ahliTv.categories.${v.categoryKey}`)}
                          </span>
                          <span className="inline-flex items-center rounded-sm bg-destructive/10 px-1.5 py-[2px] text-[9px] font-bold uppercase tracking-[0.18em] text-destructive">
                            {v.date}
                          </span>
                        </div>
                        <h4 className="mt-1.5 text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                          {t(v.titleKey)}
                        </h4>
                        <div className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                          {v.duration}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Footer CTA bar */}
        <div className="border-t border-border p-3 bg-card">
          <Button
            asChild
            className="w-full rounded-md bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold uppercase tracking-[0.15em] text-xs h-12"
          >
            <Link to="/news">
              {t("ahliTv.viewAll")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AhliTV;