import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Settings } from "lucide-react";
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

export const Header = () => {
  const { t } = useTranslation();
  const { isEditor } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
          "fixed top-0 inset-x-0 z-50 text-primary-foreground transition-[background-color,box-shadow,backdrop-filter] duration-300",
          scrolled
            ? "bg-primary shadow-soft"
            : "bg-transparent"
        )}
      >
        <div
          className={cn(
            "flex items-stretch transition-[height] duration-300",
            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
          )}
        >
          {/* Burger menu — accent square (always visible, PSG style) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-5 text-white transition-colors shrink-0",
              "bg-accent hover:bg-accent/90"
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
            className="flex items-center shrink-0 px-4 lg:px-6"
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
                    "text-white/90 hover:text-white",
                    isActive &&
                      "text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-accent"
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
              <Link to="/admin" title="Admin" className="text-white/90 hover:text-white">
                <Settings className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/auth"
              className="text-[13px] font-bold uppercase tracking-wider text-white/80 italic hover:text-white transition-colors"
            >
              {t("nav.signIn", "Se connecter")}
            </Link>
            <Link
              to="/tickets"
              className="text-[13px] font-bold uppercase tracking-wider px-4 py-2 border border-white/40 text-white hover:bg-white hover:text-primary transition-colors"
            >
              {t("nav.tickets")}
            </Link>
            <Link
              to="/store"
              className="text-[13px] font-bold uppercase tracking-wider px-4 py-2 border border-white/40 text-white hover:bg-white hover:text-primary transition-colors"
            >
              {t("nav.store", "Boutique")}
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
          className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute top-0 start-0 h-full w-full sm:w-[420px] bg-primary text-primary-foreground shadow-2xl",
            "transition-transform duration-400 ease-out",
            open ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-6 h-14 lg:h-16 border-b border-white/10">
            <Logo size="sm" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-white/90 hover:text-white"
            >
              <X className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>
          <nav className="px-6 py-8 flex flex-col gap-1">
            {fullNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-3 text-2xl font-bold uppercase tracking-[0.04em] transition-colors border-b border-white/10",
                    "text-white/90 hover:text-accent",
                    isActive && "text-accent"
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