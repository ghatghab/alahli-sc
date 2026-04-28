import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Play, ChevronLeft, ChevronRight, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ImageWithSkeleton } from "@/components/ui/image-with-skeleton";
import featured from "@/assets/news-coach-aoun.jpg";
import thumb1 from "@/assets/team-football.jpg";
import thumb2 from "@/assets/news-jaziri.png";
import thumb3 from "@/assets/player-celebration.jpg";
import thumb4 from "@/assets/training.jpg";
import thumb5 from "@/assets/stadium-aerial.jpg";
import thumb6 from "@/assets/team-basketball.jpg";

type Video = {
  id: string;
  titleKey: string;
  thumb: string;
  date: string;
  categoryKey: "highlights" | "press" | "interview" | "behind";
  duration: string;
  videoUrl: string;
};

// Public sample sources so the player works without backend
const SAMPLE_A = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
const SAMPLE_B = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const SAMPLE_C = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const SAMPLE_D = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const VIDEOS: Video[] = [
  { id: "feat", titleKey: "ahliTv.items.featuredTitle", thumb: featured, date: "30.10.2025", categoryKey: "press",      duration: "18:24", videoUrl: SAMPLE_A },
  { id: "v1",   titleKey: "ahliTv.items.v1",            thumb: thumb1,   date: "28.10.2025", categoryKey: "highlights", duration: "4:12",  videoUrl: SAMPLE_B },
  { id: "v2",   titleKey: "ahliTv.items.v2",            thumb: thumb2,   date: "24.10.2025", categoryKey: "press",      duration: "12:48", videoUrl: SAMPLE_C },
  { id: "v3",   titleKey: "ahliTv.items.v3",            thumb: thumb3,   date: "20.10.2025", categoryKey: "highlights", duration: "5:02",  videoUrl: SAMPLE_D },
  { id: "v4",   titleKey: "ahliTv.items.v4",            thumb: thumb4,   date: "16.10.2025", categoryKey: "behind",     duration: "3:36",  videoUrl: SAMPLE_A },
  { id: "v5",   titleKey: "ahliTv.items.v1",            thumb: thumb5,   date: "12.10.2025", categoryKey: "interview",  duration: "8:21",  videoUrl: SAMPLE_B },
  { id: "v6",   titleKey: "ahliTv.items.v2",            thumb: thumb6,   date: "08.10.2025", categoryKey: "highlights", duration: "6:45",  videoUrl: SAMPLE_C },
];

const PER_PAGE = 3;

export const AhliTV = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [openVideo, setOpenVideo] = useState<Video | null>(null);

  const totalPages = Math.max(1, Math.ceil(VIDEOS.length / PER_PAGE));
  const start = page * PER_PAGE;
  const visible = VIDEOS.slice(start, start + PER_PAGE);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-club py-16 lg:py-24">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-2xl sm:text-4xl font-bold uppercase tracking-tight leading-none text-primary-foreground">
              {t("ahliTv.title")}
            </h2>
            <span className="hidden sm:inline-block h-[3px] w-24 lg:w-40 bg-accent rtl:bg-accent" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {visible.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setOpenVideo(v)}
              className="group relative block overflow-hidden rounded-md bg-primary-foreground/5 text-start focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={t(v.titleKey) as string}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden">
                <ImageWithSkeleton
                  src={v.thumb}
                  alt={t(v.titleKey) as string}
                  wrapperClassName="absolute inset-0 h-full w-full"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Bottom dark gradient for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />

                {/* Left green accent panel (like reference) */}
                <div className="absolute inset-y-0 start-0 w-[42%] bg-gradient-to-r from-accent/85 via-accent/55 to-transparent rtl:bg-gradient-to-l pointer-events-none" />

                {/* Duration */}
                <span className="absolute top-3 end-3 rounded-sm bg-primary/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-primary-foreground">
                  {v.duration}
                </span>

                {/* Hover play button */}
                <span className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-elegant scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-7 w-7 fill-current ms-1" strokeWidth={1.5} />
                  </span>
                </span>

                {/* Bottom content overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                  <div className="flex items-center gap-2 text-primary-foreground/90 mb-2">
                    <Play className="h-3.5 w-3.5 fill-current" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                      {t(`ahliTv.categories.${v.categoryKey}`)}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold leading-snug text-primary-foreground line-clamp-2 group-hover:text-accent-soft transition-colors">
                    {t(v.titleKey)}
                  </h3>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous"
            className="grid h-9 w-9 place-items-center rounded-full text-primary-foreground/70 hover:text-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-10 bg-accent" : "w-6 bg-primary-foreground/25 hover:bg-primary-foreground/50"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next"
            className="grid h-9 w-9 place-items-center rounded-full text-primary-foreground/70 hover:text-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" strokeWidth={1.5} />
          </button>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-md border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent font-bold uppercase tracking-[0.18em] text-xs h-11 px-6"
          >
            <Link to="/news">
              {t("ahliTv.viewAll")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180 ms-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={!!openVideo} onOpenChange={(o) => !o && setOpenVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-primary border-accent/30">
          {openVideo && (
            <div>
              <div className="relative aspect-video w-full bg-black">
                <video
                  key={openVideo.id}
                  src={openVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full"
                  poster={openVideo.thumb}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
                    {t(`ahliTv.categories.${openVideo.categoryKey}`)}
                  </span>
                  <span className="text-[11px] font-semibold text-primary-foreground/70 tabular-nums">
                    {openVideo.date} · {openVideo.duration}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-primary-foreground">
                  {t(openVideo.titleKey)}
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AhliTV;
