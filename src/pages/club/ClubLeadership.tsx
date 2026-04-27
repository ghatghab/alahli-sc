import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const board = [
  { name: "Mohamed Al-Tarhouni", role: "President", bio: "Lifelong supporter and former club captain. Elected for a four-year term in 2023." },
  { name: "Hana Bensalem", role: "Vice-President", bio: "Leads governance, finance oversight and the women's sport development plan." },
  { name: "Khalil Aboud", role: "General Secretary", bio: "Coordinates the executive office and represents the club at federation level." },
  { name: "Youssef Mansouri", role: "Treasurer", bio: "Oversees budgeting, sponsorship and the club's long-term financial sustainability." },
];

const directors = [
  { name: "Adel Ben Romdhane", role: "Sporting Director — Football" },
  { name: "Sami El-Karoui", role: "Sporting Director — Basketball" },
  { name: "Walid Zayed", role: "Sporting Director — Handball" },
  { name: "Karim Ferchichi", role: "Sporting Director — Volleyball" },
  { name: "Leïla Mejri", role: "Head of Academy" },
  { name: "Omar Driss", role: "Head of Communications" },
];

const Card = ({ name, role, bio }: { name: string; role: string; bio?: string }) => (
  <div className="rounded-2xl border border-border bg-card p-6">
    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 grid place-items-center font-display text-xl font-black text-accent">
      {name.split(" ").map(n => n[0]).slice(0, 2).join("")}
    </div>
    <h3 className="mt-4 font-display text-lg font-bold text-foreground">{name}</h3>
    <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mt-1">{role}</div>
    {bio && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{bio}</p>}
  </div>
);

const ClubLeadership = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Club / Leadership"
      title="Board & executive office"
      subtitle="A volunteer board and a professional executive team work together to keep the club competitive on the pitch and responsible off it."
      image={stadium}
    />
    <section className="container-club py-16">
      <div className="eyebrow mb-3">Executive board</div>
      <h2 className="font-display text-3xl font-bold text-foreground">Elected officials</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {board.map(p => <Card key={p.name} {...p} />)}
      </div>
    </section>
    <section className="bg-muted/30 py-16">
      <div className="container-club">
        <div className="eyebrow mb-3">Sporting & operations</div>
        <h2 className="font-display text-3xl font-bold text-foreground">Directors</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {directors.map(p => <Card key={p.name} {...p} />)}
        </div>
      </div>
    </section>
  </>
);

export default ClubLeadership;