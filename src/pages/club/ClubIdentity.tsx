import { useTranslation } from "react-i18next";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import logo from "@/assets/logo-alahli.png";
import stadium from "@/assets/hero-stadium.jpg";

type Value = { title: string; text: string };

const ClubIdentity = () => {
  const { t } = useTranslation();
  const values = (t("pagesContent.clubIdentity.values", { returnObjects: true }) as Value[]) ?? [];
  return (
    <>
      <Seo pageKey="club_identity" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubIdentity.eyebrow")}
        title={t("pagesContent.clubIdentity.title")}
        subtitle={t("pagesContent.clubIdentity.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16 grid gap-12 lg:grid-cols-2 items-center">
        <div className="rounded-2xl bg-muted/30 p-10 grid place-items-center aspect-square">
          <img src={logo} alt={t("pagesContent.clubIdentity.crestAlt")} className="max-h-72 w-auto object-contain" />
        </div>
        <div>
          <div className="eyebrow mb-3">{t("pagesContent.clubIdentity.crestEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.clubIdentity.crestTitle")}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("pagesContent.clubIdentity.crestText")}</p>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("pagesContent.clubIdentity.primaryColor")}</dt>
              <dd className="mt-2 flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-accent" />
                <span className="font-display font-bold text-foreground">{t("pagesContent.clubIdentity.primaryName")}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("pagesContent.clubIdentity.secondaryColor")}</dt>
              <dd className="mt-2 flex items-center gap-3">
                <span className="h-6 w-6 rounded-full bg-foreground border border-border" />
                <span className="font-display font-bold text-foreground">{t("pagesContent.clubIdentity.secondaryName")}</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container-club">
          <div className="eyebrow mb-3">{t("pagesContent.clubIdentity.valuesEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.clubIdentity.valuesTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(v => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubIdentity;
