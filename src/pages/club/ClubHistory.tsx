import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import history from "@/assets/honours-trophies.jpg";

const timeline = [
  { year: "1950", title: "Foundation", text: "A group of Tripoli students and merchants found Al Ahli Sports Club, choosing green and white as a symbol of renewal and unity." },
  { year: "1963", title: "First national title", text: "The football first team lifts its first national championship after a perfect home season." },
  { year: "1978", title: "New stadium era", text: "The club moves to a modernised home ground, increasing capacity to host major regional fixtures." },
  { year: "1995", title: "Multi-sport expansion", text: "Basketball, handball and volleyball sections are formalised under one professional structure." },
  { year: "2010", title: "Continental milestone", text: "Continental qualification across two team sports in the same season — a club first." },
  { year: "2024", title: "Modern era", text: "Launch of the Al Ahli Academy and a long-term project to develop home-grown talent across every sport." },
];

const ClubHistory = () => (
  <>
    <Seo pageKey="club" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Club / History"
      title="Seven decades of green and white"
      subtitle="From a modest sports society in 1950 to a national institution, the story of Al Ahli is the story of generations of players, fans and families."
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

export default ClubHistory;