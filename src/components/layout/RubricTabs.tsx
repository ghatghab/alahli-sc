import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type RubricItem = { to: string; key: string; end?: boolean };

/**
 * Section header for a sport / sub-section. Shows a "back" link to the parent
 * (e.g. ‹ FOOTBALL MASCULIN) above a horizontal tab bar of rubrics
 * (Effectif · Staff · Calendrier · Classements · Palmarès).
 */
export const RubricTabs = ({
  items,
}: {
  parent?: { to: string; labelKey: string };
  items: RubricItem[];
}) => {
  const { t } = useTranslation();
  return (
    <div className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav
        aria-label="Section"
        className="container-club overflow-x-auto sm:overflow-x-visible"
      >
        <ul className="flex min-w-max items-center gap-6 py-3 sm:gap-8 sm:min-w-0 sm:flex-wrap">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex items-center whitespace-nowrap py-2 text-sm font-bold uppercase tracking-[0.14em] transition-smooth",
                    "text-foreground/65 hover:text-accent",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive && "text-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(item.key)}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent transition-smooth",
                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                      )}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};