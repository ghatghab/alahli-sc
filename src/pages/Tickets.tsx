import { useTranslation } from "react-i18next";
import { Ticket, Users, ShieldCheck, Calendar } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

type Tier = { name: string; price: string; desc: string };
type UpcomingItem = { date: string; opp: string; comp: string };
type Perk = { title: string; text: string };

const PERK_ICONS = [Users, ShieldCheck, Ticket];
const ON_SALE = [true, true, false];

const TicketsPage = () => {
  const { t } = useTranslation();
  const tiers = (t("pagesContent.tickets.tiers", { returnObjects: true }) as Tier[]) ?? [];
  const upcoming = (t("pagesContent.tickets.upcoming", { returnObjects: true }) as UpcomingItem[]) ?? [];
  const perks = (t("pagesContent.tickets.perks", { returnObjects: true }) as Perk[]) ?? [];
  return (
    <>
      <Seo pageKey="tickets" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.tickets.eyebrow")}
        title={t("pagesContent.tickets.title")}
        subtitle={t("pagesContent.tickets.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16">
        <div className="eyebrow mb-3">{t("pagesContent.tickets.onSaleEyebrow")}</div>
        <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.tickets.onSaleTitle")}</h2>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
          {upcoming.map((m, i) => {
            const on = ON_SALE[i] ?? false;
            return (
              <div key={m.date} className="flex items-center gap-4 p-5">
                <Calendar className="h-5 w-5 text-accent shrink-0" strokeWidth={1.75} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-foreground">{t("pagesContent.tickets.vs")} {m.opp}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-0.5">{m.comp} — {m.date}</div>
                </div>
                <button
                  disabled={!on}
                  className="rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {on ? t("pagesContent.tickets.buy") : t("pagesContent.tickets.soon")}
                </button>
              </div>
            );
          })}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container-club">
          <div className="eyebrow mb-3">{t("pagesContent.tickets.pricingEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.tickets.pricingTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map(tier => (
              <div key={tier.name} className="rounded-2xl border border-border bg-card p-6 flex flex-col">
                <Ticket className="h-7 w-7 text-accent" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{tier.name}</h3>
                <div className="mt-1 font-display text-3xl font-black text-accent">{tier.price}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{tier.desc}</p>
                <button className="mt-5 rounded-full border border-accent text-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition">
                  {t("pagesContent.tickets.select")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container-club py-16 grid gap-6 md:grid-cols-3">
        {perks.map((p, i) => {
          const Icon = PERK_ICONS[i] ?? Ticket;
          return (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6">
              <Icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default TicketsPage;
