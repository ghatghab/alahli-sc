import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  category: string;
  timeText?: string | null;
  className?: string;
  /** When true, use white text (e.g. over a dark image background). */
  onDark?: boolean;
};

/**
 * News tag — transparent background, green category label, optional time.
 */
export const NewsTag = ({ category, timeText, className, onDark = false }: Props) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]",
        className,
      )}
    >
      <span
        className={cn("inline-block h-2.5 w-2.5 shrink-0", onDark ? "bg-white" : "bg-accent")}
        aria-hidden
      />
      <span className={onDark ? "text-white" : "text-accent"}>{category}</span>
      {timeText && (
        <>
          <Clock className={cn("h-3 w-3", onDark ? "text-white/70" : "text-muted-foreground")} />
          <span
            className={cn(
              "font-semibold normal-case tracking-normal",
              onDark ? "text-white/90" : "text-muted-foreground",
            )}
          >
            {timeText}
          </span>
        </>
      )}
    </span>
  );
};