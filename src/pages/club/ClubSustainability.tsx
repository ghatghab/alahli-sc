import { Leaf, Users, Recycle, HeartHandshake } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const pillars = [
  { icon: Leaf, title: "Climate", text: "Reducing match-day energy use, switching to LED floodlights and offsetting the team travel footprint." },
  { icon: Recycle, title: "Resources", text: "Reusable cups across all stadium concessions and a 75% waste-recovery target by 2027." },
  { icon: Users, title: "Community", text: "Free youth coaching clinics in five Tripoli neighbourhoods every season." },
  { icon: HeartHandshake, title: "Inclusion", text: "Accessible seating, sensory-friendly fixtures and pathways for women and girls in every sport." },
];

const goals = [
  { kpi: "−40%", label: "match-day water use vs 2019" },
  { kpi: "100%", label: "LED stadium lighting by 2026" },
  { kpi: "5,000+", label: "young people in our community programmes" },
  { kpi: "12", label: "partner schools across Tripoli" },
];

const ClubSustainability = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Club / Sustainability"
      title="A club that takes responsibility"
      subtitle="Our long-term plan covers climate, resources, community and inclusion — measurable commitments published every year."
      image={stadium}
    />
    <section className="container-club py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-border bg-card p-6">
            <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
    <section className="bg-muted/30 py-16">
      <div className="container-club">
        <div className="eyebrow mb-3">Our 2027 goals</div>
        <h2 className="font-display text-3xl font-bold text-foreground">Targets we publish openly</h2>
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

export default ClubSustainability;