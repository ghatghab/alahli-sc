import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Build crumbs from the current pathname using i18n labels where possible.
 * Falls back to a humanized segment name.
 */
const labelFor = (
  segment: string,
  index: number,
  segments: string[],
  t: (k: string, opts?: Record<string, unknown>) => string,
): string => {
  // Try a few well-known keys per top-level area
  const root = segments[0];
  if (index === 0) {
    const navKey = `nav.${root === "match-center" ? "matchCenter" : root}`;
    const navLabel = t(navKey);
    if (navLabel && navLabel !== navKey) return navLabel;
  }
  if (root === "club" && index === 1) {
    const clubKey = `club.${segment}`;
    const clubLabel = t(clubKey);
    if (clubLabel && clubLabel !== clubKey) return clubLabel;
  }
  // Humanize fallback
  return decodeURIComponent(segment).replace(/-/g, " ");
};

export const Breadcrumbs = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );

  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    href: "/" + segments.slice(0, i + 1).join("/"),
    label: labelFor(seg, i, segments, t),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "border-b border-border/60 bg-muted/30 backdrop-blur-sm",
        className,
      )}
    >
      <div className="container-club py-2.5">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gold/80">
          <li className="inline-flex items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-gold transition-colors hover:text-gold/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">{t("breadcrumb.home")}</span>
            </Link>
          </li>
          {crumbs.map((c) => (
            <li key={c.href} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gold/50 rtl:rotate-180" />
              {c.isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold capitalize text-gold"
                >
                  {c.label}
                </span>
              ) : (
                <Link
                  to={c.href}
                  className="rounded-md px-1.5 py-1 capitalize text-gold/80 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};