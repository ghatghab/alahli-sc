import { Outlet, useLocation } from "react-router-dom";
import { RubricTabs, RubricItem } from "@/components/layout/RubricTabs";

const items: RubricItem[] = [
  { to: "/teams/football/first-team/squad", key: "teamsNav.squad" },
  { to: "/teams/football/first-team/staff", key: "teamsNav.staff" },
  { to: "/teams/football/first-team/schedule", key: "teamsNav.schedule" },
  { to: "/teams/football/first-team/standings", key: "teamsNav.standings" },
  { to: "/teams/football/first-team/honours", key: "teamsNav.honours" },
];

const MensFirstLayout = () => {
  const { pathname } = useLocation();
  // Hide tabs on the hub page (index). Only show after clicking a sub-rubric.
  const isHub =
    pathname === "/teams/football/first-team" ||
    pathname === "/teams/football/first-team/";
  return (
    <>
      {!isHub && (
        <RubricTabs
          parent={{ to: "/teams/football", labelKey: "teamsNav.mensFirst" }}
          items={items}
        />
      )}
      <Outlet />
    </>
  );
};

export default MensFirstLayout;