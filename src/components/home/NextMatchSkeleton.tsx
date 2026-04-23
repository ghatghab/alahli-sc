import { Skeleton } from "@/components/ui/skeleton";

export const NextMatchSkeleton = () => (
  <section
    aria-busy="true"
    aria-label="Loading matches"
    className="relative bg-background py-14 lg:py-20 overflow-hidden"
  >
    <div className="container-club">
      {/* Header skeleton */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-end gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-12 w-14 sm:h-16 sm:w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
          ))}
        </div>
      </div>

      {/* Fixture cards skeleton */}
      <div className="flex gap-6 justify-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-xl border border-border bg-card shadow-soft overflow-hidden w-full max-w-sm ${
              i > 0 ? "hidden md:block" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-5 w-36" />
              </div>
              <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-6" />
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav dots skeleton */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={`h-1.5 rounded-full ${i === 2 ? "w-10" : "w-5"}`} />
          ))}
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  </section>
);