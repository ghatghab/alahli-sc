import { useTranslation } from "react-i18next";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/hero-stadium.jpg";

const tiers = [
  { labelKey: "principal", items: ["Tripoli Bank", "Sahara Telecom", "Mediterranean Airlines"] },
  { labelKey: "official", items: ["Olive Energy", "Atlas Construction", "Cyrene Insurance", "Maghreb Logistics"] },
  { labelKey: "technical", items: ["Apex Sportswear", "FieldTurf MENA", "PlayData Analytics", "MedRecover", "Hydrate+", "Coachboard"] },
];

const Tile = ({ name }: { name: string }) => (
  <div className="aspect-[3/2] rounded-xl border border-border bg-card grid place-items-center p-4 text-center transition-smooth hover:border-accent hover:shadow-soft">
    <span className="font-display font-bold text-foreground/80 text-sm sm:text-base">{name}</span>
  </div>
);

const ClubPartners = () => {
  const { t } = useTranslation();
  return (
    <>
      <Seo pageKey="club" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubPartners.eyebrow")}
        title={t("pagesContent.clubPartners.title")}
        subtitle={t("pagesContent.clubPartners.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16 space-y-14">
        {tiers.map(tier => (
          <div key={tier.labelKey}>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-border" />
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-accent">
                {t(`pagesContent.clubPartners.tiers.${tier.labelKey}`)}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {tier.items.map(name => <Tile key={name} name={name} />)}
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-foreground">{t("pagesContent.clubPartners.becomePartner")}</h3>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">{t("pagesContent.clubPartners.becomeText")}</p>
          <a href="mailto:partnerships@alahli-sc.ly" className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition">
            partnerships@alahli-sc.ly
          </a>
        </div>
      </section>
    </>
  );
};

export default ClubPartners;
