import { Outlet, useParams } from "react-router-dom";
import { RubricTabs, RubricItem } from "@/components/layout/RubricTabs";
import Seo from "@/components/Seo";

/**
 * Wrapper for a single sport (basketball, handball, volleyball).
 * Shows a "back to Teams" link plus the rubric tab bar.
 */
const SportLayout = () => {
  const { sport } = useParams();
  const base = `/teams/${sport}`;
  const seoKey = sport && ["football", "basketball", "handball", "volleyball"].includes(sport)
    ? `teams_${sport}`
    : "teams";
  const items: RubricItem[] = [
    { to: `${base}/squad`, key: "teamsNav.squad" },
    { to: `${base}/staff`, key: "teamsNav.staff" },
    { to: `${base}/schedule`, key: "teamsNav.schedule" },
    { to: `${base}/standings`, key: "teamsNav.standings" },
    { to: `${base}/honours`, key: "teamsNav.honours" },
  ];
  return (
    <>
      <Seo pageKey={seoKey} />
      <RubricTabs
        parent={{ to: "/teams", labelKey: `teamsNav.${sport}` }}
        items={items}
      />
      <Outlet />
    </>
  );
};

export default SportLayout;