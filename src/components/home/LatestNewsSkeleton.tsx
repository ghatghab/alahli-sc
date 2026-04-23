import { Skeleton } from "@/components/ui/skeleton";

export const LatestNewsSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading latest news"
    className="container-club py-14 lg:py-20"
  >
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-72 sm:h-12 sm:w-96" />
        <Skeleton className="h-4 w-60" />
      </div>
      <Skeleton className="h-10 w-28" />
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft"
        >
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="mt-2 h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  </section>
);