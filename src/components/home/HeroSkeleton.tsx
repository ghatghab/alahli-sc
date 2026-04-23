import { Skeleton } from "@/components/ui/skeleton";

export const HeroSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading hero"
    className="relative overflow-hidden bg-primary"
  >
    <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-primary/60" />
    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/30" />
    <div className="container-club relative z-10 flex min-h-[80svh] flex-col justify-end pb-20 pt-32 lg:min-h-[88svh] lg:pb-28 lg:pt-40">
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-10 w-3/4 bg-white/20 sm:h-14 lg:h-16" />
        <Skeleton className="h-10 w-1/2 bg-white/20 sm:h-14 lg:h-16" />
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-4 w-24 bg-white/20" />
          <Skeleton className="h-4 w-20 bg-white/20" />
        </div>
        <Skeleton className="h-12 w-40 bg-white/20" />
      </div>
    </div>
  </section>
);