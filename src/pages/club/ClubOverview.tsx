import { Link } from "react-router-dom";
import { Trophy, Users, Calendar, Building2, Leaf, Landmark, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const cards = [
  { to: "/club/history", icon: Calendar, title: "History", desc: "From a small Tripoli sports society in 1950 to a multi-sport powerhouse." },
  { to: "/club/identity", icon: Trophy, title: "Identity", desc: "Crest, colours and the values that shape the green & white." },
  { to: "/club/leadership", icon: Users, title: "Leadership", desc: "The board, executive office and sporting directors." },
  { to: "/club/partners", icon: Building2, title: "Partners", desc: "Brands and institutions that walk alongside the club." },
  { to: "/club/sustainability", icon: Leaf, title: "Sustainability", desc: "Our long-term commitments to people and planet." },
  { to: "/club/museum", icon: Landmark, title: "Museum", desc: "Trophies, jerseys and stories from seven decades." },
];

const ClubOverview = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="The Club"
      title="Al Ahli Sports Club"
      subtitle="Founded in 1950, Al Ahli is one of Libya's most decorated multi-sport institutions — proudly green and white, deeply rooted in Tripoli."
      image={stadium}
    />
    <section className="container-club py-16">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-border bg-card p-6 transition-smooth hover:border-accent hover:shadow-elegant"
          >
            <Icon className="h-8 w-8 text-accent" strokeWidth={1.75} />
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.18em] text-accent group-hover:gap-2 transition-all">
              Discover <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  </>
);

export default ClubOverview;