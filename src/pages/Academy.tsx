import { useTranslation } from "react-i18next";
import { GraduationCap, Trophy, Users, ClipboardCheck } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import training from "@/assets/training.jpg";
import football from "@/assets/team-football.jpg";
import basketball from "@/assets/team-basketball.jpg";
import handball from "@/assets/team-handball.jpg";
import volleyball from "@/assets/team-volleyball.jpg";

type Pillar = { title: string; text: string };
type Programme = { title: string; ages: string; text: string };

const PILLAR_ICONS = [GraduationCap, ClipboardCheck, Trophy, Users];
const PROGRAMME_IMGS = [football, basketball, handball, volleyball];

const AcademyPage = () => {
  const { t } = useTranslation();
  const pillars = (t("pagesContent.academy.pillars", { returnObjects: true }) as Pillar[]) ?? [];
  const programmes = (t("pagesContent.academy.programmes", { returnObjects: true }) as Programme[]) ?? [];
  return (
    <>
      <Seo pageKey="academy" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.academy.eyebrow")}
        title={t("pagesContent.academy.title")}
        subtitle={t("pagesContent.academy.subtitle")}
        image={training}
      />
      <section className="container-club py-16">
        <div className="eyebrow mb-3">{t("pagesContent.academy.pillarsEyebrow")}</div>
        <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.academy.pillarsTitle")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => {
            const Icon = PILLAR_ICONS[i] ?? GraduationCap;
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
          <div className="eyebrow mb-3">{t("pagesContent.academy.programmesEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.academy.programmesTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((p, i) => (
              <article key={p.title} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={PROGRAMME_IMGS[i]} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                  <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mt-1">{p.ages}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="container-club py-16">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-transparent p-10 text-center">
          <h3 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.academy.trialsTitle")}</h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t("pagesContent.academy.trialsText")}</p>
          <a href="mailto:academy@alahli-sc.ly" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition">
            {t("pagesContent.academy.preRegister")}
          </a>
        </div>
      </section>
    </>
  );
};

export default AcademyPage;
