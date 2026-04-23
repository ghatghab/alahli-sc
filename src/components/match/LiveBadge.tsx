import { cn } from "@/lib/utils";

type Props = {
  minute?: number;
  size?: "sm" | "md";
  className?: string;
};

/** Pulsing red "LIVE" pill, optionally with the current minute. */
export const LiveBadge = ({ minute, size = "sm", className }: Props) => (
  <span
    role="status"
    aria-label={`Live${minute ? ` ${minute}'` : ""}`}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider",
      "bg-destructive text-destructive-foreground",
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
      className,
    )}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
    </span>
    LIVE
    {typeof minute === "number" && <span className="tabular-nums">· {minute}'</span>}
  </span>
);