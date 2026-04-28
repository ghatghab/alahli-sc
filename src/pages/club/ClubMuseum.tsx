import { useTranslation } from "react-i18next";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import trophies from "@/assets/honours-trophies.jpg";
import jersey from "@/assets/lineup-jersey.png";
import celebration from "@/assets/player-celebration.jpg";

const IMAGES = [trophies, jersey, celebration];

type Collection = { title: string; text: string };

const ClubMuseum = () => {
  const { t } = useTranslation();
  const collections = (t("pagesContent.clubMuseum.collections", { returnObjects: true }) as Collection[]) ?? [];
  return (
    <>
      <Seo pageKey="club" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubMuseum.eyebrow")}
        title={t("pagesContent.clubMuseum.title")}
        subtitle={t("pagesContent.clubMuseum.subtitle")}
        image={trophies}
      />
      <section className="container-club py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((c, i) => (
            <article key={c.title} className="rounded-2xl border border-border bg-card overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={IMAGES[i]} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container-club grid gap-10 md:grid-cols-2">
          <div>
            <div className="eyebrow mb-3">{t("pagesContent.clubMuseum.visitEyebrow")}</div>
            <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.clubMuseum.visitTitle")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("pagesContent.clubMuseum.visitText")}</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-center">
            {[
              ["hours", "hoursValue"],
              ["adultTicket", "adultTicketValue"],
              ["under12", "under12Value"],
              ["guidedTour", "guidedTourValue"],
            ].map(([labelKey, valueKey]) => (
              <div key={labelKey} className="rounded-xl border border-border bg-card p-5">
                <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t(`pagesContent.clubMuseum.${labelKey}`)}</dt>
                <dd className="mt-2 font-display text-foreground font-bold">{t(`pagesContent.clubMuseum.${valueKey}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
};

export default ClubMuseum;
