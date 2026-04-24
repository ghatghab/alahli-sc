import { Outlet } from "react-router-dom";
import { RubricTabs, RubricItem } from "@/components/layout/RubricTabs";

const items: RubricItem[] = [
  { to: "/teams/football/first-team/squad", key: "teamsNav.squad" },
  { to: "/teams/football/first-team/staff", key: "teamsNav.staff" },
  { to: "/teams/football/first-team/schedule", key: "teamsNav.schedule" },
  { to: "/teams/football/first-team/standings", key: "teamsNav.standings" },
  { to: "/teams/football/first-team/honours", key: "teamsNav.honours" },
];

const MensFirstLayout = () => (
  <>
    <RubricTabs
      parent={{ to: "/teams/football", labelKey: "teamsNav.mensFirst" }}
      items={items}
    />
    <Outlet />
  </>
);

export default MensFirstLayout;