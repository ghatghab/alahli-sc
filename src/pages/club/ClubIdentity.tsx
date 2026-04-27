import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import logo from "@/assets/logo-alahli.png";
import stadium from "@/assets/hero-stadium.jpg";

const values = [
  { title: "Pride", text: "We carry the green and white with humility and ambition, on every pitch and in every community." },
  { title: "Discipline", text: "Sustained excellence comes from daily standards, not single moments." },
  { title: "Unity", text: "One club, four team sports, thousands of supporters — the same colours, the same heart." },
  { title: "Development", text: "Investing in the academy, the women's pathway and home-grown talent is a long-term commitment." },
];

const ClubIdentity = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Club / Identity"
      title="Crest, colours and values"
      subtitle="Our identity has evolved with the eras, but the essence has never changed: green for renewal, white for clarity, and a torch for the spirit that lights the way."
      image={stadium}
    />
    <section className="container-club py-16 grid gap-12 lg:grid-cols-2 items-center">
      <div className="rounded-2xl bg-muted/30 p-10 grid place-items-center aspect-square">
        <img src={logo} alt="Al Ahli crest" className="max-h-72 w-auto object-contain" />
      </div>
      <div>
        <div className="eyebrow mb-3">The crest</div>
        <h2 className="font-display text-3xl font-bold text-foreground">A torch, a circle, a promise</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          The torch represents the enduring spark of the club, passed from one generation of players to the next. The
          circle stands for the community that surrounds the team — supporters, families, volunteers and partners — and
          the year of foundation anchors us to a story that began in 1950.
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-6">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Primary colour</dt>
            <dd className="mt-2 flex items-center gap-3">
              <span className="h-6 w-6 rounded-full bg-accent" />
              <span className="font-display font-bold text-foreground">Al Ahli Green</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Secondary</dt>
            <dd className="mt-2 flex items-center gap-3">
              <span className="h-6 w-6 rounded-full bg-foreground border border-border" />
              <span className="font-display font-bold text-foreground">Pure White</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
    <section className="bg-muted/30 py-16">
      <div className="container-club">
        <div className="eyebrow mb-3">Our values</div>
        <h2 className="font-display text-3xl font-bold text-foreground">What we stand for</h2>
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

export default ClubIdentity;