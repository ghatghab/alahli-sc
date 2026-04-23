import logo from "@/assets/logo-alahli.jpg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Logo = ({ compact = false }: { compact?: boolean }) => {
  const { t } = useTranslation();
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative h-11 w-11 rounded-full overflow-hidden ring-2 ring-gold/40 shadow-gold transition-smooth group-hover:scale-105">
        <img src={logo} alt="Alahli SC crest" className="h-full w-full object-cover" />
      </div>
      {!compact && (
        <div className="leading-tight hidden sm:block">
          <div className="font-display text-base font-bold uppercase tracking-wider">{t("brand.name")}</div>
          <div className="text-[11px] text-muted-foreground tracking-wide">{t("brand.tagline")}</div>
        </div>
      )}
    </Link>
  );
};