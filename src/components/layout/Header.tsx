import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Ticket, Settings } from "lucide-react";
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
  { to: "/schedule", key: "nav.schedule" },
  { to: "/academy", key: "nav.academy" },
  { to: "/contact", key: "nav.contact" },
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
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative px-3 py-2 text-sm font-medium uppercase tracking-wider transition-smooth",
                  "text-foreground/80 hover:text-accent",
                  isActive && "text-accent"
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
          </nav>
        </div>
      )}
    </header>
  );
};