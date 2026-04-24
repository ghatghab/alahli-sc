import { Outlet } from "react-router-dom";
import { RubricTabs, RubricItem } from "@/components/layout/RubricTabs";

const items: RubricItem[] = [
  { to: "/teams/football/mens-first/squad", key: "teamsNav.squad" },
  { to: "/teams/football/mens-first/staff", key: "teamsNav.staff" },
  { to: "/teams/football/mens-first/schedule", key: "teamsNav.schedule" },
  { to: "/teams/football/mens-first/standings", key: "teamsNav.standings" },
  { to: "/teams/football/mens-first/honours", key: "teamsNav.honours" },
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