import { ComingSoon } from "@/components/ComingSoon";

export const makePage = (_key: "club" | "teams" | "matchCenter" | "schedule" | "tickets" | "academy" | "contact") => {
  const Page = () => <ComingSoon />;
  return Page;
};

export const ClubPage = makePage("club");
export const TeamsPage = makePage("teams");
export const MatchCenterPage = makePage("matchCenter");
export const SchedulePage = makePage("schedule");
export const TicketsPage = makePage("tickets");
export const AcademyPage = makePage("academy");
export const ContactPage = makePage("contact");