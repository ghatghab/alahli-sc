import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Settings, User, Search } from "lucide-react";
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

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-primary text-primary-foreground shadow-soft">
        <div className="container-club flex h-14 lg:h-16 items-center gap-4 lg:gap-8">
          {/* Logo (always visible) */}
          <Link to="/" aria-label="Al Ahli Sports Club" className="flex items-center shrink-0">
            <Logo size="sm" />
          </Link>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="lg:hidden ms-auto text-white"
          >
            <Menu className="h-6 w-6" strokeWidth={2.5} />
          </button>

          {/* Desktop horizontal nav (Bayern style) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {primaryNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "relative text-[15px] font-semibold transition-colors duration-200 py-1",
                    "text-white/90 hover:text-white",
                    isActive &&
                      "text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-white"
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
            <NavLink
              to="/tickets"
              className={({ isActive }) =>
                cn(
                  "relative text-[15px] font-semibold transition-colors duration-200 py-1 text-white/90 hover:text-white",
                  isActive && "text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-white"
                )
              }
            >
              {t("nav.tickets")}
            </NavLink>
            <NavLink
              to="/store"
              className={({ isActive }) =>
                cn(
                  "relative text-[15px] font-semibold transition-colors duration-200 py-1 text-white/90 hover:text-white",
                  isActive && "text-white after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-white"
                )
              }
            >
              {t("nav.store", "Boutique")}
            </NavLink>
          </nav>

          {/* Right side: search + auth + lang (desktop) */}
          <div className="hidden lg:flex items-center gap-4 ms-auto">
            <button
              type="button"
              aria-label="Search"
              className="text-white/90 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" strokeWidth={2.2} />
            </button>
            {isEditor && (
              <Link to="/admin" title="Admin" className="text-white/90 hover:text-white">
                <Settings className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white/90 hover:text-white transition-colors"
            >
              <User className="h-4 w-4" strokeWidth={2.2} />
              {t("nav.signIn", "Se connecter")}
            </Link>
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