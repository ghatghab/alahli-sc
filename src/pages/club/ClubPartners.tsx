import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/hero-stadium.jpg";

const tiers = [
  {
    label: "Principal partners",
    items: ["Tripoli Bank", "Sahara Telecom", "Mediterranean Airlines"],
  },
  {
    label: "Official partners",
    items: ["Olive Energy", "Atlas Construction", "Cyrene Insurance", "Maghreb Logistics"],
  },
  {
    label: "Technical partners",
    items: ["Apex Sportswear", "FieldTurf MENA", "PlayData Analytics", "MedRecover", "Hydrate+", "Coachboard"],
  },
];

const Tile = ({ name }: { name: string }) => (
  <div className="aspect-[3/2] rounded-xl border border-border bg-card grid place-items-center p-4 text-center transition-smooth hover:border-accent hover:shadow-soft">
    <span className="font-display font-bold text-foreground/80 text-sm sm:text-base">{name}</span>
  </div>
);

const ClubPartners = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Club / Partners"
      title="Our official partners"
      subtitle="Long-term partnerships with brands and institutions that share our standards on the pitch and in the community."
      image={stadium}
    />
    <section className="container-club py-16 space-y-14">
      {tiers.map(tier => (
        <div key={tier.label}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-border" />
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.3em] text-accent">{tier.label}</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {tier.items.map(name => <Tile key={name} name={name} />)}
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
        <h3 className="font-display text-2xl font-bold text-foreground">Become a partner</h3>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Tailored sponsorship programmes — match-day, sectional, or club-wide — for brands that want to grow with Al Ahli.
        </p>
        <a href="mailto:partnerships@alahli-sc.ly" className="mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition">
          partnerships@alahli-sc.ly
        </a>
      </div>
    </section>
  </>
);

export default ClubPartners;