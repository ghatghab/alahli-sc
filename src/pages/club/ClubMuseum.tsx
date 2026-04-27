import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import trophies from "@/assets/honours-trophies.jpg";
import jersey from "@/assets/lineup-jersey.png";
import celebration from "@/assets/player-celebration.jpg";

const collections = [
  { img: trophies, title: "Trophy hall", text: "Domestic championships, cups and continental medals from every sport." },
  { img: jersey, title: "Jersey archive", text: "Worn shirts from iconic finals and limited-edition anniversary kits." },
  { img: celebration, title: "Photo gallery", text: "Curated photography from seven decades of fans, players and managers." },
];

const ClubMuseum = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Club / Museum"
      title="The Al Ahli Museum"
      subtitle="Inside our stadium, a permanent exhibition tells the story of the club through trophies, jerseys, photographs and personal stories."
      image={trophies}
    />
    <section className="container-club py-16">
      <div className="grid gap-8 md:grid-cols-3">
        {collections.map(c => (
          <article key={c.title} className="rounded-2xl border border-border bg-card overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
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
          <div className="eyebrow mb-3">Plan your visit</div>
          <h2 className="font-display text-3xl font-bold text-foreground">Open Tuesday to Sunday</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            The museum is located on the south side of the stadium, near gate B. Guided tours run twice a day on weekends and
            include access to the trophy hall and the dressing-room corridor.
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-6 self-center">
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Hours</dt>
            <dd className="mt-2 font-display text-foreground font-bold">10:00 — 18:00</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Adult ticket</dt>
            <dd className="mt-2 font-display text-foreground font-bold">15 LYD</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Under 12</dt>
            <dd className="mt-2 font-display text-foreground font-bold">Free</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guided tour</dt>
            <dd className="mt-2 font-display text-foreground font-bold">25 LYD</dd>
          </div>
        </dl>
      </div>
    </section>
  </>
);

export default ClubMuseum;