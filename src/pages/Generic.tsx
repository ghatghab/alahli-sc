import { ComingSoon } from "@/components/ComingSoon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/Seo";

type PageKey = "club" | "teams" | "matchCenter" | "schedule" | "tickets" | "academy" | "contact";

const SEO_KEY: Record<PageKey, string> = {
  club: "club",
  teams: "teams",
  matchCenter: "matchCenter",
  schedule: "matchCenter",
  tickets: "tickets",
  academy: "academy",
  contact: "contact",
};

export const makePage = (key: PageKey) => {
  const noBreadcrumb = key === "matchCenter";
  const insideSubNav = key === "club";
  const Page = () => (
    <>
      <Seo pageKey={SEO_KEY[key]} />
      {!noBreadcrumb && <Breadcrumbs className={insideSubNav ? "" : "pt-20"} />}
      {noBreadcrumb && <div className="pt-20" />}
      <ComingSoon />
    </>
  );
  return Page;
};

export const ClubPage = makePage("club");
export const TeamsPage = makePage("teams");
export const MatchCenterPage = makePage("matchCenter");
export const SchedulePage = makePage("schedule");
export const TicketsPage = makePage("tickets");
export const AcademyPage = makePage("academy");
export const ContactPage = makePage("contact");