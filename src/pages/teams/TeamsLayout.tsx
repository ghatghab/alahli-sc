import { Outlet } from "react-router-dom";
import { SubNav, SubNavItem } from "@/components/layout/SubNav";
import { Seo } from "@/components/Seo";

const items: SubNavItem[] = [
  { to: "/teams/football", key: "teamsNav.football" },
  { to: "/teams/basketball", key: "teamsNav.basketball" },
  { to: "/teams/handball", key: "teamsNav.handball" },
  { to: "/teams/volleyball", key: "teamsNav.volleyball" },
];

const TeamsLayout = () => (
  <div className="pt-20">
    <Seo pageKey="teams" />
    <SubNav items={items} level={1} />
    <Outlet />
  </div>
);

export default TeamsLayout;