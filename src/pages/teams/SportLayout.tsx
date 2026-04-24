import { Outlet, useParams } from "react-router-dom";
import { SubNav, SubNavItem } from "@/components/layout/SubNav";

/**
 * Standard rubric subnav for a single sport (basketball, handball, volleyball).
 * Football uses its own nested layout because it adds a "Formation" branch.
 */
const SportLayout = () => {
  const { sport } = useParams();
  const base = `/teams/${sport}`;
  const items: SubNavItem[] = [
    { to: `${base}/squad`, key: "teamsNav.squad" },
    { to: `${base}/staff`, key: "teamsNav.staff" },
    { to: `${base}/schedule`, key: "teamsNav.schedule" },
    { to: `${base}/standings`, key: "teamsNav.standings" },
    { to: `${base}/honours`, key: "teamsNav.honours" },
  ];
  return (
    <>
      <SubNav items={items} level={2} />
      <Outlet />
    </>
  );
};

export default SportLayout;