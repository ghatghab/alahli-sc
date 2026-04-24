import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  category: string;
  timeText?: string | null;
  className?: string;
  variant?: "dark" | "light";
};

/**
 * News tag — dark pill with yellow square marker, category label, and optional time.
 */
export const NewsTag = ({ category, timeText, className, variant = "dark" }: Props) => {
  const base =
    variant === "dark"
      ? "bg-primary text-primary-foreground"
      : "bg-white text-primary border border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-[0.18em]",
        base,
        className,
      )}
    >
      <span className="inline-block h-2.5 w-2.5 bg-[hsl(45_95%_55%)] shrink-0" aria-hidden />
      <span>{category}</span>
      {timeText && (
        <>
          <Clock className="h-3 w-3 opacity-70 ms-1" />
          <span className="font-semibold normal-case tracking-normal opacity-90">{timeText}</span>
        </>
      )}
    </span>
  );
};