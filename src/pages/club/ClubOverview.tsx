import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trophy, Users, Calendar, Building2, Leaf, Landmark, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const cards = [
  { to: "/club/history", icon: Calendar, key: "history" },
  { to: "/club/identity", icon: Trophy, key: "identity" },
  { to: "/club/leadership", icon: Users, key: "leadership" },
  { to: "/club/partners", icon: Building2, key: "partners" },
  { to: "/club/sustainability", icon: Leaf, key: "sustainability" },
  { to: "/club/museum", icon: Landmark, key: "museum" },
] as const;

const ClubOverview = () => {
  const { t } = useTranslation();
  return (
    <>
      <Seo pageKey="club" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubOverview.eyebrow")}
        title={t("pagesContent.clubOverview.title")}
        subtitle={t("pagesContent.clubOverview.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ to, icon: Icon, key }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-accent hover:shadow-elegant"
            >
              <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                {t(`pagesContent.clubOverview.cards.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t(`pagesContent.clubOverview.cards.${key}.desc`)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-accent group-hover:gap-2 transition-all">
                {t("pagesContent.clubOverview.discover")} <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ClubOverview;
