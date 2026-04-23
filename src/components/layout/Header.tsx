import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Ticket, Settings, Tv, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/club", key: "nav.club" },
  { to: "/teams", key: "nav.teams" },
  { to: "/match-center", key: "nav.matchCenter" },
  { to: "/news", key: "nav.news" },
  { to: "/standings", key: "nav.standings" },
  { to: "/academy", key: "nav.academy" },
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

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-smooth",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-transparent"
      )}
    >
      <div className="container-club flex h-20 items-center justify-between gap-4">
        <Link to="/" aria-label="Alahli SC" className="flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md">
          <Logo size="sm" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative px-3 py-2 text-sm font-medium uppercase tracking-wider transition-smooth",
                  "text-gold font-bold hover:text-gold/70",
                  isActive && "text-gold"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(item.key)}
                  <span
                    className={cn(
                      "absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-gold rounded-full transition-smooth",
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {isEditor && (
            <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" title="Admin">
              <Link to="/admin"><Settings className="h-4 w-4" /></Link>
            </Button>
          )}
          <Button asChild variant="gold" size="sm" className="hidden md:inline-flex">
            <Link to="/tickets">
              <Ticket className="h-4 w-4" />
              {t("nav.tickets")}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" title={t("nav.tv")}>
            <Link to="/tv"><Tv className="h-4 w-4 text-gold" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex" title={t("nav.store")}>
            <Link to="/store"><ShoppingBag className="h-4 w-4 text-gold" /></Link>
          </Button>
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border animate-fade-in">
          <nav className="container-club py-4 flex flex-col gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-3 rounded-md text-sm font-medium uppercase tracking-wider transition-smooth",
                    isActive ? "bg-accent/10 text-accent" : "hover:bg-muted"
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
            <Button asChild variant="gold" className="mt-3" onClick={() => setOpen(false)}>
              <Link to="/tickets">
                <Ticket className="h-4 w-4" />
                {t("nav.tickets")}
              </Link>
            </Button>
            <div className="flex gap-2 mt-2">
              <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/tv"><Tv className="h-4 w-4" /> {t("nav.tv")}</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                <Link to="/store"><ShoppingBag className="h-4 w-4" /> {t("nav.store")}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};