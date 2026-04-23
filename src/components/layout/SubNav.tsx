import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type SubNavItem = { to: string; key: string; end?: boolean };

/**
 * Sticky secondary navigation bar that sits below the main header.
 * Horizontally scrollable on mobile, fully keyboard accessible.
 */
export const SubNav = ({ items }: { items: SubNavItem[] }) => {
  const { t } = useTranslation();
  return (
    <div className="sticky top-20 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav
        aria-label="Section"
        className="container-club -mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-x-visible sm:px-0"
      >
        <ul className="flex min-w-max items-center gap-1 py-2 sm:min-w-0 sm:flex-wrap">
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium uppercase tracking-wider transition-smooth",
                    "text-foreground/75 hover:text-accent",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                    isActive && "text-accent",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(item.key)}
                    <span
                      className={cn(
                        "absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-gradient-gold transition-smooth",
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