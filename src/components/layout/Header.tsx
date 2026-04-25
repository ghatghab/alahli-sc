import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Settings, User, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const primaryNav = [
  { to: "/news", key: "nav.news" },
  { to: "/match-center", key: "nav.matchCenter" },
  { to: "/teams", key: "nav.teams" },
  { to: "/club", key: "nav.club" },
  { to: "/academy", key: "nav.academy" },
];

const fullNav = [
  ...primaryNav,
  { to: "/standings", key: "nav.standings" },
  { to: "/tickets", key: "nav.tickets" },
];

type SubItem = { to: string; key: string };
const subNavMap: Record<string, { labelKey: string; items: SubItem[] }> = {
  "/teams": {
    labelKey: "nav.teams",
    items: [
      { to: "/teams", key: "footer.links.mensFirst" },
      { to: "/teams", key: "footer.links.legends" },
    ],
  },
  "/club": {
    labelKey: "nav.club",
    items: [
      { to: "/club", key: "club.overview" },
      { to: "/club/history", key: "club.history" },
      { to: "/club/identity", key: "club.identity" },
      { to: "/club/leadership", key: "club.leadership" },
      { to: "/club/partners", key: "club.partners" },
      { to: "/club/sustainability", key: "club.sustainability" },
      { to: "/club/museum", key: "club.museum" },
    ],
  },
};

