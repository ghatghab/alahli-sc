import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { ComingSoon } from "@/components/ComingSoon";
import { SquadGrid } from "@/components/teams/SquadGrid";
import { StaffGrid } from "@/components/teams/StaffGrid";
import { getSportRoster, getSportStaff, type SportKey } from "@/lib/roster";

const detectSport = (pathname: string): SportKey => {
  if (pathname.includes("/football/")) return "football";
  if (pathname.includes("/basketball")) return "basketball";
  if (pathname.includes("/handball")) return "handball";
  if (pathname.includes("/volleyball")) return "volleyball";
  return "football";
};

const RubricPage = ({ titleKey }: { titleKey: string }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const sport = detectSport(pathname);
  const isSquad = titleKey.endsWith("squad");
  const isStaff = titleKey.endsWith("staff");

  return (
    <div className="container-club py-10">
      <header className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2">
          {t(`teamsNav.${sport}`)}
        </div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-foreground">
          {t(titleKey)}
        </h1>
      </header>
      {isSquad ? (
        <SquadGrid players={getSportRoster(sport)} />
      ) : isStaff ? (
        <StaffGrid staff={getSportStaff(sport)} />
      ) : (
        <ComingSoon />
      )}
    </div>
  );
};

export default RubricPage;