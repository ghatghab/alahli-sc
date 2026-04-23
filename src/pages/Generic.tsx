import { ComingSoon } from "@/components/ComingSoon";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const makePage = (key: "club" | "teams" | "matchCenter" | "schedule" | "tickets" | "academy" | "contact") => {
  const noBreadcrumb = key === "matchCenter";
  const insideSubNav = key === "club";
  const Page = () => (
    <>
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