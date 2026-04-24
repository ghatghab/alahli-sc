import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ComingSoon } from "@/components/ComingSoon";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "braem", "ashbal", "nashein", "awasit"] as const;
type Category = (typeof CATEGORIES)[number];

/**
 * Formation page — combines Squad (Effectif) + Staff for every age category.
 * Tabs let visitors filter by age group (البراعم / أشبال / الناشئين / أواسط).
 */
const FormationPage = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<Category>("all");

  return (
    <div className="container-club pt-8">
      <div
        role="tablist"
        aria-label={t("teamsNav.formation") as string}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold uppercase tracking-wider transition-smooth",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                isActive
                  ? "border-accent bg-accent text-white"
                  : "border-border text-foreground/75 hover:border-accent/50 hover:text-accent",
              )}
            >
              {t(`teamsNav.categories.${cat}`)}
            </button>
          );
        })}
      </div>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {t("teamsNav.squad")}
        </h2>
        <ComingSoon />
      </section>

      <section className="mt-4">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {t("teamsNav.staff")}
        </h2>
        <ComingSoon />
      </section>
    </div>
  );
};

export default FormationPage;