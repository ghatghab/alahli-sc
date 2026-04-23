import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";

export const makePage = (key: "club" | "teams" | "matchCenter" | "schedule" | "tickets" | "academy" | "contact") => {
  const Page = () => {
    const { t } = useTranslation();
    return (
      <>
        <PageHeader title={t(`pages.${key}.title`)} intro={t(`pages.${key}.intro`)} />
        <ComingSoon />
      </>
    );
  };
  return Page;
};

export const ClubPage = makePage("club");
export const TeamsPage = makePage("teams");
export const MatchCenterPage = makePage("matchCenter");
export const SchedulePage = makePage("schedule");
export const TicketsPage = makePage("tickets");
export const AcademyPage = makePage("academy");
export const ContactPage = makePage("contact");