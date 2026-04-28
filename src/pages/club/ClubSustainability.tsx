import { useTranslation } from "react-i18next";
import { Leaf, Users, Recycle, HeartHandshake } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const ICONS = [Leaf, Recycle, Users, HeartHandshake];

type Pillar = { title: string; text: string };
type Goal = { kpi: string; label: string };

const ClubSustainability = () => {
  const { t } = useTranslation();
  const pillars = (t("pagesContent.clubSustainability.pillars", { returnObjects: true }) as Pillar[]) ?? [];
  const goals = (t("pagesContent.clubSustainability.goals", { returnObjects: true }) as Goal[]) ?? [];
  return (
    <>
      <Seo pageKey="club" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubSustainability.eyebrow")}
        title={t("pagesContent.clubSustainability.title")}
        subtitle={t("pagesContent.clubSustainability.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = ICONS[i] ?? Leaf;
            return (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
                <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container-club">
          <div className="eyebrow mb-3">{t("pagesContent.clubSustainability.goalsEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.clubSustainability.goalsTitle")}</h2>
          <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {goals.map(g => (
              <div key={g.label} className="rounded-2xl border border-border bg-card p-6">
                <div className="font-display text-4xl font-black text-accent">{g.kpi}</div>
                <div className="mt-2 text-sm text-muted-foreground">{g.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubSustainability;
