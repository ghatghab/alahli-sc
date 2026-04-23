import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = ({ empty = false }: { empty?: boolean }) => {
  const { t } = useTranslation();

  return (
    <section
      aria-busy={!empty}
      aria-label={empty ? undefined : "Loading hero"}
      className="relative overflow-hidden bg-primary"
    >
      <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-primary/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-transparent rtl:bg-gradient-to-l" />
      <div className="container-club relative z-10 flex min-h-[80svh] flex-col justify-end pb-20 pt-32 lg:min-h-[88svh] lg:pb-28 lg:pt-40">
        <div className="max-w-4xl space-y-4">
          {/* Category + date skeleton */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20 rounded-full bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
          {/* Title skeletons */}
          <Skeleton className="h-10 w-3/4 bg-white/20 sm:h-14 lg:h-16" />
          <Skeleton className="h-10 w-1/2 bg-white/20 sm:h-14 lg:h-16" />
          {/* CTA skeleton */}
          <Skeleton className="h-12 w-40 bg-white/20 rounded-lg" />
          {empty && (
            <p className="pt-4 text-sm text-white/70 font-medium">
              {t("news.emptyHero")}
            </p>
          )}
        </div>
      </div>
      {/* Dots skeleton */}
      <div className="absolute bottom-6 start-0 end-0 z-20">
        <div className="container-club flex items-center gap-2">
          <Skeleton className="h-1.5 w-10 rounded-full bg-white/20" />
          <Skeleton className="h-1.5 w-5 rounded-full bg-white/15" />
          <Skeleton className="h-1.5 w-5 rounded-full bg-white/15" />
        </div>
      </div>
    </section>
  );
};