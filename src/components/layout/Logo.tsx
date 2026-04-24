import logo from "@/assets/logo-alahli.png";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Logo = ({ size = "sm" }: { size?: "sm" | "lg" }) => {
  const dimensions = size === "lg" ? "h-12 w-12" : "h-9 w-9";
  return (
    <Link to="/" aria-label="Alahli SC" className="flex items-center group">
      <div className={cn("relative overflow-hidden transition-smooth group-hover:scale-105", dimensions)}>
        <img src={logo} alt="Alahli SC crest" className="h-full w-full object-contain" />
      </div>
    </Link>
  );
};