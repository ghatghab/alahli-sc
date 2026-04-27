import { GraduationCap, Trophy, Users, ClipboardCheck } from "lucide-react";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import training from "@/assets/training.jpg";
import football from "@/assets/team-football.jpg";
import basketball from "@/assets/team-basketball.jpg";
import handball from "@/assets/team-handball.jpg";
import volleyball from "@/assets/team-volleyball.jpg";

const programmes = [
  { img: football, title: "Football", ages: "U8 — U19", text: "Six age groups, two sessions a week, weekend regional fixtures." },
  { img: basketball, title: "Basketball", ages: "U10 — U18", text: "Skills-first development pathway with summer 3x3 league." },
  { img: handball, title: "Handball", ages: "U12 — U18", text: "Mixed boys and girls groups under U14, full pathway above." },
  { img: volleyball, title: "Volleyball", ages: "U10 — U18", text: "Club's fastest-growing section, with full girls' and boys' streams." },
];

const pillars = [
  { icon: GraduationCap, title: "Education first", text: "Schedules built around school hours and an in-club tutoring partnership." },
  { icon: ClipboardCheck, title: "Individual plans", text: "Each player has a personal development plan reviewed every term." },
  { icon: Trophy, title: "Performance pathway", text: "Top graduates train with the senior squads from age 17." },
  { icon: Users, title: "Family club", text: "Parent meetings, open training and end-of-season celebrations." },
];

const AcademyPage = () => (
  <>
    <Seo pageKey="academy" />
    <Breadcrumbs />
    <PageHero
      eyebrow="Academy"
      title="Where the next green & white begins"
      subtitle="From U8 to U19, across four sports — the Al Ahli Academy develops players as athletes, students and people."
      image={training}
    />
    <section className="container-club py-16">
      <div className="eyebrow mb-3">Our pillars</div>
      <h2 className="font-display text-3xl font-bold text-foreground">A modern, holistic approach</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="eyebrow mb-3">Programmes</div>
        <h2 className="font-display text-3xl font-bold text-foreground">Pick your sport</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programmes.map(p => (
            <article key={p.title} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-foreground">{p.title}</h3>
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-bold mt-1">{p.ages}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    <section className="container-club py-16">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-transparent p-10 text-center">
        <h3 className="font-display text-3xl font-bold text-foreground">Open trials — Summer 2026</h3>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Trials open in June for every age group. Pre-register online to receive your slot and the medical form.
        </p>
        <a href="mailto:academy@alahli-sc.ly" className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-accent-foreground hover:bg-accent/90 transition">
          Pre-register
        </a>
      </div>
    </section>
  </>
);

export default AcademyPage;