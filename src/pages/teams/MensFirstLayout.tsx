import { Outlet } from "react-router-dom";
import { SubNav, SubNavItem } from "@/components/layout/SubNav";

const items: SubNavItem[] = [
  { to: "/teams/football/mens-first/squad", key: "teamsNav.squad" },
  { to: "/teams/football/mens-first/staff", key: "teamsNav.staff" },
  { to: "/teams/football/mens-first/schedule", key: "teamsNav.schedule" },
  { to: "/teams/football/mens-first/standings", key: "teamsNav.standings" },
  { to: "/teams/football/mens-first/honours", key: "teamsNav.honours" },
];

const MensFirstLayout = () => (
  <>
    <SubNav items={items} level={3} />
    <Outlet />
  </>
);

export default MensFirstLayout;