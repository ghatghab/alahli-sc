import { Outlet } from "react-router-dom";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Seo } from "@/components/Seo";

const TeamsLayout = () => (
  <div className="pt-20">
    <Seo pageKey="teams" />
    <Breadcrumbs />
    <Outlet />
  </div>
);

export default TeamsLayout;