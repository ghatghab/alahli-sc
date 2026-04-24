import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Settings, User } from "lucide-react";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const linkColor = scrolled ? "text-foreground/80 hover:text-accent" : "text-white/95 hover:text-white";
  const iconColor = scrolled ? "text-foreground/80" : "text-white";
  const burgerLabel = scrolled ? "text-foreground/70" : "text-white/80";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50",
          "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-500 ease-out",
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border/60 shadow-soft"
            : "bg-transparent backdrop-blur-0 border-b border-transparent shadow-none"
        )}
      >
        <div className="container-club flex h-14 lg:h-16 items-center justify-between gap-6">
          {/* Left: burger + logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className={cn("flex flex-col items-center gap-0.5 transition-colors", iconColor)}
            >
              <Menu className="h-6 w-6" strokeWidth={2.5} />
              <span className={cn("text-[9px] font-bold tracking-[0.2em]", burgerLabel)}>MENU</span>
            </button>
            <Link to="/" aria-label="Al Ahli Sports Club" className="flex items-center shrink-0">
              <Logo size="sm" />
            </Link>
          </div>

          {/* Center: primary nav */}
          <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center">
            {primaryNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-300",
                    linkColor,
                    isActive && (scrolled ? "text-accent" : "text-white")
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* Right: actions */}
          <div className="flex items-center gap-5">
            {isEditor && (
              <Link
                to="/admin"
                title="Admin"
                className={cn("hidden md:inline-flex transition-colors", iconColor)}
              >
                <Settings className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/auth"
              className={cn(
                "hidden md:inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-300",
                linkColor
              )}
            >
              <User className="h-4 w-4" strokeWidth={2.2} />
              {t("nav.signIn", "Se connecter")}
            </Link>
            <Link
              to="/tickets"
              className={cn(
                "hidden sm:inline-flex text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-300",
                linkColor
              )}
            >
              {t("nav.tickets")}
            </Link>
            <Link
              to="/store"
              className={cn(
                "hidden sm:inline-flex text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-300",
                linkColor
              )}
            >
              {t("nav.store", "Boutique")}
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