export const Header = () => {
  const { t } = useTranslation();
  const { isEditor } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  // Home page has the hero — navbar starts transparent over it.
  // Inner pages don't have a hero, so use a light navbar with green text.
  const isHome = pathname === "/";
  // Scrolled => white bg with green text (everywhere).
  // Home top => transparent with white text.
  // Inner pages top => white bg with green text.
  const isLight = scrolled || !isHome;
  const isScrolled = scrolled;
  // When "light" mode is active (inner pages, top of page) we use a white
  // background with green (accent) text. When scrolled, fall back to the
  // solid primary bar with white text on every route.

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Reset submenu when drawer closes
  useEffect(() => {
    if (!open) setActiveSub(null);
  }, [open]);

  // Track scroll to switch between transparent (over hero) and solid state
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow,backdrop-filter,color] duration-300",
          scrolled
            ? "bg-white shadow-md text-accent"
            : isHome
              ? "bg-transparent text-primary-foreground"
              : "bg-white shadow-soft text-accent"
        )}
      >
        <div
          className={cn(
            "flex items-center transition-[height] duration-300",
            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
          )}
        >
          {/* Burger menu — accent square (always visible, PSG style) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={cn(
              "self-stretch flex flex-col items-center justify-center gap-1 px-5 transition-colors shrink-0",
              isHome && !scrolled
                ? "bg-transparent text-white"
                : "bg-accent hover:bg-accent/90 text-white"
            )}
          >
            <Menu className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {t("nav.menu", "Menu")}
            </span>
          </button>

          {/* Logo */}
          <Link
            to="/"
            aria-label="Al Ahli Sports Club"
            className="hidden lg:flex items-center shrink-0 px-4 lg:px-6 self-center -mt-1"
          >
            <Logo size="sm" />
          </Link>

          {/* Desktop primary nav */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 px-2">
            {primaryNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "relative text-[15px] font-bold uppercase tracking-wide transition-colors duration-200 py-1",
                    isLight
                      ? "text-accent/80 hover:text-accent"
                    : "text-white/90 hover:text-white",
                    isActive &&
                      cn(
                        "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-accent",
                      isLight ? "text-accent" : "text-white"
                      )
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="hidden lg:flex items-center gap-3 ms-auto pr-4 lg:pr-6">
            {isEditor && (
              <Link
                to="/admin"
                title="Admin"
                className={cn(
                  "transition-colors",
                  isLight
                    ? "text-accent/80 hover:text-accent"
                    : "text-white/90 hover:text-white"
                )}
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/auth"
              className={cn(
                "inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap",
                isLight
                  ? "border-accent/40 text-accent hover:bg-accent hover:text-white"
                  : "border-white/40 text-white hover:bg-white hover:text-primary"
              )}
            >
              <User className="h-4 w-4" strokeWidth={2.5} />
              {t("nav.signIn")}
            </Link>
            <Link
              to="/tickets"
              className={cn(
                "text-[13px] font-bold uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap",
                isLight
                  ? "border-accent/40 text-accent hover:bg-accent hover:text-white"
                  : "border-white/40 text-white hover:bg-white hover:text-primary"
              )}
            >
              {t("nav.tickets")}
            </Link>
            <Link
              to="/store"
              className={cn(
                "text-[13px] font-bold uppercase tracking-wider px-4 py-2 border transition-colors whitespace-nowrap",
                isLight
                  ? "border-accent/40 text-accent hover:bg-accent hover:text-white"
                  : "border-white/40 text-white hover:bg-white hover:text-primary"
              )}
            >
              {t("nav.store")}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile right spacer / lang */}
          <div className="lg:hidden flex items-center ms-auto pr-4">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Full-screen drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 backdrop-blur-sm",
            isHome && !scrolled ? "bg-primary/70" : "bg-accent/70"
          )}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute top-0 start-0 h-full w-full sm:w-[420px] shadow-2xl",
            "bg-white text-accent",
            "transition-transform duration-400 ease-out",
            open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between px-6 h-14 lg:h-16 border-b",
              "border-accent/10"
            )}
          >
            <Logo size="sm" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-accent/80 hover:text-accent"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>
          <nav className="px-6 py-8 flex flex-col gap-1">
            {fullNav.map(item => {
              const sub = subNavMap[item.to];
              if (sub) {
                const isActiveSub = activeSub === item.to;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => setActiveSub(isActiveSub ? null : item.to)}
                    className={cn(
                      "flex items-center justify-between py-3 text-2xl font-bold uppercase tracking-[0.04em] transition-colors border-b text-start",
                      "border-accent/10 text-accent/80 hover:text-accent",
                      isActiveSub && "text-accent"
                    )}
                  >
                    <span>{t(item.key)}</span>
                    <ChevronRight
                      className={cn(
                        "h-5 w-5 transition-transform rtl:rotate-180",
                        isActiveSub && "translate-x-1 rtl:-translate-x-1"
                      )}
                    />
                  </button>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "py-3 text-2xl font-bold uppercase tracking-[0.04em] transition-colors border-b",
                      "border-accent/10 text-accent/80 hover:text-accent",
                      isActive && "text-accent"
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              );
            })}
            <NavLink
              to="/auth"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "py-3 text-2xl font-bold uppercase tracking-[0.04em] transition-colors border-b",
                  "border-accent/10 text-accent/80 hover:text-accent",
                  isActive && "text-accent"
                )
              }
            >
              {t("nav.signIn")}
            </NavLink>
          </nav>
        </aside>

        {/* Submenu panel — slides next to main drawer */}
        <aside
          className={cn(
            "absolute top-0 h-full w-full sm:w-[420px] shadow-2xl",
            "start-0 sm:start-[420px]",
            "bg-muted text-accent",
            "transition-transform duration-400 ease-out",
            open && activeSub
              ? "translate-x-0"
              : "-translate-x-full rtl:translate-x-full sm:translate-x-0 sm:opacity-0 sm:pointer-events-none"
          )}
          aria-hidden={!activeSub}
        >
          <div className="flex items-center justify-between px-6 h-14 lg:h-16 border-b border-accent/10">
            <button
              type="button"
              onClick={() => setActiveSub(null)}
              className="sm:hidden text-accent/80 hover:text-accent"
              aria-label="Back"
            >
              <ChevronRight className="h-6 w-6 rotate-180 rtl:rotate-0" strokeWidth={2.5} />
            </button>
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
              {activeSub ? t(subNavMap[activeSub].labelKey) : ""}
            </span>
            <span className="w-6" />
          </div>
          <nav className="px-6 py-8 flex flex-col gap-1">
            {activeSub &&
              subNavMap[activeSub].items.map((item, i) => (
                <NavLink
                  key={`${item.to}-${i}`}
                  to={item.to}
                  end
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "py-3 text-lg font-bold uppercase tracking-[0.04em] transition-colors",
                      "text-accent/80 hover:text-accent",
                      isActive && "text-accent underline underline-offset-8"
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
          </nav>
        </aside>
      </div>
    </>
  );
};