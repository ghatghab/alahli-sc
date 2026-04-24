import { Outlet } from "react-router-dom";
import { SubNav, SubNavItem } from "@/components/layout/SubNav";

const items: SubNavItem[] = [
  { to: "/teams/football/mens-first", key: "teamsNav.mensFirst" },
  { to: "/teams/football/formation", key: "teamsNav.formation" },
];

const FootballLayout = () => (
  <>
    <SubNav items={items} level={2} />
    <Outlet />
  </>
);

export default FootballLayout;