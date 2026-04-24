import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const langs = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = langs.find(l => l.code === i18n.language) ?? langs[0];
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const isHome = pathname === "/";
  // White only over the home hero (transparent navbar). Otherwise green.
  const isLight = scrolled || !isHome;
  const colorClass = isLight ? "text-accent" : "text-white";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 font-medium">
          <Globe className={cn("h-4 w-4", colorClass)} />
          <span className={cn("uppercase text-xs tracking-wider", colorClass)}>{current.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {langs.map(l => (
          <DropdownMenuItem key={l.code} onClick={() => i18n.changeLanguage(l.code)} className="cursor-pointer">
            <span className={l.code === i18n.language ? "font-semibold text-accent" : ""}>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};