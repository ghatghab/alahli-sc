import { useTranslation } from "react-i18next";
import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import stadium from "@/assets/stadium-aerial.jpg";

const boardNames = ["Mohamed Al-Tarhouni", "Hana Bensalem", "Khalil Aboud", "Youssef Mansouri"];

const directorRows = [
  { name: "Adel Ben Romdhane", roleKey: "sportingFootball" },
  { name: "Sami El-Karoui", roleKey: "sportingBasketball" },
  { name: "Walid Zayed", roleKey: "sportingHandball" },
  { name: "Karim Ferchichi", roleKey: "sportingVolleyball" },
  { name: "Leïla Mejri", roleKey: "academy" },
  { name: "Omar Driss", roleKey: "comms" },
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

type BoardEntry = { role: string; bio: string };

const ClubLeadership = () => {
  const { t } = useTranslation();
  const board = (t("pagesContent.clubLeadership.board", { returnObjects: true }) as BoardEntry[]) ?? [];
  return (
    <>
      <Seo pageKey="club_leadership" />
      <Breadcrumbs />
      <PageHero
        eyebrow={t("pagesContent.clubLeadership.eyebrow")}
        title={t("pagesContent.clubLeadership.title")}
        subtitle={t("pagesContent.clubLeadership.subtitle")}
        image={stadium}
      />
      <section className="container-club py-16">
        <div className="eyebrow mb-3">{t("pagesContent.clubLeadership.boardEyebrow")}</div>
        <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.clubLeadership.boardTitle")}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {boardNames.map((name, i) => (
            <Card key={name} name={name} role={board[i]?.role ?? ""} bio={board[i]?.bio} />
          ))}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container-club">
          <div className="eyebrow mb-3">{t("pagesContent.clubLeadership.directorsEyebrow")}</div>
          <h2 className="font-display text-3xl font-bold text-foreground">{t("pagesContent.clubLeadership.directorsTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {directorRows.map(d => (
              <Card key={d.name} name={d.name} role={t(`pagesContent.clubLeadership.directorRoles.${d.roleKey}`)} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ClubLeadership;
