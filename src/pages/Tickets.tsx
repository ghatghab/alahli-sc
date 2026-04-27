import { Ticket, Users, ShieldCheck, Calendar } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const tiers = [
  { name: "North Stand", price: "20 LYD", desc: "Standing terrace behind the goal — the heart of our supporters." },
  { name: "East Stand", price: "35 LYD", desc: "Seated mid-tier with great pitch view and shaded covering." },
  { name: "Main Stand", price: "65 LYD", desc: "Premium central seats, padded, with concourse access." },
  { name: "VIP Lounge", price: "180 LYD", desc: "Hospitality lounge, pre-match catering and parking included." },
];

const upcoming = [
  { date: "23 / 04 / 2026", opp: "Ittihad Tripoli", comp: "Premier League", on: true },
  { date: "30 / 04 / 2026", opp: "Al Nasr", comp: "Cup — Quarter Final", on: true },
  { date: "07 / 05 / 2026", opp: "Olympique Misurata", comp: "Premier League", on: false },
];

const TicketsPage = () => (
  <>
    <Seo pageKey="tickets" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Tickets"
      title="Be in the stands"
      subtitle="Match tickets, season passes and hospitality packages — all bookable online with secure delivery."
      image={stadium}
    />
    <section className="container-club py-16">
      <div className="eyebrow mb-3">On sale now</div>
      <h2 className="font-display text-3xl font-bold text-foreground">Upcoming home matches</h2>
      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
        {upcoming.map(m => (
          <div key={m.date} className="flex items-center gap-4 p-5">
            <Calendar className="h-5 w-5 text-accent shrink-0" strokeWidth={1.75} />
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold text-foreground">vs {m.opp}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-0.5">{m.comp} — {m.date}</div>
            </div>
            <button
              disabled={!m.on}
              className="rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {m.on ? "Buy" : "Soon"}
            </button>
          </div>
        ))}
      </div>
    </section>
    <section className="bg-muted/30 py-16">
      <div className="container-club">
        <div className="eyebrow mb-3">Pricing</div>
        <h2 className="font-display text-3xl font-bold text-foreground">Stands & tariffs</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map(t => (
            <div key={t.name} className="rounded-2xl border border-border bg-card p-6 flex flex-col">
              <Ticket className="h-7 w-7 text-accent" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">{t.name}</h3>
              <div className="mt-1 font-display text-3xl font-black text-accent">{t.price}</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">{t.desc}</p>
              <button className="mt-5 rounded-full border border-accent text-accent px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition">
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="container-club py-16 grid gap-6 md:grid-cols-3">
      {[
        { icon: Users, title: "Season passes", text: "Reserve your seat for every home match — up to 30% saving versus single tickets." },
        { icon: ShieldCheck, title: "Secure ticketing", text: "QR e-tickets delivered by email. Lost ticket? We can re-issue at the box office." },
        { icon: Ticket, title: "Group bookings", text: "10+ tickets? Contact us for group rates and dedicated entry gates." },
      ].map(({ icon: Icon, title, text }) => (
        <div key={title} className="rounded-2xl border border-border bg-card p-6">
          <Icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
          <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
        </div>
      ))}
    </section>
  </>
);

export default TicketsPage;