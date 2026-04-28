import { useTranslation } from "react-i18next";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import history from "@/assets/honours-trophies.jpg";

type Item = { year: string; title: string; text: string };

const ClubHistory = () => {
  const { t } = useTranslation();
  const timeline = (t("pagesContent.clubHistory.timeline", { returnObjects: true }) as Item[]) ?? [];
  return (
    <>
      <Seo pageKey="club" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubHistory.eyebrow")}
        title={t("pagesContent.clubHistory.title")}
        subtitle={t("pagesContent.clubHistory.subtitle")}
        image={history}
      />
      <section className="container-club py-16">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />
          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <div
                key={item.year}
                className={`relative md:flex md:items-center ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className="md:w-1/2 md:px-10 ps-12 md:ps-0">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <div className="text-3xl font-display font-black text-accent">{item.year}</div>
                    <h3 className="mt-2 font-display text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
                <div className="absolute left-4 top-6 h-3 w-3 rounded-full bg-accent ring-4 ring-background md:left-1/2 md:-translate-x-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubHistory;
